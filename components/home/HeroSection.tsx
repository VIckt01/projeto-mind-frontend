"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Ajuste o caminho se necessário

export default function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();

  return (
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
          className="px-8 bg-cyan-400 text-zinc-950 font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer hover:bg-cyan-300"
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
  );
}
