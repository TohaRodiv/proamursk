import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

AUTH_USER_MODEL = 'accounts.User'

SECRET_KEY = 'mv*#bsq_%91s(*zxmbg8n5_+ua4a_=!9621p0ocomd_r392&-d'

DEBUG = True

ALLOWED_HOSTS = ['*']

INTERNAL_IPS = [
    '127.0.0.1',
    'localhost'
]

# Application definition

INSTALLED_APPS = [
    'cp_vue',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.postgres',
    'rest_framework',
    'django_filters',
    'corsheaders',
    'applications.mediafiles',
    'applications.accounts',
    'core',
    'applications.root',
    'applications.contentblocks',
    'applications.sitesettings',
    'applications.notifications',
    'applications.banrequest',
    'applications.mailing',
    'applications.files',
    'applications.tools',
    'debug_toolbar',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'applications.sitesettings.middleware.AddSettingsInRequest',
    'applications.sitesettings.middleware.CheckDisableSite',
    'applications.banrequest.middleware.BanRequestMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'applications.contentblocks.context_processors.content_blocks'
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'

if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'proamursk_local',
            'USER': 'postgres',
            'PASSWORD': '',
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }

else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'proamursk_prod',
            'USER': 'superadmin',
            'PASSWORD': 'air3N97r',
            'HOST': 'postgres',
            'PORT': '5432',
        },
    }


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'Asia/Vladivostok'

USE_I18N = True

USE_L10N = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = '/uploads/'

STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'),)

if DEBUG:
    MEDIA_ROOT = os.path.join(BASE_DIR, 'uploads')
else:
    MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'uploads')
    STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'static')


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        # 'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'cp_vue.api.pagination.APILimitOffsetPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        # 'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'ORDERING_PARAM': 'order_by',
}

MEDIALIB_THUMB_SIZE = {
    # Админка
    'sap_min': (140, 140),
    'sap_medium': (350, 350),
    'sap_large': (1410, 1410),
    'sap_min_crop': (140, 140, 'crop'),
    'sap_medium_crop': (350, 350, 'crop'),

    # Публикации
    'pub_main': (1716, 858),  # 8 колонок, 2:1
    'pub_6cols': (1276, 638),  # 6 колонок, 2:1
    'pub_3cols_fullsize': (616, 920, 'crop'),  # 3 колонки, полноразмерная обложка
    'pub_3cols_full': (616, 638, 'crop'),  # 3 колонки, увеличенная
    'pub_3cols_small': (616, 410, 'crop'),  # 3 колонки, 3:2, стандартная
    'pub_4cols_full': (836, 920, 'crop'),  # 4 колонки, увеличенная
    'pub_4cols_small': (836, 638, 'crop'),  # 4 колонки, стандартная

    'presearch': (240, 160, 'crop'),  # в пресерче (результатах мгновенного поиска), 3:2
    'news_sidebar': (176, 176, 'crop'),  # в ленте последних новостей в сайдбаре
    'city_guides_sidebar': (748, 340, 'crop'),  # гиды по городу в сайдбаре
    'specials': (3840, 1400),  # на собственных страницах спецпроектов
    'specials_list': (2596, 800, 'crop'),  # в слайдере спецпроектов на Главной странице и в ленте всех спецпроектов

    # Киноанонсы
    'film_detail': (616, 870),  # на собственных страницах киноанонсов
    'films_list': (396, 560),  # внутри ленты с афишей кинотеатра
    'film_banner': (420, 594),  # в блоке про кинотеатр на Главной странице

    # Слайдеры и баннеры
    'wide_banner': (2596, 300),  # баннеры-растяжки
    'sidebar_banner': (748, 858),  # баннеры в сайдбаре
    'slide_format_3x2': (1716, 1144),  # слайдер горизонтальный / 3:2 — 1716x1144 px
    'slide_format_2x1': (1716, 858),  # слайдер горизонтальный / 2:1 — 1716x858 px

    'og_image_default': (1200, 630, 'crop'),
    'og_image_crop600': (600, 600, 'crop'),
    'og_image_crop1230': (1230, 1230, 'crop'),

    # E-mail рассылки
    'mailing_article': (1000, 500),  # Все публикации, кроме спецпроектов и киноанонсов
    'mailing_special': (1000, 1000, 'crop'),  # Спецпроекты
}

POST_EDITOR = dict(
    default=dict(
        column=90,
        gutter=20
    ),
)

MEDIALIB_JPEG_QUALITY = 70
MEDIALIB_EXT = ('jpg', 'jpeg', 'png', 'gif')

CELERY_IMPORTS = (
    'applications.notifications'
)

CELERY_SEND_TASK_ERROR_EMAILS = True
if DEBUG:
    CELERY_BROKER_URL = 'amqp://guest:guest@127.0.0.1:5672//'
else:
    CELERY_BROKER_URL = 'amqp://superadmin:air3N97r@rabbitmq:5672//'

COMMON_ERROR_MESSAGE = 'Ошибка сервера, попробуйте повторить попытку позже'
COMMON_FORM_ERROR_MESSAGE = 'Одно или несколько полей формы содержат ошибки'
API_ERROR_MESSAGE = 'Ошибка в процессе выполнения запроса к API'

BAN_REQUEST = {
    'feedback': {
        'min': {'count': 5, 'minutes': 5, 'check_url': False},
        'max': {'count': 30, 'minutes': 60, 'check_url': False},
        'ban_minutes': 300
    },
    'place-review': {
        'min': {'count': 5, 'minutes': 5, 'check_url': False},
        'max': {'count': 30, 'minutes': 60, 'check_url': False},
        'ban_minutes': 300
    },
    'api-password-recovery': {
        'min': {'count': 5, 'minutes': 5, 'check_url': False},
        'max': {'count': 30, 'minutes': 60, 'check_url': False},
        'ban_minutes': 300
    },

}

BAN_MESSAGE = 'Превышен лимит запросов, попробуйте повторить попытку позже'


CORS_ORIGIN_WHITELIST = (
        'localhost:8080',
        '127.0.0.1:8080'
    )

if DEBUG:
    CORS_ORIGIN_ALLOW_ALL = True
    CORS_ALLOW_CREDENTIALS = True


EMAIL_HOST = 'smtp.yandex.ru'
EMAIL_PORT = 465
EMAIL_HOST_USER = 'no-reply@perfectura.ru'
EMAIL_HOST_PASSWORD = 'Bq1ty3h7'
EMAIL_USE_SSL = True
DEFAULT_FROM_EMAIL = 'Photostog <no-reply@perfectura.ru>'
SERVER_EMAIL = 'no-reply@perfectura.ru'
EMAIL_SUBJECT_PREFIX = ''

