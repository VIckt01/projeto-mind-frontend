"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "../services/api";
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
        }

        const mappedReal = realArticles.map(mapMockArticle);
        const mappedMocks = MOCK_ARTICLES.map(mapMockArticle);
        
       
        const combinedArticles = [...mappedReal, ...mappedMocks].filter(
          (v, i, a) => a.findIndex(t => t.id === v.id) === i
        );

        setArticles(combinedArticles);

        const sortedByEngagement = [...combinedArticles].sort(
          (a, b) => (b.views + b.likes) - (a.views + a.likes)
        );
        setDestaques(sortedByEngagement.slice(0, 4));

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 py-12 flex flex-col">
        <header className="mb-10 flex justify-between items-end border-b border-zinc-900 pb-6">
          <div>
            <Link href="/" className="text-xs text-zinc-500 hover:text-cyan-400 mb-2 inline-block">&larr; Voltar para a Home</Link>
            <h1 className="text-3xl font-extrabold text-white">Explore Artigos</h1>
          </div>
        </header>

        {!loading && destaques.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xs font-bold text-zinc-400 uppercase mb-5">Em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {destaques.map((art) => (
                <Link href={`/artigos/${art.slug}`} key={art.id} className="bg-[#14181F] border border-zinc-900 rounded-xl overflow-hidden group shadow-lg">
                  <div className="h-32 bg-zinc-900"><img src={art.bannerSrc || ""} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" /></div>
                  <div className="p-4 flex flex-col">
                    <span className="text-[9px] text-cyan-400 font-semibold mb-1 uppercase">{art.category}</span>
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 line-clamp-2">
                      <SavedIcon articleId={art.id} userId={user?.id} /> {art.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex flex-col sm:flex-row gap-4 mb-8">
          <input type="text" placeholder="Buscar artigos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:max-w-xs bg-[#0d111e]/60 border border-zinc-900 rounded-lg px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-[#0d111e]/60 border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:outline-none">
            <option value="Todos">Todos os artigos</option>
            <option value="Desenvolvimento web">Desenvolvimento web</option>
            <option value="DevOps">DevOps</option>
            <option value="Inteligência Artificial">Inteligência Artificial</option>
          </select>
          <div className="flex gap-1 bg-[#0d111e] border border-zinc-900 p-0.5 rounded-lg">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500"}`}>GRID</button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500"}`}>LISTA</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-500 text-sm animate-pulse">A carregar o acervo...</div>
        ) : (
          <div className={`w-full ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "flex flex-col gap-4"}`}>
            {filteredArticles.map((article) => (
              <Link href={`/artigos/${article.slug}`} key={article.id} className="bg-[#0f1322] border border-zinc-900 rounded-xl overflow-hidden flex flex-col group p-4">
                <div className="h-44 bg-zinc-900 rounded-lg overflow-hidden mb-4"><img src={article.bannerSrc || ""} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" /></div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] text-cyan-400 font-medium mb-2">{article.category}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 line-clamp-2">
                    <SavedIcon articleId={article.id} userId={user?.id} /> {article.title}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-2 line-clamp-3">{article.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}