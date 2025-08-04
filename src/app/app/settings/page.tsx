"use client";
import AuthGuard from "@/components/AuthGuard";
import { getCurrentUser } from "@/lib/appwrite";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    getCurrentUser().then(u => setUser(u)).catch(() => setUser(null));
  }, []);
  return (
    <AuthGuard>
      <div className="bg-white p-6 rounded-lg border border-slate-200 max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500"
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
