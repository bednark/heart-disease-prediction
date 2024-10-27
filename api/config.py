import os

class Config:
  JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
  JWT_TOKEN_LOCATION = ['cookies']
  JWT_ACCESS_COOKIE_NAME = 'access_token'
  JWT_REFRESH_COOKIE_NAME = 'refresh_token'
  JWT_COOKIE_CSRF_PROTECT = False
  JSON_SORT_KEYS = False

class TestConfig(Config):
  DEBUG = True
  TESTING = True

class ProductionConfig(Config):
  DEBUG = False
  PROPAGATE_EXCEPTIONS = True