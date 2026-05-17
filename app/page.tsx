import React, { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import HomeDataLoader from "@/components/home/HomeDataLoader";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center flex-1 bg-[#070a13] text-zinc-100 antialiased font-sans">
      {/* Background com efeito de brilho no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-5xl px-4 flex flex-col z-10">
        {/* Componente Client que renderiza imediatamente */}
        <HeroSection />

        {/* Suspense protege os artigos que vêm da API via SSR */}
        <Suspense
          fallback={
            <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
              <svg
                className="animate-spin h-8 w-8 text-cyan-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-zinc-500 text-sm font-semibold animate-pulse">
                Carregando artigos...
              </span>
            </div>
          }
        >
          <HomeDataLoader />
        </Suspense>
      </div>
    </div>
  );
}
