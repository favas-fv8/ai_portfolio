import { useCallback, useEffect, useState } from "react";
import { skillsApi } from "@/api/skills";
import SkillsSection from "@/components/sections/SkillsSection";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import EmptyState from "@/components/common/EmptyState";
import type { Skill } from "@/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await skillsApi.getAll();
      setSkills(data.results);
    } catch {
      setError("Failed to load skills.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return (
    <div className="py-16">
      {isLoading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} onRetry={fetchSkills} />}
      {!isLoading && !error && skills.length === 0 && (
        <EmptyState title="No Skills Yet" description="Skills will appear here once added." />
      )}
      {!isLoading && !error && skills.length > 0 && <SkillsSection skills={skills} />}
    </div>
  );
}
