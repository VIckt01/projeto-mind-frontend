"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";

interface Comentario {
  id: number;
  author: string;
  date: string;
  content: string;
  avatarInitials: string;
  likes: number;
  userLiked?: boolean;
  replies?: Comentario[];
}

interface ArtigoDetalhe {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar: string | null;
  views: number;
  likes: number;
  commentsCount: number;
  tags: string[];
  banner: string | null;
}
const FALLBACK_MOCKS = [
  {
    id: "mock-1",
    title: "Construindo Aplicações Ultrarápidas com Next.js e React Server Components",
    slug: "construindo-aplicacoes-ultrarapidas-com-nextjs",
    content: "Descubra como otimizar o tempo de carregamento e a experiência do usuário utilizando as novas arquiteturas de renderização do ecossistema React. \n\n## Server Components\nEles permitem renderizar componentes no servidor, reduzindo o bundle JavaScript enviado ao cliente.",
    excerpt: "Descubra como otimizar o tempo de carregamento e a experiência do usuário...",
    createdAt: "2026-05-14T10:00:00.000Z",
    author: { name: "Guilherme Santos", profileImg: "" },
    category: "Desenvolvimento web",
    banner: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    views: 12400,
    likes: 182,
    tags: '["Next.js", "React", "Performance"]'
  },
  {
    id: "mock-2",
    title: "O Guia Definitivo de Inteligência Artificial para Desenvolvedores Web",
    slug: "o-guia-definitivo-de-inteligencia-artificial",
    content: "A IA não vai substituir você, mas quem usa IA vai. Saiba como integrar modelos de linguagem diretamente na sua interface de forma prática e escalável.\n\n## Integração com APIs\nUtilizar APIs da OpenAI ou Anthropic ficou mais fácil do que nunca.",
    excerpt: "A IA não vai substituir você, mas quem usa IA vai.",
    createdAt: "2026-05-10T10:00:00.000Z",
    author: { name: "Beatriz Ribeiro", profileImg: "" },
    category: "Inteligência Artificial",
    banner: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
    views: 8100,
    likes: 94,
    tags: '["IA", "Web", "Inovação"]'
  },
  {
    id: "mock-3",
    title: "Transição de Carreira para DevOps: Por Onde Começar em 2026?",
    slug: "transicao-de-carreira-para-devops-por-onde-comecar",
    content: "Se você quer dominar pipelines de CI/CD, Docker, Kubernetes e infraestrutura como código, este roteiro prático vai acelerar sua jornada.\n\n## O que estudar?\nComece por Linux, Redes e Git. Depois avance para Docker e CI/CD.",
    excerpt: "Se você quer dominar pipelines de CI/CD e infraestrutura como código...",
    createdAt: "2026-05-04T10:00:00.000Z",
    author: { name: "Lucas Andrade", profileImg: "" },
    category: "DevOps",
    banner: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
    views: 15200,
    likes: 322,
    tags: '["DevOps", "Carreira", "Cloud"]'
  },
  {
    id: "mock-4",
    title: "Python para Automação: Economize Horas de Trabalho Manual",
    slug: "python-para-automacao",
    content: "Aprenda a criar scripts simples em Python para ler planilhas, enviar emails e organizar arquivos.\n\n## Bibliotecas Essenciais\nPandas para dados, OS para arquivos e SMTPlib para emails.",
    excerpt: "Aprenda a criar scripts simples em Python...",
    createdAt: "2026-05-01T10:00:00.000Z",
    author: { name: "Fernanda Costa", profileImg: "" },
    category: "Desenvolvimento web",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    views: 5400,
    likes: 120,
    tags: '["Python", "Automação", "Produtividade"]'
  }
];

