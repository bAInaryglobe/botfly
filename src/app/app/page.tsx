"use client";
import { useState, useEffect } from "react";

interface User {
  $id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}
import AuthGuard from "@/components/AuthGuard";
import { getCurrentUser, logout } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

interface Bot {
  id: string;
  name: string;
  type: 'telegram';
  token: string;
}

function BotsTab() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleAddBot = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !token.trim()) {
      setError('Name and token are required.');
      return;
    }
    setBots([
      ...bots,
      {
        id: Date.now().toString(),
        name: name.trim(),
        type: 'telegram',
        token: token.trim(),
      },
    ]);
    setName('');
    setToken('');
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Bots</h3>
      {bots.length === 0 ? (
        <p className="text-slate-600 mb-4">No bots yet. Add your first Telegram bot below!</p>
      ) : (
        <ul className="mb-6 divide-y divide-slate-100">
          {bots.map((bot) => (
            <li key={bot.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-900">{bot.name}</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{bot.type}</span>
              </div>
              <span className="text-slate-400 text-xs">{bot.token.replace(/.(?=.{4})/g, '*')}</span>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleAddBot} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bot Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            placeholder="e.g. My Telegram Bot"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Telegram Token</label>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            placeholder="123456:ABC-DEF..."
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Add Telegram Bot
        </button>
      </form>
    </div>
  );
}

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    getCurrentUser().then(setUser).catch(console.error);
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
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "bots", label: "Bots", icon: "🤖" },
  { id: "projects", label: "Projects", icon: "📁" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "settings", label: "Settings", icon: "⚙️" },
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
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-slate-900 capitalize">
                {activeTab}
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
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setShowAccountDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 pb-20 md:pb-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Welcome Back!</h3>
                    <p className="text-slate-600">You&apos;re successfully logged in to Botfly.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Projects</h3>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics</h3>
                    <p className="text-2xl font-bold text-green-600">98%</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bots" && (
              <BotsTab />
            )}
            {activeTab === "projects" && (
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Projects</h3>
                <p className="text-slate-600">No projects yet. Create your first project to get started!</p>
              </div>
            )}
            {activeTab === "analytics" && (
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Analytics</h3>
                <p className="text-slate-600">Analytics dashboard coming soon...</p>
              </div>
            )}
            {activeTab === "settings" && (
              <div className="bg-white p-6 rounded-lg border border-slate-200">
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
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2">
          <div className="flex justify-around">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
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
