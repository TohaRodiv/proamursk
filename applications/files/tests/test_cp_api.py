# -*- coding: utf-8 -*-

import json
import os
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core.files import File
from ..models import UserFile, FileExtension, FileTag


class FileApiTestCase(TestCase):

    @classmethod
    def setUpTestData(self):
        user_model = get_user_model()
        user = user_model(username='test_admin', is_active=True, is_staff=True)
        user.set_password('test_admin')
        user.save()

        txt_ext = FileExtension.objects.create(name='txt')
        tag = FileTag.objects.create(name='test')
        first_file = UserFile(name='first_file.txt',
                              file=File(open(os.path.join(os.path.dirname(__file__), 'test.txt'))),
                              file_size=1024,
                              extension=txt_ext)

        second_file = UserFile(name='second_file.txt',
                              file=File(open(os.path.join(os.path.dirname(__file__), 'test.txt'))),
                              file_size=2048,
                              extension=txt_ext)

        first_file.save()
        second_file.save()
        first_file.tags.add(tag)
        second_file.tags.add(tag)

    def tearDown(self):
        UserFile.objects.all().delete()

    def test_list_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s?order_by=id' % reverse('api-files-list')

        response = self.client.get(url)
        assert response.status_code == 200

        data = json.loads(response.content)
        # Проверка атрибутов в ответе
        assert 'total_count' in data
        assert 'current_count' in data
        assert 'items' in data

        items = data['items']
        assert isinstance(items, list)
        assert len(items) == 2

        first_item = items[0]
        assert first_item.get('id') == 1
        assert first_item.get('name') == u'first_file.txt'
        assert 'size' in first_item
        assert 'url' in first_item
        assert 'tags' in first_item
        assert 'extension' in first_item
        assert 'create_date' in first_item

    def test_detail_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s' % reverse('api-files-detail', args=[1])

        response = self.client.get(url)
        assert response.status_code == 200
        data = json.loads(response.content)
        first_item = data
        assert first_item.get('id') == 1
        assert first_item.get('name') == u'first_file.txt'
        assert 'size' in first_item
        assert 'url' in first_item
        assert 'tags' in first_item
        assert 'extension' in first_item
        assert 'create_date' in first_item

    def test_files_update_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s' % reverse('api-files-detail', args=[1])
        response = self.client.put(url)
        assert response.status_code == 405
        response = self.client.patch(url)
        assert response.status_code == 405

    def test_files_delete_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s' % reverse('api-files-detail', args=[1])
        response = self.client.delete(url)
        assert response.status_code == 204

    def test_files_delete_action_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s' % reverse('api-files-list')
        response = self.client.patch(url, json.dumps(dict(action='delete', objects=[2])), content_type='application/json')
        assert response.status_code == 200

    def test_upload_file_api(self):
        self.client.login(username='test_admin', password='test_admin')
        with open(os.path.join(os.path.dirname(__file__), 'test.txt')) as f:
            self.client.login()
            url = reverse('api-files-list')
            response = self.client.post(url, {'tags': u'тестовый', 'file': f})

        assert response.status_code == 200

        data = json.loads(response.content)

        # Проверка атрибутов в ответе
        assert 'id' in data
        assert 'name' in data
        assert 'size' in data
        assert 'url' in data

        fl = UserFile.objects.get(id=data['id'])

        # Проверка что присвоился тег
        assert fl.tags.all().first().name == u'тестовый'
        file_path = fl.file.path
        # Проверка что файл  существует
        assert os.path.isfile(file_path)
        fl.delete()
        # Проверка что файл удалился
        assert not os.path.isfile(file_path)

    def test_upload_empty_file_api(self):
        self.client.login(username='test_admin', password='test_admin')
        with open(os.path.join(os.path.dirname(__file__), 'empty_test.txt')) as f:
            self.client.login()
            url = reverse('api-files-list')
            response = self.client.post(url, {'tags': u'тестовый', 'file': f})

        assert response.status_code == 400

        data = json.loads(response.content)

        # Проверка атрибутов в ответе
        assert 'file' in data
        assert isinstance(data.get('file'), list)
        assert len(data.get('file', [])) > 0




