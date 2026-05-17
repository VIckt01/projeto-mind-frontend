"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const router = useRouter();

  return (
    <div className="w-full flex justify-between items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Bem-vindo de volta!</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/criar-artigo")}
          className="px-4 py-2.5 bg-cyan-400 text-zinc-950 rounded-lg text-xs font-bold cursor-pointer"
        >
          Novo Artigo
        </button>
      </div>
    </div>
  );
}
