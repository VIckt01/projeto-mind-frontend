"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { MOCK_ARTICLES, mapMockArticle, SavedIcon } from "../page";

interface DisplayArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  author: string;
  category: string;
  bannerSrc: string | null;
  views: number;
  likes: number;
  comments: number;
}

export default function TodosArtigosPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const [destaques, setDestaques] = useState<DisplayArticle[]>([]);
  const [articles, setArticles] = useState<DisplayArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        let realArticles: any[] = [];
        try {
          const response = await api.get("/article");
          if (response.data && response.data.length > 0) {
            realArticles = response.data;
          }
        } catch (err) {
          console.warn("Base de dados vazia ou API indisponível no momento.");
        }

        const mapArticle = (art: any): DisplayArticle => {
          const savedComments = localStorage.getItem(
            `techblog_comments_${art.id}`,
          );
          const commentsCount = savedComments
            ? JSON.parse(savedComments).length
            : 0;

          return {
            id: String(art.id),
            title: art.title,
            slug: art.slug,
            content: art.excerpt || art.content,
            date: new Date(art.createdAt).toLocaleDateString("pt-BR"),
            author: art.author?.name || art.author || "Autor Desconhecido",
            category: art.category || "Desenvolvimento web",
            bannerSrc:
              art.banner ||
              art.imageUrl ||
              "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
            views: art.views || 0,
            likes: art.likes || 0,
            comments: commentsCount,
          };
        };

        const mappedReal = realArticles.map(mapArticle);
        const mappedMocks = MOCK_ARTICLES.map(mapArticle);
        const combinedArticles = [...mappedReal, ...mappedMocks].filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
        );

        setArticles(combinedArticles);

        const sortedByEngagement = [...combinedArticles].sort(
          (a, b) => b.views + b.likes - (a.views + a.likes),
        );
        setDestaques(sortedByEngagement.slice(0, 4));
      } catch (error) {
        console.error("Erro ao processar a página de artigos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
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

        {!loading && destaques.length > 0 && (
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
                      src={art.bannerSrc || ""}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-75 group-hover:brightness-100"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[9px] text-cyan-400 font-semibold mb-1 uppercase">
                      {art.category}
                    </span>
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 line-clamp-2 leading-snug">
                      <SavedIcon articleId={art.id} userId={user?.id} />{" "}
                      {art.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500"}`}
              >
                GRID
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500"}`}
              >
                LISTA
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
                    src={article.bannerSrc || ""}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-100"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="bg-zinc-900 text-cyan-400 font-medium px-2 py-0.5 rounded border border-zinc-800 w-max text-[10px]">
                    {article.category}
                  </span>
                  <h3 className="text-base font-bold mt-4 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    <SavedIcon articleId={article.id} userId={user?.id} />{" "}
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
                    src={article.bannerSrc || ""}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-100"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    <SavedIcon articleId={article.id} userId={user?.id} />{" "}
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
