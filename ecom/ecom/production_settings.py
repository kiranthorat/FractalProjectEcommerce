# import os
# import dj_database_url
# from .settings import *

# # Production settings
# DEBUG = False
# SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-e$sl%^mc79sl^zip=afgb9_2*sfwcei^fhejm%h@+n9=*=sg4o')

# # Allowed hosts for Heroku
# ALLOWED_HOSTS = [
#     'localhost',
#     '127.0.0.1',
# ]

# # Database configuration for Heroku (PostgreSQL)
# DATABASES = {
#     'default': dj_database_url.config(
#         default='sqlite:///db.sqlite3',
#         conn_max_age=600,
#         conn_health_checks=True,
#     )
# }

# # Static files configuration for Heroku
# STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# # Add frontend build directory to static files
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, '../frontend/dist'),
#     os.path.join(BASE_DIR, '../frontend/dist/assets'),
# ]

# # Templates configuration to serve React app
# TEMPLATES[0]['DIRS'] = [
#     os.path.join(BASE_DIR, '../frontend/dist'),
# ]

# # Add WhiteNoise for serving static files
# MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# # WhiteNoise configuration
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# # CORS settings for production
# CORS_ALLOWED_ORIGINS = [
#     "https://localhost:3000",
#     "https://127.0.0.1:3000",
#     # "https://your-app-name.onrender.com",
# ]

# CORS_ALLOW_ALL_ORIGINS = True  

# # Media files configuration
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# # Security settings for production
# SECURE_BROWSER_XSS_FILTER = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
# X_FRAME_OPTIONS = 'DENY'

# # Braintree settings (use environment variables)
# BRAINTREE_MERCHANT_ID = os.environ.get('BRAINTREE_MERCHANT_ID', 'sandbox_merchant_id')
# BRAINTREE_PUBLIC_KEY = os.environ.get('BRAINTREE_PUBLIC_KEY', 'sandbox_public_key')
# BRAINTREE_PRIVATE_KEY = os.environ.get('BRAINTREE_PRIVATE_KEY', 'sandbox_private_key')
# BRAINTREE_ENVIRONMENT = os.environ.get('BRAINTREE_ENVIRONMENT', 'sandbox')

# # Logging configuration
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'console': {
#             'level': 'INFO',
#             'class': 'logging.StreamHandler',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['console'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#     },
# }
