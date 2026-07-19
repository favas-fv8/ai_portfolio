"""
Admin configuration for the Skills app.

Customizes the Skill model display with category filters,
search, and proficiency indicators.
"""

from django.contrib import admin

from .models import Skill


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """Custom admin for the Skill model.

    Provides category-based filtering, proficiency display,
    and bulk actions for managing skills.
    """

    list_display = [
        "name",
        "category",
        "percentage_bar",
        "created_at",
    ]
    list_filter = ["category"]
    search_fields = ["name"]
    ordering = ["category", "name"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        (
            "Skill Details",
            {"fields": ("name", "category", "percentage")},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    actions = ["reset_to_zero", "set_to_100"]

    def percentage_bar(self, obj: Skill) -> str:
        """Return an HTML progress bar showing proficiency level."""
        color = "#22c55e" if obj.percentage >= 70 else "#f59e0b" if obj.percentage >= 40 else "#ef4444"
        return (
            f'<div style="background: #e5e7eb; border-radius: 4px; width: 120px; height: 20px;">'
            f'<div style="background: {color}; width: {obj.percentage}%; height: 100%; '
            f'border-radius: 4px; text-align: center; color: white; font-size: 12px; line-height: 20px;">'
            f"{obj.percentage}%</div></div>"
        )

    percentage_bar.short_description = "Proficiency"
    percentage_bar.allow_tags = True

    @admin.action(description="Reset selected skills to 0%")
    def reset_to_zero(self, request, queryset):
        """Reset proficiency of selected skills to 0."""
        count = queryset.update(percentage=0)
        self.message_user(request, f"Reset {count} skill(s) to 0%.")

    @admin.action(description="Set selected skills to 100%")
    def set_to_100(self, request, queryset):
        """Set proficiency of selected skills to 100%."""
        count = queryset.update(percentage=100)
        self.message_user(request, f"Set {count} skill(s) to 100%.")
