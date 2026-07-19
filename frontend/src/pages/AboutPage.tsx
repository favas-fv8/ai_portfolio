import { useCallback, useEffect, useState } from "react";
import { websiteApi } from "@/api/website";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import type { Website } from "@/types";

export default function AboutPage() {
  const [website, setWebsite] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await websiteApi.get();
      setWebsite(data.data);
    } catch {
      setError("Failed to load profile information.");
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
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About Me</h1>
      {website?.profile_image_url && (
        <img
          src={website.profile_image_url}
          alt={website.full_name}
          className="w-48 h-48 rounded-full object-cover mb-8"
        />
      )}
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {website?.full_name}
        </h2>
        <p className="text-xl text-blue-600 mb-6">{website?.professional_title}</p>
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {website?.about}
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {website?.email && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">{website.email}</p>
            </div>
          )}
          {website?.phone && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400">{website.phone}</p>
            </div>
          )}
          {website?.address && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
              <p className="text-gray-600 dark:text-gray-400">{website.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
