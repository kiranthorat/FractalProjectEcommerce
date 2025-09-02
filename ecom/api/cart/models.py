from django.db import models
from api.user.models import CustomUser
from api.product.models import Product


class Cart(models.Model):
    """Cart model to store user's cart items"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.email}"

    @property
    def total_items(self):
        return self.items.count()

    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())


class CartItem(models.Model):
    """Cart item model to store individual products in cart"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('cart', 'product')  # Prevent duplicate products in same cart

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def total_price(self):
        return float(self.product.price) * self.quantity