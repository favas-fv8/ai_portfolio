"""
Filters for the Skills app.

Provides filtering by category and minimum proficiency level.
"""

import django_filters

from .models import Skill


class SkillFilter(django_filters.FilterSet):
    """Filter for Skills by category and proficiency range."""

    category = django_filters.CharFilter(
        field_name="category",
        lookup_expr="exact",
        help_text="Filter by skill category (e.g., frontend, backend).",
    )
    min_percentage = django_filters.NumberFilter(
        field_name="percentage",
        lookup_expr="gte",
        help_text="Filter skills with percentage >= value.",
    )
    max_percentage = django_filters.NumberFilter(
        field_name="percentage",
        lookup_expr="lte",
        help_text="Filter skills with percentage <= value.",
    )

    class Meta:
        model = Skill
        fields = ["category", "min_percentage", "max_percentage"]
