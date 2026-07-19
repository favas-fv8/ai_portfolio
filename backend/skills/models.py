"""
Skills model for Portfolio CMS.

Stores technical skills organized by category with proficiency levels.
"""

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from core.models import TimeStampedModel


class SkillCategory(models.TextChoices):
    """Predefined categories for organizing skills."""

    FRONTEND = "frontend", "Frontend"
    BACKEND = "backend", "Backend"
    DATABASE = "database", "Database"
    DEVOPS = "devops", "DevOps"
    DESIGN = "design", "Design"
    MOBILE = "mobile", "Mobile"
    OTHER = "other", "Other"


class Skill(TimeStampedModel):
    """A technical skill with category and proficiency level.

    Attributes:
        name: The skill name (e.g., "Python", "React").
        category: The category this skill belongs to.
        percentage: Proficiency level as a percentage (0-100).
    """

    name = models.CharField(
        max_length=100,
        help_text="Name of the skill (e.g., Python, React).",
    )
    category = models.CharField(
        max_length=20,
        choices=SkillCategory.choices,
        default=SkillCategory.OTHER,
        help_text="Category this skill belongs to.",
    )
    percentage = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Proficiency level as a percentage (0-100).",
    )

    class Meta:
        verbose_name = "Skill"
        verbose_name_plural = "Skills"
        ordering = ["category", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "category"],
                name="unique_skill_per_category",
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.get_category_display()} — {self.percentage}%)"