export default function DetalheArtigoPage() {
  const { id } = useParams(); 
  const { user, loading: authLoading } = useAuth();

  const [artigo, setArtigo] = useState<ArtigoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [articleLiked, setArticleLiked] = useState(false);
  const [articleSaved, setArticleSaved] = useState(false);

  const [comments, setComments] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // 1. CARREGAR ARTIGO E DADOS SALVOS NO LOCALSTORAGE
  useEffect(() => {
    async function carregarArtigo() {
      if (!id) return;
      let data = null;

      // Garante a decodificação da URL caso venha com %20 ou similares
      const decodedSlug = typeof id === "string" ? decodeURIComponent(id) : decodeURIComponent(String(id));

      try {
        const response = await api.get(`/article/slug/${decodedSlug}`);
        data = response.data.article || response.data;
        if (!data || !data.id) throw new Error("Artigo inválido");
      } catch (err) {
        // FALLBACK INTELIGENTE: Pega dos mocks garantidos
        const fakeArticle = FALLBACK_MOCKS.find(a => a.slug === decodedSlug);
        if (fakeArticle) {
            data = fakeArticle;
        } else {
            setLoading(false);
            return;
        }
      }

      const qtdPalavras = data.content ? data.content.split(/\s+/).length : 0;
      const tempoCalculado = Math.ceil(qtdPalavras / 200) || 1;

      // Recupera Comentários Salvos do LocalStorage para ESTE artigo (persiste após F5)
      const savedComments = localStorage.getItem(`techblog_comments_${data.id}`);
      const parsedComments = savedComments ? JSON.parse(savedComments) : [];

      setArtigo({
        id: data.id,
        title: data.title,
        subtitle: data.excerpt || "",
        content: data.content || "",
        category: data.category || "Desenvolvimento web",
        date: data.createdAt ? new Date(data.createdAt).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
        readTime: `${tempoCalculado} min`,
        author: data.author?.name || data.author || "Autor Desconhecido",
        authorAvatar: data.author?.profileImg || null,
        views: data.views || 0,
        likes: data.likes || 0,
        commentsCount: parsedComments.length, 
        tags: data.tags ? (typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags) : ["Tecnologia"], 
        banner: data.banner || data.imageUrl || null,
      });

      // Injecção inicial de comentários se estiver vazio (Para estética da Demo)
      if (parsedComments.length === 0 && data.id.toString().includes("mock")) {
          const defaultDemoComments = [
            {
              id: 1, author: "Guilherme Santos", avatarInitials: "GS", date: "20/05/2026",
              content: "Excelente conteúdo! Estava precisando exatamente dessa explicação para estruturar meu projeto.",
              likes: 12, replies: [{ id: 101, author: "Maria Oliveira", avatarInitials: "MO", date: "21/05/2026", content: "Concordo! Ajudou muito a clarificar a arquitetura.", likes: 3, replies: [] }]
            }
          ];
          setComments(defaultDemoComments);
      } else {
          setComments(parsedComments);
      }

      // Recupera Curtida e Save específicos Deste Usuário para Este Artigo
      if (user) {
        setArticleLiked(localStorage.getItem(`techblog_like_${user.id}_${data.id}`) === "true");
        setArticleSaved(localStorage.getItem(`techblog_save_${user.id}_${data.id}`) === "true");
      }

      setLoading(false);
    }
    
    carregarArtigo();
  }, [id, user]);

  // 2. SALVAR COMENTÁRIOS NO LOCALSTORAGE SEMPRE QUE ALTERAR
  useEffect(() => {
    if (artigo && comments.length > 0) {
      localStorage.setItem(`techblog_comments_${artigo.id}`, JSON.stringify(comments));
      setArtigo(prev => prev ? { ...prev, commentsCount: comments.reduce((acc, curr) => acc + 1 + (curr.replies?.length || 0), 0) } : null);
    }
  }, [comments, artigo?.id]);

  const handleLikeArticle = () => {
    if (!user || !artigo) return alert("Faça login para curtir.");
    const novoStatus = !articleLiked;
    setArticleLiked(novoStatus);
    setArtigo(prev => prev ? { ...prev, likes: prev.likes + (novoStatus ? 1 : -1) } : null);
    localStorage.setItem(`techblog_like_${user.id}_${artigo.id}`, novoStatus.toString());
  };

  const handleSaveArticle = () => {
    if (!user || !artigo) return alert("Faça login para salvar.");
    const novoStatus = !articleSaved;
    setArticleSaved(novoStatus);
    localStorage.setItem(`techblog_save_${user.id}_${artigo.id}`, novoStatus.toString());
  };

  const getInitials = (name: string) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const handleEnviarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const novo: Comentario = {
      id: Date.now(),
      author: user.name,
      avatarInitials: getInitials(user.name),
      date: new Date().toLocaleDateString("pt-BR"),
      content: newComment,
      likes: 0,
      replies: []
    };

    setComments([novo, ...comments]);
    setNewComment("");
  };

  const handleEnviarResposta = (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;

    const novaResposta: Comentario = {
      id: Date.now(),
      author: user.name,
      avatarInitials: getInitials(user.name),
      date: new Date().toLocaleDateString("pt-BR"),
      content: replyContent,
      likes: 0,
    };

    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, replies: [...(c.replies || []), novaResposta] } : c
    ));
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleLikeComment = (commentId: number, isReply: boolean = false, parentId?: number) => {
    if (!user) return alert("Faça login para interagir.");
    setComments(prev => prev.map(c => {
      if (!isReply && c.id === commentId) {
        return { ...c, userLiked: !c.userLiked, likes: c.likes + (c.userLiked ? -1 : 1) };
      }
      if (isReply && c.id === parentId) {
        return {
          ...c,
          replies: c.replies?.map(r => r.id === commentId ? { ...r, userLiked: !r.userLiked, likes: r.likes + (r.userLiked ? -1 : 1) } : r)
        };
      }
      return c;
    }));
  };

  if (loading || authLoading) return <div className="min-h-screen bg-[#070a13] text-center pt-24 text-zinc-500 font-mono text-xs animate-pulse">Carregando artigo...</div>;
  
  if (!artigo) {
      return (
        <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold text-white mb-2">Artigo não encontrado</h1>
            <p className="text-xs text-zinc-500 mb-6">O link pode estar quebrado ou o artigo foi removido pelo autor.</p>
            <Link href="/artigos" className="bg-cyan-400 hover:bg-cyan-300 text-zinc-950 px-6 py-2 rounded-md text-xs font-bold transition-colors">
                Voltar aos Artigos
            </Link>
        </div>
      );
  }

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center">
      <div className="w-full max-w-3xl px-6 py-12 flex flex-col">
        <Link href="/artigos" className="text-xs text-zinc-500 hover:text-cyan-400 flex items-center gap-1.5 mb-8 transition-colors w-max group">
          <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span> Voltar aos Artigos
        </Link>

        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-max mb-4">
          {artigo.category}
        </span>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">{artigo.title}</h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-2 leading-relaxed">{artigo.subtitle}</p>

        <div className="w-full flex items-center justify-between border-b border-zinc-900 pb-4 mt-6">
          <div className="flex items-center gap-3">
            {artigo.authorAvatar ? (
              <img src={artigo.authorAvatar} alt={artigo.author} className="w-9 h-9 rounded-full object-cover border border-zinc-800" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#14181F] border border-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">
                {getInitials(artigo.author)}
              </div>
            )}
            <div className="flex flex-col text-[11px]">
              <span className="font-bold text-zinc-200">{artigo.author}</span>
              <span className="text-zinc-500">{artigo.date} • ⏱️ {artigo.readTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={handleLikeArticle} className={`transition-colors cursor-pointer flex items-center gap-1.5 ${articleLiked ? 'text-red-400' : 'text-zinc-500 hover:text-white'}`} title="Curtir Artigo">
              <svg xmlns="http://www.w3.org/2000/svg" fill={articleLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
            </button>
            <button onClick={handleSaveArticle} className={`transition-colors cursor-pointer flex items-center gap-1.5 ${articleSaved ? 'text-cyan-400' : 'text-zinc-500 hover:text-white'}`} title="Salvar Artigo">
              <svg xmlns="http://www.w3.org/2000/svg" fill={articleSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono mt-3.5 tracking-wide">
          <span>❤️ {artigo.likes} curtidas</span>
          <span>•</span>
          <span>👁️ {artigo.views} visualizações</span>
          <span>•</span>
          <span>💬 {artigo.commentsCount} comentários</span>
        </div>

        <div className="w-full h-64 md:h-80 bg-zinc-900 relative flex items-center justify-center overflow-hidden rounded-xl my-8 select-none border border-zinc-900/50">
          <img src={artigo.banner || "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80"} alt={artigo.title} className="w-full h-full object-cover filter brightness-90" />
        </div>

        <div className="text-zinc-300 text-xs md:text-sm leading-relaxed space-y-5 whitespace-pre-line text-justify">
          {artigo.content.split("\n").map((paragraph, idx) => {
            if (paragraph.trim().startsWith("##")) return <h2 key={idx} className="text-sm font-bold text-white pt-4 tracking-tight block">{paragraph.replace("##", "").trim()}</h2>;
            return <p key={idx}>{paragraph.trim()}</p>;
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-8 mb-12 pt-4 border-t border-zinc-900">
          {artigo.tags.map(tag => (
            <span key={tag} className="bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-[10px] px-2.5 py-0.5 rounded-md font-medium">{tag}</span>
          ))}
        </div>

        <section className="w-full border-t border-zinc-900 pt-6 mt-10">
          <h2 className="text-xs font-bold text-white mb-5 tracking-wide">Comentários ({artigo.commentsCount})</h2>

          {!user ? (
            <div className="w-full bg-[#0d111e]/40 border border-zinc-900 rounded-xl p-6 text-center mb-8">
              <p className="text-[11px] text-zinc-500 mb-3">Faça login para interagir e comentar</p>
              <Link href="/login" className="inline-block bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold px-5 py-1.5 rounded-md text-[11px] transition-colors shadow-md">
                Fazer login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleEnviarComentario} className="w-full bg-[#0d111e]/40 border border-zinc-900 rounded-xl p-4 mb-8 focus-within:border-cyan-500/30 transition-all duration-300">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} required placeholder="Partilhe a sua opinião sobre o assunto..." className="w-full bg-transparent text-xs md:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed" />
              <div className="flex justify-end mt-2 pt-2 border-t border-zinc-900/60">
                <button type="submit" className="bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold px-4 py-1.5 rounded-md text-xs transition-colors cursor-pointer active:scale-95 shadow-md shadow-cyan-400/5">Comentar</button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-5 w-full">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-3">
                <div className="bg-[#0d111e]/20 border border-zinc-900/60 rounded-xl p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#14181F] rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-zinc-800">
                        {comment.avatarInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-200">{comment.author}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{comment.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed text-justify">{comment.content}</p>
                  
                  <div className="flex items-center gap-4 mt-1 border-t border-zinc-900/40 pt-2">
                    <button onClick={() => handleLikeComment(comment.id)} className={`flex items-center gap-1.5 text-[10px] transition-colors cursor-pointer font-bold ${comment.userLiked ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      <span>❤️</span> {comment.likes}
                    </button>
                    {user && (
                      <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-[10px] text-zinc-500 hover:text-cyan-400 font-bold uppercase tracking-wider cursor-pointer">
                        Responder
                      </button>
                    )}
                  </div>
                </div>

                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleEnviarResposta(e, comment.id)} className="ml-8 bg-[#0B0E13] border border-cyan-900/30 rounded-lg p-3 flex flex-col gap-2">
                    <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} required rows={2} placeholder={`Respondendo a ${comment.author}...`} className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none" />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setReplyingTo(null)} className="text-[10px] text-zinc-500 px-2 cursor-pointer">Cancelar</button>
                      <button type="submit" className="bg-cyan-500/10 text-cyan-400 px-3 py-1 text-[10px] font-bold rounded cursor-pointer hover:bg-cyan-500/20 transition-colors">Enviar Resposta</button>
                    </div>
                  </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="flex flex-col gap-3 ml-8 border-l border-zinc-900 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-[#0B0E13] border border-zinc-900/40 rounded-lg p-3 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center text-[9px] font-bold text-zinc-500 border border-zinc-800">
                            {reply.avatarInitials}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-zinc-300">{reply.author}</span>
                            <span className="text-[8px] text-zinc-600 font-mono">{reply.date}</span>
                          </div>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">{reply.content}</p>
                        <div className="flex items-center gap-4 mt-1 border-t border-zinc-900/30 pt-1.5">
                          <button onClick={() => handleLikeComment(reply.id, true, comment.id)} className={`flex items-center gap-1 text-[10px] transition-colors cursor-pointer font-bold ${reply.userLiked ? 'text-red-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
                            <span>❤️</span> {reply.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}