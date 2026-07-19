"""
Views for the Skills app.

Provides ViewSets for managing skills and listing available categories.
"""

from rest_framework import viewsets
from rest_framework.response import Response

from core.permissions import IsAdminOrReadOnly

from .models import Skill, SkillCategory
from .serializers import SkillCategorySerializer, SkillSerializer
from .filters import SkillFilter


class SkillViewSet(viewsets.ModelViewSet):
    """ViewSet for managing technical Skills.

    Supports:
    - Filtering by category, min/max percentage
    - Search by name
    - Ordering by name, percentage, category, created_at

    Public read access; admin-only write access.
    """

    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = SkillFilter
    search_fields = ["name"]
    ordering_fields = ["name", "percentage", "category", "created_at"]
    ordering = ["category", "name"]


class SkillCategoryViewSet(viewsets.ViewSet):
    """ViewSet for listing available skill categories.

    Returns the list of predefined categories from SkillCategory choices.
    This is read-only and public.
    """

    def list(self, request) -> Response:
        """Return all available skill categories."""
        categories = [
            {"value": choice[0], "label": choice[1]}
            for choice in SkillCategory.choices
        ]
        return Response(categories)
