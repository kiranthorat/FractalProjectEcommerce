import braintree
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Configure Braintree Gateway
gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        environment=braintree.Environment.Sandbox,  # Use braintree.Environment.Production for live
        merchant_id=getattr(settings, 'BRAINTREE_MERCHANT_ID', 'sandbox_merchant_id'),
        public_key=getattr(settings, 'BRAINTREE_PUBLIC_KEY', 'sandbox_public_key'),
        private_key=getattr(settings, 'BRAINTREE_PRIVATE_KEY', 'sandbox_private_key')
    )
)

def validate_user_session(id, token):
    UserModel = get_user_model()
    try:
        user = UserModel.objects.get(pk=id)
        if user.session_token == token:
            return True
        return False
    except UserModel.DoesNotExist:
        return False

@csrf_exempt
def generate_token(request, id, token):
    """Generate client token for Braintree"""
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Invalid session, Please login again.'})

    try:
        client_token = gateway.client_token.generate()
        return JsonResponse({
            'clientToken': client_token, 
            'success': True
        })
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to generate client token',
            'success': False
        })

@csrf_exempt
def process_payment(request, id, token):
    """Process payment with Braintree"""
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Invalid session, Please login again.'})

    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'})

    try:
        # Get data from request
        data = json.loads(request.body)
        nonce_from_the_client = data.get('paymentMethodNonce')
        amount_from_the_client = data.get('amount')

        if not nonce_from_the_client or not amount_from_the_client:
            return JsonResponse({
                'error': 'Missing payment method nonce or amount',
                'success': False
            })

        # Process the transaction
        result = gateway.transaction.sale({
            "amount": str(amount_from_the_client),
            "payment_method_nonce": nonce_from_the_client,
            "options": {
                "submit_for_settlement": True
            }
        })

        if result.is_success:
            return JsonResponse({
                "success": True,
                "transaction": {
                    'id': result.transaction.id, 
                    'amount': result.transaction.amount,
                    'status': result.transaction.status
                }
            })
        else:
            # Handle errors
            error_string = ""
            for error in result.errors.deep_errors:
                error_string += error.message + " "
            
            return JsonResponse({
                'error': error_string or 'Transaction failed',
                'success': False
            })

    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data',
            'success': False
        })
    except Exception as e:
        return JsonResponse({
            'error': f'Payment processing failed: {str(e)}',
            'success': False
        })

# Alternative simple payment processing (without Braintree for testing)
@csrf_exempt
def process_simple_payment(request, id, token):
    """Simple payment processing for testing without Braintree setup"""
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Invalid session, Please login again.'})

    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'})

    try:
        data = json.loads(request.body)
        amount = data.get('amount')
        
        if not amount:
            return JsonResponse({
                'error': 'Amount is required',
                'success': False
            })

        # Simulate successful payment
        import time
        import random
        transaction_id = f"TXN_{int(time.time())}_{random.randint(1000, 9999)}"
        
        return JsonResponse({
            "success": True,
            "transaction": {
                'id': transaction_id,
                'amount': amount,
                'status': 'settled'
            }
        })

    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data',
            'success': False
        })
    except Exception as e:
        return JsonResponse({
            'error': f'Payment processing failed: {str(e)}',
            'success': False
        })