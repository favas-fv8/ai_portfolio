"""
Views for the Projects app.

Provides ViewSets for managing portfolio projects.
"""

from rest_framework import viewsets

from core.permissions import IsAdminOrReadOnly

from .filters import ProjectFilter
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Portfolio Projects.

    Supports:
    - Filtering by featured status and technology keyword
    - Search by title, description, technologies
    - Ordering by title, featured, order, created_at

    Public read access; admin-only write access.
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = ProjectFilter
    search_fields = ["title", "description", "technologies"]
    ordering_fields = ["title", "featured", "order", "created_at"]
    ordering = ["order", "-created_at"]
