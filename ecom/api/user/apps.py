from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.user'
    label = 'user'  # Add this line to set the app label explicitly
