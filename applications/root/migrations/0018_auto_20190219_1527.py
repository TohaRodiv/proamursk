# Generated by Django 2.1.4 on 2019-02-19 15:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mediafiles', '0003_auto_20181219_1051'),
        ('root', '0017_auto_20190219_1254'),
    ]

    operations = [
        migrations.CreateModel(
            name='CityGuideItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('edit_date', models.DateTimeField(auto_now=True, verbose_name='Дата изменения')),
                ('is_active', models.BooleanField(default=True, verbose_name='Состояние')),
                ('title', models.CharField(max_length=255, verbose_name='Заголовок')),
                ('description', models.CharField(max_length=255, verbose_name='Описание')),
                ('single_room_price', models.CharField(blank=True, max_length=255, verbose_name='Одноместный номер')),
                ('luxury_room_price', models.CharField(blank=True, max_length=255, verbose_name='Одноместный номер')),
                ('nutrition_info', models.CharField(blank=True, max_length=255, verbose_name='Питание')),
                ('kitchen', models.CharField(blank=True, max_length=255, verbose_name='Кухня')),
                ('avg_value', models.CharField(blank=True, max_length=255, verbose_name='Средний чек')),
                ('enter_price', models.CharField(blank=True, max_length=255, verbose_name='Входной билет')),
                ('work_time', models.CharField(blank=True, max_length=255, verbose_name='Время работы')),
                ('phone', models.CharField(blank=True, max_length=255, verbose_name='Телефон')),
                ('site', models.URLField(blank=True, max_length=255, verbose_name='Сайт')),
                ('instagram', models.URLField(blank=True, max_length=255, verbose_name='Instagram')),
                ('address', models.CharField(max_length=255, verbose_name='Адрес')),
                ('coordinates', models.CharField(blank=True, max_length=255, verbose_name='Координаты')),
            ],
            options={
                'verbose_name': 'Гид по городу',
                'verbose_name_plural': 'Гиды по городу',
                'ordering': ('-id',),
            },
        ),
        migrations.AlterModelOptions(
            name='cityguide',
            options={'ordering': ('-id',), 'verbose_name': 'Страница гида по городу', 'verbose_name_plural': 'Страницы гидов по городу'},
        ),
        migrations.AddField(
            model_name='cityguideitem',
            name='city_guide',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='root.CityGuide', verbose_name='Гид по городу'),
        ),
        migrations.AddField(
            model_name='cityguideitem',
            name='cover',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mediafiles.MediaFile', verbose_name='Обложка'),
        ),
        migrations.AddField(
            model_name='cityguideitem',
            name='place',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='guides', to='root.Place', verbose_name='Материал об этом месте'),
        ),
        migrations.AddField(
            model_name='cityguideitem',
            name='slider',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='root.Slider', verbose_name='Слайдер'),
        ),
    ]