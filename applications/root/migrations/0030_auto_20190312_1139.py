# Generated by Django 2.1.1 on 2019-03-12 11:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0029_cityguideitem_cover_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cityguideitem',
            name='place',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='guides', to='root.Place', verbose_name='Материал об этом месте'),
        ),
    ]
