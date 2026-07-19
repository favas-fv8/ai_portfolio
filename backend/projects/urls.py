"""
Projects API URL configuration.

Uses a DRF router to auto-generate CRUD endpoints.
"""

from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet

app_name = "projects"

router = DefaultRouter()
router.register("", ProjectViewSet, basename="project")

urlpatterns = router.urls
