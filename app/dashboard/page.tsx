"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

interface Artigo {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  createdAt: string;
  views: number;
  likes: number;
  banner?: string;
}

interface LeituraRecente {
  id: number;
  title: string;
  status: "Em andamento" | "Concluído";
  imageUrl: string;
  url: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [fetching, setFetching] = useState(true);

  // Estados para o Modal Centralizado de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const [leituras, setLeituras] = useState<LeituraRecente[]>([
    {
      id: 1,
      title: "Python para Automação: Economize Horas de Trabalho Manual",
      status: "Em andamento",
      imageUrl:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80",
      url: "/artigos/python-para-automacao",
    },
    {
      id: 2,
      title: "A Evolução da Inteligência Artificial nos Video Games Modernos",
      status: "Em andamento",
      imageUrl:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=120&auto=format&fit=crop&q=80",
      url: "/artigos/a-evolucao-da-inteligencia",
    },
  ]);

  const [metrics, setMetrics] = useState({
    totalArtigos: 0,
    engajamento: 0,
    curtidas: 0,
    tempoLeitura: "0 min",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const fetchMeusArtigos = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/article/user/${user.id}`);
        const data = response.data;

        let totalPalavras = 0;

        const formattedArticles = data.map((art: any) => {
          // Conta as palavras de cada artigo para o cálculo de tempo
          const palavrasDoArtigo = art.content
            ? art.content.split(/\s+/).length
            : 0;
          totalPalavras += palavrasDoArtigo;

          return {
            id: art.id,
            title: art.title,
            slug: art.slug,
            content: art.content,
            excerpt: art.excerpt,
            createdAt: new Date(art.createdAt).toLocaleDateString("pt-BR"),
            views: art.views || 0,
            likes: art.likes || 0,
            banner:
              art.banner ||
              "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
          };
        });

        setArtigos(formattedArticles);

        // --- CÁLCULO DE MÉTRICAS REAIS ---
        const totalLikes = formattedArticles.reduce(
          (acc: number, cur: any) => acc + cur.likes,
          0,
        );
        const totalViews = formattedArticles.reduce(
          (acc: number, cur: any) => acc + cur.views,
          0,
        );

        // Média de leitura: 200 palavras por minuto divido pela qtd de artigos
        const tempoMedio =
          formattedArticles.length > 0
            ? Math.ceil(totalPalavras / 200 / formattedArticles.length)
            : 0;

        setMetrics({
          totalArtigos: formattedArticles.length,
          curtidas: totalLikes,
          engajamento: totalLikes + totalViews, // Engajamento = Curtidas + Visualizações
          tempoLeitura: `${tempoMedio} min`,
        });
      } catch (err) {
        console.error("Erro ao buscar artigos do usuário", err);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchMeusArtigos();
    }
  }, [user, loading, router]);

  const handleConcluirLeitura = (id: number) => {
    setLeituras((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Concluído" } : item,
      ),
    );
  };

  // Abre o modal de exclusão
  const confirmDeleteClick = (id: string) => {
    setArticleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Executa a exclusão após confirmação no Modal
  const executeDelete = async () => {
    if (!articleToDelete) return;
    try {
      await api.delete(`/article/${articleToDelete}`);
      setArtigos((prev) =>
        prev.filter((artigo) => artigo.id !== articleToDelete),
      );
      setMetrics((prev) => ({
        ...prev,
        totalArtigos: Math.max(0, prev.totalArtigos - 1),
      }));
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (err: any) {
      console.error("Erro ao deletar artigo", err);
      alert(err.response?.data?.error || "Erro ao excluir o artigo");
      setIsDeleteModalOpen(false);
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
      {/* --- MODAL CENTRALIZADO DE EXCLUSÃO --- */}
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
              Esta ação é permanente. O artigo será removido do banco de dados e
              não poderá ser recuperado.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-red-500/20"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-[1440px] mx-auto px-10 py-12 flex flex-col gap-8">
        {/* HEADER DO DASHBOARD */}
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
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 hover:text-white text-zinc-400 hover:bg-zinc-800/60 rounded-lg text-xs font-semibold transition-all"
            >
              Configurações
            </button>
            <button
              onClick={() => router.push("/criar-artigo")}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 rounded-lg text-xs font-bold transition-all shadow-md"
            >
              Novo Artigo
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
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

        {/* CONTEÚDO PRINCIPAL */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* COLUNA ESQUERDA: LISTA MEUS ARTIGOS */}
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
                  {/* Clicar na imagem ou texto abre o artigo para visualização */}
                  <Link
                    href={`/artigos/${artigo.slug}`}
                    className="flex items-center gap-4 flex-1 overflow-hidden cursor-pointer"
                  >
                    <div className="w-24 h-16 rounded overflow-hidden border border-zinc-800/80 shrink-0 relative bg-zinc-950">
                      <img
                        src={artigo.banner}
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
                    {/* Botão Visualizar */}
                    <button
                      onClick={() => router.push(`/artigos/${artigo.slug}`)}
                      className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-cyan-900/30 hover:border-cyan-700 text-[11px] text-cyan-400 font-semibold rounded hover:bg-cyan-900/20 transition-all cursor-pointer"
                    >
                      Ver
                    </button>
                    {/* Botão Editar */}
                    <button
                      onClick={() => router.push(`/editar-artigo/${artigo.id}`)}
                      className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 font-semibold rounded hover:text-white hover:bg-zinc-800/20 transition-all cursor-pointer"
                    >
                      Editar
                    </button>
                    {/* Botão Excluir que abre o Modal */}
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

          {/* COLUNA DIREITA: LEITURA RECENTE */}
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
