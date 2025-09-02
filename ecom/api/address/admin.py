from django.contrib import admin
from .models import Address


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'address_type', 'city', 'state', 'is_default', 'created_at']
    list_filter = ['address_type', 'is_default', 'country', 'state']
    search_fields = ['full_name', 'user__email', 'city', 'state', 'postal_code']
    list_editable = ['is_default']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'address_type', 'is_default')
        }),
        ('Contact Details', {
            'fields': ('full_name', 'phone_number')
        }),
        ('Address Details', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
