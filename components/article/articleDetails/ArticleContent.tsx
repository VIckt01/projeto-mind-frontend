import React from "react";
import { ArticleDetailResponse } from "@/services/article/detail.server";

interface ArticleContentProps {
  article: ArticleDetailResponse;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="w-full flex flex-col">
      {/* Imagem de Capa */}
      <div className="w-full h-[300px] md:h-[400px] bg-[#0d111e] relative mb-10 overflow-hidden">
        <img
          src={article.banner || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Corpo do Texto */}
      <div 
        className="text-zinc-300 text-sm md:text-base leading-[1.8] whitespace-pre-wrap flex flex-col gap-6"
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
      {/* Obs: Usar dangerouslySetInnerHTML é o ideal se você for integrar um Editor Rich Text (como TipTap) no futuro. */}

      {/* Seção de Tags (Adicionado conforme o design) */}
      <div className="flex flex-wrap gap-2 mt-12 mb-4">
        {["Desenvolvimento web", "Inteligência Artificial", "Desenvolvimento backend"].map((tag) => (
          <span 
            key={tag} 
            className="bg-[#0f1322] border border-zinc-800/80 text-zinc-400 text-[10px] px-3 py-1.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}