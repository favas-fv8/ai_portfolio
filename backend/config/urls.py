"""
Root URL configuration for Portfolio CMS.

Routes:
    /admin/       → Django Admin
    /api/v1/      → Versioned REST API
    /api/schema/  → OpenAPI schema (drf-spectacular)
    /api/docs/    → Swagger UI
    /api/redoc/   → ReDoc UI
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

# Customize admin site branding
admin.site.site_header = "Portfolio CMS Admin"
admin.site.site_title = "Portfolio CMS"
admin.site.index_title = "Content Management"

urlpatterns = [
    # ── Django Admin ──
    path("admin/", admin.site.urls),
    # ── API v1 ──
    path("api/v1/", include("config.api_urls")),
    # ── API Documentation ──
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
