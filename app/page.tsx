"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

interface DisplayArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  author: string;
  category: string;
  bannerSrc: string | null;
  views: number;
  likes: number;
  comments: number;
}

export const MOCK_ARTICLES = [
  {
    id: "mock-1",
    title:
      "Construindo Aplicações Ultrarápidas com Next.js e React Server Components",
    slug: "construindo-aplicacoes-ultrarapidas-com-nextjs",
    content:
      "Descubra como otimizar o tempo de carregamento e a experiência do usuário utilizando as novas arquiteturas de renderização do ecossistema React. \n\n## Server Components\nEles permitem renderizar componentes no servidor, reduzindo o bundle JavaScript enviado ao cliente.",
    excerpt:
      "Descubra como otimizar o tempo de carregamento e a experiência do usuário utilizando as novas arquiteturas de renderização.",
    createdAt: "2026-05-14T10:00:00.000Z",
    author: { name: "Guilherme Santos", profileImg: "" },
    category: "Desenvolvimento web",
    banner:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    views: 12400,
    likes: 182,
    tags: '["Next.js", "React", "Performance"]',
  },
  {
    id: "mock-2",
    title:
      "O Guia Definitivo de Inteligência Artificial para Desenvolvedores Web",
    slug: "o-guia-definitivo-de-inteligencia-artificial",
    content:
      "A IA não vai substituir você, mas quem usa IA vai. Saiba como integrar modelos de linguagem diretamente na sua interface de forma prática e escalável.\n\n## Integração com APIs\nUtilizar APIs da OpenAI ou Anthropic ficou mais fácil do que nunca.",
    excerpt:
      "A IA não vai substituir você, mas quem usa IA vai. Saiba como integrar modelos de linguagem na sua interface.",
    createdAt: "2026-05-10T10:00:00.000Z",
    author: { name: "Beatriz Ribeiro", profileImg: "" },
    category: "Inteligência Artificial",
    banner:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
    views: 8100,
    likes: 94,
    tags: '["IA", "Web", "Inovação"]',
  },
  {
    id: "mock-3",
    title: "Transição de Carreira para DevOps: Por Onde Começar em 2026?",
    slug: "transicao-de-carreira-para-devops-por-onde-comecar",
    content:
      "Se você quer dominar pipelines de CI/CD, Docker, Kubernetes e infraestrutura como código, este roteiro prático vai acelerar sua jornada.\n\n## O que estudar?\nComece por Linux, Redes e Git. Depois avance para Docker e CI/CD.",
    excerpt:
      "Se você quer dominar pipelines de CI/CD e infraestrutura como código, este roteiro vai acelerar sua jornada.",
    createdAt: "2026-05-04T10:00:00.000Z",
    author: { name: "Lucas Andrade", profileImg: "" },
    category: "DevOps",
    banner:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
    views: 15200,
    likes: 322,
    tags: '["DevOps", "Carreira", "Cloud"]',
  },
  {
    id: "mock-4",
    title: "Python para Automação: Economize Horas de Trabalho Manual",
    slug: "python-para-automacao",
    content:
      "Aprenda a criar scripts simples em Python para ler planilhas, enviar emails e organizar arquivos.\n\n## Bibliotecas Essenciais\nPandas para dados, OS para arquivos e SMTPlib para emails.",
    excerpt:
      "Aprenda a criar scripts simples em Python para ler planilhas, enviar emails e organizar arquivos rapidamente.",
    createdAt: "2026-05-01T10:00:00.000Z",
    author: { name: "Fernanda Costa", profileImg: "" },
    category: "Desenvolvimento web",
    banner:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    views: 5400,
    likes: 120,
    tags: '["Python", "Automação", "Produtividade"]',
  },
];

export const mapMockArticle = (art: any): DisplayArticle => {
  const savedComments =
    typeof window !== "undefined"
      ? localStorage.getItem(`techblog_comments_${art.id}`)
      : null;
  const commentsCount = savedComments ? JSON.parse(savedComments).length : 0;

  return {
    id: String(art.id),
    title: art.title,
    slug: art.slug,
    content: art.excerpt || art.content,
    date: new Date(art.createdAt).toLocaleDateString("pt-BR"),
    author: art.author?.name || "Autor Anônimo",
    category: art.category || "Tecnologia",
    bannerSrc:
      art.banner ||
      art.imageUrl ||
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
    views: art.views || 0,
    likes: art.likes || 0,
    comments: commentsCount,
  };
};

