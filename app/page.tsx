import React from "react";
import Link from "next/link"; // Importado para navegação nativa e performática de Server Components

// --- TIPAGEM E INTERFACES ---
type ArticleAPI = {
  id: number;
  title: string;
  slug: string; // Adicionado para receber o link dinâmico do banco
  content: string;
  banner: { type: string; data: number[] } | null;
  createdAt: string;
  author: { name: string; email: string };
};

interface DisplayArticle {
  id: number;
  title: string;
  slug: string; // Adicionado para o redirecionamento
  content: string;
  date: string;
  author: string;
  category: string;
  bannerSrc: string | null; // URL base64 ou null
  views: string;
  likes: string;
  comments: string;
}

// --- FUNÇÕES AUXILIARES / TRATAMENTO DE DADOS ---

// Converte o Buffer do banco de dados em uma string Base64 utilizável na tag <img>
function convertBufferToBase64(banner: ArticleAPI["banner"]): string | null {
  if (!banner || !banner.data || banner.data.length === 0) return null;
  try {
    const base64String = Buffer.from(banner.data).toString("base64");
    return `data:${banner.type || "image/jpeg"};base64,${base64String}`;
  } catch (error) {
    console.error("Erro ao converter banner do artigo:", error);
    return null;
  }
}

async function getArticles(): Promise<DisplayArticle[]> {
  try {
    const res = await fetch("http://localhost:5000/articles", { cache: "no-store" });
    if (!res.ok) return [];
    
    const data: ArticleAPI[] = await res.json();
    
    return data.map((art) => ({
      id: art.id,
      title: art.title,
      slug: art.slug, // ◄— Mapeado diretamente do retorno da API
      content: art.content,
      date: new Date(art.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      author: art.author?.name || "Autor Anônimo",
      category: "Tecnologia", // Categoria fallback padrão
      bannerSrc: convertBufferToBase64(art.banner),
      views: "1.2k", 
      likes: "84",
      comments: "9",
    }));
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    return [];
  }
}

// --- COMPONENTE PRINCIPAL ---
export default async function Home() {
  const fetchedArticles = await getArticles();

  // Dados mockados humanizados de alta qualidade para fallbacks ou complemento visual
  const placeholderArticles: DisplayArticle[] = [
    {
      id: 1,
      title: "Construindo Aplicações Ultrarápidas com Next.js e React Server Components",
      slug: "construindo-aplicacoes-ultrarapidas-com-nextjs", // Adicionado slug coerente
      content: "Descubra como otimizar o tempo de carregamento e a experiência do usuário utilizando as novas arquiteturas de renderização do ecossistema React.",
      date: "14 de Mai de 2026",
      author: "Guilherme Santos",
      category: "Front-end",
      bannerSrc: null, 
      views: "12.4k",
      likes: "182",
      comments: "12",
    },
    {
      id: 2,
      title: "O Guia Definitivo de Inteligência Artificial para Desenvolvedores Web",
      slug: "o-guia-definitivo-de-inteligencia-artificial", // Adicionado slug coerente
      content: "A IA não vai substituir você, mas quem usa IA vai. Saiba como integrar modelos de linguagem diretamente na sua interface de forma prática e escalável.",
      date: "10 de Mai de 2026",
      author: "Beatriz Ribeiro",
      category: "Inteligência Artificial",
      bannerSrc: null,
      views: "8.1k",
      likes: "94",
      comments: "5",
    },
    {
      id: 3,
      title: "Transição de Carreira para DevOps: Por Onde Começar em 2026?",
      slug: "transicao-de-carreira-para-devops-por-onde-comecar", // ◄— Adicionado slug coerente
      content: "Se você quer dominar pipelines de CI/CD, Docker, Kubernetes e infraestrutura como código, este roteiro prático vai acelerar sua jornada.",
      date: "04 de Mai de 2026",
      author: "Lucas Andrade",
      category: "DevOps",
      bannerSrc: null,
      views: "15.2k",
      likes: "322",
      comments: "41",
    },
  ];

  // Distribuição inteligente do conteúdo para a UI
  const featuredArticles = fetchedArticles.length > 0 ? fetchedArticles.slice(0, 3) : placeholderArticles;
  const recentArticles = fetchedArticles.length > 3 ? fetchedArticles.slice(3, 6) : placeholderArticles;

  return (
    <div className="w-full flex flex-col items-center flex-1 bg-[#070a13] text-zinc-100 antialiased font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Efeito de iluminação de fundo (Mesh Gradient sutil no Hero) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-5xl px-4 flex flex-col z-10">
        
        {/* HERO SECTION */}
        <section className="w-full flex flex-col items-center text-center max-w-2xl mx-auto mt-20 mb-36">
          <h1 className="text-[42px] md:text-[54px] font-extrabold tracking-tight text-white leading-[1.1]">
            Explore o Futuro da <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
              Tecnologia
            </span>
          </h1>
          <p className="mt-6 text-zinc-400 text-sm md:text-base max-w-md leading-relaxed">
            Artigos aprofundados sobre engenharia de software, inteligência artificial e as reais tendências do mercado tech.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3.5 w-full max-w-md justify-center">
            <button className="w-full sm:w-auto px-8 bg-cyan-400 text-zinc-950 font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase hover:bg-cyan-300 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-cyan-500/10 cursor-pointer">
              Explorar Artigos
            </button>
            <button className="w-full sm:w-auto px-8 border border-zinc-800 bg-[#0f1322]/60 text-zinc-300 font-semibold py-3.5 rounded-lg text-xs tracking-wider uppercase hover:bg-zinc-800/80 hover:text-white active:scale-[0.98] transition-all duration-200 cursor-pointer">
              Começar a Escrever
            </button>
          </div>
        </section>

        {/* ARTIGOS EM DESTAQUE */}
        <section className="w-full mb-28">
          <div className="flex items-end justify-between w-full mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Artigos em Destaque</h2>
              <p className="text-xs text-zinc-500 mt-1">Os conteúdos mais relevantes selecionados para você</p>
            </div>
            <a href="/artigos" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold group transition-colors">
              Ver todos <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} showBanner={true} />
            ))}
          </div>
        </section>

        {/* ARTIGOS RECENTES */}
        <section className="w-full mb-28">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Artigos Recentes</h2>
            <p className="text-xs text-zinc-500 mt-1">Atualizações frescas vindas diretamente da comunidade</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} showBanner={false} />
            ))}
          </div>
        </section>
      </div>

      {/* NEWSLETTER SEMANAL */}
      <section className="w-full bg-[#0d111e] border-t border-b border-zinc-900/60 py-20 flex justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293705_1px,transparent_1px),linear-gradient(to_bottom,#1f293705_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="w-full max-w-5xl px-4 flex flex-col items-center text-center z-10">
          <div className="text-cyan-400 mb-4 bg-cyan-500/5 p-3 rounded-xl border border-cyan-500/10 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white tracking-tight">Newsletter Semanal</h3>
          <p className="mt-3 text-zinc-400 text-sm max-w-md leading-relaxed">
            Receba insights direto no seu e-mail. Sem flood, sem spam, apenas engenharia pura e direto ao ponto.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-2.5 w-full max-w-md justify-center bg-[#070a13] p-1.5 rounded-xl border border-zinc-800/80 focus-within:border-cyan-500/50 transition-all duration-300">
            <input 
              type="email" 
              placeholder="seu.email@provedor.com" 
              className="bg-transparent px-3 py-2 text-xs w-full focus:outline-none text-zinc-200 placeholder-zinc-600" 
            />
            <button className="bg-cyan-400 text-zinc-950 font-bold px-6 py-2.5 rounded-lg text-xs hover:bg-cyan-300 active:scale-[0.97] transition-all cursor-pointer whitespace-nowrap">
              Inscrever-se
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 mt-4 tracking-wide font-medium">
            Junte-se a mais de 10.000 engenheiros de software assinantes.
          </p>
        </div>
      </section>

      {/* COMPARTILHE SEU CONHECIMENTO (CTA) */}
      <section className="w-full bg-[#070a13] py-24 flex justify-center">
        <div className="w-full max-w-5xl px-4 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold text-white tracking-tight">Quer fazer parte do ecossistema?</h3>
          <p className="mt-3 text-zinc-400 text-sm max-w-lg leading-relaxed">
            Escreveu um artigo massa ou resolveu um problem complexo na sua squad? Compartilhe com a nossa comunidade tech.
          </p>
          <button className="mt-8 bg-cyan-400 text-zinc-950 font-bold px-6 py-3 rounded-lg text-xs tracking-wider uppercase hover:bg-cyan-300 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/5 cursor-pointer">
            Criar Minha Conta Gratuita
          </button>
        </div>
      </section>
    </div>
  );
}

