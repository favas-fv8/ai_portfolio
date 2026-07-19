"""
Base models and abstract classes for the Portfolio CMS.

Provides reusable model mixins to avoid code duplication across apps.
"""

import uuid

from django.db import models


class TimeStampedModel(models.Model):
    """Abstract base model with automatic created/updated timestamps.

    All models that need tracking of creation and modification times
    should inherit from this class.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this record.",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when this record was created.",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when this record was last updated.",
    )

    class Meta:
        abstract = True
        ordering = ["-created_at"]

    def __str__(self) -> str:
        """Return string representation — subclasses should override."""
        return str(self.id)
