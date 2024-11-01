from rest_framework import serializers
from .models import Product, Order, Category
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'category', 'stock']

    def create(self, validated_data):

        category_data = validated_data.pop('category')
        category, = Category.objects.get_or_create(**category_data)
        product = Product.objects.create(category=category, **validated_data)

        return product

    def update(self, instance, validated_data):

        category_data = validated_data.pop('category', None)
        if category_data:
            category, = Category.objects.get_or_create(**category_data)
            instance.category = category

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.stock = validated_data.get('stock', instance.stock)
        instance.save()

        return instance

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = Order
        fields = ['id', 'user', 'product', 'quantity', 'total_price', 'shipping_address', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):

        product = validated_data.pop('product')
        validated_data['total_price'] = product.price * validated_data['quantity']
        order = Order.objects.create(product=product, **validated_data)
        return order


    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.shipping_address = validated_data.get('shipping_address', instance.shipping_address)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
