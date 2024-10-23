from azure.cosmos import PartitionKey
from azure.cosmos.exceptions import CosmosResourceExistsError, CosmosHttpResponseError
from extentions import database

container = database.create_container_if_not_exists(
  id='patients',
  partition_key=PartitionKey(path='/pesel'),
  unique_key_policy={
    'uniqueKeys': [
      { 'paths': ['/pesel'] }
    ]
  }
)

class PatientsModel:
  def __init__(self, firstname, lastname, pesel, email, phone,
    age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang,
    oldpeak, slope, ca, thal, result
  ):
    self.firstname = firstname
    self.lastname = lastname
    self.pesel = pesel
    self.email = email
    self.phone = phone
    self.age = age
    self.sex = sex
    self.cp = cp
    self.trestbps = trestbps
    self.chol = chol
    self.fbs = fbs
    self.restecg = restecg
    self.thalach = thalach
    self.exang = exang
    self.oldpeak = oldpeak
    self.slope = slope
    self.ca = ca
    self.thal = thal
    self.result = result

  def get_all():
    query = f'SELECT * FROM p'
    items = list(container.query_items(query, enable_cross_partition_query=True))
    return items

  def get_by_id(id):
    query = f'SELECT * FROM p WHERE p.id="{id}"'
    item = list(container.query_items(query, enable_cross_partition_query=True))
    if item:
      return item[0]
    else:
      return { 'msg': 'Pacjent nie istnieje' }, 404

  def create_item(self):
    item = {
      'firstname': self.firstname,
      'lastname': self.lastname,
      'pesel': self.pesel,
      'age': self.age,
      'sex': self.sex,
      'email': self.email,
      'phone': self.phone,
      'cp': self.cp,
      'trestbps': self.trestbps,
      'chol': self.chol,
      'fbs': self.fbs,
      'restecg': self.restecg,
      'thalach': self.thalach,
      'exang': self.exang,
      'oldpeak': self.oldpeak,
      'slope': self.slope,
      'ca': self.ca,
      'thal': self.thal,
      'result': self.result
    }
    try:
      patient = container.create_item(body=item, enable_automatic_id_generation=True)
      return {
        'msg': 'Predykcja wykonana pomyślnie',
        'id': patient['id'],
        'result': patient['result']
      }, 201
    except CosmosResourceExistsError:
      return { 'msg': 'Pacjent o takim numerze PESEL już istnieje' }, 409

  def delete_item(item):
    try:
      container.delete_item(item=item, partition_key=item['pesel'])
      return { 'msg': 'Pacjent usunięty pomyślnie' }, 200
    except TypeError:
      return { 'msg': 'Pacjent nie istnieje' }, 404