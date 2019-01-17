# -*-coding: utf-8 -*-

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ..models import UserFile, FileTag, FileExtension


class UserFileNestedSerializer(ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)
    size = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UserFile
        fields = ('id', 'name', 'size', 'url')

    def get_url(self, instance):
        return instance.file.url

    def get_size(self, instance):
        return instance.get_text_file_size()


class UserFileListSerializer(ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)
    size = serializers.SerializerMethodField(read_only=True)
    extension = serializers.SerializerMethodField(read_only=True)
    tags = serializers.StringRelatedField(many=True)

    class Meta:
        model = UserFile
        fields = ('id', 'name', 'size', 'tags', 'url', 'extension', 'create_date')

    def get_url(self, instance):
        return instance.file.url

    def get_size(self, instance):
        return instance.get_text_file_size()

    def get_extension(self, instance):
        return instance.extension.name.upper()  if instance.extension else u''


class FileExtensionSerializer(ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FileExtension
        fields = ('id', 'name')

    def get_name(self, instance):
        return instance.name.upper()


class FileTagSerializer(ModelSerializer):

    class Meta:
        model = FileTag
        fields = ('id', 'name')


class UserFileDetailSerializer(ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)
    size = serializers.SerializerMethodField(read_only=True)
    tags = FileTagSerializer(many=True)
    extension = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UserFile
        fields = ('id', 'name', 'size', 'url', 'tags', 'extension', 'create_date')

    def get_url(self, instance):
        return instance.file.url

    def get_size(self, instance):
        return instance.get_text_file_size()

    def get_extension(self, instance):
        return instance.extension.name.upper() if instance.extension else u''