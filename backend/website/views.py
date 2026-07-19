"""
Views for the Website app.

Provides a ViewSet for managing portfolio website information.
Only admin users can modify; public users can read.
"""

from rest_framework import viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from core.permissions import IsAdminOrReadOnly

from .models import Website
from .serializers import WebsiteSerializer


class WebsiteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing the Website singleton.

    - GET: Public access (read-only).
    - POST/PUT/PATCH/DELETE: Admin only.

    The Website model enforces a singleton pattern, so there is
    only ever one instance. The retrieve action returns that instance.
    """

    queryset = Website.objects.all()
    serializer_class = WebsiteSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        """Always return the singleton Website instance."""
        return Website.load()
