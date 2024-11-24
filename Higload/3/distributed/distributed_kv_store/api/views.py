from django.http import Http404, JsonResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import KeyValue
from .serializers import KeyValueSerializer

import random

def find_primes(n):
    primes = []
    for num in range(2, n + 1):
        is_prime = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)
    return primes


def heavy_load_view(request):
    primes = find_primes(5)

    key_value_list = [
        KeyValue(key=f'key_{i+20000}', value=f'value_{i}') for i in range(1000000)
    ]
    KeyValue.objects.bulk_create(key_value_list)

    return JsonResponse({'primes': primes})

class StoreCreateView(generics.CreateAPIView):
    queryset = KeyValue.objects.all()
    serializer_class = KeyValueSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StoreRetrieveView(generics.RetrieveAPIView):
    queryset = KeyValue.objects.all()
    serializer_class = KeyValueSerializer

    def get_object(self):
        # Используем key для извлечения объекта
        key = self.kwargs.get("key")
        try:

            if random.choice([True, False]):
                db = 'default'
            else:
                db = 'replica'

            KeyValue.objects.all()
            return KeyValue.objects.get(key=key)
        except KeyValue.DoesNotExist:
            raise Http404("Key not found.")

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class StoreDeleteView(generics.DestroyAPIView):
    queryset = KeyValue.objects.all()
    serializer_class = KeyValueSerializer

    def delete(self, request, *args, **kwargs):
        key = self.kwargs.get("key")
        try:
            instance = KeyValue.objects.get(key=key)
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except KeyValue.DoesNotExist:
            raise Http404("Key not found.")