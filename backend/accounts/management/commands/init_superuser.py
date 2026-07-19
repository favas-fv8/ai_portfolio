"""
Management command to create a superuser from environment variables.

Usage: python manage.py init_superuser

Reads DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD from env.
If the user already exists, does nothing.
"""

from decouple import config
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    help = "Create initial superuser from environment variables"

    def handle(self, *args, **options):
        email = config("DJANGO_SUPERUSER_EMAIL", default="admin@portfolio.com")
        password = config("DJANGO_SUPERUSER_PASSWORD", default="admin123!")

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.SUCCESS(f"Superuser '{email}' already exists. Skipping."))
            return

        User.objects.create_superuser(
            email=email,
            password=password,
            first_name="Admin",
            last_name="User",
        )
        self.stdout.write(self.style.SUCCESS(f"Superuser '{email}' created successfully."))
