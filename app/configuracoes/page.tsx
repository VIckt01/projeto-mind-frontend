"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Configuracoes() {
  const router = useRouter();
  const { user, login } = useAuth();

  // Estados dos campos editáveis
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Estados dos campos fixos (Não alteráveis)
  const [role, setRole] = useState("Membro");
  const [membroDesde, setMembroDesde] = useState("");

  // Estados de feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Carrega os dados reais do banco assim que a página abre
  useEffect(() => {
    if (!user) return;

    const fetchPerfil = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/profile/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatarUrl || "");
          setRole(data.role || "Admin");
          
          // Formata a data de registro para PT-BR (DD/MM/AAAA)
          if (data.createdAt) {
            const dataFormatada = new Date(data.createdAt).toLocaleDateString("pt-BR");
            setMembroDesde(dataFormatada);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar perfil do banco", err);
      }
    };

    fetchPerfil();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (bio.length > 500) {
      setError("A biografia não pode passar de 500 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?.id, name, email, bio, avatarUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar dados.");
      }

      setSuccess("Configurações updated com sucesso!");

      // Atualiza a Central de Autenticação global instantaneamente
      login(data.user);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Foto padrão caso o usuário não tenha nenhuma cadastrada
  const avatarVisualizacao = avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop";

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white flex flex-col justify-between antialiased font-sans select-none">
      
      <main className="w-full max-w-[1440px] mx-auto xl:px-[360px] lg:px-[180px] md:px-[80px] px-4 py-12 flex flex-col gap-6 flex-1 justify-center">
        
        {/* Link Voltar ao Dashboard */}
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer self-start font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Voltar ao Dashboard
        </button>

        {/* Título da Página */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">Configurações do Perfil</h1>
          <p className="text-xs text-zinc-500 mt-1">Gerencie suas informações pessoais</p>
        </div>

        {/* CARD CENTRAL */}
        <div className="w-full bg-[#14181F] border border-zinc-900/80 rounded-xl p-8 shadow-2xl">
          
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded text-center font-medium">{error}</div>}
          {success && <div className="mb-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs p-3 rounded text-center font-medium">{success}</div>}

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            
            {/* Bloco de Preview e Input da Imagem */}
            <div className="flex flex-col items-center gap-4">
              <img 
                src={avatarVisualizacao} 
                alt="Preview do Perfil" 
                className="w-24 h-24 rounded-lg object-cover border-2 border-zinc-800 shadow-md"
              />
              <div className="flex flex-col gap-1.5 w-full max-w-md text-center">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide text-left">Foto de Perfil</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://linkdaimagem.com/foto.jpg"
                  className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200 placeholder-zinc-700"
                />
                <span className="text-[10px] text-zinc-500 text-left">Adicione uma imagem ou deixe em branco</span>
              </div>
            </div>

            {/* Input: Nome Completo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-zinc-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200"
              />
            </div>

            {/* Input: Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-zinc-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200"
              />
            </div>

            {/* Textarea: Bio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Escreva um pouco sobre você..."
                className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200 resize-none"
              />
              <span className="text-[10px] text-zinc-500 text-right">{bio.length}/500 caracteres</span>
            </div>

            {/* Linha Divisória */}
            <div className="border-t border-zinc-800/80 my-2"></div>

            {/* Seção Inalterável: Informações da Conta */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Informações da conta</h3>
              <div className="grid grid-cols-2 gap-4 bg-[#0B0E13] border border-zinc-900 rounded-lg p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Tipo de conta</span>
                  <span className="text-xs text-zinc-200 font-semibold">{role}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Membro desde</span>
                  <span className="text-xs text-zinc-200 font-semibold">{membroDesde || "20/01/2026"}</span>
                </div>
              </div>
            </div>

            {/* Botão de Submissão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? "Salvando Alterações..." : "Salvar Alterações"}
            </button>

          </form>

        </div>
      </main>

      {/* FOOTER PONTUAL */}
      <footer className="w-full bg-[#14181F] border-t border-zinc-800/60 py-[60px] px-[40px]">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-[36px]">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col max-w-xs">
              <span className="text-xl font-bold tracking-tight text-white">&lt;M/&gt;</span>
              <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
                Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.
              </p>
            </div>
            
            <div className="flex gap-20">
              {/* Coluna Navegação */}
              <div className="flex flex-col gap-3">
                <span className="font-bold text-white text-xs tracking-wide">Navegação</span>
                <div className="flex flex-col gap-2.5 text-xs text-zinc-500">
                  <a href="/" className="hover:text-white transition-colors">Home</a>
                  <a href="/artigos" className="hover:text-white transition-colors">Artigos</a>
                  <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
                </div>
              </div>

              {/* Coluna Redes Sociais */}
              <div className="flex flex-col gap-3">
                <span className="font-bold text-white text-xs tracking-wide">Redes Sociais</span>
                <div className="flex items-center gap-4 text-zinc-500">
                  <a href="#" className="hover:text-white transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-zinc-800/80 w-full"></div>
          <div className="text-center text-zinc-600 text-[11px] tracking-wide">
            &copy; 2026 TechBlog. Todos os direitos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
}