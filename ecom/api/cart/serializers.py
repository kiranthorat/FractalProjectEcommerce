from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_image = serializers.SerializerMethodField()
    product_description = serializers.CharField(source='product.description', read_only=True)
    total_price = serializers.ReadOnlyField()
    
    def get_product_image(self, obj):
        if obj.product.image:
            # Return absolute URL to match Product API format
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            # Fallback to relative URL if no request context
            return obj.product.image.url
        return None

    class Meta:
        model = CartItem
        fields = ('id', 'product_id', 'product_name', 'product_description', 'product_price', 'product_image', 'quantity', 'total_price', 'created_at', 'updated_at')
        read_only_fields = ('id', 'product_id', 'product_name', 'product_description', 'product_price', 'product_image', 'total_price', 'created_at', 'updated_at')


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'total_items', 'total_amount', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
