import api from "./axios";
import type { ApiResponse, AuthResponse, LoginFormData, RegisterFormData, User } from "@/types";

export const authApi = {
  login: (data: LoginFormData) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login/", data),

  register: (data: RegisterFormData) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register/", data),

  getProfile: () =>
    api.get<ApiResponse<User>>("/auth/profile/"),

  updateProfile: (data: Partial<User>) =>
    api.patch<ApiResponse<User>>("/auth/profile/", data),

  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post<ApiResponse<{ message: string }>>("/auth/change-password/", data),

  refreshToken: (refresh: string) =>
    api.post<{ access: string }>("/auth/token/refresh/", { refresh }),
};
