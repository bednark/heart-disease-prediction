from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
from dotenv import load_dotenv
import os

if os.path.exists('.env.local'):
  load_dotenv(dotenv_path='.env.local', override=True)

from extentions import api, jwt, ma
from resources.index import IndexResource
from resources.users import UsersResource, UserResource
from resources.patients import PatientsModel, PatientResource
from resources.auth import AuthResource, TokenRefreshResource, TokenRevokeResource
from models.users import create_initial_user

app = Flask(__name__)

if 'FLASK_ENV' not in os.environ:
  raise RuntimeError('FLASK_ENV variable is not set')

if 'JWT_SECRET_KEY' not in os.environ:
  raise RuntimeError('JWT_SECRET_KEY variable is not set')

if os.environ.get('FLASK_ENV') == 'test':
  app.config.from_object('config.TestConfig')
elif os.environ.get('FLASK_ENV') == 'prod':
  app.config.from_object('config.ProductionConfig')
else:
  raise RuntimeError('FLASK_ENV variable is invalid')

CORS(app, supports_credentials=True)
api.init_app(app)
ma.init_app(app)
jwt.init_app(app)

SWAGGER_URL="/swagger"
API_URL='/static/swagger.json'

swagger_ui_blueprint = get_swaggerui_blueprint(
  SWAGGER_URL,
  API_URL,
  config={
    'app_name': 'Heart Disease Prediction API'
  }
)
app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

create_initial_user()

if __name__ == '__main__':
  if os.environ.get('FLASK_ENV') == 'test':
    app.run(host='0.0.0.0', port=os.environ.get('PORT') or 8080)
  elif os.environ.get('FLASK_ENV') == 'prod':
    print(f'SERVER IS LISTENING ON PORT {os.environ.get("PORT") or 8080}')
    http_server = WSGIServer(('0.0.0.0', int(os.environ.get('PORT')) or 8080), app)
    http_server.serve_forever()