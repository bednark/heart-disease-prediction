from flask import request, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
import time, hashlib

from extentions import api, redis_access_keys, redis_blocklist
from models.users import UsersModel

class CredentialsSchema(Schema):
  username = fields.String(required=True)
  password = fields.String(required=True)

class AuthResource(Resource):
  def post(self):
    try:
      validated_data = CredentialsSchema().load(request.json)
    except ValidationError as e:
      return e.messages, 400

    user = UsersModel.get_by_username(validated_data['username'])

    if 404 in user:
      return { 'msg': 'Invalid credentials' }, 401

    salt = bytes.fromhex(user['salt'])
    password_salted = validated_data['password'].encode() + salt
    password_hash = hashlib.sha256(password_salted).hexdigest()

    if password_hash != user['password_hash']:
      return { 'msg': 'Invalid credentials' }, 401

    access_token_exp = int(time.time()) + 3600
    refresh_token_exp = int(time.time()) + 86400
    claims = {
      'access_group': user['access_group'],
      'exp': access_token_exp
    }
    access_token = create_access_token(identity=user['username'], additional_claims=claims)
    redis_access_keys.set(user['username'], access_token)
    redis_access_keys.expireat(user['username'], access_token_exp)

    claims['exp'] = refresh_token_exp
    refresh_token = create_refresh_token(identity=user['username'], additional_claims=claims)

    response = make_response({ 'msg': 'Authentication successful' }, 200)
    response.set_cookie('access_token', access_token, httponly=True, secure=True, samesite='Strict', max_age=3600)
    response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='Strict', max_age=86400)

    return response

class TokenRefreshResource(Resource):
  @jwt_required(refresh=True)
  def get(self):
    current_user = get_jwt_identity()
    access_token_exp = int(time.time()) + 3600

    if redis_access_keys.exists(current_user):
      return { 'msg': 'Access token is not expired' }, 400

    claims = { 
      'access_group': get_jwt()['access_group'],
      'exp': access_token_exp
    }

    access_token = create_access_token(identity=current_user, additional_claims=claims)
    redis_access_keys.set(current_user, access_token)
    redis_access_keys.expireat(current_user, access_token_exp)

    return { 'access_token': access_token }, 200

class TokenRevokeResource(Resource):
  @jwt_required()
  def get(self):
    jwt_data = get_jwt()
    if jwt_data['exp'] > time.time():
      redis_access_keys.delete(get_jwt_identity())
      redis_blocklist.set(jwt_data['jti'], "")
      redis_blocklist.expireat(jwt_data['jti'], jwt_data['exp'])

    return { 'msg': 'Token revoked' }, 200

api.add_resource(AuthResource, '/auth')
api.add_resource(TokenRefreshResource, '/auth/refresh')
api.add_resource(TokenRevokeResource, '/auth/revoke')