from flask_restful import Api
from flask_jwt_extended import JWTManager, verify_jwt_in_request, get_jwt
from flask_marshmallow import Marshmallow
from functools import wraps
from azure.cosmos import CosmosClient
import os, redis

if os.environ.get('FLASK_ENV') == 'test':
  import urllib3
  urllib3.disable_warnings()

api = Api()
ma = Marshmallow()
jwt = JWTManager()

if 'COSMOS_URI' not in os.environ:
  raise RuntimeError('COSMOS_URI variable is not set')

if 'COSMOS_SECRET' not in os.environ:
  raise RuntimeError('COSMOS_SECRET variable is not set')

connection_verify = os.environ.get('FLASK_ENV') == 'prod'
redis_ssl = os.environ.get('REDIS_SSL') == 'true' if 'REDIS_SSL' in os.environ else True

client = CosmosClient(os.environ.get('COSMOS_URI'), os.environ.get('COSMOS_SECRET'), connection_verify=connection_verify)
database = client.create_database_if_not_exists(os.environ.get('COSMOS_DB') or 'heart-disease-prediction')

redis_access_keys = redis.StrictRedis(
  host=os.environ.get('REDIS_HOST'),
  port=os.environ.get('REDIS_PORT') or 6380,
  db=0,
  password=os.environ.get('REDIS_PASSWORD'),
  ssl=redis_ssl
)

redis_blocklist = redis.StrictRedis(
  host=os.environ.get('REDIS_HOST'),
  port=os.environ.get('REDIS_PORT') or 6380,
  db=1,
  password=os.environ.get('REDIS_PASSWORD'),
  ssl=redis_ssl
)

def admin_required():
  def wrapper(fn):
    @wraps(fn)
    def decorator(*args, **kwargs):
      verify_jwt_in_request()
      claims = get_jwt()
      if claims["access_group"] == 'Administrator':
        return fn(*args, **kwargs)
      else:
        return "Forbidden", 403
    return decorator
  return wrapper

@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_redis = redis_blocklist.get(jti)
    return token_in_redis is not None