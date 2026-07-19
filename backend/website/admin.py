"""
Admin configuration for the Website app.

Customizes the Website model display with image previews,
file previews, and organized fieldsets.
"""

from django.contrib import admin

from .models import Website


@admin.register(Website)
class WebsiteAdmin(admin.ModelAdmin):
    """Custom admin for the Website singleton model.

    Provides image previews, file download links, and
    organized fieldsets for easy content management.
    """

    list_display = [
        "full_name",
        "professional_title",
        "email",
        "has_profile_image",
        "has_hero_image",
        "has_resume",
        "updated_at",
    ]
    search_fields = ["full_name", "professional_title", "email"]
    readonly_fields = [
        "created_at",
        "updated_at",
        "profile_image_preview",
        "hero_image_preview",
        "resume_link",
    ]

    fieldsets = (
        (
            "Personal Information",
            {"fields": ("full_name", "professional_title", "about")},
        ),
        (
            "Contact Information",
            {"fields": ("email", "phone", "address")},
        ),
        (
            "Social Links",
            {"fields": ("linkedin", "github")},
        ),
        (
            "Files",
            {
                "fields": (
                    "resume",
                    "resume_link",
                    "profile_image",
                    "profile_image_preview",
                    "hero_image",
                    "hero_image_preview",
                )
            },
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def has_profile_image(self, obj: Website) -> bool:
        """Return whether a profile image is uploaded."""
        return bool(obj.profile_image)

    has_profile_image.boolean = True
    has_profile_image.short_description = "Profile Image"

    def has_hero_image(self, obj: Website) -> bool:
        """Return whether a hero image is uploaded."""
        return bool(obj.hero_image)

    has_hero_image.boolean = True
    has_hero_image.short_description = "Hero Image"

    def has_resume(self, obj: Website) -> bool:
        """Return whether a resume is uploaded."""
        return bool(obj.resume)

    has_resume.boolean = True
    has_resume.short_description = "Resume"

    def profile_image_preview(self, obj: Website) -> str:
        """Return HTML preview of the profile image."""
        if obj.profile_image:
            return f'<img src="{obj.profile_image.url}" style="max-height: 200px; border-radius: 8px;" />'
        return "No image uploaded"

    profile_image_preview.short_description = "Profile Image Preview"

    def hero_image_preview(self, obj: Website) -> str:
        """Return HTML preview of the hero image."""
        if obj.hero_image:
            return f'<img src="{obj.hero_image.url}" style="max-height: 200px; border-radius: 8px;" />'
        return "No image uploaded"

    hero_image_preview.short_description = "Hero Image Preview"

    def resume_link(self, obj: Website) -> str:
        """Return a download link for the resume."""
        if obj.resume:
            return f'<a href="{obj.resume.url}" target="_blank">Download Resume</a>'
        return "No resume uploaded"

    resume_link.short_description = "Resume Download"
    resume_link.allow_tags = True
