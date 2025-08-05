"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getDocument, COLLECTION_IDS, databaseId } from "@/lib/appwrite";
import type { Bots } from '@/types/appwrite';

const CRITERIA_OPTIONS = [
  { value: "startsWithNumber", label: "Starts with a number" },
  { value: "containsCheck", label: "Contains ✅" },
];

export default function BotDetailsPage() {
  // General logs state
  const [logs, setLogs] = useState<any[]>([]);
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const logsInterval = useRef<NodeJS.Timeout | null>(null);
  const params = useParams();
  const botId = params?.botId as string;
  const [bot, setBot] = useState<Bots | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<string>("unknown");
  const [rules, setRules] = useState<any[]>([]);
  const [groupId, setGroupId] = useState("");
  const [criteria, setCriteria] = useState(CRITERIA_OPTIONS[0].value);
  const [addingRule, setAddingRule] = useState(false);
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);

  // Load bot info
  useEffect(() => {
    async function fetchBot() {
      setLoading(true);
      setError("");
      const res = await getDocument(databaseId, COLLECTION_IDS.bots, botId);
      if (res instanceof Error) {
        setError(res.message);
        setBot(null);
      } else {
        setBot(res as Bots);
      }
      setLoading(false);
    }
    if (botId) fetchBot();
  }, [botId]);

  // General logs: fetch logs and logging state
  async function fetchLogs() {
    setLoadingLogs(true);
    const res = await fetch(`/api/telegram-bot/${botId}?logs=1`);
    const data = await res.json();
    setLogs(data.logs || []);
    setLoggingEnabled(!!data.loggingEnabled);
    setLoadingLogs(false);
  }

  // Toggle logging
  async function toggleLogging(enable: boolean) {
    await fetch(`/api/telegram-bot/${botId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loggingEnabled: enable }),
    });
    setLoggingEnabled(enable);
    if (enable) fetchLogs();
  }

  // Poll logs if enabled
  useEffect(() => {
    if (!botId) return;
    fetchLogs();
    if (loggingEnabled) {
      logsInterval.current = setInterval(fetchLogs, 3000);
    } else if (logsInterval.current) {
      clearInterval(logsInterval.current);
      logsInterval.current = null;
    }
    return () => {
      if (logsInterval.current) clearInterval(logsInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId, loggingEnabled]);

  // Load rules
  async function fetchRules() {
    const res = await fetch(`/api/telegram-bot/${botId}`);
    const data = await res.json();
    setRules(data.rules || []);
  }
  useEffect(() => { if (botId) fetchRules(); }, [botId]);

  // Check bot status
  async function checkStatus() {
    setStatus("checking...");
    const res = await fetch(`/api/telegram-bot/${botId}`);
    setStatus(res.ok ? "running" : "stopped");
  }
  useEffect(() => { if (botId) checkStatus(); }, [botId]);

  // Start bot
  async function startBot() {
    setStarting(true);
    setError("");
    try {
      const config = bot ? JSON.parse(bot.config) : {};
      const res = await fetch(`/api/telegram-bot/${botId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: config.token }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to start bot");
      else setStatus("running");
    } catch (e) {
      setError("Failed to start bot");
    }
    setStarting(false);
  }

  // Stop bot
  async function stopBot() {
    setStopping(true);
    setError("");
    try {
      const res = await fetch(`/api/telegram-bot/${botId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to stop bot");
      else setStatus("stopped");
    } catch (e) {
      setError("Failed to stop bot");
    }
    setStopping(false);
  }

  // Add rule
  async function addRule(e: React.FormEvent) {
    e.preventDefault();
    setAddingRule(true);
    setError("");
    try {
      const res = await fetch(`/api/telegram-bot/${botId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, criteria }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to add rule");
      else setRules(data.rules);
    } catch (e) {
      setError("Failed to add rule");
    }
    setAddingRule(false);
  }

  // Remove rule
  async function removeRule(rule: any) {
    setError("");
    try {
      const res = await fetch(`/api/telegram-bot/${botId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to remove rule");
      else setRules(data.rules);
    } catch (e) {
      setError("Failed to remove rule");
    }
  }

  if (loading) return <div className="p-6">Loading bot...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!bot) return <div className="p-6">Bot not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-slate-200 mt-8">
      <h2 className="text-xl font-bold mb-2">Bot: {bot.name}</h2>
      <p className="mb-2 text-slate-700">Type: {bot.type}</p>
      <p className="mb-4 text-slate-500 text-xs">ID: {bot.$id}</p>
      <div className="mb-4 flex items-center space-x-4">
        <span className="text-sm">Status: <span className={status === "running" ? "text-green-600" : "text-red-600"}>{status}</span></span>
        <button onClick={startBot} disabled={starting || status === "running"} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">Start</button>
        <button onClick={stopBot} disabled={stopping || status !== "running"} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">Stop</button>
      </div>

      {/* General Logs Section */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h3 className="font-semibold mr-4">General Logs</h3>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={loggingEnabled} onChange={e => toggleLogging(e.target.checked)} className="mr-2" />
            <span className="text-sm">{loggingEnabled ? "Logging ON" : "Logging OFF"}</span>
          </label>
        </div>
        {loggingEnabled ? (
          <div className="border rounded bg-slate-50 p-2 max-h-64 overflow-y-auto text-xs">
            {loadingLogs ? <div>Loading logs...</div> : logs.length === 0 ? <div className="text-slate-400">No logs yet.</div> : (
              <ul className="space-y-1">
                {logs.slice(-50).reverse().map((log, i) => (
                  <li key={i} className="border-b border-slate-100 pb-1">
                    <span className="text-slate-500">[{new Date(log.date).toLocaleTimeString()}]</span> <span className="font-mono">{log.user}</span> <span className="text-slate-400">({log.chatTitle || log.chatId})</span>: {log.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : <div className="text-slate-400 text-xs">Logging is off. Turn on to see all messages received by this bot.</div>}
      </div>

      {/* Group Rules Section */}
      <form onSubmit={addRule} className="mb-6 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0">
        <div>
          <label className="block text-sm font-medium mb-1">Group ID</label>
          <input type="text" value={groupId} onChange={e => setGroupId(e.target.value)} className="px-2 py-1 border rounded w-40" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Criteria</label>
          <select value={criteria} onChange={e => setCriteria(e.target.value)} className="px-2 py-1 border rounded">
            {CRITERIA_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <button type="submit" disabled={addingRule} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Add Rule</button>
      </form>
      <div>
        <h3 className="font-semibold mb-2">Group Interaction Rules</h3>
        {rules.length === 0 ? <p className="text-slate-500">No rules yet.</p> : (
          <ul className="divide-y divide-slate-100">
            {rules.map((rule, i) => (
              <li key={i} className="py-2 flex items-center justify-between">
                <span className="text-sm">Group <span className="font-mono">{rule.groupId}</span> &mdash; <span className="italic">{CRITERIA_OPTIONS.find(opt => opt.value === rule.criteria)?.label || rule.criteria}</span></span>
                <button onClick={() => removeRule(rule)} className="text-xs text-red-600 hover:underline">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
