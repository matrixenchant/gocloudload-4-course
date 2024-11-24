from django.urls import path
from .views import StoreCreateView, StoreRetrieveView, StoreDeleteView, heavy_load_view

urlpatterns = [
    path('store/', StoreCreateView.as_view(), name='store-create'),
    path('highload', heavy_load_view, name='heavy_load'),
    path('store/<str:key>/', StoreRetrieveView.as_view(), name='store-retrieve'),
    path('store/<str:key>/delete/', StoreDeleteView.as_view(), name='store-delete'),
]
