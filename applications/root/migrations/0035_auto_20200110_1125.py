# Generated by Django 2.1.1 on 2020-01-10 11:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mediafiles', '0003_auto_20181219_1051'),
        ('root', '0034_auto_20190711_1533'),
    ]

    operations = [
        migrations.CreateModel(
            name='Compilation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('edit_date', models.DateTimeField(auto_now=True, verbose_name='Дата изменения')),
                ('is_active', models.BooleanField(default=True, verbose_name='Состояние')),
                ('meta_title', models.CharField(blank=True, max_length=255, verbose_name='Заголовок страницы (title / og:title)')),
                ('meta_description', models.TextField(blank=True, verbose_name='Описание страницы (description / og:description)')),
                ('meta_keywords', models.TextField(blank=True, verbose_name='Ключевые слова, через запятую (keywords)')),
                ('name', models.CharField(max_length=255, verbose_name='Название')),
                ('codename', models.CharField(max_length=255, unique=True, verbose_name='Кодовое название')),
                ('comment', models.TextField(blank=True, verbose_name='Комментарий')),
                ('og_image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='root_compilation_og_image', to='mediafiles.MediaFile', verbose_name='OG-image')),
            ],
            options={
                'verbose_name': 'Подборка материалов',
                'verbose_name_plural': 'Подборки материалов',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='CompilationItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity', models.CharField(max_length=255, verbose_name='Сущность')),
                ('object_id', models.PositiveIntegerField()),
                ('weight', models.PositiveIntegerField()),
                ('compilation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='root.Compilation', verbose_name='Подборка')),
            ],
            options={
                'verbose_name': 'Состав подборки',
                'verbose_name_plural': 'Состав подборки',
                'db_table': 'root_compilation_item',
                'ordering': ('weight',),
            },
        ),
        migrations.AlterField(
            model_name='cityguide',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='event',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='film',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='history',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='historyrubric',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='news',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='person',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='place',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='placereview',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='report',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='sidebarbanner',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='slider',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='special',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='widebanner',
            name='comment',
            field=models.TextField(blank=True, default='', verbose_name='Комментарий'),
        ),
    ]