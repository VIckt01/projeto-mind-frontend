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
      <div className="min-h-screen bg-[#070a13] flex flex-col items-center pt-32 text-zinc-500 font-mono text-sm">
        <p>Artigo não encontrado.</p>
        <Link href="/artigos" className="text-cyan-400 mt-4 hover:underline">
          &larr; Voltar aos artigos
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center">
      <div className="w-full max-w-3xl px-6 py-12 flex flex-col">
        <Link
          href="/artigos"
          className="text-xs text-zinc-500 hover:text-cyan-400 mb-8 inline-block w-max transition-colors"
        >
          &larr; Voltar aos Artigos
        </Link>

        <ArticleHeader article={article} />
        <ArticleContent article={article} />

        <CommentsSection 
          articleId={article.id} 
          initialComments={article.comments || []} 
        />
      </div>
    </div>
  );
}