# Generated by Django 2.1.4 on 2019-02-14 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0011_auto_20190214_2123'),
    ]

    operations = [
        migrations.AddField(
            model_name='cityguide',
            name='show_two_banners',
            field=models.BooleanField(default=False, verbose_name='Показать 2 баннера'),
        ),
        migrations.AddField(
            model_name='event',
            name='show_two_banners',
            field=models.BooleanField(default=False, verbose_name='Показать 2 баннера'),
        ),
        migrations.AddField(
            model_name='film',
            name='show_two_banners',
            field=models.BooleanField(default=False, verbose_name='Показать 2 баннера'),
        ),
        migrations.AddField(
            model_name='history',
            name='show_two_banners',
            field=models.BooleanField(default=False, verbose_name='Показать 2 баннера'),
        ),
        migrations.AddField(
            model_name='news',
            name='show_two_banners',
            field=models.BooleanField(default=False, verbose_name='Показать 2 баннера'),
        ),
        migrations.AddField(
            model_name='person',
            name='show_two_banners',
            field=models.BooleanField(default=False, verbose_name='Показать 2 баннера'),
        ),
        migrations.AddField(
            model_name='place',
            name='show_two_banners',
            field=models.BooleanField(default=False, verbose_name='Показать 2 баннера'),
        ),
        migrations.AddField(
            model_name='report',
            name='show_two_banners',
            field=models.BooleanField(default=False, verbose_name='Показать 2 баннера'),
        ),
    ]