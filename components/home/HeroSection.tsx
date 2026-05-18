"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <section className="w-full flex flex-col items-center text-center max-w-2xl mx-auto pt-24 pb-16 px-4 z-10">
      <h1 className="text-[38px] md:text-[46px] font-extrabold tracking-tight text-white leading-[1.15]">
        Explore o Futuro da <br />
        <span className="text-cyan-400">
          Tecnologia
        </span>
      </h1>
      <p className="mt-5 text-zinc-400 text-[13px] md:text-sm max-w-[320px] mx-auto leading-relaxed">
        Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências tecnológicas
      </p>
      
      {/* Botões empilhados exatamente como no PNG */}
      <div className="mt-8 flex flex-col gap-3 w-full max-w-[260px] mx-auto">
        <button
          onClick={() => router.push("/artigos")}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold py-3.5 rounded text-xs transition-colors shadow-lg shadow-cyan-500/10 cursor-pointer"
        >
          Explorar Artigos
        </button>
        <button
          onClick={() => router.push(user ? "/criar-artigo" : "/login")}
          className="w-full border border-zinc-800 bg-[#0a0d17]/60 text-zinc-300 font-semibold py-3.5 rounded text-xs transition-colors cursor-pointer hover:bg-zinc-800/80 hover:text-white"
        >
          Começar a Escrever
        </button>
      </div>
    </section>
  );
}