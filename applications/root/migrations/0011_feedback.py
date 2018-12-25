# Generated by Django 2.1.4 on 2018-12-25 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0010_auto_20181221_1205'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(choices=[('news', 'Поделиться хорошей новостью'), ('event', 'Поделиться событием'), ('history', 'Поделиться своей историей'), ('person', 'Предложить героя'), ('error', 'Сообщить об ошибке'), ('question', 'Задать вопрос')], max_length=255, verbose_name='Тема обращения')),
                ('name', models.CharField(max_length=255, verbose_name='ФИО отправителя')),
                ('email', models.EmailField(max_length=254, verbose_name='E-mail')),
                ('phone', models.CharField(blank=True, max_length=20, verbose_name='Телефон')),
                ('text', models.TextField(verbose_name='Текст обращения')),
                ('attachment', models.FileField(blank=True, max_length=1000, upload_to='attachments', verbose_name='Вложение')),
                ('is_agree', models.BooleanField(default=False, verbose_name='Согласие с правилами обработки данных')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
            ],
            options={
                'verbose_name': 'Обращение в редакцию',
                'verbose_name_plural': 'Обращения в редакцию',
                'ordering': ('-id',),
            },
        ),
    ]
