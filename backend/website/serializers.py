"""
Serializers for the Website app.

Handles serialization of portfolio website information including
file uploads for resume, profile image, and hero image.
"""

from rest_framework import serializers

from .models import Website


class WebsiteSerializer(serializers.ModelSerializer):
    """Serializer for the Website singleton model.

    Includes all fields plus computed absolute URLs for uploaded files.
    Read-only fields are auto-generated; write-only fields handle uploads.
    """

    resume_url = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    hero_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Website
        fields = [
            "id",
            "full_name",
            "professional_title",
            "about",
            "email",
            "phone",
            "address",
            "linkedin",
            "github",
            "resume",
            "resume_url",
            "profile_image",
            "profile_image_url",
            "hero_image",
            "hero_image_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_resume_url(self, obj: Website) -> str | None:
        """Return absolute URL for the resume file."""
        if obj.resume:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.resume.url)
            return obj.resume.url
        return None

    def get_profile_image_url(self, obj: Website) -> str | None:
        """Return absolute URL for the profile image."""
        if obj.profile_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

    def get_hero_image_url(self, obj: Website) -> str | None:
        """Return absolute URL for the hero image."""
        if obj.hero_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return None
