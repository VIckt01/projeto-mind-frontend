"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { api } from "../services/api";
import { MOCK_ARTICLES, SavedIcon } from "../page";

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
  imageUrl: string | null;
  url: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [savedArticles, setSavedArticles] = useState<Artigo[]>([]); // Estado para os salvos
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

  useEffect(() => {
    const savedLeituras = localStorage.getItem("techblog_leituras");
    if (savedLeituras) {
      setLeituras(JSON.parse(savedLeituras));
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const mapToDashboardArticle = (art: any): Artigo => ({
      id: String(art.id),
      title: art.title,
      slug: art.slug,
      content: art.content || "",
      excerpt: art.excerpt || art.content?.substring(0, 120),
      createdAt: new Date(art.createdAt).toLocaleDateString("pt-BR"),
      views: art.views || 0,
      likes: art.likes || 0,
      banner: art.banner || art.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
    });

    const fetchData = async () => {
      if (!user) return;
      try {
        // 1. Busca os artigos criados pelo usuário
        let userArticles = [];
        try {
          const res = await api.get(`/article/user/${user.id}`);
          if (res.data?.length > 0) userArticles = res.data;
        } catch (e) {}

        const formattedArticles = userArticles.map(mapToDashboardArticle);
        setArtigos(formattedArticles);
        calcularMetricas(formattedArticles);

        // 2. Busca TODOS os artigos para filtrar os que ele Salvou
        let allRealArticles = [];
        try {
          const resAll = await api.get("/article");
          if (resAll.data?.length > 0) allRealArticles = resAll.data;
        } catch (e) {}

        const allMapped = [...allRealArticles, ...MOCK_ARTICLES].map(mapToDashboardArticle);
        
        // Filtra olhando pro LocalStorage com a chave correta
        const favoritedArticles = allMapped.filter((art) => 
          localStorage.getItem(`techblog_save_${user.id}_${art.id}`) === "true"
        );
        
        // Remove duplicatas
        const uniqueFavorited = favoritedArticles.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setSavedArticles(uniqueFavorited);

      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchData();
  }, [user, loading, router]);

  const calcularMetricas = (lista: Artigo[]) => {
    const totalLikes = lista.reduce((acc, cur) => acc + cur.likes, 0);
    const totalViews = lista.reduce((acc, cur) => acc + cur.views, 0);
    const totalPalavras = lista.reduce((acc, cur) => acc + (cur.content ? cur.content.split(/\s+/).length : 0), 0);
    const tempoMedio = lista.length > 0 ? Math.ceil(totalPalavras / 200 / lista.length) : 0;

    setMetrics({
      totalArtigos: lista.length,
      curtidas: totalLikes,
      engajamento: totalLikes + totalViews,
      tempoLeitura: `${tempoMedio} min`,
    });
  };

  const handleConcluirLeitura = (id: string) => {
    const updated = leituras.map((item) => item.id === id ? { ...item, status: "Concluído" as const } : item);
    setLeituras(updated);
    localStorage.setItem("techblog_leituras", JSON.stringify(updated));
  };

  const executeDelete = async () => {
    if (!articleToDelete) return;
    try {
      await api.delete(`/article/${articleToDelete}`);
    } catch (e) {
      console.log("Deletado do Front localmente.");
    } finally {
      const novosArtigos = artigos.filter((a) => a.id !== articleToDelete);
      setArtigos(novosArtigos);
      calcularMetricas(novosArtigos);
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
    }
  };

  if (loading || fetching) return <div className="w-full min-h-screen bg-[#0B0E13] text-zinc-400 text-center pt-24 animate-pulse">Carregando painel...</div>;

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white antialiased font-sans select-none relative">
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#14181F] border border-zinc-800 p-6 rounded-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-bold text-white mb-2">Excluir Artigo?</h3>
            <p className="text-xs text-zinc-400 mb-6">Esta ação é permanente.</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer">Cancelar</button>
              <button onClick={executeDelete} className="flex-1 px-4 py-2.5 bg-red-500 rounded-lg text-xs font-bold cursor-pointer">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-[1440px] mx-auto px-10 py-12 flex flex-col gap-8">
        <div className="w-full flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-xs text-zinc-500 mt-1">Bem-vindo, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/criar-artigo")} className="px-4 py-2.5 bg-cyan-400 text-zinc-950 rounded-lg text-xs font-bold cursor-pointer">Novo Artigo</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28">
            <span className="text-zinc-500 font-bold text-[11px]">Total de Artigos</span>
            <span className="text-3xl font-bold">{metrics.totalArtigos}</span>
          </div>
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28">
            <span className="text-zinc-500 font-bold text-[11px]">Engajamento</span>
            <span className="text-3xl font-bold">{metrics.engajamento}</span>
          </div>
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28">
            <span className="text-zinc-500 font-bold text-[11px]">Curtidas</span>
            <span className="text-3xl font-bold">{metrics.curtidas}</span>
          </div>
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28">
            <span className="text-zinc-500 font-bold text-[11px]">Tempo de Leitura</span>
            <span className="text-3xl font-bold">{metrics.tempoLeitura}</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-6 w-full">
            {/* SESSÃO DOS MEUS ARTIGOS */}
            <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
              <h2 className="text-sm font-bold text-white tracking-wide">Meus Artigos</h2>
              <div className="flex flex-col gap-4">
                {artigos.map((artigo) => (
                  <div key={artigo.id} className="border border-zinc-900/60 bg-[#0B0E13]/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <Link href={`/artigos/${artigo.slug}`} className="flex items-center gap-4 flex-1">
                      <div className="w-24 h-16 rounded overflow-hidden shrink-0"><img src={artigo.banner || ""} className="w-full h-full object-cover" /></div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xs font-bold text-white"><SavedIcon articleId={artigo.id} userId={user?.id} /> {artigo.title}</h3>
                        <p className="text-[11px] text-zinc-500 line-clamp-1">{artigo.excerpt}</p>
                      </div>
                    </Link>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => router.push(`/editar-artigo/${artigo.id}`)} className="px-2.5 py-1.5 border border-zinc-800 text-[11px] font-semibold rounded cursor-pointer hover:bg-zinc-800">Editar</button>
                      <button onClick={() => { setArticleToDelete(artigo.id); setIsDeleteModalOpen(true); }} className="px-2.5 py-1.5 border border-red-950/20 text-red-400 text-[11px] font-semibold rounded cursor-pointer hover:bg-red-950/40">Excluir</button>
                    </div>
                  </div>
                ))}
                {artigos.length === 0 && <div className="text-center text-xs text-zinc-500 py-8 border border-dashed border-zinc-800/80 rounded-lg">Você ainda não tem artigos publicados.</div>}
              </div>
            </div>

            {/* SESSÃO DOS ARTIGOS SALVOS */}
            <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
              <h2 className="text-sm font-bold text-white tracking-wide">Artigos Salvos</h2>
              <div className="flex flex-col gap-4">
                {savedArticles.map((artigo) => (
                  <Link href={`/artigos/${artigo.slug}`} key={`saved-${artigo.id}`} className="border border-zinc-900/60 bg-[#0B0E13]/30 hover:border-zinc-700 transition-colors rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-24 h-16 rounded overflow-hidden shrink-0"><img src={artigo.banner || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors"><SavedIcon articleId={artigo.id} userId={user?.id} /> {artigo.title}</h3>
                        <p className="text-[11px] text-zinc-500 line-clamp-1">{artigo.excerpt}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded">Ir para o artigo &rarr;</span>
                  </Link>
                ))}
                {savedArticles.length === 0 && <div className="text-center text-xs text-zinc-500 py-8 border border-dashed border-zinc-800/80 rounded-lg">Você não favoritou nenhum artigo ainda. Explore a plataforma!</div>}
              </div>
            </div>
          </div>

          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-white tracking-wide">Leituras Recentes</h2>
            <div className="flex flex-col gap-4">
              {leituras.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-zinc-900/80 last:border-b-0">
                  <img src={item.imageUrl || ""} className="w-12 h-12 rounded object-cover shrink-0" />
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-[11px] text-zinc-200 font-bold"><SavedIcon articleId={item.id} userId={user?.id} /> {item.title}</p>
                    <span className={`text-[9px] font-black uppercase tracking-wider self-start px-1.5 py-0.5 rounded ${item.status === "Em andamento" ? "bg-amber-500/10 text-amber-400" : "bg-teal-500/10 text-teal-400"}`}>
                      {item.status}
                    </span>
                    {item.status === "Em andamento" && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => router.push(item.url)} className="flex-1 bg-zinc-800 text-[10px] font-bold py-1 rounded cursor-pointer">Ler</button>
                        <button onClick={() => handleConcluirLeitura(item.id)} className="flex-1 bg-cyan-400/10 text-cyan-400 text-[10px] font-bold py-1 rounded cursor-pointer">Concluir</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {leituras.length === 0 && <div className="text-center text-xs text-zinc-500 py-8">Nenhum histórico de leitura.</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}