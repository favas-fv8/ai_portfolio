"""
Custom exception handler for Django REST Framework.

Provides consistent error response format across all API endpoints.
"""

from typing import Any

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc: Exception, context: dict[str, Any]) -> Response | None:
    """Handle all exceptions and return a consistent error format.

    Args:
        exc: The exception that was raised.
        context: Additional context about the exception.

    Returns:
        Response with standardized error structure.
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_data: dict[str, Any] = {
            "success": False,
            "status_code": response.status_code,
            "errors": response.data,
        }

        # Map status codes to human-readable messages
        messages = {
            status.HTTP_400_BAD_REQUEST: "Bad Request",
            status.HTTP_401_UNAUTHORIZED: "Authentication Credentials Were Not Provided",
            status.HTTP_403_FORBIDDEN: "You Do Not Have Permission To Perform This Action",
            status.HTTP_404_NOT_FOUND: "The Requested Resource Was Not Found",
            status.HTTP_405_METHOD_NOT_ALLOWED: "Method Not Allowed",
            status.HTTP_429_TOO_MANY_REQUESTS: "Request Was Throttled",
            status.HTTP_500_INTERNAL_SERVER_ERROR: "Internal Server Error",
        }

        error_data["message"] = messages.get(
            response.status_code, "An Error Occurred"
        )
        response.data = error_data

    return response
