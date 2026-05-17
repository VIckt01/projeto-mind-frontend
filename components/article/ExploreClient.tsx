"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BsBookmarkFill, BsGridFill, BsListUl } from "react-icons/bs";
import { ExploreArticleResponse } from "@/services/article/explore.server";

interface ExploreClientProps {
  initialArticles: ExploreArticleResponse[];
}

export default function ExploreClient({ initialArticles }: ExploreClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Ordena os destaques (4 melhores) somando views e likes no próprio frontend
  const destaques = useMemo(() => {
    return [...initialArticles]
      .sort((a, b) => b.views + b.likes - (a.views + a.likes))
      .slice(0, 4);
  }, [initialArticles]);

  // Filtra de acordo com o texto digitado e a categoria selecionada
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((art) => {
      const artCategory = art.category || "Desenvolvimento web"; // Fallback caso backend não tenha category

      const matchesSearch = art.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || artCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialArticles, searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-5xl px-4 py-12 flex flex-col">
      <header className="mb-10 flex justify-between items-end border-b border-zinc-900 pb-6">
        <div>
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-cyan-400 flex items-center gap-1.5 mb-2 transition-colors w-max"
          >
            &larr; Voltar para a Home
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Explore Artigos
          </h1>
        </div>
      </header>

      {destaques.length > 0 && (
        <div className="mb-14">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />{" "}
            Em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {destaques.map((art) => (
              <Link
                href={`/artigos/${art.slug}`}
                key={`highlight-${art.id}`}
                className="bg-[#14181F] border border-zinc-900 rounded-xl overflow-hidden group flex flex-col shadow-lg"
              >
                <div className="h-32 bg-zinc-900 relative">
                  <img
                    src={art.banner || ""}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-75 group-hover:brightness-100"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[9px] text-cyan-400 font-semibold mb-1 uppercase">
                    {art.category || "Desenvolvimento web"}
                  </span>
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 line-clamp-2 leading-snug">
                    <BsBookmarkFill
                      className="text-cyan-400 inline mb-0.5 mr-1"
                      size={10}
                    />
                    {art.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CONTROLES DE FILTRO E BUSCA */}
      <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <input
          type="text"
          placeholder="Buscar artigos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs bg-[#0d111e]/60 border border-zinc-900 rounded-lg px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50"
        />
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0d111e]/60 border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:outline-none cursor-pointer"
          >
            <option value="Todos">Todos os artigos</option>
            <option value="Desenvolvimento web">Desenvolvimento web</option>
            <option value="Inteligência Artificial">
              Inteligência Artificial
            </option>
            <option value="DevOps">DevOps</option>
          </select>

          <div className="flex items-center bg-[#0d111e] border border-zinc-900 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              title="Visualização em Grid"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500"}`}
            >
              <BsGridFill size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="Visualização em Lista"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500"}`}
            >
              <BsListUl size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* LISTAGEM DE ARTIGOS */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-sm">
          Nenhum artigo encontrado.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredArticles.map((article) => (
            <Link
              href={`/artigos/${article.slug}`}
              key={`grid-${article.id}`}
              className="bg-[#0f1322] border border-zinc-900 rounded-xl overflow-hidden flex flex-col group transition-all duration-200"
            >
              <div className="h-44 bg-zinc-900 relative flex items-center justify-center overflow-hidden select-none">
                <img
                  src={article.banner || ""}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-100"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="bg-zinc-900 text-cyan-400 font-medium px-2 py-0.5 rounded border border-zinc-800 w-max text-[10px]">
                  {article.category || "Desenvolvimento web"}
                </span>
                <h3 className="text-base font-bold mt-4 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  <BsBookmarkFill
                    className="text-cyan-400 inline mb-0.5 mr-1.5"
                    size={12}
                  />
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {filteredArticles.map((article) => (
            <Link
              href={`/artigos/${article.slug}`}
              key={`list-${article.id}`}
              className="bg-[#0f1322] border border-zinc-900/60 rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center group transition-all"
            >
              <div className="w-full sm:w-48 h-28 bg-zinc-900 relative flex items-center justify-center overflow-hidden rounded-lg shrink-0 select-none">
                <img
                  src={article.banner || ""}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-100"
                />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <span className="text-[10px] text-cyan-400 font-semibold uppercase">
                  {article.category || "Desenvolvimento web"}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                  <BsBookmarkFill
                    className="text-cyan-400 inline mb-0.5 mr-1.5"
                    size={12}
                  />
                  {article.title}
                </h3>
                <p className="text-zinc-500 text-xs line-clamp-2 mt-1">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
