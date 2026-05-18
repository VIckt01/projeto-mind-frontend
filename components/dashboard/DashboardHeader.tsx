"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiSettings, FiPlus } from "react-icons/fi";

export default function DashboardHeader() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Pegamos apenas o nome e sobrenome para não ficar muito longo
  const nomeExibicao = user?.name ? user.name.split(" ").slice(0, 2).join(" ") : "Usuário";

  return (
    <div className="w-full flex justify-between items-center gap-4">
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-white mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-500">Bem-vindo de volta, {nomeExibicao}!</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/configuracoes")}
          className="px-4 py-2 bg-transparent border border-zinc-800 text-zinc-300 rounded text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FiSettings size={14} />
          Configurações
        </button>
        <button
          onClick={() => router.push("/criar-artigo")}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FiPlus size={16} />
          Novo Artigo
        </button>
      </div>
    </div>
  );
}