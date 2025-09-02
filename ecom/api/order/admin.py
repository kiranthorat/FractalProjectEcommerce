from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_products', 'total_amount', 'transaction_id', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email', 'transaction_id']
    readonly_fields = ['created_at', 'updated_at']
