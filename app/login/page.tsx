"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../services/api";

export default function Login() {
  const router = useRouter();
  const { loginState } = useAuth(); // Função pura para atualizar state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1. Faz a request diretamente aqui
      const response = await api.post("/auth/login", { email, password });

      const { user, message } = response.data;
      const { token, ...userData } = user; // Separa token dos dados do usuário

      // 2. Salva APENAS o token nos cookies com o nome "session" (Expira em 1 dia = 86400s)
      document.cookie = `session=${token}; path=/; max-age=86400; SameSite=Lax`;

      // 3. Chama o service do contexto apenas para setar o state do usuário
      loginState(userData);

      setSuccess(message || "Login realizado com sucesso! Redirecionando...");

      // 4. Redireciona
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white flex flex-col justify-between antialiased font-sans select-none">
      {/* ... [O RESTANTE DO SEU LAYOUT DE HEADER AQUI (MANTIDO INTACTO)] ... */}

      <main className="w-full max-w-[1440px] mx-auto xl:px-[360px] lg:px-[180px] md:px-[80px] px-4 py-16 flex flex-col items-center gap-10 flex-1 justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="text-3xl font-bold text-white mb-4">&lt;M/&gt;</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Entrar na Plataforma
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Insira suas credenciais para gerenciar seus conteúdos
          </p>
        </div>

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
              <label className="text-[11px] font-bold text-zinc-400 tracking-wide">
                Email
              </label>
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
              <label className="text-[11px] font-bold text-zinc-400 tracking-wide">
                Senha
              </label>
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
            <a
              href="/cadastro"
              className="text-white hover:underline font-semibold ml-1"
            >
              Criar conta gratuita
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
