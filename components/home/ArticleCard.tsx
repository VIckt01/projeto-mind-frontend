import React from "react";
import Link from "next/link";
import { ArticleResponse } from "@/services/article/home.server";
import { BsBookmarkFill } from "react-icons/bs";

interface ArticleCardProps {
  article: ArticleResponse;
  showBanner: boolean;
}

export default function ArticleCard({ article, showBanner }: ArticleCardProps) {
  return (
    <Link
      href={`/artigos/${article.slug}`}
      className="bg-[#0f1322] border border-zinc-900/80 rounded-xl overflow-hidden flex flex-col group transition-all w-full shadow-md hover:border-zinc-800"
    >
      {showBanner && (
        <div className="h-32 bg-[#070a13] w-full">
          <img
            src={article.banner || ""}
            alt={article.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 w-full">
        <span className="text-[10px] text-cyan-400 font-semibold mb-2">
          Tecnologia
        </span>
        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
          {/* Ícone inserido diretamente aqui */}
          <BsBookmarkFill
            className="text-cyan-400 inline mb-0.5 mr-1.5"
            size={12}
          />
          {article.title}
        </h3>
        <p className="text-zinc-400 text-[11px] mt-2 line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
