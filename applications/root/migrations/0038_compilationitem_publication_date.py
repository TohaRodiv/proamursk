# Generated by Django 2.1.1 on 2020-01-17 15:00

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0037_compilationitem_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='compilationitem',
            name='publication_date',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата и время публикации'),
        ),
    ]
