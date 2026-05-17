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

export default function DetalheArtigoPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [artigo, setArtigo] = useState<ArtigoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const [comments, setComments] = useState<Comentario[]>([]);

  useEffect(() => {
    async function carregarArtigo() {
      if (!id) return;
      try {
        // Chamada real na rota do Slug que já incrementa o view automático no back-end
        const response = await api.get(`/article/slug/${id}`);
        const data = response.data;

        // Calcula o tempo médio de leitura (200 palavras por minuto) baseado no conteúdo real
        const qtdPalavras = data.content ? data.content.split(/\s+/).length : 0;
        const tempoCalculado = Math.ceil(qtdPalavras / 200);

        setArtigo({
          id: data.id,
          title: data.title,
          subtitle: data.excerpt || "",
          content: data.content || "",
          category: data.category || "Desenvolvimento web",
          date: new Date(data.createdAt).toLocaleDateString("pt-BR"),
          readTime: `${tempoCalculado} min`,
          author: data.author?.name || "Autor Desconhecido",
          authorAvatar: data.author?.profileImg || null,
          views: data.views,
          likes: data.likes,
          commentsCount: 0,
          tags: ["Tecnologia"],
          banner: data.banner || null,
        });
      } catch (err) {
        console.error("Artigo não encontrado", err);
      } finally {
        setLoading(false);
      }
    }
    carregarArtigo();
  }, [id]);

  const handleEnviarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const iniciais = user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

    const novoComentario: Comentario = {
      id: Date.now(),
      author: user.name,
      avatarInitials: iniciais,
      date: new Date().toLocaleDateString("pt-BR"),
      content: newComment,
      likes: 0,
    };

    setComments([novoComentario, ...comments]);
    setNewComment("");
  };

  if (loading || authLoading)
    return (
      <div className="min-h-screen bg-[#070a13] text-center pt-24 text-zinc-500 font-mono text-xs animate-pulse">
        Carregando artigo...
      </div>
    );
  if (!artigo)
    return (
      <div className="min-h-screen bg-[#070a13] text-center pt-24 text-zinc-500 font-mono text-xs">
        Artigo não encontrado ou link inválido.
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center">
      <div className="w-full max-w-3xl px-6 py-12 flex flex-col">
        <Link
          href="/artigos"
          className="text-xs text-zinc-500 hover:text-cyan-400 flex items-center gap-1.5 mb-8 transition-colors w-max group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">
            &larr;
          </span>{" "}
          Voltar aos Artigos
        </Link>

        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-max mb-4">
          {artigo.category}
        </span>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {artigo.title}
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-2 leading-relaxed">
          {artigo.subtitle}
        </p>

        <div className="w-full flex items-center justify-between border-b border-zinc-900 pb-4 mt-6">
          <div className="flex items-center gap-3">
            {artigo.authorAvatar ? (
              <img
                src={artigo.authorAvatar}
                alt={artigo.author}
                className="w-9 h-9 rounded-full object-cover border border-zinc-800"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#14181F] border border-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">
                {artigo.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="flex flex-col text-[11px]">
              <span className="font-bold text-zinc-200">{artigo.author}</span>
              <span className="text-zinc-500">
                {artigo.date} • ⏱️ {artigo.readTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-zinc-500 text-xs">
            <button
              className="hover:text-white transition-colors cursor-pointer"
              title="Curtir"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
            <button
              className="hover:text-white transition-colors cursor-pointer"
              title="Salvar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono mt-3.5 tracking-wide">
          <span>❤️ {artigo.likes} curtidas</span>
          <span>•</span>
          <span>👁️ {artigo.views} visualizações</span>
          <span>•</span>
          <span>💬 {comments.length} comentários</span>
        </div>

        {/* IMAGEM DE CAPA REAL */}
        <div className="w-full h-64 md:h-80 bg-zinc-900 relative flex items-center justify-center overflow-hidden rounded-xl my-8 select-none border border-zinc-900/50">
          <img
            src={
              artigo.banner ||
              "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80"
            }
            alt={artigo.title}
            className="w-full h-full object-cover filter brightness-90"
          />
        </div>

        <div className="text-zinc-300 text-xs md:text-sm leading-relaxed space-y-5 whitespace-pre-line text-justify">
          {artigo.content.split("\n").map((paragraph, idx) => {
            if (paragraph.trim().startsWith("##")) {
              return (
                <h2
                  key={idx}
                  className="text-sm font-bold text-white pt-4 tracking-tight block"
                >
                  {paragraph.replace("##", "").trim()}
                </h2>
              );
            }
            return <p key={idx}>{paragraph.trim()}</p>;
          })}
        </div>

        <section className="w-full border-t border-zinc-900 pt-6 mt-10">
          <h2 className="text-xs font-bold text-white mb-5 tracking-wide">
            Comentários ({comments.length})
          </h2>

          {!user ? (
            <div className="w-full bg-[#0d111e]/40 border border-zinc-900 rounded-xl p-6 text-center mb-8">
              <p className="text-[11px] text-zinc-500 mb-3">
                Faça login para comentar
              </p>
              <Link
                href="/login"
                className="inline-block bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold px-5 py-1.5 rounded-md text-[11px] transition-colors shadow-md"
              >
                Fazer login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleEnviarComentario}
              className="w-full bg-[#0d111e]/40 border border-zinc-900 rounded-xl p-4 mb-8 focus-within:border-cyan-500/30 transition-all duration-300"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
                placeholder="Partilhe a sua opinião sobre o assunto..."
                className="w-full bg-transparent text-xs md:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex justify-end mt-2 pt-2 border-t border-zinc-900/60">
                <button
                  type="submit"
                  className="bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold px-4 py-1.5 rounded-md text-xs transition-colors cursor-pointer active:scale-95 shadow-md shadow-cyan-400/5"
                >
                  Comentar
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-4 w-full">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-[#0d111e]/20 border border-zinc-900/60 rounded-xl p-4 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-[9px] font-bold text-zinc-400 border border-zinc-700/40">
                      {comment.avatarInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-200">
                        {comment.author}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {comment.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-400 cursor-pointer transition-colors font-mono">
                    <span>🤍</span>
                    <span>{comment.likes}</span>
                  </div>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed pl-1 text-justify">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
