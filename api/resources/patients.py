from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from marshmallow import Schema, fields, ValidationError, validate
import re, os
from datetime import datetime
import requests, json

from extentions import api
from models.patients import PatientsModel

def validate_pesel(value):
  reg = re.compile(r'^[0-9]{11}$')

  if not reg.match(value):
    raise ValidationError('Wprowadzono niepoprawny PESEL')
  else:
    digits = list(map(int, value))
    checksum = (1 * digits[0] + 3 * digits[1] + 7 * digits[2] + 9 * digits[3] +
      1 * digits[4] + 3 * digits[5] + 7 * digits[6] + 9 * digits[7] +
      1 * digits[8] + 3 * digits[9]) % 10

    if checksum == 0:
      checksum = 10

    checksum = 10 - checksum

    if int(value[10]) != checksum:
      raise ValidationError('Wprowadzono niepoprawny PESEL')

def validate_email(value):
  if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
    raise ValidationError('Wprowadzono niepoprawny adres email')

def validate_phone(value):
  if not re.match(r'^(\+48)?\d{9}$', value):
    raise ValidationError('Wprowadzono niepoprawny numer telefonu')

def pesel_to_sex(pesel):
  penultimate_number = int(pesel[-2])

  if penultimate_number % 2 == 0:
    return 1
  else:
    return 0

def pesel_to_age(pesel):
    year = int(pesel[0:2])
    month = int(pesel[2:4])
    day = int(pesel[4:6])

    if month > 80:
        year += 1800
        month -= 80
    elif month > 20:
        year += 2000
        month -= 20
    else:
        year += 1900

    birth_date = datetime(year, month, day)
    today = datetime.now()
    age = today.year - birth_date.year

    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1

    return age

class PatientSchema(Schema):
  firstname = fields.String(required=True)
  lastname = fields.String(required=True)
  pesel = fields.String(required=True, validate=validate_pesel)
  email = fields.String(required=True, validate=validate_email)
  phone = fields.String(required=True, validate=validate_phone)
  cp = fields.Int(required=True, validate=validate.Range(0, 3))
  trestbps = fields.Int(required=True, validate=validate.Range(80, 200))
  chol = fields.Int(required=True, validate=validate.Range(100, 600))
  fbs = fields.Bool(required=True)
  restecg = fields.Int(required=True, validate=validate.Range(0, 2))
  thalach = fields.Int(required=True, validate=validate.Range(60, 220))
  exang = fields.Bool(required=True)
  oldpeak = fields.Int(required=True, validate=validate.Range(0, 6))
  slope = fields.Int(required=True, validate=validate.Range(0, 2))
  ca = fields.Int(required=True, validate=validate.Range(0, 3))
  thal = fields.Int(required=True, validate=validate.Range(0, 3))

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

class PatientsResource(Resource):
  @jwt_required()
  def get(self):
    return jsonify(PatientsModel.get_all())

  @jwt_required()
  def post(self):
    request.json['phone'] = request.json['phone'].replace(' ', '')
    try:
      validated_data = PatientSchema().load(request.json)
    except ValidationError as e:
      return { 'msg': e.messages }, 400

    validated_data['sex'] = pesel_to_sex(validated_data['pesel'])
    validated_data['age'] = pesel_to_age(validated_data['pesel'])

    request_body = {
      'data': [[
        validated_data['age'],
        validated_data['sex'],
        validated_data['cp'],
        validated_data['trestbps'],
        validated_data['chol'],
        validated_data['fbs'],
        validated_data['restecg'],
        validated_data['thalach'],
        validated_data['exang'],
        validated_data['oldpeak'],
        validated_data['slope'],
        validated_data['ca'],
        validated_data['thal']
      ]]
    }

    request_body = json.dumps(request_body)
    request_headers = {
      'Content-Type': 'application/json'
    }

    response = requests.post(os.environ.get('MODEL_URI'), data=request_body, headers=request_headers)

    validated_data['result'] = response.json()['probability'][0]

    new_patient = PatientsModel(**validated_data)
    return new_patient.create_item()

class PatientResource(Resource):
  @jwt_required()
  def delete(self, id):
    patient = PatientsModel.get_by_id(id)
    return PatientsModel.delete_item(patient)

api.add_resource(PatientsResource, '/patients')
api.add_resource(PatientResource, '/patient/<string:id>')