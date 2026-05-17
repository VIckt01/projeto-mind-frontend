import React from "react";
import Link from "next/link";
import { getHomeArticlesServer } from "@/services/article/home.server";
import ArticleCard from "./ArticleCard";

export default async function HomeDataLoader() {
  const { featured, recent } = await getHomeArticlesServer();

  console.log(featured);
  console.log(recent);

  return (
    <>
      {featured.length > 0 && (
        <section className="w-full mb-28">
          <div className="flex items-end justify-between w-full mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Artigos em Destaque
            </h2>
            <Link
              href="/artigos"
              className="text-xs text-cyan-400 font-semibold"
            >
              &rarr; Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
        <section className="w-full mb-28">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Artigos Recentes
            </h2>
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

      {/* Fallback caso não haja nenhum artigo no banco ainda */}
      {featured.length === 0 && recent.length === 0 && (
        <div className="text-center text-zinc-500 py-20 text-sm">
          Nenhum artigo publicado no momento.
        </div>
      )}
    </>
  );
}
