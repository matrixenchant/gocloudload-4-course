from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
  path('', views.get_all, name='get_all'),
  path('<int:post_id>/', views.post_detail, name='post_detail'),

  path('<int:post_id>/reset', views.cache_reset, name='cache_reset'),
]