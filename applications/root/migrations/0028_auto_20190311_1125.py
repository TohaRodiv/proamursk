# Generated by Django 2.1.1 on 2019-03-11 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0027_auto_20190306_1247'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cityguide',
            name='descriptor',
            field=models.TextField(verbose_name='Подзаголовок'),
        ),
        migrations.AlterField(
            model_name='cityguideitem',
            name='description',
            field=models.TextField(verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='event',
            name='lead',
            field=models.TextField(verbose_name='Лид'),
        ),
        migrations.AlterField(
            model_name='history',
            name='lead',
            field=models.TextField(verbose_name='Лид'),
        ),
        migrations.AlterField(
            model_name='news',
            name='lead',
            field=models.TextField(verbose_name='Лид'),
        ),
        migrations.AlterField(
            model_name='place',
            name='lead',
            field=models.TextField(verbose_name='Лид'),
        ),
        migrations.AlterField(
            model_name='report',
            name='lead',
            field=models.TextField(verbose_name='Лид'),
        ),
        migrations.AlterField(
            model_name='special',
            name='descriptor',
            field=models.TextField(verbose_name='Подзаголовок'),
        ),
    ]
