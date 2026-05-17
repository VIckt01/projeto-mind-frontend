import React from "react";
import { ArticleDetailResponse } from "@/services/article/detail.server";

interface ArticleContentProps {
  article: ArticleDetailResponse;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <>
      {article.banner && (
        <div className="w-full h-80 bg-zinc-900 relative my-8 overflow-hidden rounded-xl border border-zinc-900/50">
          <img
            src={article.banner}
            alt={article.title}
            className="w-full h-full object-cover filter brightness-90"
          />
        </div>
      )}

      <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line text-justify mt-4">
        {article.content}
      </div>
    </>
  );
}