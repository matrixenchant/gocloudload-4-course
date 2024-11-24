from django.http import Http404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import KeyValue
from .serializers import KeyValueSerializer

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