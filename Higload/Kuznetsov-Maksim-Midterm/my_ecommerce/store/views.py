from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer, UserSerializer
from django.contrib.auth.models import User

from django.core.cache import cache
from rest_framework.response import Response

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        products = cache.get('product_list')
        if not products:

            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            products = serializer.data

            cache.set('product_list', products, timeout=60 * 15)
        return Response(products)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
