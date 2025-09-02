from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    delivery_address = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = (
            'id', 'user', 'product_names', 'total_products', 'transaction_id', 
            'total_amount', 'status', 'delivery_name', 'delivery_phone',
            'delivery_address_line_1', 'delivery_address_line_2', 'delivery_city',
            'delivery_state', 'delivery_postal_code', 'delivery_country',
            'delivery_address', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'delivery_address')
