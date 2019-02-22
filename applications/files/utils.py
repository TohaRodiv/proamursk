
from .models import UserFile, FileTag, FileExtension
from django.core.exceptions import ObjectDoesNotExist


def get_tags_id(tags):
    tags_id = []
    if tags:
        for tag_name in tags:
            if tag_name:
                try:
                    tag = FileTag.objects.get(name=tag_name)
                except ObjectDoesNotExist:
                    tag = FileTag.objects.create(name=tag_name)
                except:
                    tag = None

                if tag:
                    tags_id.append(tag.id)

    return tags_id


def get_file_data(fl):
    file_size_kb = int(round(float(fl.size) / 1024, 0))
    file_name = fl.name

    return {'name': file_name,
            'file_size': file_size_kb}