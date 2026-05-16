"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

interface Artigo {
  id: number;
  title: string;
  excerpt?: string;
  createdAt: string;
  views?: number;
  likes?: number;
  imageUrl: string;
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

  // Estado para gerenciar a lista de leituras recentes de forma interativa
  const [leituras, setLeituras] = useState<LeituraRecente[]>([
    {
      id: 1,
      title: "Python para Automação: Economize Horas de Trabalho Manual",
      status: "Em andamento",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80",
      url: "/artigos/python-automacao"
    },
    {
      id: 2,
      title: "A Evolução da Inteligência Artificial nos Video Games Modernos",
      status: "Em andamento",
      imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=120&auto=format&fit=crop&q=80",
      url: "/artigos/ia-video-games"
    }
  ]);

  // Estados dos cards de engajamento do Figma
  const [metrics, setMetrics] = useState({
    totalArtigos: 0,
    engajamento: 4,
    curtidas: 20,
    tempoLeitura: "8 min",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const fetchMeusArtigos = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:5000/articles/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setArtigos(data);
          setMetrics((prev) => ({ ...prev, totalArtigos: data.length }));
        } else {
          const mockData: Artigo[] = [
            { 
              id: 1, 
              title: "Desvendando o Aprendizado de Máquina: Do Conceito à Prática", 
              excerpt: "Entenda como os algoritmos de Machine Learning aprendem com dados e transformam indústrias inteiras.", 
              createdAt: "16/05/2026", 
              views: 142, 
              likes: 48,
              imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80"
            },
            { 
              id: 2, 
              title: "Construindo APIs Robustas e Escaláveis com Node.js e Express", 
              excerpt: "As melhores práticas de mercado para arquitetar rotas, middlewares de proteção e conexões limpas.", 
              createdAt: "14/05/2026", 
              views: 98, 
              likes: 32,
              imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80"
            },
            { 
              id: 3, 
              title: "A Evolução da Inteligência Artificial nos Video Games Modernos", 
              excerpt: "Como os comportamentos dos NPCs e a geração de mundos procedurais elevaram o nível dos jogos atuais.", 
              createdAt: "10/05/2026", 
              views: 210, 
              likes: 85,
              imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80"
            },
            { 
              id: 4, 
              title: "Python para Automação: Economize Horas de Trabalho Manual", 
              excerpt: "Aprenda a criar scripts simples em Python para ler planilhas, enviar emails e organizar arquivos.", 
              createdAt: "05/05/2026", 
              views: 175, 
              likes: 64,
              imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80"
            },
          ];
          setArtigos(mockData);
          setMetrics((prev) => ({ ...prev, totalArtigos: mockData.length }));
        }
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

  // Função para alternar o status do artigo lido para Concluído
  const handleConcluirLeitura = (id: number) => {
    setLeituras((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Concluído" } : item
      )
    );
  };

  // Função reativa para deletar o artigo no Banco e atualizar o estado do Frontend
  const handleDeletarArtigo = async (id: number) => {
    const confirmar = confirm("Tem certeza que deseja excluir este artigo permanentemente?");
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:5000/articles/${id}`, {
        method: "DELETE",
      });

      setArtigos((prev) => prev.filter((artigo) => artigo.id !== id));
      setMetrics((prev) => ({ ...prev, totalArtigos: Math.max(0, prev.totalArtigos - 1) }));
    } catch (err) {
      console.error("Erro ao deletar artigo", err);
    }
  };

  if (loading || fetching) {
    return (
      <div className="w-full min-h-screen bg-[#0B0E13] flex items-center justify-center text-zinc-400 text-xs uppercase tracking-widest animate-pulse">
        Carregando painel...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white antialiased font-sans select-none">
      
      <main className="w-full max-w-[1440px] mx-auto px-10 py-12 flex flex-col gap-8">
        
        {/* HEADER DO DASHBOARD */}
        <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-xs text-zinc-500 mt-1">Bem-vindo de volta, {user?.name}!</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/configuracoes")}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 hover:text-white text-zinc-400 hover:bg-zinc-800/60 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.307.235-.45.645-.366 1.022.012.052.022.105.03.158.042.27.017.546-.073.805l-.012.034c-.112.319-.077.674.12.96l.732.1.66 1.144a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.307.235-.45.645-.366 1.022.012.052.022.105.03.158.042.27.017.546-.073.805l-.012.034c-.112.319-.077.674.12.96l.732.1.213 1.281c.09.543-.38 1.11-.94 1.11H13.3c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.767c.306-.235.45-.645.365-1.022a5.59 5.59 0 0 1-.03-.158c-.042-.27-.017-.546.074-.805l.012-.034c.112-.319.077-.674-.12-.96l-.732-.1c-.542-.09-.94-.56-.94-1.11V7.277c0-.55.398-1.02.94-1.11l1.281-.213c.374-.062.686-.312.87-.644.04-.074.083-.147.127-.22.196-.325.257-.72.124-1.076l-.456-1.217a1.125 1.125 0 0 1 .49-1.369l2.247-1.297ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
              </svg>
              Configurações
            </button>
            <button
              onClick={() => router.push("/criar-artigo")}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-cyan-400/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Novo Artigo
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wide">Total de Artigos</span>
            <span className="text-3xl font-bold text-white tracking-tight">{metrics.totalArtigos}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-700 absolute right-5 bottom-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>

          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wide">Engajamento</span>
            <span className="text-3xl font-bold text-white tracking-tight">{metrics.engajamento}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-700 absolute right-5 bottom-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641l-.318 1.235c-.083.323.218.614.528.5l1.417-.523a2.43 2.43 0 0 1 1.909.116A8.897 8.897 0 0 0 12 20.25Z" />
            </svg>
          </div>

          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wide">Curtidas</span>
            <span className="text-3xl font-bold text-white tracking-tight">{metrics.curtidas}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-700 absolute right-5 bottom-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>

          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wide">Tempo médio de leitura</span>
            <span className="text-3xl font-bold text-white tracking-tight">{metrics.tempoLeitura}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-700 absolute right-5 bottom-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
          </div>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* COLUNA ESQUERDA: LISTA MEUS ARTIGOS */}
          <div className="lg:col-span-2 bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-white tracking-wide">Meus Artigos</h2>
            
            <div className="flex flex-col gap-4">
              {artigos.map((artigo) => (
                <div 
                  key={artigo.id} 
                  className="w-full border border-zinc-900/60 bg-[#0B0E13]/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:border-zinc-700/80 hover:bg-[#181d26]/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/[0.02] group"
                >
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <div className="w-24 h-16 rounded overflow-hidden border border-zinc-800/80 shrink-0 relative bg-zinc-950">
                      <img 
                        src={artigo.imageUrl} 
                        alt={artigo.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <h3 className="text-xs font-bold text-white truncate w-full group-hover:text-cyan-400 transition-colors duration-200 cursor-pointer">
                        {artigo.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 truncate w-full group-hover:text-zinc-400 transition-colors duration-200">
                        {artigo.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-medium mt-1">
                        <span className="group-hover:text-zinc-500 transition-colors">{artigo.createdAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 group-hover:text-zinc-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-zinc-700 group-hover:text-zinc-600 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641l-.318 1.235c-.083.323.218.614.528.5l1.417-.523a2.43 2.43 0 0 1 1.909.116A8.897 8.897 0 0 0 12 20.25Z" />
                          </svg>
                          {artigo.views}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 group-hover:text-zinc-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-zinc-700 group-hover:text-red-500/60 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                          </svg>
                          {artigo.likes}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-zinc-900 pt-3 sm:pt-0">
                    <button 
                      onClick={() => router.push(`/editar-artigo/${artigo.id}`)}
                      className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 font-semibold rounded hover:text-white hover:bg-zinc-800/20 transition-all cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-zinc-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeletarArtigo(artigo.id)}
                      className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-red-950/20 bg-red-500/5 hover:bg-red-500/10 text-[11px] text-red-400 font-semibold rounded transition-all cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-red-500/70">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6.14m-4.74 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUNA DIREITA: LEITURA RECENTE COM BOTÕES DE AÇÃO INTERATIVOS */}
          <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-white tracking-wide">Leitura Recente</h2>
            
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
                      
                      {/* Badge dinâmico de status */}
                      <span className={`text-[9px] font-black uppercase tracking-wider self-start px-1.5 py-0.5 rounded ${
                        item.status === "Em andamento" 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                          : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Botões operacionais da leitura */}
                  {item.status === "Em andamento" && (
                    <div className="flex items-center gap-2 mt-1 w-full">
                      <button
                        onClick={() => router.push(item.url)}
                        className="flex-1 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer text-center"
                      >
                        Continuar lendo
                      </button>
                      <button
                        onClick={() => handleConcluirLeitura(item.id)}
                        className="flex-1 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-zinc-950 border border-cyan-400/20 hover:border-transparent text-[10px] font-black uppercase tracking-wider py-1.5 rounded transition-all cursor-pointer text-center"
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