import React from "react";
import Link from "next/link";
import { getArticleBySlugServer } from "@/services/article/detail.server";
import ArticleContent from "../../../components/article/articleDetails/ArticleContent";
import ArticleHeader from "../../../components/article/articleDetails/ArticleHeader";
import CommentsSection from "@/components/article/articleDetails/CommentsSection";

export default async function DetalheArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlugServer(slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col items-center pt-32 text-zinc-500 text-sm">
        <p>Artigo não encontrado.</p>
        <Link href="/artigos" className="text-cyan-400 mt-4 hover:underline transition-all">
          &larr; Voltar aos artigos
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center">
      <div className="w-full max-w-[768px] px-6 py-10 flex flex-col">
        
        {/* Botão Voltar */}
        <Link
          href="/artigos"
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white mb-10 w-max transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar aos Artigos
        </Link>

        {/* Componentes da Página */}
        <ArticleHeader article={article} />
        <ArticleContent article={article} />
        <CommentsSection articleId={article.id} initialComments={article.comments || []} />
      </div>
    </div>
  );
}