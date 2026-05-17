"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { MOCK_ARTICLES } from "../page";

interface Artigo {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  createdAt: string;
  views: number;
  likes: number;
  banner?: string | null;
}

interface LeituraRecente {
  id: string;
  title: string;
  status: "Em andamento" | "Concluído";
  imageUrl: string;
  url: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [leituras, setLeituras] = useState<LeituraRecente[]>([]);
  const [fetching, setFetching] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const [metrics, setMetrics] = useState({
    totalArtigos: 0,
    engajamento: 0,
    curtidas: 0,
    tempoLeitura: "0 min",
  });

  // Inicializa Leituras Inteligentes conectadas aos Artigos Mocks/Reais
  useEffect(() => {
    const savedLeituras = localStorage.getItem("techblog_leituras");
    if (savedLeituras) {
      setLeituras(JSON.parse(savedLeituras));
    } else {
      const initialLeituras: LeituraRecente[] = MOCK_ARTICLES.slice(0, 2).map(
        (art) => ({
          id: art.id,
          title: art.title,
          status: "Em andamento",
          imageUrl: art.banner,
          url: `/artigos/${art.slug}`,
        }),
      );
      setLeituras(initialLeituras);
      localStorage.setItem(
        "techblog_leituras",
        JSON.stringify(initialLeituras),
      );
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // FUNÇÃO DE MAPEAMENTO CORRETA PARA A INTERFACE "Artigo" DO DASHBOARD
    const mapToDashboardArticle = (art: any): Artigo => ({
      id: art.id,
      title: art.title,
      slug: art.slug,
      content: art.content || "",
      excerpt: art.excerpt || art.content?.substring(0, 120),
      createdAt: new Date(art.createdAt).toLocaleDateString("pt-BR"),
      views: art.views || 0,
      likes: art.likes || 0,
      banner:
        art.banner ||
        "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
    });

    const fetchMeusArtigos = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/article/user/${user.id}`);
        if (response.data.length === 0) throw new Error("Vazio");

        const formattedArticles = response.data.map(mapToDashboardArticle);
        setArtigos(formattedArticles);
        calcularMetricas(formattedArticles);
      } catch (err) {
        // FALLBACK MOCK COM A TIPAGEM CORRIGIDA
        const mockData = MOCK_ARTICLES.slice(0, 2).map(mapToDashboardArticle);
        setArtigos(mockData);
        calcularMetricas(mockData);
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchMeusArtigos();
  }, [user, loading, router]);

  const calcularMetricas = (lista: Artigo[]) => {
    const totalLikes = lista.reduce((acc, cur) => acc + cur.likes, 0);
    const totalViews = lista.reduce((acc, cur) => acc + cur.views, 0);
    const totalPalavras = lista.reduce(
      (acc, cur) => acc + (cur.content ? cur.content.split(/\s+/).length : 0),
      0,
    );
    const tempoMedio =
      lista.length > 0 ? Math.ceil(totalPalavras / 200 / lista.length) : 0;

    setMetrics({
      totalArtigos: lista.length,
      curtidas: totalLikes,
      engajamento: totalLikes + totalViews,
      tempoLeitura: `${tempoMedio} min`,
    });
  };

  const handleConcluirLeitura = (id: string) => {
    const updated = leituras.map((item) =>
      item.id === id ? { ...item, status: "Concluído" as const } : item,
    );
    setLeituras(updated);
    localStorage.setItem("techblog_leituras", JSON.stringify(updated));
  };

  const confirmDeleteClick = (id: string) => {
    setArticleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!articleToDelete) return;
    try {
      await api.delete(`/article/${articleToDelete}`);
    } catch (e) {
      console.log("Tentou deletar na API, mock atualizado no frontend.");
    } finally {
      const novosArtigos = artigos.filter((a) => a.id !== articleToDelete);
      setArtigos(novosArtigos);
      calcularMetricas(novosArtigos);
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
    }
  };

  if (loading || fetching)
    return (
      <div className="w-full min-h-screen bg-[#0B0E13] flex items-center justify-center text-zinc-400 text-xs uppercase tracking-widest animate-pulse">
        Carregando painel...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white antialiased font-sans select-none relative">
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-[#14181F] border border-zinc-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Excluir Artigo?
            </h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Esta ação reduzirá seu engajamento no dashboard. O artigo será
              removido do banco de dados e não poderá ser recuperado.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-lg cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-[1440px] mx-auto px-10 py-12 flex flex-col gap-8">
        <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Bem-vindo de volta, {user?.name}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/configuracoes")}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 hover:text-white text-zinc-400 hover:bg-zinc-800/60 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Configurações
            </button>
            <button
              onClick={() => router.push("/criar-artigo")}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Novo Artigo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
              Total de Artigos
            </span>
            <span className="text-3xl font-bold text-white tracking-tight">
              {metrics.totalArtigos}
            </span>
          </div>
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
              Engajamento (Visualizações)
            </span>
            <span className="text-3xl font-bold text-white tracking-tight">
              {metrics.engajamento}
            </span>
          </div>
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
              Curtidas Totais
            </span>
            <span className="text-3xl font-bold text-white tracking-tight">
              {metrics.curtidas}
            </span>
          </div>
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
              Tempo médio de leitura
            </span>
            <span className="text-3xl font-bold text-white tracking-tight">
              {metrics.tempoLeitura}
            </span>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Meus Artigos
            </h2>
            <div className="flex flex-col gap-4">
              {artigos.map((artigo) => (
                <div
                  key={artigo.id}
                  className="w-full border border-zinc-900/60 bg-[#0B0E13]/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-zinc-700/80 group"
                >
                  <Link
                    href={`/artigos/${artigo.slug}`}
                    className="flex items-center gap-4 flex-1 overflow-hidden cursor-pointer"
                  >
                    <div className="w-24 h-16 rounded overflow-hidden border border-zinc-800/80 shrink-0 relative bg-zinc-950">
                      <img
                        src={artigo.banner || ""}
                        alt={artigo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                      />
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <h3 className="text-xs font-bold text-white truncate w-full group-hover:text-cyan-400 transition-colors duration-200">
                        {artigo.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 truncate w-full group-hover:text-zinc-400 transition-colors duration-200">
                        {artigo.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-medium mt-1">
                        <span>{artigo.createdAt}</span>
                        <span>•</span>
                        <span>👁️ {artigo.views}</span>
                        <span>•</span>
                        <span>❤️ {artigo.likes}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-zinc-900 pt-3 sm:pt-0">
                    <button
                      onClick={() => router.push(`/artigos/${artigo.slug}`)}
                      className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-cyan-900/30 hover:border-cyan-700 text-[11px] text-cyan-400 font-semibold rounded hover:bg-cyan-900/20 transition-all cursor-pointer"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => router.push(`/editar-artigo/${artigo.id}`)}
                      className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 font-semibold rounded hover:text-white hover:bg-zinc-800/20 transition-all cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDeleteClick(artigo.id)}
                      className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-red-950/20 bg-red-500/5 hover:bg-red-500/10 text-[11px] text-red-400 font-semibold rounded transition-all cursor-pointer"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
              {artigos.length === 0 && (
                <div className="text-center text-xs text-zinc-500 py-8 border border-dashed border-zinc-800 rounded-lg">
                  Você ainda não tem artigos publicados.
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Leituras Recentes
            </h2>
            <div className="flex flex-col gap-4">
              {leituras.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex flex-col gap-3 pb-4 border-b border-zinc-900/80 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover shrink-0 border border-zinc-800"
                    />
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <p className="text-[11px] text-zinc-200 font-bold leading-normal truncate-2-lines">
                        {item.title}
                      </p>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider self-start px-1.5 py-0.5 rounded ${item.status === "Em andamento" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-teal-500/10 text-teal-400 border border-teal-500/20"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  {item.status === "Em andamento" && (
                    <div className="flex items-center gap-2 mt-1 w-full">
                      <button
                        onClick={() => router.push(item.url)}
                        className="flex-1 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer text-center"
                      >
                        Continuar lendo
                      </button>
                      <button
                        onClick={() => handleConcluirLeitura(item.id)}
                        className="flex-1 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-zinc-950 border border-cyan-400/20 text-[10px] font-black uppercase tracking-wider py-1.5 rounded transition-all cursor-pointer text-center"
                      >
                        Concluir
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
