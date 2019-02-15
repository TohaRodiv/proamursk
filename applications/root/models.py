from django.contrib.postgres.fields import JSONField
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from applications.contentblocks.models import Page
from core.models import BaseModel, IsActiveMixin, BaseSeoMixin
from django.apps import apps


class TopItem(models.Model):
    page = models.ForeignKey(Page, verbose_name='Страница', on_delete=models.CASCADE, related_name='top_items')
    codename = models.CharField('Сущность', max_length=255)
    object_id = models.PositiveIntegerField()
    weight = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Позиция в топе'
        verbose_name_plural = 'Топы для страниц'
        ordering = '-id',

    def get_model(self):
        return apps.get_model('root', self.codename)

    def get_object(self):
        obj = None
        model = self.get_model()
        if model:
            obj = model.objects.filter(id=self.object_id).first()
        return obj

    def __str__(self):
        return str(self.id)


class News(BaseModel, BaseSeoMixin, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = models.TextField()
    cover_author = models.CharField('Автор обложки', max_length=255, blank=True)
    content_author = models.CharField('Автор материала', max_length=255, blank=True)
    publication_date = models.DateTimeField('Дата и время публикации', default=timezone.now)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')
    show_two_banners = models.BooleanField('Показать 2 баннера', default=False)

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('news-detail', args=[self.id])


class Event(BaseModel, BaseSeoMixin, IsActiveMixin):
    SMALL = 'small'
    FULL = 'full'
    FORMATS = (
        (SMALL, 'Обычная обложка'),
        (FULL, 'Полноразмерная обложка')
    )
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    cover_format = models.CharField('Формат обложки', choices=FORMATS, default=SMALL, max_length=45)
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    place = models.CharField('Место проведения', max_length=255)
    coordinates = models.CharField('Координаты', max_length=255, blank=True)
    start_event_date = models.DateTimeField('Дата начала события')
    event_date_text = models.CharField('Дата проведения', max_length=255)
    cover_author = models.CharField('Автор обложки', max_length=255, blank=True)
    content_author = models.CharField('Автор материала', max_length=255, blank=True)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')
    show_two_banners = models.BooleanField('Показать 2 баннера', default=False)

    class Meta:
        verbose_name = 'Анонс события'
        verbose_name_plural = 'Анонсы событий'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('events-detail', args=[self.id])

    @property
    def is_past(self):
        return self.start_event_date < timezone.now()


class Report(BaseModel, BaseSeoMixin, IsActiveMixin):
    SMALL = 'small'
    FULL = 'full'
    FORMATS = (
        (SMALL, 'Обычная обложка'),
        (FULL, 'Полноразмерная обложка')
    )
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    cover_format = models.CharField('Формат обложки', choices=FORMATS, default=SMALL, max_length=45)
    event = models.OneToOneField(Event, models.SET_NULL, null=True, verbose_name='Анонс события', related_name='report')
    title = models.CharField('Заголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    cover_author = models.CharField('Автор обложки', max_length=255, blank=True)
    content_author = models.CharField('Автор материала', max_length=255, blank=True)
    place = models.CharField('Место проведения', max_length=255)
    coordinates = models.CharField('Координаты', max_length=255, blank=True)
    event_date_text = models.CharField('Дата проведения', max_length=255)
    publication_date = models.DateTimeField('Дата и время публикации', default=timezone.now)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')
    show_two_banners = models.BooleanField('Показать 2 баннера', default=False)

    class Meta:
        verbose_name = 'Репортаж о событии'
        verbose_name_plural = 'Репортажи о событиях'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('reports-detail', args=[self.id])


class Special(BaseModel, BaseSeoMixin, IsActiveMixin):
    SMALL = 'small'
    FULL = 'full'
    FORMATS = (
        (SMALL, 'Обычная обложка'),
        (FULL, 'Полноразмерная обложка')
    )
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    cover_format = models.CharField('Формат обложки', choices=FORMATS, default=SMALL, max_length=45)
    title = models.CharField('Заголовок', max_length=255)
    descriptor = models.CharField('Подзаголовок', max_length=255)
    codename = models.CharField('URL (кодовое название)', max_length=255, unique=True)
    cover_author = models.CharField('Автор обложки', max_length=255, blank=True)
    content_author = models.CharField('Автор материала', max_length=255, blank=True)
    publication_date = models.DateTimeField('Дата и время публикации', default=timezone.now)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Спецпроект'
        verbose_name_plural = 'Спецпроекты'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('specials-detail', args=[self.codename])


class Person(BaseModel, BaseSeoMixin, IsActiveMixin):
    SMALL = 'small'
    FULL = 'full'
    FORMATS = (
        (SMALL, 'Обычная обложка'),
        (FULL, 'Полноразмерная обложка')
    )
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    cover_format = models.CharField('Формат обложки', choices=FORMATS, default=SMALL, max_length=45)
    title = models.CharField('Заголовок', max_length=255)
    descriptor = models.CharField('Подзаголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    cover_author = models.CharField('Автор обложки', max_length=255, blank=True)
    content_author = models.CharField('Автор материала', max_length=255, blank=True)
    publication_date = models.DateTimeField('Дата и время публикации', default=timezone.now)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')
    show_two_banners = models.BooleanField('Показать 2 баннера', default=False)

    class Meta:
        verbose_name = 'Статья о людях'
        verbose_name_plural = 'Статьи о людях'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('persons-detail', args=[self.id])


class HistoryRubric(BaseModel):
    name = models.CharField('Заголовок', max_length=255)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Рубрика исторических статей'
        verbose_name_plural = 'Рубрики исторических статей'
        ordering = '-id',

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return ''  # reverse('persons-detail', args=[self.id])


class History(BaseModel, BaseSeoMixin, IsActiveMixin):
    SMALL = 'small'
    FULL = 'full'
    FORMATS = (
        (SMALL, 'Обычная обложка'),
        (FULL, 'Полноразмерная обложка')
    )
    rubric = models.ForeignKey('HistoryRubric', on_delete=models.CASCADE, verbose_name='Рубрика')
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    cover_format = models.CharField('Формат обложки', choices=FORMATS, default=SMALL, max_length=45)
    title = models.CharField('Заголовок', max_length=255)
    descriptor = models.CharField('Подзаголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    cover_author = models.CharField('Автор обложки', max_length=255, blank=True)
    content_author = models.CharField('Автор материала', max_length=255, blank=True)
    publication_date = models.DateTimeField('Дата и время публикации', default=timezone.now)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')
    show_two_banners = models.BooleanField('Показать 2 баннера', default=False)

    class Meta:
        verbose_name = 'Историческая статья'
        verbose_name_plural = 'Исторические статьи'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('history-detail', args=[self.id])


class CityGuide(BaseModel, BaseSeoMixin, IsActiveMixin):
    SMALL = 'small'
    FULL = 'full'
    FORMATS = (
        (SMALL, 'Обычная обложка'),
        (FULL, 'Полноразмерная обложка')
    )
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    cover_format = models.CharField('Формат обложки', choices=FORMATS, default=SMALL, max_length=45)
    title = models.CharField('Заголовок', max_length=255)
    descriptor = models.CharField('Подзаголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    cover_author = models.CharField('Автор обложки', max_length=255, blank=True)
    content_author = models.CharField('Автор материала', max_length=255, blank=True)
    publication_date = models.DateTimeField('Дата и время публикации', default=timezone.now)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')
    show_two_banners = models.BooleanField('Показать 2 баннера', default=False)

    class Meta:
        verbose_name = 'Гид по городу'
        verbose_name_plural = 'Гиды по городу'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('city-guides-detail', args=[self.id])


class Place(BaseModel, BaseSeoMixin, IsActiveMixin):
    SMALL = 'small'
    FULL = 'full'
    FORMATS = (
        (SMALL, 'Обычная обложка'),
        (FULL, 'Полноразмерная обложка')
    )
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    cover_format = models.CharField('Формат обложки', choices=FORMATS, default=SMALL, max_length=45)
    title = models.CharField('Заголовок', max_length=255)
    descriptor = models.CharField('Подзаголовок', max_length=255)
    lead = models.CharField('Лид', max_length=255)
    content = JSONField()
    cover_author = models.CharField('Автор обложки', max_length=255, blank=True)
    content_author = models.CharField('Автор материала', max_length=255, blank=True)
    address = models.CharField('Адрес', max_length=255, blank=True)
    coordinates = models.CharField('Координаты', max_length=255, blank=True)
    schedule = models.CharField('Режим работы', max_length=255, blank=True)
    contacts = models.CharField('Контактная информация', max_length=255, blank=True)
    site = models.URLField('Сайт', max_length=255, blank=True)
    instagram = models.URLField('Профиль в Instagram', max_length=255, blank=True)
    publication_date = models.DateTimeField('Дата и время публикации', default=timezone.now)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')
    show_two_banners = models.BooleanField('Показать 2 баннера', default=False)

    class Meta:
        verbose_name = 'Статья о местах'
        verbose_name_plural = 'Статьи о местах'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('places-detail', args=[self.id])

    def get_reviews(self):
        return self.reviews.filter(is_active=True)


class PlaceReview(BaseModel):
    name = models.CharField('ФИО отправителя', max_length=255)
    place = models.ForeignKey(Place, on_delete=models.CASCADE, verbose_name='Место', related_name='reviews')
    email = models.EmailField('E-mail')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    text = models.TextField('Текст отзыва')
    is_agree = models.BooleanField('Согласие с правилами обработки данных', default=False)
    is_active = models.BooleanField('Статус', default=False)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Отзыв о местах'
        verbose_name_plural = 'Отзывы о местах'
        ordering = '-id',

    def __str__(self):
        return 'Отзыв №{} о {}'.format(self.pk, self.place.title)


class Film(BaseModel, BaseSeoMixin, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Название', max_length=255)
    description = models.TextField('Описание фильма')
    release_year = models.PositiveSmallIntegerField('Год выпуска')
    country = models.CharField('Страна', max_length=255)
    genre = models.CharField('Жанр', max_length=255)
    director = models.CharField('Режиссер', max_length=255)
    starring = models.CharField('В главных ролях', max_length=255)
    duration = models.PositiveSmallIntegerField('Продолжительность, мин')
    age_restriction = models.CharField('Возрастное ограничение', max_length=255)
    is_3d = models.BooleanField('3D', default=False)
    trailer = models.URLField('Ссылка на трейлер в YouTube')
    purchase_link = models.URLField('Ссылка на страницу фильма на сайте кинотеатра "Молодость"')
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')
    show_two_banners = models.BooleanField('Показать 2 баннера', default=False)

    class Meta:
        verbose_name = 'Киноанонс'
        verbose_name_plural = 'Киноанонсы'
        ordering = '-id',

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('films-detail', args=[self.id])


class FilmSession(BaseModel):
    film = models.ForeignKey(Film, models.CASCADE, verbose_name='Фильм', related_name='sessions')
    session_time = models.DateTimeField('Дата и время начала сеанса')
    price = models.PositiveSmallIntegerField('Цена')

    class Meta:
        verbose_name = 'Сеанс'
        verbose_name_plural = 'Сеансы'
        ordering = 'session_time',

    def __str__(self):
        return '{} {}'.format(self.film.title, self.session_time)


class SidebarBanner(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE,
                              related_name='verticals_banners', verbose_name='Обложка')
    horizontal_cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE,
                                         related_name='horizontal_banners', verbose_name='Обложка')
    title = models.CharField('Название', max_length=255)
    link = models.CharField('Ссылка', max_length=255)
    start_publication_date = models.DateTimeField('Дата и время начала публикации', null=True)
    end_publication_date = models.DateTimeField('Дата и время окончания публикации', null=True)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Баннер в сайдбаре'
        verbose_name_plural = 'Баннеры в сайдбаре'


class WideBanner(BaseModel, IsActiveMixin):
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    title = models.CharField('Название', max_length=255)
    link = models.CharField('Ссылка', max_length=255)
    start_publication_date = models.DateTimeField('Дата и время начала публикации', null=True)
    end_publication_date = models.DateTimeField('Дата и время окончания публикации', null=True)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Баннер-растяжка'
        verbose_name_plural = 'Баннеры-растяжки'


class Slider(BaseModel, IsActiveMixin):
    FORMAT_3x2 = 'format_3x2'
    FORMAT_2x1 = 'format_2x1'
    FORMATS = (
        (FORMAT_3x2, 'Горизонтальный / 3:2'),
        (FORMAT_2x1, 'Горизонтальный / 2:1')
    )
    title = models.CharField('Название', max_length=255)
    format = models.CharField('Формат слайдера', choices=FORMATS, max_length=45)
    start_publication_date = models.DateTimeField('Дата и время начала публикации', null=True)
    end_publication_date = models.DateTimeField('Дата и время окончания публикации', null=True)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Слайдер'
        verbose_name_plural = 'Слайдеры'
        ordering = '-id',

    def get_slides(self):
        slides = []
        for slide in self.slides.filter(is_active=True).order_by('weight'):
            if slide.is_active:
                slides.append({'id': int(slide.pk),
                               'img': slide.cover.get_thumbnail_url_by_name('slide_%s' % self.format),
                               'description': slide.description,
                               })
        return slides


class SliderItem(models.Model):
    slider = models.ForeignKey(Slider, on_delete=models.CASCADE, verbose_name='Слайдер', related_name='slides')
    cover = models.ForeignKey('mediafiles.MediaFile', on_delete=models.CASCADE, verbose_name='Обложка')
    description = models.CharField('Описание', max_length=255, blank=True)
    is_active = models.BooleanField(default=True, verbose_name='Состояние')
    weight = models.PositiveIntegerField('Вес', default=0)

    class Meta:
        verbose_name = 'Слайд'
        verbose_name_plural = 'Слайды'


class Feedback(models.Model):
    NEWS = 'news'
    EVENT = 'event'
    HISTORY = 'history'
    PERSON = 'person'
    QUESTION = 'question'
    SUBJECTS = (
        (NEWS, 'Поделиться хорошей новостью'),
        (EVENT, 'Поделиться событием'),
        (HISTORY, 'Поделиться своей историей'),
        (PERSON, 'Предложить героя'),
        (QUESTION, 'Задать вопрос')
    )
    subject = models.CharField(choices=SUBJECTS, max_length=255, verbose_name='Тема обращения')
    name = models.CharField('ФИО отправителя', max_length=255)
    email = models.EmailField('E-mail')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    text = models.TextField('Текст обращения')
    attachment = models.FileField('Вложение', upload_to='attachments', max_length=1000, blank=True)
    is_agree = models.BooleanField('Согласие с правилами обработки данных', default=False)
    create_date = models.DateTimeField('Дата создания', auto_now_add=True)

    class Meta:
        verbose_name = 'Обращение в редакцию'
        verbose_name_plural = 'Обращения в редакцию'
        ordering = '-id',

    def __str__(self):
        return 'Обращение с сайта id{}'.format(self.id)


class TextError(models.Model):
    url = models.CharField('URL старницы', max_length=255)
    text = models.TextField('Текст с ошибкой')
    create_date = models.DateTimeField('Дата создания', auto_now_add=True)

    class Meta:
        verbose_name = 'Сообщение об ошибке'
        verbose_name_plural = 'Сообщения об ошибках'
        ordering = '-id',

    def __str__(self):
        return 'Сообщение об ошибке id{}'.format(self.id)

