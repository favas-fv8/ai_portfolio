import api from "./axios";
import type { ApiResponse, Website } from "@/types";

export const websiteApi = {
  get: () =>
    api.get<ApiResponse<Website>>("/website/"),

  update: (data: FormData) =>
    api.put<ApiResponse<Website>>("/website/1/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
