"""
API v1 URL configuration.

All app-specific API routes are included here under /api/v1/.
"""

from django.urls import include, path

app_name = "api-v1"

urlpatterns = [
    path("auth/", include("accounts.urls", namespace="accounts")),
    path("website/", include("website.urls", namespace="website")),
    path("skills/", include("skills.urls", namespace="skills")),
    path("projects/", include("projects.urls", namespace="projects")),
]
