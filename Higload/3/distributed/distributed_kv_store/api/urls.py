from django.urls import path
from .views import StoreCreateView, StoreRetrieveView

urlpatterns = [
    path('store/', StoreCreateView.as_view(), name='store-create'),
    path('store/<str:pk>/', StoreRetrieveView.as_view(), name='store-retrieve'),
]