// --- SUBCOMPONENTE DE CARD CUSTOMIZADO ---
function ArticleCard({ article, showBanner }: { article: DisplayArticle; showBanner: boolean }) {
  const authorInitials = article.author ? article.author.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "??";

  // Modificado de <article> para <Link> para criar a navegação dinâmica perfeita por slug de Server Components
  return (
    <Link 
      href={`/artigos/${article.slug}`}
      className="bg-[#0f1322] border border-zinc-900/80 rounded-xl overflow-hidden flex flex-col group hover:border-zinc-800 hover:scale-[1.015] transition-all duration-300 cursor-pointer w-full shadow-md hover:shadow-cyan-950/20"
    >
      
      {/* Seção do Banner Inteligente */}
      {showBanner && (
        <div className="h-44 relative flex items-center justify-center overflow-hidden select-none border-b border-zinc-900/60 bg-[#070a13] w-full">
          {article.bannerSrc ? (
            // Se houver imagem convertida real do backend
            <img 
              src={article.bannerSrc} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            // Abstração rica em CSS caso não haja imagem salva (Fallback)
            <>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
              <span className="z-10 text-zinc-600 font-mono text-xs tracking-widest font-bold uppercase opacity-60 group-hover:opacity-100 group-hover:text-cyan-400 group-hover:scale-105 transition-all duration-300">
                {article.category}
              </span>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/15 group-hover:scale-125 transition-all duration-500 rounded-full" />
              <div className="absolute -top-8 -left-8 w-28 h-28 bg-blue-500/5 blur-2xl rounded-full" />
            </>
          )}
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-1 w-full">
        <div className="flex items-center justify-between text-[10px] font-medium">
          <span className="bg-zinc-900 text-cyan-400 border border-zinc-800 px-2 py-0.5 rounded-md font-semibold tracking-wide">
            {article.category}
          </span>
          <span className="text-zinc-500">{article.date}</span>
        </div>
        
        <h3 className="text-base font-bold mt-3.5 text-zinc-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug tracking-tight">
          {article.title}
        </h3>
        
        <p className="text-zinc-400 text-xs mt-2 line-clamp-3 flex-1 leading-relaxed">
          {article.content}
        </p>
        
        <div className="mt-5 pt-3.5 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 w-full">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-tr from-zinc-800 to-zinc-700 rounded-full flex items-center justify-center text-[9px] font-bold text-zinc-300 border border-zinc-700/60 shadow-inner">
              {authorInitials}
            </div>
            <span className="text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">{article.author}</span>
          </div>
          
          {showBanner && (
            <div className="flex items-center gap-2.5 text-[10px] text-zinc-500/70 font-mono">
              <span className="hover:text-zinc-400 transition-colors" title="Visualizações">👁️ {article.views}</span>
              <span className="hover:text-zinc-400 transition-colors" title="Curtidas">❤️ {article.likes}</span>
              <span className="hover:text-zinc-400 transition-colors" title="Comentários">💬 {article.comments}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}