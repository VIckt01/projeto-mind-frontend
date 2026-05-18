import React, { Suspense } from "react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import HomeDataLoader from "@/components/home/HomeDataLoader";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col flex-1 bg-[#070a13] antialiased font-sans relative overflow-hidden items-center">
      
      {/* Background radial brilhante sutil no topo (Efeito de brilho atrás do Hero) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_60%)] pointer-events-none" />

      {/* O Hero entra imediatamente pois não depende da API */}
      <HeroSection />

      {/* A área de artigos fica suspensa até a API responder */}
      <Suspense
        fallback={
          <div className="w-full flex flex-col items-center justify-center py-32 gap-4">
            <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-zinc-500 text-xs font-semibold animate-pulse tracking-wide">
              Carregando acervo técnico...
            </span>
          </div>
        }
      >
        <HomeDataLoader />
      </Suspense>

      {/* SECTION: Newsletter Semanal (Adicionado conforme o PNG) */}
      <section className="w-full bg-[#0a0d17] border-y border-zinc-900/60 py-16 px-6 flex flex-col items-center text-center mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-zinc-500 mb-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        <h2 className="text-lg font-bold text-white mb-2">Newsletter Semanal</h2>
        <p className="text-xs text-zinc-500 mb-8 max-w-sm">
          Receba os melhores artigos de tecnologia diretamente no seu e-mail.<br />Sem spam, apenas conteúdo de qualidade.
        </p>
        <form className="flex w-full max-w-[380px] gap-2">
          <input
            type="email"
            placeholder="exemplo@email.com"
            className="flex-1 bg-[#14181f] border border-zinc-800 rounded px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <button type="button" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-5 py-2.5 rounded text-xs font-bold transition-colors cursor-pointer">
            Inscrever
          </button>
        </form>
        <p className="text-[9px] text-zinc-600 mt-4">Mais de 10.000 desenvolvedores já assinam nossa newsletter.</p>
      </section>

      {/* SECTION: Compartilhe Seu Conhecimento (CTA final conforme o PNG) */}
      <section className="w-full py-20 px-6 flex flex-col items-center text-center">
        <h2 className="text-lg font-bold text-white mb-2">Compartilhe Seu Conhecimento</h2>
        <p className="text-xs text-zinc-500 mb-6 max-w-sm">
          Junte-se à nossa comunidade de escritores e compartilhe suas experiências e conhecimentos em tecnologia.
        </p>
        <Link
          href="/cadastro"
          className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-3 rounded text-xs font-bold transition-colors shadow-lg shadow-cyan-500/10"
        >
          Criar Conta Gratuita
        </Link>
      </section>
    </div>
  );
}