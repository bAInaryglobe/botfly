"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getCurrentUser, logout } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  $id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  useEffect(() => {
    getCurrentUser().then(u => {
      if (u instanceof Error) setUser(null);
      else setUser(u);
    }).catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sidebarItems = [
    { href: "/app", label: "Dashboard", icon: "📊" },
    { href: "/app/bots", label: "Bots", icon: "🤖" },
    { href: "/app/projects", label: "Projects", icon: "📁" },
    { href: "/app/analytics", label: "Analytics", icon: "📈" },
    { href: "/app/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900">Botfly</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-slate-900 capitalize">
                {/* Show current page title based on route? */}
              </h2>
            </div>
            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900">{user?.name || "Loading..."}</p>
                  <p className="text-xs text-slate-500">{user?.email || ""}</p>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/app/settings"
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    onClick={() => setShowAccountDropdown(false)}
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <span>🔚</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 pb-20 md:pb-6">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2">
          <div className="flex justify-around">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      {/* Click outside to close dropdown */}
      {showAccountDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowAccountDropdown(false)}
        />
      )}
    </AuthGuard>
  );
}
