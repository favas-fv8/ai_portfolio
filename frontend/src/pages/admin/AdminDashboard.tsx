import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Welcome back, {user?.full_name || user?.email}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Website Info</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your personal information, bio, and social links.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add and manage your technical skills.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Projects</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your portfolio projects.
          </p>
        </div>
      </div>
    </div>
  );
}
