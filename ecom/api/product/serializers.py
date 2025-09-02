from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    image = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'image', 'image_url', 'category')
    
    def get_image(self, obj):
        if obj.image:
            # Return the full URL path
            return obj.image.url
        return None
    
    def get_image_url(self, obj):
        if obj.image:
            # Return the full URL path
            return obj.image.url
        return None