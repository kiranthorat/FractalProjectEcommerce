from django.db import models
from api.user.models import CustomUser
from api.product.models import Product


class Order(models.Model):
    ORDER_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    product_names = models.CharField(max_length=500)
    total_products = models.CharField(max_length=500, default=0)
    transaction_id = models.CharField(max_length=150, default=0)
    total_amount = models.CharField(max_length=50, default=0)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    
    # Delivery Address Fields
    delivery_name = models.CharField(max_length=100, blank=True, null=True)
    delivery_phone = models.CharField(max_length=20, blank=True, null=True)
    delivery_address_line_1 = models.CharField(max_length=255, blank=True, null=True)
    delivery_address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    delivery_city = models.CharField(max_length=100, blank=True, null=True)
    delivery_state = models.CharField(max_length=100, blank=True, null=True)
    delivery_postal_code = models.CharField(max_length=20, blank=True, null=True)
    delivery_country = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.user.email if self.user else 'Anonymous'}"
    
    @property
    def delivery_address(self):
        """Return formatted delivery address"""
        if not self.delivery_address_line_1:
            return "No delivery address provided"
        
        address_parts = [
            self.delivery_address_line_1,
            self.delivery_address_line_2,
            self.delivery_city,
            self.delivery_state,
            self.delivery_postal_code,
            self.delivery_country
        ]
        return ', '.join([part for part in address_parts if part])
