"""
Serializers for the Projects app.

Handles serialization of portfolio project data including
image URLs and computed technology lists.
"""

from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for the Project model.

    Includes computed fields: `technologies_list` (parsed array)
    and `project_image_url` (absolute URL for the image).
    """

    technologies_list = serializers.ListField(
        child=serializers.CharField(),
        source="technologies_list",
        read_only=True,
    )
    project_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "technologies",
            "technologies_list",
            "github_url",
            "live_url",
            "project_image",
            "project_image_url",
            "featured",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_project_image_url(self, obj: Project) -> str | None:
        """Return absolute URL for the project image."""
        if obj.project_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.project_image.url)
            return obj.project_image.url
        return None

    def validate_title(self, value: str) -> str:
        """Strip and validate project title."""
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Project title cannot be empty.")
        return value

    def validate_github_url(self, value: str) -> str | None:
        """Allow blank github_url."""
        if value:
            return value.strip()
        return value

    def validate_live_url(self, value: str) -> str | None:
        """Allow blank live_url."""
        if value:
            return value.strip()
        return value
