"""
Admin configuration for the Projects app.

Customizes the Project model display with image previews,
featured indicators, and technology tags.
"""

from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """Custom admin for the Project model.

    Provides image previews, featured indicators,
    technology display, and bulk actions for managing projects.
    """

    list_display = [
        "title",
        "featured_badge",
        "order",
        "technologies_short",
        "has_image",
        "created_at",
    ]
    list_filter = ["featured", "created_at"]
    search_fields = ["title", "description", "technologies"]
    ordering = ["order", "-created_at"]
    readonly_fields = [
        "created_at",
        "updated_at",
        "image_preview",
        "technologies_list_display",
    ]

    fieldsets = (
        (
            "Project Details",
            {"fields": ("title", "description", "technologies", "technologies_list_display")},
        ),
        (
            "Links",
            {"fields": ("github_url", "live_url")},
        ),
        (
            "Media",
            {"fields": ("project_image", "image_preview")},
        ),
        (
            "Display Settings",
            {"fields": ("featured", "order")},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    actions = ["mark_featured", "unmark_featured"]

    def featured_badge(self, obj: Project) -> str:
        """Return an HTML badge indicating featured status."""
        if obj.featured:
            return '<span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Featured</span>'
        return '<span style="background: #9ca3af; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Normal</span>'

    featured_badge.short_description = "Status"
    featured_badge.allow_tags = True

    def technologies_short(self, obj: Project) -> str:
        """Return a truncated display of technologies."""
        techs = obj.technologies
        if len(techs) > 60:
            return techs[:60] + "..."
        return techs

    technologies_short.short_description = "Technologies"

    def has_image(self, obj: Project) -> bool:
        """Return whether a project image is uploaded."""
        return bool(obj.project_image)

    has_image.boolean = True
    has_image.short_description = "Image"

    def image_preview(self, obj: Project) -> str:
        """Return HTML preview of the project image."""
        if obj.project_image:
            return f'<img src="{obj.project_image.url}" style="max-height: 200px; border-radius: 8px;" />'
        return "No image uploaded"

    image_preview.short_description = "Image Preview"

    def technologies_list_display(self, obj: Project) -> str:
        """Return a formatted list of technologies."""
        techs = obj.technologies_list
        return ", ".join(techs) if techs else "None"

    technologies_list_display.short_description = "Technologies (Parsed)"

    @admin.action(description="Mark selected projects as featured")
    def mark_featured(self, request, queryset):
        """Mark selected projects as featured."""
        count = queryset.update(featured=True)
        self.message_user(request, f"Marked {count} project(s) as featured.")

    @admin.action(description="Remove featured status from selected projects")
    def unmark_featured(self, request, queryset):
        """Remove featured status from selected projects."""
        count = queryset.update(featured=False)
        self.message_user(request, f"Removed featured status from {count} project(s).")
