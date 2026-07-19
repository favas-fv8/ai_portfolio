"""
Accounts API URL configuration.

Provides authentication endpoints:
- /register/      → User registration
- /login/         → Email-based login (returns JWT)
- /profile/       → Get/update user profile
- /change-password/ → Change password
- /token/refresh/ → Refresh JWT access token
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import ChangePasswordView, LoginView, ProfileView, RegisterView

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
