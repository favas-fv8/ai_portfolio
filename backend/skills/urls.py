"""
Skills API URL configuration.

Uses DRF routers for Skill CRUD and category listing.
"""

from rest_framework.routers import DefaultRouter

from .views import SkillCategoryViewSet, SkillViewSet

app_name = "skills"

router = DefaultRouter()
router.register("categories", SkillCategoryViewSet, basename="skill-category")
router.register("", SkillViewSet, basename="skill")

urlpatterns = router.urls
