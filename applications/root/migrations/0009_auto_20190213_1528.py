# Generated by Django 2.1.4 on 2019-02-13 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0008_auto_20190213_1525'),
    ]

    operations = [
        migrations.AddField(
            model_name='cityguide',
            name='content_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор материала'),
        ),
        migrations.AddField(
            model_name='cityguide',
            name='cover_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор обложки'),
        ),
        migrations.AddField(
            model_name='event',
            name='content_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор материала'),
        ),
        migrations.AddField(
            model_name='event',
            name='cover_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор обложки'),
        ),
        migrations.AddField(
            model_name='history',
            name='content_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор материала'),
        ),
        migrations.AddField(
            model_name='history',
            name='cover_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор обложки'),
        ),
        migrations.AddField(
            model_name='person',
            name='content_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор материала'),
        ),
        migrations.AddField(
            model_name='person',
            name='cover_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор обложки'),
        ),
        migrations.AddField(
            model_name='place',
            name='content_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор материала'),
        ),
        migrations.AddField(
            model_name='place',
            name='cover_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор обложки'),
        ),
        migrations.AddField(
            model_name='report',
            name='content_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор материала'),
        ),
        migrations.AddField(
            model_name='report',
            name='cover_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор обложки'),
        ),
        migrations.AddField(
            model_name='special',
            name='content_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор материала'),
        ),
        migrations.AddField(
            model_name='special',
            name='cover_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор обложки'),
        ),
    ]
