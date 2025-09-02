from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets

from .models import Order
from .serializers import OrderSerializer


def validate_user_session(id, token):
    UserModel = get_user_model()
    
    try:
        user = UserModel.objects.get(pk=id)
        # Fixed: was 'session_toke' should be 'session_token'
        if user.session_token == token:
            return True
        return False
    except UserModel.DoesNotExist:
        return False


@csrf_exempt
def add(request, id, token):
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Please re-login', 'code': '1'})
    
    # Fixed: was 'Post' should be 'POST'
    if request.method == 'POST':
        user_id = id
        # Fixed: was 'transcation_id' should be 'transaction_id'
        transaction_id = request.POST.get('transaction_id', '')
        amount = request.POST.get('amount', '0')
        products = request.POST.get('products', '')
        
        # Get delivery address fields
        delivery_name = request.POST.get('delivery_name', '')
        delivery_phone = request.POST.get('delivery_phone', '')
        delivery_address_line_1 = request.POST.get('delivery_address_line_1', '')
        delivery_address_line_2 = request.POST.get('delivery_address_line_2', '')
        delivery_city = request.POST.get('delivery_city', '')
        delivery_state = request.POST.get('delivery_state', '')
        delivery_postal_code = request.POST.get('delivery_postal_code', '')
        delivery_country = request.POST.get('delivery_country', '')
        
        # Debug logging
        print(f"Order creation debug:")
        print(f"  user_id: {user_id}")
        print(f"  transaction_id: '{transaction_id}'")
        print(f"  amount: '{amount}'")
        print(f"  products: '{products}'")
        print(f"  delivery_name: '{delivery_name}'")
        
        # Fix total_products calculation
        if products and products.strip():
            # Split by comma and filter out empty strings
            product_list = [p.strip() for p in products.split(',') if p.strip()]
            total_products = len(product_list)
        else:
            total_products = 0
            
        print(f"  calculated total_products: {total_products}")
        
        UserModel = get_user_model()
        
        try:
            user = UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'})
        
        order = Order(
            user=user, 
            product_names=products,
            total_products=total_products, 
            transaction_id=transaction_id, 
            total_amount=amount,
            delivery_name=delivery_name,
            delivery_phone=delivery_phone,
            delivery_address_line_1=delivery_address_line_1,
            delivery_address_line_2=delivery_address_line_2,
            delivery_city=delivery_city,
            delivery_state=delivery_state,
            delivery_postal_code=delivery_postal_code,
            delivery_country=delivery_country
        )
        order.save()
        
        return JsonResponse({
            'success': True, 
            'error': False, 
            'msg': 'Order placed Successfully'
        })


class OrderViewSet(viewsets.ModelViewSet):
    # Fixed: Order model doesn't have 'name' field, using 'id' instead
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
