import React from "react";
import { ArticleDetailResponse } from "@/services/article/detail.server";

interface ArticleHeaderProps {
  article: ArticleDetailResponse;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const dataFormatada = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("pt-BR")
    : "Data desconhecida";

  // Cálculo simples para estimar o tempo de leitura
  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <header className="flex flex-col w-full mb-8">
      {/* Tag de Categoria */}
      <span className="bg-[#e68e4a] text-[#070a13] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded w-max mb-5">
        Desenvolvimento web
      </span>

      {/* Título e Resumo */}
      <h1 className="text-3xl md:text-[40px] font-bold text-white leading-[1.2] mb-4 tracking-tight">
        {article.title}
      </h1>
      <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
        {article.excerpt}
      </p>

      {/* Informações do Autor e Ações */}
      <div className="flex items-center justify-between border-y border-zinc-800/60 py-4 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={article.author.profileImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
            alt={article.author.name}
            className="w-10 h-10 rounded-full object-cover border border-zinc-800"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-100">{article.author.name}</span>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-0.5">
              <span>{dataFormatada}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {readingTime}min
              </span>
            </div>
          </div>
        </div>

        {/* Ícones de Ação (Curtir, Salvar, Compartilhar) */}
        <div className="flex items-center gap-4 text-zinc-400">
          <button className="hover:text-cyan-400 transition-colors cursor-pointer"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
          <button className="hover:text-cyan-400 transition-colors cursor-pointer"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg></button>
          <button className="hover:text-cyan-400 transition-colors cursor-pointer"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
        </div>
      </div>

      {/* Métricas Inferiores */}
      <div className="flex items-center gap-5 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {article.likes} curtidas</span>
        <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> {article.views} visualizações</span>
        <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> {article.comments?.length || 0} comentários</span>
      </div>
    </header>
  );
}