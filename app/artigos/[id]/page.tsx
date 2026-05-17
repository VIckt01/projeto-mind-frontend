"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../services/api";
import { MOCK_ARTICLES } from "../../page";

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
  slug: string;
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

  useEffect(() => {
    async function carregarArtigo() {
      if (!id) return;
      let data = null;
      const decodedSlug = typeof id === "string" ? decodeURIComponent(id) : decodeURIComponent(String(id));

      try {
        const response = await api.get(`/article/slug/${decodedSlug}`);
        data = response.data.article || response.data;
        if (!data || !data.id) throw new Error("Artigo inválido");
      } catch (err) {
        const fakeArticle = MOCK_ARTICLES.find(a => a.slug === decodedSlug);
        if (fakeArticle) {
            data = fakeArticle;
        } else {
            setLoading(false);
            return;
        }
      }

      const qtdPalavras = data.content ? data.content.split(/\s+/).length : 0;
      
      const savedComments = localStorage.getItem(`techblog_comments_${data.id}`);
      const parsedComments = savedComments ? JSON.parse(savedComments) : [];

      setArtigo({
        id: String(data.id),
        title: data.title,
        slug: data.slug || decodedSlug,
        subtitle: data.excerpt || "",
        content: data.content || "",
        category: data.category || "Desenvolvimento web",
        date: data.createdAt ? new Date(data.createdAt).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
        readTime: `${Math.ceil(qtdPalavras / 200) || 1} min`,
        author: data.author?.name || data.author || "Autor Desconhecido",
        authorAvatar: data.author?.profileImg || null,
        views: data.views || 0,
        likes: data.likes || 0,
        commentsCount: parsedComments.length, 
        tags: data.tags ? (typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags) : ["Tecnologia"], 
        banner: data.banner || data.imageUrl || null,
      });

      if (parsedComments.length === 0 && String(data.id).includes("mock")) {
          const defaultDemo = [{ id: 1, author: "Guilherme Santos", avatarInitials: "GS", date: "20/05/2026", content: "Excelente conteúdo!", likes: 12, replies: [] }];
          setComments(defaultDemo);
      } else {
          setComments(parsedComments);
      }

      if (user) {
        setArticleLiked(localStorage.getItem(`techblog_like_${user.id}_${data.id}`) === "true");
        setArticleSaved(localStorage.getItem(`techblog_save_${user.id}_${data.id}`) === "true");
      }

      const savedLeituras = localStorage.getItem("techblog_leituras");
      let leiturasArray = savedLeituras ? JSON.parse(savedLeituras) : [];
     leiturasArray = leiturasArray.filter((l: any) => String(l.id) !== String(data.id));
      
      leiturasArray.unshift({
        id: String(data.id),
        title: data.title,
        status: "Em andamento",
        imageUrl: data.banner || data.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
        url: `/artigos/${data.slug || decodedSlug}`
      });

      // Mantem apenas os 4 mais recentes no histórico
      localStorage.setItem("techblog_leituras", JSON.stringify(leiturasArray.slice(0, 4)));
     
      setLoading(false);
    }
    carregarArtigo();
  }, [id, user]);

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
    setComments([{ id: Date.now(), author: user.name, avatarInitials: getInitials(user.name), date: new Date().toLocaleDateString("pt-BR"), content: newComment, likes: 0, replies: [] }, ...comments]);
    setNewComment("");
  };

  const handleEnviarResposta = (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, replies: [...(c.replies || []), { id: Date.now(), author: user.name, avatarInitials: getInitials(user.name), date: new Date().toLocaleDateString("pt-BR"), content: replyContent, likes: 0 }] } : c));
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleLikeComment = (commentId: number, isReply: boolean = false, parentId?: number) => {
    if (!user) return alert("Faça login para interagir.");
    setComments(prev => prev.map(c => {
      if (!isReply && c.id === commentId) return { ...c, userLiked: !c.userLiked, likes: c.likes + (c.userLiked ? -1 : 1) };
      if (isReply && c.id === parentId) return { ...c, replies: c.replies?.map(r => r.id === commentId ? { ...r, userLiked: !r.userLiked, likes: r.likes + (r.userLiked ? -1 : 1) } : r) };
      return c;
    }));
  };

  if (loading || authLoading) return <div className="min-h-screen bg-[#070a13] text-center pt-24 text-zinc-500 font-mono text-xs animate-pulse">Carregando artigo...</div>;
  if (!artigo) return <div className="min-h-screen bg-[#070a13] text-center pt-24 text-zinc-500 font-mono text-xs">Artigo não encontrado.</div>;

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center">
      <div className="w-full max-w-3xl px-6 py-12 flex flex-col">
        <Link href="/artigos" className="text-xs text-zinc-500 hover:text-cyan-400 mb-8 inline-block">&larr; Voltar aos Artigos</Link>

        <h1 className="text-3xl font-extrabold text-white">{artigo.title}</h1>
        <p className="text-zinc-400 text-sm mt-2">{artigo.subtitle}</p>

        <div className="w-full flex items-center justify-between border-b border-zinc-900 pb-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#14181F] flex items-center justify-center font-bold text-xs">{getInitials(artigo.author)}</div>
            <div className="flex flex-col text-[11px]"><span className="font-bold">{artigo.author}</span><span className="text-zinc-500">{artigo.date} • {artigo.readTime}</span></div>
          </div>
          
          <div className="flex gap-4">
            {/* Ícone de Curtir */}
            <button onClick={handleLikeArticle} className={`cursor-pointer transition-transform active:scale-90 ${articleLiked ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`} title="Curtir Artigo">
              {articleLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
              )}
            </button>
            
            {/* Ícone de Salvar (Estilo Instagram) */}
            <button onClick={handleSaveArticle} className={`cursor-pointer transition-transform active:scale-90 ${articleSaved ? 'text-cyan-400' : 'text-zinc-500 hover:text-white'}`} title="Salvar Artigo">
              {articleSaved ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M6.32 2.577a4.901 4.901 0 0 1 5.68-.89l.328.168.327-.168a4.901 4.901 0 0 1 5.68.89c.642.642 1.053 1.503 1.168 2.457L19.5 21l-7.5-4.5L4.5 21l-.003-15.966a3.523 3.523 0 0 1 1.168-2.457Z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="w-full h-80 bg-zinc-900 relative my-8 overflow-hidden rounded-xl border border-zinc-900/50">
          <img src={artigo.banner || ""} className="w-full h-full object-cover filter brightness-90" />
        </div>

        <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line text-justify">{artigo.content}</div>

        <section className="border-t border-zinc-900 pt-6 mt-10">
          <h2 className="text-xs font-bold text-white mb-5">Comentários ({artigo.commentsCount})</h2>
          
          {user ? (
            <form onSubmit={handleEnviarComentario} className="bg-[#0d111e]/40 border border-zinc-900 rounded-xl p-4 mb-8">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} required placeholder="Partilhe a sua opinião..." className="w-full bg-transparent text-sm text-zinc-200 outline-none resize-none" />
              <div className="flex justify-end mt-2"><button type="submit" className="bg-cyan-400 text-zinc-950 font-bold px-4 py-1.5 rounded-md text-xs cursor-pointer">Comentar</button></div>
            </form>
          ) : (
            <div className="text-center p-6 border border-zinc-900 rounded-xl mb-8">Faça <Link href="/login" className="text-cyan-400 underline">login</Link> para comentar</div>
          )}

          <div className="flex flex-col gap-5">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-3">
                <div className="bg-[#0d111e]/20 border border-zinc-900/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-[#14181F] rounded-full flex items-center justify-center text-[10px] font-bold">{comment.avatarInitials}</div>
                    <span className="text-xs font-bold">{comment.author}</span>
                  </div>
                  <p className="text-zinc-300 text-xs">{comment.content}</p>
                  <div className="flex gap-4 mt-2">
                    <button onClick={() => handleLikeComment(comment.id)} className={`text-[10px] cursor-pointer ${comment.userLiked ? 'text-red-400' : 'text-zinc-500'}`}>❤️ {comment.likes}</button>
                    {user && <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-[10px] text-zinc-500 hover:text-cyan-400 cursor-pointer">Responder</button>}
                  </div>
                </div>

                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleEnviarResposta(e, comment.id)} className="ml-8 bg-[#0B0E13] border border-cyan-900/30 rounded-lg p-3">
                    <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} required rows={2} placeholder="Respondendo..." className="w-full bg-transparent text-xs text-zinc-200 outline-none" />
                    <button type="submit" className="bg-cyan-500/10 text-cyan-400 px-3 py-1 text-[10px] rounded mt-2 cursor-pointer">Enviar</button>
                  </form>
                )}

                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="ml-8 bg-[#0B0E13] border border-zinc-900/40 rounded-lg p-3">
                    <span className="text-[11px] font-bold block mb-1">{reply.author}</span>
                    <p className="text-zinc-400 text-[11px]">{reply.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}