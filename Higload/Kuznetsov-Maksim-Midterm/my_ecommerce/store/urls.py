from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet, UserViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'users', UserViewSet)

urlpatterns = router.urls