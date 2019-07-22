# -*-coding: utf-8 -*-

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ..models import MediaFile, Thumbnail, MediaTag, Extension


class ImageNestedSerializer(ModelSerializer):
    original_url = serializers.SerializerMethodField(read_only=True)
    min_url = serializers.SerializerMethodField(read_only=True)
    medium_url = serializers.SerializerMethodField(read_only=True)
    large_url = serializers.SerializerMethodField(read_only=True)
    min_crop_url = serializers.SerializerMethodField(read_only=True)
    medium_crop_url = serializers.SerializerMethodField(read_only=True)
    size = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MediaFile
        fields = ('id', 'name', 'width', 'height', 'size', 'original_url', 'min_url', 'medium_url', 'large_url',
                  'min_crop_url', 'medium_crop_url')

    def get_original_url(self, instance):
        return instance.file.url

    def get_min_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_min')

    def get_medium_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_medium')

    def get_large_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_large')

    def get_min_crop_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_min_crop')

    def get_medium_crop_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_medium_crop')

    def get_size(self, instance):
        return instance.get_text_file_size()


class ImageListSerializer(ModelSerializer):
    original_url = serializers.SerializerMethodField(read_only=True)
    min_url = serializers.SerializerMethodField(read_only=True)
    medium_url = serializers.SerializerMethodField(read_only=True)
    large_url = serializers.SerializerMethodField(read_only=True)
    min_crop_url = serializers.SerializerMethodField(read_only=True)
    medium_crop_url = serializers.SerializerMethodField(read_only=True)
    size = serializers.SerializerMethodField(read_only=True)
    thumbnails_size = serializers.SerializerMethodField(read_only=True)
    extension = serializers.SerializerMethodField(read_only=True)
    tags = serializers.StringRelatedField(many=True)

    class Meta:
        model = MediaFile
        fields = ('id', 'name', 'width', 'height', 'size', 'extension', 'tags', 'thumbnails_size',
                  'original_url', 'min_url', 'medium_url', 'large_url', 'min_crop_url', 'medium_crop_url',
                  'create_date')

    def get_original_url(self, instance):
        return instance.file.url

    def get_min_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_min')

    def get_medium_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_medium')

    def get_large_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_large')

    def get_min_crop_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_min_crop')

    def get_medium_crop_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_medium_crop')

    def get_size(self, instance):
        return instance.get_text_file_size()

    def get_extension(self, instance):
        return instance.extension.name.upper() if instance.extension else u''

    def get_thumbnails_size(self, instance):
        thumbnails_size = instance.thumbnails_size

        if not thumbnails_size or thumbnails_size == 0:
            return u'—'

        thumbnails_size = float(thumbnails_size)
        if thumbnails_size > 1024:
            thumbnails_size = (u'%s МБ' % (int((thumbnails_size / float(1024)) * 100) / float(100))).rstrip('0').rstrip(
                '0').rstrip('.')
        else:
            thumbnails_size = u'%d КБ' % thumbnails_size
        return thumbnails_size.replace('.', ',')


class ExtensionSerializer(ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Extension
        fields = ('id', 'name')

    def get_name(self, instance):
        return instance.name.upper()


class MediaTagsSerializer(ModelSerializer):

    class Meta:
        model = MediaTag
        fields = ('id', 'name')


class ThumbnailDetailSerializer(ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)
    size = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Thumbnail
        fields = ('id', 'width', 'height', 'size', 'url')

    def get_url(self, instance):
        return instance.file.url

    def get_size(self, instance):
        return instance.get_text_file_size()


class ImageDetailSerializer(ModelSerializer):
    original_url = serializers.SerializerMethodField(read_only=True)
    size = serializers.SerializerMethodField(read_only=True)
    thumbnails = ThumbnailDetailSerializer(many=True, source='thumbnail_set')
    tags = MediaTagsSerializer(many=True)
    extension = serializers.SerializerMethodField(read_only=True)
    large_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MediaFile
        fields = ('id', 'name', 'width', 'height', 'size', 'original_url', 'tags', 'thumbnails', 'extension',
                  'large_url', 'create_date')

    def get_original_url(self, instance):
        return instance.file.url

    def get_large_url(self, instance):
        return instance.get_thumbnail_url_by_name('sap_large')

    def get_size(self, instance):
        return instance.get_text_file_size()

    def get_extension(self, instance):
        return instance.extension.name.upper() if instance.extension else u''
