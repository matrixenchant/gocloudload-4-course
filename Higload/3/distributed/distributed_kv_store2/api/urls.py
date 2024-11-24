from django.urls import path
from .views import StoreCreateView, StoreRetrieveView, StoreDeleteView

urlpatterns = [
    path('store/', StoreCreateView.as_view(), name='store-create'),
    path('store/<str:key>/', StoreRetrieveView.as_view(), name='store-retrieve'),
    path('store/<str:key>/delete/', StoreDeleteView.as_view(), name='store-delete'),
]
