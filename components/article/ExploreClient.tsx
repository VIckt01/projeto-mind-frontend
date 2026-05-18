"use client";

import React, { useState } from "react";
import ArticleCard from "../home/ArticleCard";

interface ExploreClientProps {
  initialArticles: any[];
}

export default function ExploreClient({ initialArticles }: ExploreClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list"); // ← Por padrão, visualização em lista

  // Aplica os filtros digitados/selecionados pelo usuário
  const filteredArticles = initialArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? article.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="w-full max-w-[1200px] mx-auto px-6 pt-16 flex flex-col">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Todos os Artigos</h1>
        <p className="text-zinc-400 text-sm">Explore nossa coleção completa de artigos técnicos</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        {/* Campo de Pesquisa */}
        <div className="relative w-full md:max-w-md">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d111e]/60 border border-zinc-800/80 rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Dropdown de Categorias */}
          <div className="relative flex-1 md:flex-none">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-48 bg-[#0d111e]/60 border border-zinc-800/80 rounded-lg pl-9 pr-4 py-2.5 text-xs text-zinc-400 appearance-none focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="">Desenvolvimento web</option>
              <option value="IA">Inteligência Artificial</option>
              <option value="DevOps">DevOps</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Botões Grid / Lista */}
          <div className="flex items-center gap-1.5 border border-zinc-800/80 rounded-lg p-1 bg-[#0d111e]/40">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "grid" ? "bg-orange-400 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "list" ? "bg-orange-400 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Renderização do Grid ou Lista */}
      {filteredArticles.length > 0 ? (
        <div className={`grid gap-5 w-full ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} showBanner={true} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
          Nenhum artigo encontrado.
        </div>
      )}
    </main>
  );
}