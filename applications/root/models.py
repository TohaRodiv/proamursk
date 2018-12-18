from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils import timezone

from core.models import BaseModel, IsActiveMixin


class News(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        ordering = '-id',

    def __str__(self):
        return self.title


class Event(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    place = models.CharField('Место проведения', max_length=255, blank=True)
    coordinates = models.CharField('Координаты', max_length=255, blank=True)
    start_event_date = models.DateTimeField('Дата начала события')
    event_date_text = models.CharField('Дата проведения', max_length=255)
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Анонс события'
        verbose_name_plural = 'Анонсы событий'
        ordering = '-id',

    def __str__(self):
        return self.title


class Report(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    event = models.OneToOneField(Event, models.SET_NULL, null=True, verbose_name='Анонс события')
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    place = models.CharField('Место проведения', max_length=255, blank=True)
    coordinates = models.CharField('Координаты', max_length=255, blank=True)
    start_event_date = models.DateTimeField('Дата начала события')
    event_date_text = models.CharField('Дата проведения', max_length=255)
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Репортаж о событии'
        verbose_name_plural = 'Репортажи о событиях'
        ordering = '-id',

    def __str__(self):
        return self.title


class Special(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Заголовок', max_length=255)
    codename = models.CharField('Коднейм', max_length=255)
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Спецпроект'
        verbose_name_plural = 'Спецпроекты'
        ordering = '-id',

    def __str__(self):
        return self.title


class Person(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Статья о людях'
        verbose_name_plural = 'Статьи о людях'
        ordering = '-id',

    def __str__(self):
        return self.title


class History(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Историческая статья'
        verbose_name_plural = 'Исторические статьи'
        ordering = '-id',

    def __str__(self):
        return self.title


class CityGuide(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Гид по городу'
        verbose_name_plural = 'Гиды по городу'
        ordering = '-id',

    def __str__(self):
        return self.title


class Place(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Заголовок', max_length=255)
    address = models.CharField('Адрес', max_length=255, blank=True)
    coordinates = models.CharField('Координаты', max_length=255, blank=True)
    schedule = models.CharField('Режим работы', max_length=255, blank=True)
    content = JSONField()
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Статья о местах'
        verbose_name_plural = 'Статьи о местах'
        ordering = '-id',

    def __str__(self):
        return self.title


class PlaceComment(BaseModel):
    sender_name = models.CharField('ФИО отправителя', max_length=255)
    place = models.ForeignKey(Place, on_delete=models.CASCADE, verbose_name='Место')
    email = models.EmailField('E-mail')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    content = models.TextField('Контент')
    is_agree = models.BooleanField('Согласие с правилами обработки данных', default=False)
    is_active = models.BooleanField('Статус', default=False)

    class Meta:
        verbose_name = 'Отзыв о местах'
        verbose_name_plural = 'Отзывы о местах'
        ordering = '-id',

    def __str__(self):
        return 'Отзыв №{} о {}'.format(self.pk, self.place.title)


class Film(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Название', max_length=255)
    description = models.TextField('Описание')
    start_date = models.DateTimeField('Дата и время начала проката', null=True)
    end_date = models.DateTimeField('Дата и время окончания проката', null=True)
    release_year = models.CharField('Год выпуска', max_length=4)
    country = models.CharField('Страна', max_length=255)
    genre = models.CharField('Жанр', max_length=255)
    director = models.CharField('Режиссер', max_length=255)
    starring = models.CharField('В главных ролях', max_length=255)
    duration = models.CharField('Продолжительность', max_length=10)
    age_restriction = models.CharField('Возрастное ограничение', max_length=10)
    is_3d = models.BooleanField('3D', default=False)
    trailer = models.URLField('Трейлер')
    purchase_link = models.URLField('Ссылка на сайт кинотеатра для покупки билета')
    publication_date = models.DateTimeField('Дата публикации', default=timezone.now)

    class Meta:
        verbose_name = 'Киноанонс'
        verbose_name_plural = 'Киноанонсы'
        ordering = '-id',

    def __str__(self):
        return self.title


class FilmSession(BaseModel):
    film = models.ForeignKey(Film, models.CASCADE, verbose_name='Фильм')
    datetime = models.DateTimeField('Время сеанса')
    price = models.CharField('Цена', max_length=45)

    class Meta:
        verbose_name = 'Сеанс'
        verbose_name_plural = 'Сеансы'
        ordering = 'datetime'

    def __str__(self):
        return '{} {}'.format(self.film.title, self.datetime)


class SidebarBanner(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Название', max_length=255)
    link = models.CharField('Ссылка', max_length=255)
    start_publication_date = models.DateTimeField('Дата и время начала публикации', null=True)
    end_publication_date = models.DateTimeField('Дата и время окончания публикации', null=True)

    class Meta:
        verbose_name = 'Баннер в сайдбаре'
        verbose_name_plural = 'Баннеры в сайдбаре'


class WideBanner(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Название', max_length=255)
    link = models.CharField('Ссылка', max_length=255)
    start_publication_date = models.DateTimeField('Дата и время начала публикации', null=True)
    end_publication_date = models.DateTimeField('Дата и время окончания публикации', null=True)

    class Meta:
        verbose_name = 'Баннер-растяжка'
        verbose_name_plural = 'Баннеры-растяжки'


class Slider(BaseModel, IsActiveMixin):
    title = models.CharField('Название', max_length=255)
    start_publication_date = models.DateTimeField('Дата и время начала публикации', null=True)
    end_publication_date = models.DateTimeField('Дата и время окончания публикации', null=True)

    class Meta:
        verbose_name = 'Слайдер'
        verbose_name_plural = 'Слайдеры'


class SliderItem(models.Model, IsActiveMixin):
    slider = models.ForeignKey(Slider, on_delete=models.CASCADE, verbose_name='Слайдер')
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')

    class Meta:
        verbose_name = 'Слайд'
        verbose_name_plural = 'Слайды'


class Feedback(models.Model):
    NEWS = 'Поделиться хорошей новостью'
    EVENT = 'Поделиться событием'
    HISTORY = 'Поделиться своей историей'
    PERSON = 'Предложить героя'
    ERROR = 'Сообщить об ошибке'
    QUESTION = 'Задать вопрос'
    THEMES = (
        ('news', NEWS),
        ('event', EVENT),
        ('history', HISTORY),
        ('person', PERSON),
        ('error', ERROR),
        ('question', QUESTION)
    )
    theme = models.CharField(choices=THEMES, default=NEWS, max_length=255, verbose_name='Тема обращения')
    sender_name = models.CharField('ФИО отправителя', max_length=255)
    email = models.EmailField('E-mail')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    content = models.TextField('Текст обращения')
    file = models.FileField('Вложение', upload_to='attachments', max_length=1000)
    is_agree = models.BooleanField('Согласие с правилами обработки данных', default=False)

    class Meta:
        verbose_name = 'Обращение в редакцию'
        verbose_name_plural = 'Обращения в редакцию'
        ordering = '-id',


