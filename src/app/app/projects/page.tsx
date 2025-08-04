"use client";
import AuthGuard from "@/components/AuthGuard";
export default function ProjectsPage() {
  return (
    <AuthGuard>
      <div className="bg-white p-6 rounded-lg border border-slate-200 max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Projects</h3>
        <p className="text-slate-600">No projects yet. Create your first project to get started!</p>
      </div>
    </AuthGuard>
  );
}
