from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
import json

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from api.product.models import Product


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
def get_cart(request, id, token):
    """Get user's cart"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})

    try:
        cart = Cart.objects.get(user=user)
        serializer = CartSerializer(cart, context={'request': request})
        return JsonResponse({
            'success': True,
            'cart': serializer.data
        })
    except Cart.DoesNotExist:
        # Create empty cart if doesn't exist
        cart = Cart.objects.create(user=user)
        serializer = CartSerializer(cart, context={'request': request})
        return JsonResponse({
            'success': True,
            'cart': serializer.data
        })


@csrf_exempt
def add_to_cart(request, id, token):
    """Add item to cart"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})

    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'})

    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        if not product_id:
            return JsonResponse({'error': 'Product ID is required'})

        # Get or create cart
        cart, created = Cart.objects.get_or_create(user=user)

        # Get product
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'})

        # Get or create cart item
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            # Item already exists, update quantity
            cart_item.quantity += quantity
            cart_item.save()

        return JsonResponse({
            'success': True,
            'message': 'Item added to cart successfully',
            'cart_item': {
                'id': cart_item.id,
                'product_name': product.name,
                'quantity': cart_item.quantity,
                'total_price': cart_item.total_price
            }
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': f'Failed to add item to cart: {str(e)}'})


@csrf_exempt
def remove_from_cart(request, id, token):
    """Remove item from cart"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})

    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'})

    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')

        if not product_id:
            return JsonResponse({'error': 'Product ID is required'})

        try:
            cart = Cart.objects.get(user=user)
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.delete()

            return JsonResponse({
                'success': True,
                'message': 'Item removed from cart successfully'
            })

        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return JsonResponse({'error': 'Item not found in cart'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': f'Failed to remove item from cart: {str(e)}'})


@csrf_exempt
def update_cart_item(request, id, token):
    """Update cart item quantity"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})

    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'})

    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        if not product_id:
            return JsonResponse({'error': 'Product ID is required'})

        if quantity <= 0:
            return JsonResponse({'error': 'Quantity must be greater than 0'})

        try:
            cart = Cart.objects.get(user=user)
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.quantity = quantity
            cart_item.save()

            return JsonResponse({
                'success': True,
                'message': 'Cart item updated successfully',
                'cart_item': {
                    'id': cart_item.id,
                    'product_name': cart_item.product.name,
                    'quantity': cart_item.quantity,
                    'total_price': cart_item.total_price
                }
            })

        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return JsonResponse({'error': 'Item not found in cart'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': f'Failed to update cart item: {str(e)}'})


@csrf_exempt
def clear_cart(request, id, token):
    """Clear all items from cart"""
    is_valid, user = validate_user_session(id, token)
    if not is_valid:
        return JsonResponse({'error': 'Invalid session, Please login again.'})

    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'})

    try:
        cart = Cart.objects.get(user=user)
        cart.items.all().delete()

        return JsonResponse({
            'success': True,
            'message': 'Cart cleared successfully'
        })

    except Cart.DoesNotExist:
        return JsonResponse({
            'success': True,
            'message': 'Cart is already empty'
        })
    except Exception as e:
        return JsonResponse({'error': f'Failed to clear cart: {str(e)}'})


class CartViewSet(viewsets.ModelViewSet):
    """Cart ViewSet for REST API"""
    serializer_class = CartSerializer

    def get_queryset(self):
        # Only return current user's cart
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        return Cart.objects.none()