"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "../../services/api";

interface DisplayArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  author: string;
  category: string;
  bannerSrc: string;
  views: number;
  likes: number;
  comments: number;
}

export default function TodosArtigosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [articles, setArticles] = useState<DisplayArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        // Puxando da rota pública com o Axios
        const response = await api.get("/article");
        const data = response.data;

        const mapped = data.map((art: any) => ({
          id: art.id,
          title: art.title,
          slug: art.slug,
          content: art.excerpt || art.content,
          date: new Date(art.createdAt).toLocaleDateString("pt-BR"),
          author: art.author?.name || "Autor Desconhecido",
          category: art.category || "Desenvolvimento web", // Se tiver no BD, usa de lá
          bannerSrc:
            art.banner ||
            "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
          views: art.views,
          likes: art.likes,
          comments: 0, // Como não temos relação de comentários no BD ainda
        }));

        setArticles(mapped);
      } catch (error) {
        console.error("Erro ao buscar artigos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 py-12 flex flex-col">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-cyan-400 flex items-center gap-1.5 mb-2 transition-colors"
            >
              &larr; Voltar para a Home
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Todos os Artigos
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Explore nossa coleção completa de artigos técnicos
            </p>
          </div>
        </header>

        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-zinc-900">
          <div className="w-full sm:max-w-xs relative">
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d111e]/60 border border-zinc-900 rounded-lg px-4 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
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
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 5.25h16.5m-16.5-10.5h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-500 text-sm font-mono animate-pulse">
            Carregando acervo técnico...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            Nenhum artigo encontrado para os filtros selecionados.
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredArticles.map((article) => (
              <Link
                href={`/artigos/${article.slug}`}
                key={article.id}
                className="bg-[#0f1322] border border-zinc-900 rounded-xl overflow-hidden flex flex-col group transition-all duration-200"
              >
                <div className="h-44 bg-zinc-900 relative flex items-center justify-center overflow-hidden select-none">
                  <img
                    src={article.bannerSrc}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-100"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="bg-zinc-900 text-cyan-400 font-medium px-2 py-0.5 rounded border border-zinc-800">
                      {article.category}
                    </span>
                    <span className="text-zinc-500">{article.date}</span>
                  </div>
                  <h3 className="text-base font-bold mt-4 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-2 line-clamp-3 flex-1 leading-relaxed">
                    {article.content}
                  </p>
                  <div className="mt-5 pt-3 border-t border-zinc-900/80 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{article.author}</span>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span>👁️ {article.views}</span>
                      <span>❤️ {article.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {filteredArticles.map((article) => (
              <Link
                href={`/artigos/${article.slug}`}
                key={article.id}
                className="bg-[#0f1322] border border-zinc-900/60 rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center group transition-all"
              >
                <div className="w-full sm:w-48 h-28 bg-zinc-900 relative flex items-center justify-center overflow-hidden rounded-lg shrink-0 select-none">
                  <img
                    src={article.bannerSrc}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-100"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span className="text-cyan-400 font-semibold">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500">
                    <span>Por: {article.author}</span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span>👁️ {article.views}</span>
                      <span>❤️ {article.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
