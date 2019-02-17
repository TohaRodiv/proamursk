# Generated by Django 2.1.4 on 2019-02-15 11:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contentblocks', '0001_initial'),
        ('contenttypes', '0002_remove_content_type_name'),
        ('root', '0012_auto_20190214_2137'),
    ]

    operations = [
        migrations.CreateModel(
            name='TopItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField()),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contentblocks.Page', verbose_name='Страница')),
            ],
            options={
                'verbose_name': 'Позиция в топе',
                'verbose_name_plural': 'Топы для страниц',
                'ordering': ('-id',),
            },
        ),
    ]