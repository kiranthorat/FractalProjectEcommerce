from django.db import models
from api.user.models import CustomUser


class Address(models.Model):
    ADDRESS_TYPES = (
        ('home', 'Home'),
        ('work', 'Work'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPES, default='home')
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='India')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_default', '-created_at']
        unique_together = [['user', 'is_default']]  # Only one default address per user
    
    def __str__(self):
        return f"{self.full_name} - {self.address_type} ({self.city})"
    
    def save(self, *args, **kwargs):
        # Ensure only one default address per user
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)
    
    @property
    def full_address(self):
        """Return formatted full address"""
        address_parts = [
            self.address_line_1,
            self.address_line_2,
            self.city,
            self.state,
            self.postal_code,
            self.country
        ]
        return ', '.join([part for part in address_parts if part])
