"""
Projects model for Portfolio CMS.

Stores portfolio project entries with images, links, and metadata.
"""

from django.db import models

from core.models import TimeStampedModel


class Project(TimeStampedModel):
    """A portfolio project entry.

    Represents a single project in the portfolio with its description,
    technologies used, links to source code and live demo, and metadata
    for featured display and ordering.
    """

    title = models.CharField(
        max_length=200,
        help_text="Project title.",
    )
    description = models.TextField(
        help_text="Detailed project description.",
    )
    technologies = models.CharField(
        max_length=500,
        help_text="Comma-separated list of technologies used.",
    )
    github_url = models.URLField(
        max_length=300,
        blank=True,
        help_text="GitHub repository URL.",
    )
    live_url = models.URLField(
        max_length=300,
        blank=True,
        help_text="Live demo URL.",
    )
    project_image = models.ImageField(
        upload_to="projects/",
        blank=True,
        null=True,
        help_text="Project screenshot or thumbnail image.",
    )
    featured = models.BooleanField(
        default=False,
        help_text="Whether this project should be featured/highlighted.",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order (lower numbers appear first).",
    )

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ["order", "-created_at"]

    def __str__(self) -> str:
        return self.title

    @property
    def technologies_list(self) -> list[str]:
        """Return technologies as a list of stripped strings."""
        return [tech.strip() for tech in self.technologies.split(",") if tech.strip()]
