import { useCallback, useEffect, useState } from "react";
import { projectsApi } from "@/api/projects";
import ProjectsSection from "@/components/sections/ProjectsSection";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import EmptyState from "@/components/common/EmptyState";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await projectsApi.getAll();
      setProjects(data.results);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="py-16">
      {isLoading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} onRetry={fetchProjects} />}
      {!isLoading && !error && projects.length === 0 && (
        <EmptyState title="No Projects Yet" description="Projects will appear here once added." />
      )}
      {!isLoading && !error && projects.length > 0 && <ProjectsSection projects={projects} />}
    </div>
  );
}
