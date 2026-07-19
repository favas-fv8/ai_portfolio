"""
Serializers for the Skills app.

Handles serialization of skill data with category display and validation.
"""

from rest_framework import serializers

from .models import Skill, SkillCategory


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for the Skill model.

    Includes the computed `category_display` field for human-readable
    category names in API responses.
    """

    category_display = serializers.CharField(
        source="get_category_display",
        read_only=True,
    )

    class Meta:
        model = Skill
        fields = [
            "id",
            "name",
            "category",
            "category_display",
            "percentage",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_percentage(self, value: int) -> int:
        """Ensure percentage is between 0 and 100."""
        if not 0 <= value <= 100:
            raise serializers.ValidationError("Percentage must be between 0 and 100.")
        return value

    def validate_name(self, value: str) -> str:
        """Strip and validate skill name."""
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Skill name cannot be empty.")
        return value


class SkillCategorySerializer(serializers.Serializer):
    """Serializer for returning available skill categories."""

    value = serializers.CharField()
    label = serializers.CharField()
