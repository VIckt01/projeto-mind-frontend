"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  // Regra de negócio para pegar apenas o primeiro nome
  const primeiroNome = user ? user.name.split(" ")[0] : "";

  return (
    <nav className="flex items-center gap-6 text-[13px] font-medium text-zinc-300">
      <a href="/" className="hover:text-white transition-colors">
        Home
      </a>
      <a
        href="/artigos"
        className="text-zinc-400 hover:text-white transition-colors"
      >
        Artigos
      </a>
      <span className="text-zinc-800 select-none">|</span>

      {/* Ícone Outline da Lua (Dark Mode) */}
      <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </button>

      {/* Condição baseada no estado de Login */}
      {user ? (
        /* CONTAINER DO DROPDOWN (Ativa ao passar o mouse usando 'group') */
        <div className="relative group flex items-center gap-2 py-2 cursor-pointer">
          {/* Nome e Foto visíveis no topo da Navbar */}
          <span className="text-zinc-200 font-semibold text-[13px] tracking-wide select-none">
            {primeiroNome}
          </span>
          <img
            src={
              user.profileImg ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
            }
            alt="Avatar Usuário"
            className="w-8 h-8 rounded-full object-cover border border-zinc-800"
          />

          {/* CAIXA DO MENU FLUTUANTE (Dropdown) */}
          <div className="absolute right-0 top-[45px] w-64 bg-[#14181F] border border-zinc-800/80 rounded-lg shadow-2xl p-4 flex flex-col invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50 text-left">
            {/* Bloco de Perfil de Cima */}
            <div className="flex items-center gap-3 pb-3">
              <img
                src={
                  user.profileImg ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                }
                alt="Avatar Menu"
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-white font-semibold text-xs truncate">
                  {user.name}
                </span>
                <span className="text-zinc-500 text-[11px] truncate">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Linha Divisória */}
            <div className="border-t border-zinc-800/80 my-1"></div>

            {/* Link: Dashboard */}
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-2 py-2.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition-all text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4 text-zinc-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
              Dashboard
            </a>

            {/* Link: Configurações */}
            <a
              href="/configuracoes"
              className="flex items-center gap-3 px-2 py-2.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition-all text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4 text-zinc-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.307.235-.45.645-.366 1.022.012.052.022.105.03.158.042.27.017.546-.073.805l-.012.034c-.112.319-.077.674.12.96l.732.1.66 1.144a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.307.235-.45.645-.366 1.022.012.052.022.105.03.158.042.27.017.546-.073.805l-.012.034c-.112.319-.077.674.12.96l.732.1.213 1.281c.09.543-.38 1.11-.94 1.11H13.3c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.767c.306-.235.45-.645.365-1.022a5.59 5.59 0 0 1-.03-.158c-.042-.27-.017-.546.074-.805l.012-.034c.112-.319.077-.674-.12-.96l-.732-.1c-.542-.09-.94-.56-.94-1.11V7.277c0-.55.398-1.02.94-1.11l1.281-.213c.374-.062.686-.312.87-.644.04-.074.083-.147.127-.22.196-.325.257-.72.124-1.076l-.456-1.217a1.125 1.125 0 0 1 .49-1.369l2.247-1.297ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                />
              </svg>
              Configurações
            </a>

            {/* Linha Divisória */}
            <div className="border-t border-zinc-800/80 my-1"></div>

            {/* Botão Ação: Sair */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-2 py-2.5 rounded text-red-400 hover:bg-red-500/10 transition-all text-xs font-medium text-left cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                />
              </svg>
              Sair
            </button>
          </div>
        </div>
      ) : (
        /* Se NÃO estiver logado, mantém os botões de entrada padrão */
        <>
          <a href="/login" className="hover:text-white transition-colors">
            Entrar
          </a>
          <a
            href="/cadastro"
            className="bg-cyan-400 text-zinc-950 px-5 py-2.5 rounded font-bold hover:bg-cyan-300 transition-all text-xs uppercase tracking-wider"
          >
            Cadastrar
          </a>
        </>
      )}
    </nav>
  );
}
