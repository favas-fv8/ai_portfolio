"""
Website API URL configuration.

Uses a DRF router to auto-generate CRUD endpoints.
Only one endpoint is needed (singleton model).
"""

from rest_framework.routers import DefaultRouter

from .views import WebsiteViewSet

app_name = "website"

router = DefaultRouter()
router.register("", WebsiteViewSet, basename="website")

urlpatterns = router.urls
