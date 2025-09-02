from rest_framework import routers
from django.urls import path, include

from . import views

router = routers.DefaultRouter()
router.register(r'', views.AddressViewSet)

urlpatterns = [
    path('get/<int:id>/<str:token>/', views.get_addresses, name='get_addresses'),
    path('add/<int:id>/<str:token>/', views.add_address, name='add_address'),
    path('update/<int:id>/<str:token>/<int:address_id>/', views.update_address, name='update_address'),
    path('delete/<int:id>/<str:token>/<int:address_id>/', views.delete_address, name='delete_address'),
    path('set-default/<int:id>/<str:token>/<int:address_id>/', views.set_default_address, name='set_default_address'),
    path('admin/', include(router.urls))
]
