# Generated by Django 2.1.4 on 2018-12-20 15:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0004_auto_20181220_1507'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filmsession',
            name='film',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sessions', to='root.Film', verbose_name='Фильм'),
        ),
    ]
