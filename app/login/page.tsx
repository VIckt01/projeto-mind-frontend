"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; // Sobe dois níveis para achar a raiz

export default function Login() {
  const router = useRouter();
  const { login } = useAuth(); // Chamado como função ()

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados de feedback visual
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "E-mail ou senha incorretos.");
      }

      setSuccess("Login realizado com sucesso! Redirecionando...");
      
      // Salva a sessão na nossa Central de Autenticação global
      login(data.user);

      // Redireciona para a Home de forma segura
      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      // Corrigido para "finally" com dois Ls, fechando o bloco corretamente
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white flex flex-col justify-between antialiased font-sans select-none">
      
      {/* NAVBAR COMPONENTE - FIXED 90PX */}
      <header className="w-full border-b border-zinc-900/60 bg-[#0B0E13]">
        <div className="w-full max-w-[1440px] mx-auto px-10 h-[90px] flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-white">&lt;M/&gt;</div>
          <nav className="flex items-center gap-6 text-[13px] font-medium text-zinc-300">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/artigos" className="text-zinc-400 hover:text-white transition-colors">Artigos</a>
            <span className="text-zinc-800 select-none">|</span>
            <button type="button" className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* DIV ARTIGO - CONTAINER CENTRAL RECUADO */}
      <main className="w-full max-w-[1440px] mx-auto xl:px-[360px] lg:px-[180px] md:px-[80px] px-4 py-16 flex flex-col items-center gap-10 flex-1 justify-center">
        
        <div className="flex flex-col items-center text-center">
          <div className="text-3xl font-bold text-white mb-4">&lt;M/&gt;</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Entrar na Plataforma</h1>
          <p className="text-xs text-zinc-500 mt-1">Insira suas credenciais para gerenciar seus conteúdos</p>
        </div>

        {/* FORM CARD - BACKGROUND #14181F */}
        <div className="w-full bg-[#14181F] border border-zinc-900/80 rounded-xl p-8 max-w-[440px] shadow-2xl">
          
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded text-center font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs p-3 rounded text-center font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 tracking-wide">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200 placeholder-zinc-700"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 tracking-wide">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*********"
                className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200 placeholder-zinc-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold py-3 rounded text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? "Autenticando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Ainda não tem conta?{" "}
            <a href="/cadastro" className="text-white hover:underline font-semibold ml-1">
              Criar conta gratuita
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}