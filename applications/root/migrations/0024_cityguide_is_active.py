# Generated by Django 2.1.4 on 2019-02-21 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0023_auto_20190221_1430'),
    ]

    operations = [
        migrations.AddField(
            model_name='cityguide',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Состояние'),
        ),
    ]
