import json
import random
import re

from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse    
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import CustomUser
from .serializers import UserSerializer


def generate_session_token(length=10):
    return ''.join(random.SystemRandom().choice(
        [chr(i) for i in range(97, 123)] + [str(i) for i in range(10)]
    ) for _ in range(length))


@csrf_exempt
def signin(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Send a POST request with valid parameters only'})

    email = request.POST.get('email')
    password = request.POST.get('password')

    # Fixed: Use 'email' instead of 'username'
    if not re.match(r"^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$", str(email)):
        return JsonResponse({'error': 'Enter a valid email'})

    if not password or len(password) < 3:
        return JsonResponse({'error': 'Password needs to be at least 3 chars'})

    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(email=email)
        if user.check_password(password):
            user_dict = UserModel.objects.filter(email=email).values().first()
            user_dict.pop('password', None)

            if user.session_token != "0":
                user.session_token = "0"
                user.save()
                return JsonResponse({'error': 'Previous session exists'})

            token = generate_session_token()
            user.session_token = token
            user.save()
            login(request, user)
            return JsonResponse({'token': token, 'user': user_dict})
        else:
            return JsonResponse({'error': 'Invalid password'})
    except UserModel.DoesNotExist:
        return JsonResponse({'error': 'Invalid Email'})


def signout(request, id):
    logout(request)
    
    UserModel = get_user_model()
    
    try:
        user = UserModel.objects.get(pk=id)
        user.session_token = "0"  
        user.save()
    except UserModel.DoesNotExist:
        return JsonResponse({'error': 'Invalid user ID'})
    
    return JsonResponse({'success': 'Logout success'})


def validate_user_session(id, token):
    UserModel = get_user_model()
    try:
        user = UserModel.objects.get(pk=id)
        if user.session_token == token:
            return True, user
        return False, None
    except UserModel.DoesNotExist:
        return False, None


@csrf_exempt
def update_profile(request, id, token):
    """Update user profile with session validation"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})
    
    if request.method != 'PUT':
        return JsonResponse({'error': 'Send a PUT request only'})
    
    try:
        # Parse JSON data
        data = json.loads(request.body)
        
        # Update user fields
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            # Validate email format
            if not re.match(r"^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$", str(data['email'])):
                return JsonResponse({'error': 'Enter a valid email'})
            user.email = data['email']
        if 'phone' in data:
            user.phone = data['phone']
        if 'gender' in data:
            user.gender = data['gender']
        
        user.save()
        
        # Return updated user data (excluding sensitive fields)
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'gender': user.gender,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'updated_at': user.updated_at.isoformat() if user.updated_at else None,
        }
        
        return JsonResponse({
            'success': True,
            'user': user_data,
            'message': 'Profile updated successfully'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': str(e)})


class UserViewSet(viewsets.ModelViewSet):
    permission_classes_by_action = {'create': [AllowAny]}
    
    queryset = CustomUser.objects.all().order_by('id')
    serializer_class = UserSerializer
    
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]