# Generated by Django 2.1.4 on 2019-02-13 15:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0007_auto_20190207_1729'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='content_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор материала'),
        ),
        migrations.AddField(
            model_name='news',
            name='cover_author',
            field=models.CharField(blank=True, max_length=255, verbose_name='Автор обложки'),
        ),
        migrations.AlterField(
            model_name='news',
            name='content',
            field=models.TextField(),
        ),
    ]
