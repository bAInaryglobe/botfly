"use client";
import AuthGuard from "@/components/AuthGuard";
export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <div className="bg-white p-6 rounded-lg border border-slate-200 max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Analytics</h3>
        <p className="text-slate-600">Analytics dashboard coming soon...</p>
      </div>
    </AuthGuard>
  );
}
