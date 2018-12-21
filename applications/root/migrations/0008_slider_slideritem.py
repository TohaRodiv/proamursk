# Generated by Django 2.1.4 on 2018-12-21 11:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mediafiles', '0003_auto_20181219_1051'),
        ('root', '0007_placereview_comment'),
    ]

    operations = [
        migrations.CreateModel(
            name='Slider',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('edit_date', models.DateTimeField(auto_now=True, verbose_name='Дата изменения')),
                ('is_active', models.BooleanField(default=True, verbose_name='Состояние')),
                ('title', models.CharField(max_length=255, verbose_name='Название')),
                ('format', models.CharField(choices=[('format_3x2', 'Горизонтальный / 3:2 — 1716x1144 px'), ('format_2x1', 'Горизонтальный / 2:1 — 1716x858 px')], max_length=45, verbose_name='Формат слайдера')),
                ('start_publication_date', models.DateTimeField(null=True, verbose_name='Дата и время начала публикации')),
                ('end_publication_date', models.DateTimeField(null=True, verbose_name='Дата и время окончания публикации')),
                ('comment', models.CharField(blank=True, default='', max_length=255, verbose_name='Комментарий')),
            ],
            options={
                'verbose_name': 'Слайдер',
                'verbose_name_plural': 'Слайдеры',
            },
        ),
        migrations.CreateModel(
            name='SliderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=255, verbose_name='Описание')),
                ('is_active', models.BooleanField(default=True, verbose_name='Состояние')),
                ('cover', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mediafiles.MediaFile', verbose_name='Обложка')),
                ('slider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='root.Slider', verbose_name='Слайдер')),
            ],
            options={
                'verbose_name': 'Слайд',
                'verbose_name_plural': 'Слайды',
            },
        ),
    ]
