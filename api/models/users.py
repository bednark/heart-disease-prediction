from azure.cosmos import PartitionKey
from azure.cosmos.exceptions import CosmosResourceExistsError, CosmosHttpResponseError
from extentions import database

container = database.create_container_if_not_exists(
  id='users',
  partition_key=PartitionKey(path='/username'),
  unique_key_policy={
    'uniqueKeys': [
      { 'paths': ['/username'] }
    ]
  }
)

def create_initial_user():
  try:
    user_item = {
      'id': '4f8f2bc1-e6b8-4d0e-85a4-1a149af85b27',
      'username': 'admin',
      'password_hash': '8501890333773da240a9df349888342c83ea26e0fbf56b8b9514d392517b914c',
      'firstname': 'First',
      'lastname': 'Admin',
      'access_group': 'Administrator',
      'salt': '34bbadffb35290921218fe8be86d49c9'
    }
    container.create_item(body=user_item)
    print('Initial user created successfully')
  except (CosmosResourceExistsError, CosmosHttpResponseError):
    print('Initial user already exists')


class UsersModel:
  def __init__(self, username, password_hash, firstname, lastname, access_group, salt):
    self.username = username
    self.password_hash = password_hash
    self.firstname = firstname
    self.lastname = lastname
    self.access_group = access_group
    self.salt = salt

  def get_all():
    query = f'SELECT * FROM u'
    items = list(container.query_items(query, enable_cross_partition_query=True))
    return items

  def get_by_id(id):
    query = f'SELECT * FROM u WHERE u.id="{id}"'
    item = list(container.query_items(query, enable_cross_partition_query=True))
    if item:
      return item[0]
    else:
      return { 'msg': 'User not found' }, 404

  def get_by_username(username):
    query = f'SELECT * FROM u WHERE u.username="{username}"'
    item = list(container.query_items(query, enable_cross_partition_query=True))
    if item:
      return item[0]
    else:
      return { 'msg': 'User not found' }, 404

  def create_item(self):
    item = {
      'username': self.username,
      'password_hash': self.password_hash,
      'firstname': self.firstname,
      'lastname': self.lastname,
      'access_group': self.access_group,
      'salt': self.salt
    }
    try:
      container.create_item(body=item, enable_automatic_id_generation=True)
      return { 'msg': 'User added successfuly' }, 201
    except CosmosResourceExistsError:
      return { 'msg': 'Unique index constraint violation' }, 409

  def upsert_item(item):
    try:
      container.upsert_item(body=item)
      return { 'msg': 'User updated successfuly' }, 200
    except CosmosHttpResponseError:
      return { 'msg': 'User not found' }, 404

  def delete_item(item):
    try:
      container.delete_item(item=item, partition_key=item['username'])
      return { 'msg': 'User deleted successfuly' }, 200
    except TypeError:
      return { 'msg': 'User not found' }, 404