from rest_framework import generics
from .models import KeyValue
from .serializers import KeyValueSerializer

class StoreCreateView(generics.CreateAPIView):
    queryset = KeyValue.objects.all()
    serializer_class = KeyValueSerializer

class StoreRetrieveView(generics.RetrieveAPIView):
    queryset = KeyValue.objects.all()
    serializer_class = KeyValueSerializer
