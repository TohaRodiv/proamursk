# -*- coding: utf-8 -*-

import json
import os
from django.test import TestCase
from django.core.urlresolvers import reverse
from django.contrib.auth import get_user_model
from django.core.files import File
from ..models import MediaFile, Extension, MediaTag


class FileApiTestCase(TestCase):

    @classmethod
    def setUpTestData(self):
        user_model = get_user_model()
        user = user_model(username='test_admin', is_active=True, is_staff=True)
        user.set_password('test_admin')
        user.save()

        ext = Extension.objects.create(name='jpg')
        tag = MediaTag.objects.create(name='test')
        first_file = MediaFile(name='first_file.jpg',
                               file=File(open(os.path.join(os.path.dirname(__file__), 'test.jpg'))),
                               file_size=1024,
                               extension=ext)

        second_file = MediaFile(name='second_file.jpg',
                                file=File(open(os.path.join(os.path.dirname(__file__), 'test.jpg'))),
                                file_size=2048,
                                extension=ext)

        first_file.save()
        second_file.save()
        first_file.tags.add(tag)
        second_file.tags.add(tag)

    def tearDown(self):
        MediaFile.objects.all().delete()

    def test_files_list_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s?order_by=id' % reverse('api-mediafiles-list')

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

        first_file = items[0]
        assert first_file.get('id') == 1
        assert first_file.get('name') == u'first_file.jpg'
        assert 'width' in first_file
        assert 'height' in first_file
        assert 'size' in first_file
        assert 'tags' in first_file
        assert 'original_url' in first_file
        assert 'min_crop_url' in first_file
        assert 'medium_crop_url' in first_file
        assert 'extension' in first_file
        assert 'thumbnails_size' in first_file
        assert 'create_date' in first_file

    def test_file_detail_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s' % reverse('api-mediafiles-detail', args=[1])

        response = self.client.get(url)
        assert response.status_code == 200
        data = json.loads(response.content)
        first_file = data
        assert first_file.get('id') == 1
        assert first_file.get('name') == u'first_file.jpg'
        assert 'width' in first_file
        assert 'height' in first_file
        assert 'size' in first_file
        assert 'original_url' in first_file
        assert 'tags' in first_file
        assert 'thumbnails' in first_file
        assert 'create_date' in first_file

    def test_files_update_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s' % reverse('api-mediafiles-detail', args=[1])
        response = self.client.put(url)
        assert response.status_code == 405
        response = self.client.patch(url)
        assert response.status_code == 405

    def test_files_delete_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s' % reverse('api-mediafiles-detail', args=[1])
        response = self.client.delete(url)
        assert response.status_code == 204

    def test_files_delete_action_api(self):
        self.client.login(username='test_admin', password='test_admin')
        url = '%s' % reverse('api-mediafiles-list')
        response = self.client.patch(url, json.dumps(dict(action='delete', objects=[2])), content_type='application/json')
        assert response.status_code == 200

    def test_upload_file_api(self):
        self.client.login(username='test_admin', password='test_admin')
        with open(os.path.join(os.path.dirname(__file__), 'test.jpg')) as f:
            self.client.login()
            url = reverse('api-mediafiles-list')
            response = self.client.post(url, {'tags': u'тестовый', 'file': f})

        assert response.status_code == 200

        data = json.loads(response.content)

        # Проверка атрибутов в ответе
        assert 'id' in data
        assert 'name' in data
        assert 'width' in data
        assert 'height' in data
        assert 'size' in data
        assert 'original_url' in data
        assert 'min_url' in data
        assert 'medium_url' in data
        assert 'large_url' in data
        assert 'min_crop_url' in data
        assert 'medium_crop_url' in data

        fl = MediaFile.objects.get(id=data['id'])

        # Проверка что присвоился тег
        assert fl.tags.all().first().name == u'тестовый'
        file_path = fl.file.path
        # Проверка что файл  существует
        assert os.path.isfile(file_path)
        fl.delete()
        # Проверка что файл удалился
        assert not os.path.isfile(file_path)




