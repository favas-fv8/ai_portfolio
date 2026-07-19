/** Auth tokens returned from login/register */
export interface AuthTokens {
  access: string;
  refresh: string;
}

/** Auth response from login/register */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/** User model */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  created_at: string;
}

/** Website/portfolio info */
export interface Website {
  id: string;
  full_name: string;
  professional_title: string;
  about: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  resume: string | null;
  resume_url: string | null;
  profile_image: string | null;
  profile_image_url: string | null;
  hero_image: string | null;
  hero_image_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Skill categories */
export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "design"
  | "mobile"
  | "other";

/** Skill model */
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  category_display: string;
  percentage: number;
  created_at: string;
  updated_at: string;
}

/** Skill category option */
export interface SkillCategoryOption {
  value: string;
  label: string;
}

/** Project model */
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  technologies_list: string[];
  github_url: string;
  live_url: string;
  project_image: string | null;
  project_image_url: string | null;
  featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

/** Login form data */
export interface LoginFormData {
  email: string;
  password: string;
}

/** Register form data */
export interface RegisterFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}
