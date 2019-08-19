# Generated by Django 2.1.1 on 2019-08-19 14:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_create_channel_email'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='action',
            options={'verbose_name': 'Тип уведомления', 'verbose_name_plural': 'Типы уведомлений'},
        ),
        migrations.AlterModelOptions(
            name='recipient',
            options={'verbose_name': 'Получатель уведомлений', 'verbose_name_plural': 'Получатели уведомлений'},
        ),
        migrations.AddField(
            model_name='recipient',
            name='telegram_chat_id',
            field=models.CharField(blank=True, max_length=255, verbose_name='Telegram Chat ID'),
        ),
        migrations.AddField(
            model_name='variable',
            name='channels',
            field=models.ManyToManyField(blank=True, to='notifications.Channel', verbose_name='Канал'),
        ),
    ]
