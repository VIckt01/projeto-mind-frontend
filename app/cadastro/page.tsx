"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../services/api";

export default function Cadastro() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", { name, email, password });

      setSuccess("Conta criada com sucesso! Redirecionando para o login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Erro ao efetuar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white flex flex-col justify-between antialiased font-sans select-none">
      <header className="w-full border-b border-zinc-900/60 bg-[#0B0E13]">
        <div className="w-full max-w-[1440px] mx-auto px-10 h-[90px] flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-white">&lt;M/&gt;</div>
          <nav className="flex items-center gap-6 text-[13px] font-medium text-zinc-300">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/artigos" className="text-zinc-400 hover:text-white transition-colors">Artigos</a>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-[1440px] mx-auto px-4 py-16 flex flex-col items-center gap-10 flex-1 justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="text-3xl font-bold text-white mb-4">&lt;M/&gt;</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Criar Conta</h1>
          <p className="text-xs text-zinc-500 mt-1">Junte-se à nossa plataforma</p>
        </div>

        <div className="w-full bg-[#14181F] border border-zinc-900/80 rounded-xl p-8 max-w-[440px] shadow-2xl">
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded text-center">{error}</div>}
          {success && <div className="mb-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs p-3 rounded text-center">{success}</div>}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 tracking-wide">Nome Completo</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 tracking-wide">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 tracking-wide">Senha</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 tracking-wide">Confirmar senha</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold py-3 rounded text-xs uppercase tracking-wider transition-all cursor-pointer mt-2 disabled:opacity-50">
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Já tem uma conta? <a href="/login" className="text-white hover:underline font-semibold ml-1">Fazer login</a>
          </p>
        </div>
      </main>
    </div>
  );
}