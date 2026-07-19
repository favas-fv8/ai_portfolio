import api from "./axios";
import type { ApiResponse, PaginatedResponse, Project } from "@/types";

interface ProjectFilters {
  featured?: boolean;
  technology?: string;
  search?: string;
  ordering?: string;
}

export const projectsApi = {
  getAll: (params?: ProjectFilters) =>
    api.get<PaginatedResponse<Project>>("/projects/", { params }),

  getOne: (id: string) =>
    api.get<ApiResponse<Project>>(`/projects/${id}/`),

  create: (data: FormData) =>
    api.post<ApiResponse<Project>>("/projects/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Project>>(`/projects/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id: string) =>
    api.delete(`/projects/${id}/`),
};
