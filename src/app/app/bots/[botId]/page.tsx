"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDocument, COLLECTION_IDS, databaseId } from "@/lib/appwrite";
import type { Bots } from '@/types/appwrite';

export default function BotDetailsPage() {
  const params = useParams();
  const botId = params?.botId as string;
  const [bot, setBot] = useState<Bots | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Placeholder for background/async bot functions
  useEffect(() => {
    if (!bot) return;
    // Example: Start background job (e.g., Telegram polling)
    // const job = startTelegramBot(bot.config);
    // return () => job.stop();
  }, [bot]);

  if (loading) return <div className="p-6">Loading bot...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!bot) return <div className="p-6">Bot not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-slate-200 mt-8">
      <h2 className="text-xl font-bold mb-2">Bot: {bot.name}</h2>
      <p className="mb-2 text-slate-700">Type: {bot.type}</p>
      <p className="mb-4 text-slate-500 text-xs">ID: {bot.$id}</p>
      {/* Add controls and status for background/async functions here */}
      <div className="mt-6 text-slate-600">Background bot functions coming soon...</div>
    </div>
  );
}
