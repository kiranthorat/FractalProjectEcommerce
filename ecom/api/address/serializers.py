from rest_framework import serializers
from .models import Address


class AddressSerializer(serializers.ModelSerializer):
    full_address = serializers.ReadOnlyField()
    
    class Meta:
        model = Address
        fields = [
            'id', 'address_type', 'full_name', 'phone_number',
            'address_line_1', 'address_line_2', 'city', 'state',
            'postal_code', 'country', 'is_default', 'full_address',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, data):
        """Custom validation for address data"""
        # Validate phone number format (basic validation)
        phone = data.get('phone_number', '')
        if phone and not phone.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise serializers.ValidationError({'phone_number': 'Enter a valid phone number'})
        
        # Validate postal code format (basic validation)
        postal_code = data.get('postal_code', '')
        if postal_code and len(postal_code.replace(' ', '')) < 3:
            raise serializers.ValidationError({'postal_code': 'Enter a valid postal code'})
        
        return data
