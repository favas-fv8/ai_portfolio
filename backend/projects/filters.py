"""
Filters for the Projects app.

Provides filtering by featured status and technology keywords.
"""

import django_filters

from .models import Project


class ProjectFilter(django_filters.FilterSet):
    """Filter for Projects by featured status and technology keyword."""

    featured = django_filters.BooleanFilter(
        field_name="featured",
        help_text="Filter by featured status (true/false).",
    )
    technology = django_filters.CharFilter(
        field_name="technologies",
        lookup_expr="icontains",
        help_text="Filter projects containing a specific technology keyword.",
    )

    class Meta:
        model = Project
        fields = ["featured", "technology"]
