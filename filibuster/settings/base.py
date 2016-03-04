#usr/bin/python
# -*- coding:utf-8 -*-

import os
import sys
from ConfigParser import ConfigParser
from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PROJECT_NAME = os.path.basename(PROJECT_DIR)
ROOT_DIR = os.path.dirname(PROJECT_DIR)
APPS_DIR = os.path.join(PROJECT_DIR, 'apps')

sys.path.insert(0, ROOT_DIR)
sys.path.insert(0, PROJECT_DIR)
sys.path.insert(0, APPS_DIR)

# Get sensitive configuration
config = ConfigParser()
config.read(ROOT_DIR + '/conf/sensitive/configuration.ini')

# Send bug reports on production mode
ADMINS = (
    ('Developer', config.get('gmail:developer', 'email_address')),
)

# Internationalization
LANGUAGE_CODE = 'ko'
ugettext = lambda s: s
LANGUAGES = (
    ('ko', 'Korean'),
    ('en', 'English'),
)
LOCALE_PATHS = (
    ROOT_DIR + '/locale/',
)
USE_I18N = True
USE_L10N = True
TIME_ZONE = 'UTC'
USE_TZ = True
DEFAULT_CHARSET = 'utf-8'

def ABS_PATH(*args):
    return os.path.join(PROJECT_DIR, *args)

# Static files
STATIC_ROOT = ABS_PATH('..', 'static')
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    ABS_PATH('static'),
)
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# Template files
TEMPLATE_DIRS = (
    ABS_PATH('templates'),
)
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

# Application configuration
ROOT_URLCONF = PROJECT_NAME + '.urls'
WSGI_APPLICATION = PROJECT_NAME + '.wsgi.application'
SECRET_KEY = config.get('django', 'secret_key')

# Defualt applications
INSTALLED_APPS = (
    # Suit is custom admin interface
    # Suit should come before 'django.contrib.admin'
    'suit',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

# Django-suit settings
TEMPLATE_CONTEXT_PROCESSORS = TEMPLATE_CONTEXT_PROCESSORS + (
    'django.core.context_processors.request',
    'django.core.context_processors.i18n',
)

# Custom applications
INSTALLED_APPS += (
    'main',
    'extra',
)   

# Middlewares
MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    # LocaleMiddleware should come after SessionMiddleware & CacheMiddleware
    # LocaleMiddleware should come before CommonMiddleware
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line to deactivate clickjacking protection
    # It would not allow to show site via iframe tag
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

# 3rd-party applications
INSTALLED_APPS += (
    'captcha',
    'compressor',
    'debug_toolbar',
    'django_extensions',
)

# 3rd-party middlewares
MIDDLEWARE_CLASSES += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

# User class settings
AUTH_USER_MODEL = 'main.User'   # Extend default user class

# Compressor settings
COMPRESS_URL = STATIC_URL
COMPRESS_ROOT = STATIC_ROOT
COMPRESS_OUTPUT_DIR = 'CACHE'
STATICFILES_FINDERS += (
    'compressor.finders.CompressorFinder',
)

# Time-to-live for cache
CACHE_TTL = 60 * 60 * 24 * 7    # 7 days

# CDN URL
CDN_URL = config.get('aws', 'cloudfront_url')

# Custom variables
MAX_COMMENTS_PER_QUERYSET = 10
