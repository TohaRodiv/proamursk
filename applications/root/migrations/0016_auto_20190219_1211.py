# Generated by Django 2.1.4 on 2019-02-19 12:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0015_auto_20190215_1216'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='topitem',
            options={'ordering': ('weight',), 'verbose_name': 'Позиция в топе', 'verbose_name_plural': 'Топы для страниц'},
        ),
        migrations.RemoveField(
            model_name='cityguide',
            name='content',
        ),
        migrations.RemoveField(
            model_name='cityguide',
            name='lead',
        ),
    ]