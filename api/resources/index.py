from flask_restful import Resource

from extentions import api

class IndexResource(Resource):
  def get(self):
    return "This is API for Heart Disease Prediction"

api.add_resource(IndexResource, '/')