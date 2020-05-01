import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

AUTH_USER_MODEL = 'accounts.User'

SECRET_KEY = 'mv*#bsq_%91s(*zxmbg8n5_+ua4a_=!9621p0ocomd_r392&-d'

DEBUG = False

ROOT_LINK = 'https://proamursk.ru'

ALLOWED_HOSTS = ['*']

INTERNAL_IPS = [
    '127.0.0.1',
    'localhost'
]

ADMINS = (
    ('admin', 'debug@perfectura.ru'),
)

MANAGERS = (
    ('admin', 'debug@perfectura.ru'),
)

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
    'django.contrib.sitemaps',
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
    # 'debug_toolbar',
    'pytils',
]

if not DEBUG:
    INSTALLED_APPS = INSTALLED_APPS + ['raven.contrib.django.raven_compat', ]

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
    'applications.tools.middleware.SetCsrfTokenCookieMiddleware',
    # 'debug_toolbar.middleware.DebugToolbarMiddleware',
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
                'applications.contentblocks.context_processors.content_blocks',
                'applications.root.context_processors.project_settings',
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

FILE_UPLOAD_PERMISSIONS = 0o644

STATIC_URL = '/static/'
MEDIA_URL = '/uploads/'

STATIC_VERSION = 194

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
    ),
    'ORDERING_PARAM': 'order_by',
}

if DEBUG:
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] + (
        'rest_framework.renderers.BrowsableAPIRenderer',)

MEDIALIB_THUMB_SIZE = {
    # Админка
    'sap_min': (140, 140),
    'sap_medium': (350, 350),
    'sap_large': (1400, 1400),
    'sap_min_crop': (140, 140, 'crop'),
    'sap_medium_crop': (350, 350, 'crop'),

    'specials_index': (3840, 1040),
    'specials_feed': (2600, 1040, 'crop'),

    # Киноанонсы
    'film_detail': (480, 720),
    'films_list': (440, 660),
    'film_banner': (460, 690),

    # Слайдеры и баннеры
    'wide_banner': (2600, 320),
    'sidebar_banner': (760, 920),
    'horizontal_sidebar_banner': (760, 480),
    'slide_format_3x2': (1720, 1144),
    'slide_format_2x1': (1720, 860),

    'og_image_default': (1200, 630, 'crop'),
    'og_image_crop600': (600, 600, 'crop'),
    'og_image_crop1230': (1230, 1230, 'crop'),

    'poste_ditor_direct_photo': (220, 220, 'crop'),

    'news_grid_cover': (620, 414, 'crop'),
    'news_aside_cover': (220, 160, 'crop'),
    'news_cover': (1720, 1000),

    'email_ws': (1280, 560, 'crop'),
    'email_wf': (1280, 920, 'crop'),
    'email_hs': (620, 560, 'crop'),
    'email_hf': (620, 920, 'crop'),

    'pub_cover': (1720, 1000),

    '8_column_img': (1720, 1000,),
    '6_column_img_small': (1280, 560, 'crop'),
    '6_column_img_full': (1280, 960, 'crop'),
    '3_column_img_small': (620, 560, 'crop'),
    '3_column_img_full': (620, 920, 'crop'),
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
    'ajax-upload-file': {
        'min': {'count': 15, 'minutes': 5, 'check_url': False},
        'max': {'count': 45, 'minutes': 60, 'check_url': False},
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
EMAIL_HOST_USER = 'no-reply@proamursk.ru'
EMAIL_HOST_PASSWORD = 'Bq1ty3h7'
EMAIL_USE_SSL = True
DEFAULT_FROM_EMAIL = 'проАмурск <no-reply@proamursk.ru>'
SERVER_EMAIL = 'no-reply@proamursk.ru'
EMAIL_SUBJECT_PREFIX = ''


YA_WEATHER_API_KYE = '28704a8b-6266-4abf-9929-046f8b598b46'
YA_WEATHER_LAT = '50.226797'
YA_WEATHER_LON = '136.910607'

if not DEBUG:
    import raven

    RAVEN_CONFIG = {
        'dsn': 'http://f4846ecf706b4bf0b00f8630e68b0d90:6f5e6839552a411ea5efac537b96cb7d@92.63.98.63:9000/11',
        # If you are using git, you can also automatically configure the
        # release based on the git info.
        # 'release': raven.fetch_git_sha(os.path.dirname(__file__)),
    }

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': True,
        'root': {
            'level': 'WARNING',
            'handlers': ['sentry'],
        },
        'formatters': {
            'verbose': {
                'format': '%(levelname)s %(asctime)s %(module)s '
                          '%(process)d %(thread)d %(message)s'
            },
        },
        'handlers': {
            'null': {
                'level': 'DEBUG',
                'class': 'logging.NullHandler',
            },
            'sentry': {
                'level': 'DEBUG',
                'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
                'tags': {'custom-tag': 'x'},
            },
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
                'formatter': 'verbose'
            }
        },
        'loggers': {
            'django.security.DisallowedHost': {
                'handlers': ['null'],
                'level': 'ERROR',
                'propagate': False,
            },
            'django.db.backends': {
                'level': 'ERROR',
                'handlers': ['console'],
                'propagate': False,
            },
            'raven': {
                'level': 'DEBUG',
                'handlers': ['console'],
                'propagate': False,
            },
            'sentry.errors': {
                'level': 'DEBUG',
                'handlers': ['console'],
                'propagate': False,
            },
        },
    }
