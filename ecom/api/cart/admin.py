from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('total_price',)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_items', 'total_amount', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email', 'user__name']
    readonly_fields = ['total_items', 'total_amount', 'created_at', 'updated_at']
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'product', 'quantity', 'total_price', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['product__name', 'cart__user__email']
    readonly_fields = ['total_price', 'created_at', 'updated_at']