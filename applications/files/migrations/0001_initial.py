# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-22 02:54
from __future__ import unicode_literals

import applications.files.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FileExtension',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, unique=True, verbose_name='\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435')),
            ],
            options={
                'db_table': 'files_file_extension',
                'verbose_name': '\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435',
                'verbose_name_plural': '\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u044f',
            },
        ),
        migrations.CreateModel(
            name='FileTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0442\u0435\u0433\u0430')),
            ],
            options={
                'verbose_name': '\u0422\u0435\u0433 \u0444\u0430\u0439\u043b\u0430',
                'verbose_name_plural': '\u0422\u0435\u0433\u0438 \u0444\u0430\u043b\u043e\u0432',
            },
        ),
        migrations.CreateModel(
            name='UserFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='\u0418\u043c\u044f \u0444\u0430\u0439\u043b\u0430 \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u0430')),
                ('file', models.FileField(max_length=1000, upload_to=applications.files.models.get_file_path, verbose_name='\u0424\u0430\u0439\u043b')),
                ('file_size', models.IntegerField(verbose_name='\u0420\u0430\u0437\u043c\u0435\u0440 \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u0430, \u041a\u0411')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='\u0414\u0430\u0442\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438')),
                ('extension', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='files.FileExtension', verbose_name='\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435')),
                ('tags', models.ManyToManyField(blank=True, to='files.FileTag', verbose_name='\u0422\u0435\u0433\u0438')),
            ],
            options={
                'db_table': 'files_user_file',
                'verbose_name': '\u0424\u0430\u0439\u043b',
                'verbose_name_plural': '\u0424\u0430\u0439\u043b\u044b',
            },
        ),
    ]
