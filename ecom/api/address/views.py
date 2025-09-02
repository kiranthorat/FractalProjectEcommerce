import json
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Address
from .serializers import AddressSerializer


def validate_user_session(id, token):
    """Validate user session"""
    UserModel = get_user_model()
    try:
        user = UserModel.objects.get(pk=id)
        if user.session_token == token:
            return True, user
        return False, None
    except UserModel.DoesNotExist:
        return False, None


@csrf_exempt
def get_addresses(request, id, token):
    """Get all addresses for a user"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})
    
    try:
        addresses = Address.objects.filter(user=user)
        serializer = AddressSerializer(addresses, many=True)
        return JsonResponse({
            'success': True,
            'addresses': serializer.data
        })
    except Exception as e:
        return JsonResponse({'error': str(e)})


@csrf_exempt
def add_address(request, id, token):
    """Add a new address"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})
    
    if request.method != 'POST':
        return JsonResponse({'error': 'Send a POST request only'})
    
    try:
        data = json.loads(request.body)
        data['user'] = user.id
        
        serializer = AddressSerializer(data=data)
        if serializer.is_valid():
            address = serializer.save(user=user)
            return JsonResponse({
                'success': True,
                'address': AddressSerializer(address).data,
                'message': 'Address added successfully'
            })
        else:
            return JsonResponse({
                'error': 'Validation failed',
                'errors': serializer.errors
            })
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': str(e)})


@csrf_exempt
def update_address(request, id, token, address_id):
    """Update an existing address"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})
    
    if request.method != 'PUT':
        return JsonResponse({'error': 'Send a PUT request only'})
    
    try:
        address = Address.objects.get(id=address_id, user=user)
        data = json.loads(request.body)
        
        serializer = AddressSerializer(address, data=data, partial=True)
        if serializer.is_valid():
            updated_address = serializer.save()
            return JsonResponse({
                'success': True,
                'address': AddressSerializer(updated_address).data,
                'message': 'Address updated successfully'
            })
        else:
            return JsonResponse({
                'error': 'Validation failed',
                'errors': serializer.errors
            })
    except Address.DoesNotExist:
        return JsonResponse({'error': 'Address not found'})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': str(e)})


@csrf_exempt
def delete_address(request, id, token, address_id):
    """Delete an address"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})
    
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Send a DELETE request only'})
    
    try:
        address = Address.objects.get(id=address_id, user=user)
        address.delete()
        return JsonResponse({
            'success': True,
            'message': 'Address deleted successfully'
        })
    except Address.DoesNotExist:
        return JsonResponse({'error': 'Address not found'})
    except Exception as e:
        return JsonResponse({'error': str(e)})


@csrf_exempt
def set_default_address(request, id, token, address_id):
    """Set an address as default"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})
    
    if request.method != 'POST':
        return JsonResponse({'error': 'Send a POST request only'})
    
    try:
        # Remove default from all other addresses
        Address.objects.filter(user=user, is_default=True).update(is_default=False)
        
        # Set this address as default
        address = Address.objects.get(id=address_id, user=user)
        address.is_default = True
        address.save()
        
        return JsonResponse({
            'success': True,
            'address': AddressSerializer(address).data,
            'message': 'Default address updated successfully'
        })
    except Address.DoesNotExist:
        return JsonResponse({'error': 'Address not found'})
    except Exception as e:
        return JsonResponse({'error': str(e)})


class AddressViewSet(viewsets.ModelViewSet):
    """ViewSet for Address CRUD operations (if needed for admin)"""
    queryset = Address.objects.all().order_by('-is_default', '-created_at')
    serializer_class = AddressSerializer
