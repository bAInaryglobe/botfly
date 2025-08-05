"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import { listDocuments, createDocument, COLLECTION_IDS, databaseId } from "@/lib/appwrite";

const BOT_TYPES = [
  { value: "telegram", label: "Telegram", fields: ["token"] },
  { value: "discord", label: "Discord", fields: ["webhook"] },
];

function mapDocumentToBot(doc: any) {
  let config: any = {};
  try {
    config = typeof doc.config === 'string' ? JSON.parse(doc.config) : {};
  } catch {
    config = {};
  }
  return {
    $id: doc.$id,
    name: typeof doc.name === 'string' ? doc.name : 'Unnamed Bot',
    type: typeof doc.type === 'string' ? doc.type : 'unknown',
    token: config.token,
    webhook: config.webhook,
    ...doc,
  };
}

import type { Bots } from '@/types/appwrite';

export default function BotsPage() {
  const [bots, setBots] = useState<Bots[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState(BOT_TYPES[0].value);
  const [token, setToken] = useState('');
  const [webhook, setWebhook] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBots() {
      setLoading(true);
      setError('');
      const res = await listDocuments(databaseId, COLLECTION_IDS.bots, []);
      if (res instanceof Error) {
        setError(res.message);
        setBots([]);
      } else {
        setBots(Array.isArray(res.documents) ? res.documents.map(mapDocumentToBot) : []);
      }
      setLoading(false);
    }
    fetchBots();
  }, []);

  const handleAddBot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    const selectedType = BOT_TYPES.find(t => t.value === type);
    if (selectedType) {
      for (const field of selectedType.fields) {
        if (field === "token" && !token.trim()) {
          setError('Token is required for Telegram bots.');
          return;
        }
        if (field === "webhook" && !webhook.trim()) {
          setError('Webhook is required for Discord bots.');
          return;
        }
      }
    }
    const now = new Date().toISOString();
    let configObj: Record<string, string> = {};
    if (type === "telegram") configObj.token = token.trim();
    if (type === "discord") configObj.webhook = webhook.trim();
    const data: Record<string, unknown> = {
      name: name.trim(),
      type,
      config: JSON.stringify(configObj),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    const res = await createDocument(databaseId, COLLECTION_IDS.bots, data);
    if (res instanceof Error) {
      setError(res.message);
      return;
    }
    setBots([...bots, mapDocumentToBot(res)]);
    setName('');
    setToken('');
    setWebhook('');
  };

  return (
    <AuthGuard>
      <div className="bg-white p-6 rounded-lg border border-slate-200 max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Bots</h3>
        {loading ? (
          <p className="text-slate-600 mb-4">Loading...</p>
        ) : bots.length === 0 ? (
          <p className="text-slate-600 mb-4">No bots yet. Add your first bot below!</p>
        ) : (
          <ul className="mb-6 divide-y divide-slate-100">
            {bots.map((bot) => (
              <li key={bot.$id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-900">{bot.name}</span>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{bot.type}</span>
                </div>
                {bot.type === "telegram" && bot.token && (
                  <span className="text-slate-400 text-xs">{bot.token.replace(/.(?=.{4})/g, '*')}</span>
                )}
                {bot.type === "discord" && bot.webhook && (
                  <span className="text-slate-400 text-xs">{bot.webhook.replace(/.(?=.{4})/g, '*')}</span>
                )}
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
              placeholder="e.g. My Bot"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bot Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            >
              {BOT_TYPES.map(bt => (
                <option key={bt.value} value={bt.value}>{bt.label}</option>
              ))}
            </select>
          </div>
          {type === "telegram" && (
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
          )}
          {type === "discord" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discord Webhook</label>
              <input
                type="text"
                value={webhook}
                onChange={e => setWebhook(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Add Bot
          </button>
        </form>
      </div>
    </AuthGuard>
  );
}
