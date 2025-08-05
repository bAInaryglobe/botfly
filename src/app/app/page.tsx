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

export default function AppPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Welcome Back!</h3>
          <p className="text-slate-600">You're successfully logged in to Botfly.</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Projects</h3>
          <p className="text-2xl font-bold text-blue-600">--</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics</h3>
          <p className="text-2xl font-bold text-green-600">--</p>
        </div>
      </div>
    </div>
  );
}

