# Generated by Django 2.1.4 on 2018-12-19 10:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mediafiles', '0002_auto_20181102_1115'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mediafile',
            name='extension',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='mediafiles.Extension', verbose_name='Расширение'),
        ),
    ]