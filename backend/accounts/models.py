"""
Custom User model for Portfolio CMS.

Uses email as the primary identifier instead of username.
Supports both regular users and admin (staff) access.
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

from core.models import TimeStampedModel


class UserManager(BaseUserManager):
    """Custom manager for User model with email-based authentication."""

    def create_user(self, email: str, password: str | None = None, **extra_fields) -> "User":
        """Create and return a regular user with the given email and password.

        Args:
            email: The user's email address (required).
            password: The user's password (optional).
            **extra_fields: Additional fields for the user.

        Returns:
            The created User instance.

        Raises:
            ValueError: If email is not provided.
        """
        if not email:
            raise ValueError("Email address is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str | None = None, **extra_fields) -> "User":
        """Create and return a superuser with admin privileges.

        Args:
            email: The superuser's email address (required).
            password: The superuser's password (required).
            **extra_fields: Additional fields for the superuser.

        Returns:
            The created superuser instance.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(TimeStampedModel, AbstractBaseUser, PermissionsMixin):
    """Custom user model using email instead of username.

    Attributes:
        email: Unique email address used for authentication.
        first_name: User's first name.
        last_name: User's last name.
        is_active: Whether the user account is active.
        is_staff: Whether the user can access Django admin.
    """

    email = models.EmailField(
        unique=True,
        max_length=255,
        help_text="Email address used for authentication.",
    )
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = ["first_name", "last_name"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()
