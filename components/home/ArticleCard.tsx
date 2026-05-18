import React from "react";
import Link from "next/link";

interface ArticleCardProps {
  article: any;
  showBanner?: boolean;
  viewMode?: "grid" | "list"; // Nova prop para controlar o design
}

export default function ArticleCard({ article, showBanner = true, viewMode = "grid" }: ArticleCardProps) {
  const isList = viewMode === "list";
  const dataFormatada = article.createdAt 
    ? new Date(article.createdAt).toLocaleDateString("pt-BR", { day: 'numeric', month: 'short', year: 'numeric' })
    : "Data desconhecida";

  return (
    <Link
      href={`/artigos/${article.slug}`}
      className={`group flex bg-[#0d111e]/60 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 w-full ${isList ? "flex-col md:flex-row" : "flex-col"}`}
    >
      {/* Imagem do Card */}
      {showBanner && (
        <div className={`bg-zinc-900 relative overflow-hidden flex-shrink-0 ${isList ? "h-56 md:h-auto md:w-[340px]" : "h-44 w-full"}`}>
          <img
            src={article.banner || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Conteúdo (Textos e Métricas) */}
      <div className={`p-5 flex flex-col flex-1 w-full ${isList ? "justify-center" : ""}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="bg-zinc-800/80 text-zinc-300 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Desenvolvimento web
          </span>
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            {dataFormatada}
          </div>
        </div>

        <h3 className="text-base font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-2">
          {article.title}
        </h3>
        <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2 flex-1 mb-4">
          {article.excerpt || "Sem resumo disponível..."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/60">
          <span className="text-[10px] font-medium text-zinc-400 truncate pr-2">
            {article.author?.name || "Autor Desconhecido"}
          </span>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              {article.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
              {article.likes || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}