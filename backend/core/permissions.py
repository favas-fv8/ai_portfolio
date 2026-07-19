"""
Custom permissions for the Portfolio CMS API.

Provides role-based access control for admin and public endpoints.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminUser(BasePermission):
    """Allow access only to admin (authenticated) users.

    Used for admin panel API endpoints where only the portfolio
    owner should be able to create, update, or delete content.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class IsAdminOrReadOnly(BasePermission):
    """Allow read-only access to anyone, write access only to admins.

    This is the primary permission for public-facing content APIs.
    Visitors can browse (GET, HEAD, OPTIONS) but only the admin
    can create, update, or delete content.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff


class IsOwner(BasePermission):
    """Allow access only to the owner of the object.

    Expects the object to have an `owner` or `user` attribute.
    """

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, "owner"):
            return obj.owner == request.user
        if hasattr(obj, "user"):
            return obj.user == request.user
        return False
