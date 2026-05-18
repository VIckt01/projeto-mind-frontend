import React from "react";
import Link from "next/link";
import { getHomeArticlesServer } from "@/services/article/home.server";
import ArticleCard from "./ArticleCard";

export default async function HomeDataLoader() {
  const { featured, recent } = await getHomeArticlesServer();

  return (
    <div className="w-full max-w-[1100px] mx-auto px-6">
      {featured.length > 0 && (
        <section className="w-full mb-20 mt-4">
          <div className="flex items-end justify-between w-full mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Artigos em Destaque
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Os melhores conteúdos selecionados para você
              </p>
            </div>
            <Link
              href="/artigos"
              className="text-[11px] text-cyan-500 font-medium hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              Ver todos <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          {/* Ajustado para 3 colunas (lg:grid-cols-3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {featured.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showBanner={true}
              />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="w-full mb-20">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Artigos Recentes
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Conteúdo recente da comunidade
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {recent.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showBanner={false}
              />
            ))}
          </div>
        </section>
      )}

      {featured.length === 0 && recent.length === 0 && (
        <div className="text-center text-zinc-500 py-20 text-sm">
          Nenhum artigo publicado no momento.
        </div>
      )}
    </div>
  );
}