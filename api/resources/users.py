from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from marshmallow import Schema, fields, ValidationError, validate
import hashlib, secrets

from extentions import api, admin_required
from models.users import UsersModel

def validate_password(value):
  if len(value) < 8:
    raise ValidationError("Password must be at least 8 characters long")
  if not any(char.isupper() for char in value):
    raise ValidationError("Password must contain at least one uppercase letter")
  if not any(char.islower() for char in value):
    raise ValidationError("Password must contain at least one lowercase letter")
  if not any(char.isdigit() for char in value):
    raise ValidationError("Password must contain at least one digit")

def hash_password(password):
  salt = secrets.token_bytes(16)
  password_salted = password.encode() + salt
  password_hash = hashlib.sha256(password_salted).hexdigest()

  return password_hash, salt.hex()

class UsersSchema(Schema):
  username = fields.String(required=True)
  password = fields.String(required=True, validate=validate_password)
  firstname = fields.String(required=True)
  lastname = fields.String(required=True)
  access_group = fields.String(required=True, validate=validate.OneOf(['Administrator', 'AuthenticatedUser']))

  def __init__(self, *args, **kwargs):
    self.required_fields = kwargs.pop("required_fields", True)
    super().__init__(*args, **kwargs)

  def _remove_required(self, field):
    field.required = False
    return field

  def _set_required(self, field):
    field.required = True
    return field

  def load(self, data, *, many=None, unknown=None):
    fields = self.fields
    for name, field_obj in fields.items():
      if self.required_fields:
        field_obj = self._set_required(field_obj)
      else:
        field_obj = self._remove_required(field_obj)
      self.fields[name] = field_obj
    return super().load(data, many=many, unknown=unknown)

class UsersResource(Resource):
  @admin_required()
  def get(self):
    return jsonify(UsersModel.get_all())

  @admin_required()
  def post(self):
    try:
      validated_data = UsersSchema().load(request.json)
    except ValidationError as e:
      return e.messages, 400

    password_hash, salt = hash_password(validated_data['password'])

    user_data = {
      'username': validated_data['username'],
      'password_hash': password_hash,
      'firstname': validated_data['firstname'],
      'lastname': validated_data['lastname'],
      'access_group': validated_data['access_group'],
      'salt': salt
    }
    new_user = UsersModel(**user_data)
    return new_user.create_item()

class UserResource(Resource):
  @jwt_required()
  def get(self, id):
    user = get_jwt_identity()
    claims = get_jwt()
    result = UsersModel.get_by_id(id)

    if 'username' in result:
      if user != result['username'] and claims['access_group'] != 'Administrator':
        return "Forbidden", 403

    return result

  @admin_required()
  def put(self, id):
    try:
      validated_data = UsersSchema(required_fields=False).load(request.json)
    except ValidationError as e:
      return {'message': 'Validation error', 'errors': e.messages}, 400

    user = UsersModel.get_by_id(id)
    edited_user = {}

    if 'id' in user:
      edited_user = {
        'id': user['id'],
        'username': validated_data['username'] if 'username' in validated_data else user['username'],
        'firstname': validated_data['firstname'] if 'firstname' in validated_data else user['firstname'],
        'lastname': validated_data['lastname'] if 'lastname' in validated_data else user['lastname'],
        'access_group': validated_data['access_group'] if 'access_group' in validated_data else user['access_group'],
        'id': user['id'],
        '_rid': user['_rid'],
        '_rid': user['_rid'],
        '_etag': user['_etag'],
        '_attachments': user['_attachments'],
        '_self': user['_self'],
        '_ts': user['_ts']
      }

      if 'password' in validated_data:
        password_hash, salt = hash_password(validated_data['password'])
        edited_user['password_hash'] = password_hash
        edited_user['salt'] = salt

      if user == edited_user:
        return { 'msg': 'No changes' }, 200

      if edited_user['username'] != user['username']:
        UsersModel.delete_item(user)

    return UsersModel.upsert_item(edited_user)

  @admin_required()
  def delete(self, id):
    user = UsersModel.get_by_id(id)
    return UsersModel.delete_item(user)

api.add_resource(UsersResource, '/users')
api.add_resource(UserResource, '/user/<string:id>')