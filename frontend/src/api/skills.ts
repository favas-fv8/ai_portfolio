import api from "./axios";
import type { ApiResponse, PaginatedResponse, Skill, SkillCategoryOption } from "@/types";

interface SkillFilters {
  category?: string;
  min_percentage?: number;
  max_percentage?: number;
  search?: string;
  ordering?: string;
}

export const skillsApi = {
  getAll: (params?: SkillFilters) =>
    api.get<PaginatedResponse<Skill>>("/skills/", { params }),

  getCategories: () =>
    api.get<ApiResponse<SkillCategoryOption[]>>("/skills/categories/"),

  create: (data: Partial<Skill>) =>
    api.post<ApiResponse<Skill>>("/skills/", data),

  update: (id: string, data: Partial<Skill>) =>
    api.put<ApiResponse<Skill>>(`/skills/${id}/`, data),

  delete: (id: string) =>
    api.delete(`/skills/${id}/`),
};
