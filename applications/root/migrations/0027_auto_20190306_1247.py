# Generated by Django 2.1.4 on 2019-03-06 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0026_news_descriptor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='slideritem',
            name='description',
            field=models.TextField(blank=True, verbose_name='Описание'),
        ),
    ]