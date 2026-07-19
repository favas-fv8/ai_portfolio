"""
Website model for Portfolio CMS.

Stores the portfolio owner's personal and professional information.
This is a singleton model — only one instance should exist.
"""

from django.db import models

from core.models import TimeStampedModel


class Website(TimeStampedModel):
    """Portfolio website information.

    Singleton model representing the portfolio owner's profile.
    Contains personal info, contact details, social links, and
    file references for resume and profile images.
    """

    full_name = models.CharField(
        max_length=200,
        help_text="Full name displayed on the portfolio.",
    )
    professional_title = models.CharField(
        max_length=200,
        help_text="Professional title or headline (e.g., Full Stack Developer).",
    )
    about = models.TextField(
        help_text="Detailed about/bio section.",
    )
    email = models.EmailField(
        max_length=255,
        help_text="Contact email address.",
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Phone number (optional).",
    )
    address = models.CharField(
        max_length=300,
        blank=True,
        help_text="Physical address or location (optional).",
    )
    linkedin = models.URLField(
        max_length=300,
        blank=True,
        help_text="LinkedIn profile URL.",
    )
    github = models.URLField(
        max_length=300,
        blank=True,
        help_text="GitHub profile URL.",
    )
    resume = models.FileField(
        upload_to="resumes/",
        blank=True,
        null=True,
        help_text="Resume/CV file upload (PDF preferred).",
    )
    profile_image = models.ImageField(
        upload_to="profile/",
        blank=True,
        null=True,
        help_text="Profile photo displayed across the portfolio.",
    )
    hero_image = models.ImageField(
        upload_to="hero/",
        blank=True,
        null=True,
        help_text="Hero section background image.",
    )

    class Meta:
        verbose_name = "Website Information"
        verbose_name_plural = "Website Information"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.full_name} — {self.professional_title}"

    def save(self, *args, **kwargs) -> None:
        """Enforce singleton pattern — only one Website instance allowed."""
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls) -> "Website":
        """Load the singleton instance, creating one if it doesn't exist."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
