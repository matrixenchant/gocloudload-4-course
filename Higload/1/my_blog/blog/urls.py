from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
  path('hello', views.helloWorld, name='helloWorld'),
  path('', views.posts_list, name='posts_list'),
  path('<int:id>/', views.post_details, name='post_details'),
  path('create/', views.create_post, name='create_post'),
  path('<int:id>/edit/', views.edit_post, name='edit_post'),
  path('<int:id>/delete/', views.delete_post, name='delete_post'),

  path('register/', views.register, name='register'),
  path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
  path('logout/', auth_views.LogoutView.as_view(template_name='logout.html'), name='logout'),
]