export function SavedIcon({
  articleId,
  userId,
}: {
  articleId: string;
  userId?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userId) {
      const isSaved = localStorage.getItem(
        `techblog_save_${userId}_${articleId}`,
      );
      setSaved(isSaved === "true");
    }
  }, [articleId, userId]);

  if (!saved) return null;

  return (
    <span
      title="Artigo Salvo"
      className="inline-block align-text-bottom mr-1.5 text-cyan-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 inline"
      >
        <path
          fillRule="evenodd"
          d="M6.32 2.577a4.901 4.901 0 0 1 5.68-.89l.328.168.327-.168a4.901 4.901 0 0 1 5.68.89c.642.642 1.053 1.503 1.168 2.457L19.5 21l-7.5-4.5L4.5 21l-.003-15.966a3.523 3.523 0 0 1 1.168-2.457Z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const [featuredArticles, setFeaturedArticles] = useState<DisplayArticle[]>(
    [],
  );
  const [recentArticles, setRecentArticles] = useState<DisplayArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const response = await api.get("/article/feed/highlights");
        const { destaques, recentes } = response.data;

        let finalDestaques =
          destaques.length > 0
            ? destaques
            : [...MOCK_ARTICLES].sort((a, b) => b.views - a.views).slice(0, 4);
        let finalRecentes =
          recentes.length > 0 ? recentes : [...MOCK_ARTICLES].slice(0, 4);

        setFeaturedArticles(finalDestaques.map(mapMockArticle));
        setRecentArticles(finalRecentes.map(mapMockArticle));
      } catch (error) {
        setFeaturedArticles(
          [...MOCK_ARTICLES]
            .sort((a, b) => b.views - a.views)
            .slice(0, 4)
            .map(mapMockArticle),
        );
        setRecentArticles([...MOCK_ARTICLES].slice(0, 4).map(mapMockArticle));
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const handleStartWriting = () => {
    if (user) {
      router.push("/criar-artigo");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="w-full flex flex-col items-center flex-1 bg-[#070a13] text-zinc-100 antialiased font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-5xl px-4 flex flex-col z-10">
        <section className="w-full flex flex-col items-center text-center max-w-2xl mx-auto mt-20 mb-36">
          <h1 className="text-[42px] md:text-[54px] font-extrabold tracking-tight text-white leading-[1.1]">
            Explore o Futuro da <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
              Tecnologia
            </span>
          </h1>
          <p className="mt-6 text-zinc-400 text-sm max-w-md">
            Artigos aprofundados sobre engenharia de software e inteligência
            artificial.
          </p>
          <div className="mt-10 flex gap-3.5 w-full max-w-md justify-center">
            <button
              onClick={() => router.push("/artigos")}
              className="px-8 bg-cyan-400 text-zinc-950 font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
            >
              Explorar Artigos
            </button>
            <button
              onClick={() => router.push(user ? "/criar-artigo" : "/login")}
              className="px-8 border border-zinc-800 bg-[#0f1322]/60 text-zinc-300 font-semibold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer hover:bg-zinc-800"
            >
              Começar a Escrever
            </button>
          </div>
        </section>

        {!loading && (
          <>
            <section className="w-full mb-28">
              <div className="flex items-end justify-between w-full mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Artigos em Destaque
                  </h2>
                </div>
                <Link
                  href="/artigos"
                  className="text-xs text-cyan-400 font-semibold"
                >
                  &rarr; Ver todos
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {featuredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    showBanner={true}
                    userId={user?.id}
                  />
                ))}
              </div>
            </section>

            <section className="w-full mb-28">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Artigos Recentes
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {recentArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    showBanner={false}
                    userId={user?.id}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  showBanner,
  userId,
}: {
  article: DisplayArticle;
  showBanner: boolean;
  userId?: string;
}) {
  return (
    <Link
      href={`/artigos/${article.slug}`}
      className="bg-[#0f1322] border border-zinc-900/80 rounded-xl overflow-hidden flex flex-col group transition-all w-full shadow-md hover:border-zinc-800"
    >
      {showBanner && (
        <div className="h-32 bg-[#070a13] w-full">
          <img
            src={article.bannerSrc || ""}
            alt={article.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 w-full">
        <span className="text-[10px] text-cyan-400 font-semibold mb-2">
          {article.category}
        </span>
        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
          <SavedIcon articleId={article.id} userId={userId} />
          {article.title}
        </h3>
        <p className="text-zinc-400 text-[11px] mt-2 line-clamp-2">
          {article.content}
        </p>
      </div>
    </Link>
  );
}
