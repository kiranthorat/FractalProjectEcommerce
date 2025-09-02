from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'api', views.CartViewSet, basename='cart')

urlpatterns = [
    # Custom cart endpoints with session validation
    path('get/<int:id>/<str:token>/', views.get_cart, name='cart.get'),
    path('add/<int:id>/<str:token>/', views.add_to_cart, name='cart.add'),
    path('remove/<int:id>/<str:token>/', views.remove_from_cart, name='cart.remove'),
    path('update/<int:id>/<str:token>/', views.update_cart_item, name='cart.update'),
    path('clear/<int:id>/<str:token>/', views.clear_cart, name='cart.clear'),
    
    # REST API endpoints
    path('', include(router.urls)),
]
