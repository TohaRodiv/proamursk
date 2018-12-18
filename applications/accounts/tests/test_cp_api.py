# # -*- coding: utf-8 -*-
#
# import json
# from django.test import TestCase
# from ..models import User
# from django.core.urlresolvers import reverse
# from django.test import Client
#
#
# class UserApiTestCase(TestCase):
#
#     @classmethod
#     def setUpTestData(self):
#         user = User(username='test_admin', is_active=True, is_staff=True)
#         user.set_password('test_admin')
#         user.save()
#         user1 = User(username='test1', is_active=True, is_staff=True)
#         user1.set_password('test1')
#         user1.save()
#
#     def tearDown(self):
#         User.objects.all().delete()
#
#     def test_login(self):
#         c = Client()
#         response = c.post('/api/v1/auth/signin/',{'username': 'test_admin', 'password': 'test_admin'})
#         self.assertContains(response, u'{}')
#
#     def test_list_api(self):
#         self.client.login(username='test_admin', password='test_admin')
#         url = '%s?order_by=id' % reverse('api-users-list')
#
#         response = self.client.get(url)
#         assert response.status_code == 200
#
#         data = json.loads(response.content)
#         # Проверка атрибутов в ответе
#         assert 'total_count' in data
#         assert 'current_count' in data
#         assert 'items' in data
#
#         items = data['items']
#         assert isinstance(items, list)
#         assert len(items) == 2
#
#         first_item = items[0]
#         assert first_item.get('id') == 1
#         assert first_item.get('username') == u'test_admin'
#         assert 'email' in first_item
#         assert 'phone' in first_item
#         assert 'full_name' in first_item
#         assert 'is_active' in first_item
#         assert 'is_staff' in first_item
#         assert 'create_date' in first_item
#         assert 'edit_date' in first_item
#
#     def test_detail_api(self):
#         self.client.login(username='test_admin', password='test_admin')
#         url = '%s' % reverse('api-users-detail', args=[1])
#
#         response = self.client.get(url)
#         assert response.status_code == 200
#         first_item = json.loads(response.content)
#         assert first_item.get('id') == 1
#         assert first_item.get('username') == u'test_admin'
#         assert 'email' in first_item
#         assert 'phone' in first_item
#         assert 'first_name' in first_item
#         assert 'last_name' in first_item
#         assert 'patronymic' in first_item
#         assert 'is_active' in first_item
#         assert 'is_staff' in first_item
#         assert 'create_date' in first_item
#         assert 'edit_date' in first_item
#
#     def test_api_create_user(self):
#         c = Client()
#         c.login(username='test_admin', password='test_admin')
#         url = '%s' % reverse('api-users-list')
#         data_dict = dict(
#             username='test_create',
#             email='test_create@user.ru',
#             phone='+7 (123) 456 45 67',
#             first_name='first_name',
#             last_name='last_name',
#             patronymic='patronymic',
#             password1='test_create',
#             password2='test_create',
#             comment='comment',
#             is_staff=True,
#             is_active=True,
#         )
#         response = c.post(url, json.dumps(data_dict), content_type='application/json')
#
#         assert response.status_code == 201
#         item = json.loads(response.content)
#
#         for k, v in data_dict.items():
#             if k not in ['password1', 'password2']:
#                 try:
#                     assert item.get(k) == v
#                 except AssertionError as e:
#                     print '======= ERROR IN =========='
#                     print k, v
#                     raise e
#
#     def test_update_api(self):
#         self.client.login(username='test_admin', password='test_admin')
#         url = '%s' % reverse('api-users-detail', args=[2])
#         data_dict = dict(
#             username='test1',
#             email='test1@user.ru',
#             phone='+7 (123) 456 45 67',
#             first_name='first_name',
#             last_name='last_name',
#             patronymic='patronymic',
#             password1='test_create',
#             password2='test_create',
#             comment='comment',
#             is_staff=True,
#             is_active=True,
#         )
#         response = self.client.put(url, json.dumps(data_dict), content_type='application/json')
#
#         assert response.status_code == 200
#         item = json.loads(response.content)
#
#         for k, v in data_dict.items():
#             if k not in ['password1', 'password2']:
#                 try:
#                     assert item.get(k) == v
#                 except AssertionError as e:
#                     print '======= ERROR IN =========='
#                     print k, v
#                     raise e
#
