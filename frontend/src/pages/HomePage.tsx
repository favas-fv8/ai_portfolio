import { useCallback, useEffect, useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { websiteApi } from "@/api/website";
import { skillsApi } from "@/api/skills";
import { projectsApi } from "@/api/projects";
import type { Website, Skill, Project } from "@/types";

export default function HomePage() {
  const [website, setWebsite] = useState<Website | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [websiteRes, skillsRes, projectsRes] = await Promise.allSettled([
        websiteApi.get(),
        skillsApi.getAll(),
        projectsApi.getAll({ featured: true }),
      ]);

      if (websiteRes.status === "fulfilled") setWebsite(websiteRes.value.data.data);
      if (skillsRes.status === "fulfilled") setSkills(skillsRes.value.data.results);
      if (projectsRes.status === "fulfilled") setProjects(projectsRes.value.data.results);
    } catch {
      setError("Failed to load portfolio data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} />;

  return (
    <>
      <HeroSection data={website} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} featured />
      <ContactSection data={website} />
    </>
  );
}
