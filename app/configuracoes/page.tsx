"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function Configuracoes() {
  const router = useRouter();
  const { user, loginState } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [role, setRole] = useState("Admin");
  const [membroDesde, setMembroDesde] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchPerfil = async () => {
      try {
        const response = await api.get(`/auth/me/${user.id}`);
        const { data } = response.data;

        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setAvatarPreview(data.profileImg || "");
        setRole(data.role || "Admin");

        if (data.createdAt) {
          const dataFormatada = new Date(data.createdAt).toLocaleDateString("pt-BR");
          setMembroDesde(dataFormatada);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil do banco", err);
      }
    };

    fetchPerfil();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

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
      const formData = new FormData();
      formData.append("id", user?.id || "");
      formData.append("name", name);
      formData.append("email", email);
      formData.append("bio", bio);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Configurações atualizadas com sucesso!");

      if (response.data && response.data.data) {
        loginState(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  const avatarVisualizacao = avatarPreview || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop";

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 flex flex-col justify-between antialiased font-sans">
      <main className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-4 py-12 flex-1">
        
        {/* Container Principal Centralizado */}
        <div className="w-full max-w-2xl flex flex-col mt-4">
          
          {/* Botão Voltar */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer w-max mb-10 bg-transparent border-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Voltar ao Dashboard
          </button>

          {/* Cabeçalho da Página */}
          <div className="flex flex-col mb-10 pb-8 border-b border-zinc-800/80">
            <h1 className="text-[32px] font-bold text-white tracking-tight mb-2">
              Configurações do Perfil
            </h1>
            <p className="text-sm text-zinc-500">
              Gerencie suas informações pessoais
            </p>
          </div>

          {/* Área do Formulário */}
          <div className="w-full bg-[#0a0d17] border border-zinc-800/80 rounded-xl p-8">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs p-3 rounded text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-8">
              
              {/* Seção da Foto de Perfil */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={avatarVisualizacao}
                  alt="Foto do Perfil"
                  className="w-24 h-24 rounded object-cover mb-6 border border-zinc-800"
                />
                
                <div className="flex flex-col w-full max-w-md">
                  <label className="text-[11px] text-zinc-300 mb-2">
                    Foto de Perfil
                  </label>
                  <label className="w-full bg-[#14181f] border border-zinc-800 rounded px-4 py-3 text-xs text-zinc-500 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:border-zinc-700 transition-colors">
                    {selectedFile ? selectedFile.name : avatarVisualizacao}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-zinc-600 mt-2">
                    Adicione uma imagem ou deixe em branco
                  </span>
                </div>
              </div>

              {/* Input: Nome Completo */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-zinc-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-zinc-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#14181f] border border-zinc-800 rounded px-4 py-3 text-xs w-full focus:outline-none focus:border-cyan-500/50 text-zinc-200 transition-colors"
                />
              </div>

              {/* Input: Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-zinc-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-zinc-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#14181f] border border-zinc-800 rounded px-4 py-3 text-xs w-full focus:outline-none focus:border-cyan-500/50 text-zinc-200 transition-colors"
                />
              </div>

              {/* Textarea: Bio */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-zinc-300">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="bg-[#14181f] border border-zinc-800 rounded px-4 py-3 text-xs w-full focus:outline-none focus:border-cyan-500/50 text-zinc-200 resize-none transition-colors"
                />
                <span className="text-[10px] text-zinc-600 mt-1">
                  {bio.length}/500 caracteres
                </span>
              </div>

              {/* Linha Divisória interna */}
              <div className="border-t border-zinc-800/80 my-2"></div>

              {/* Informações da Conta (Somente Leitura) */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[13px] font-bold text-white mb-2">
                  Informações da conta
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-zinc-400">Tipo de conta</span>
                    <span className="text-xs text-zinc-200">{role}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-zinc-400">Membro desde</span>
                    <span className="text-xs text-zinc-200">{membroDesde || "20/01/2026"}</span>
                  </div>
                </div>
              </div>

              {/* Botão de Salvar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold py-3.5 rounded text-xs transition-colors cursor-pointer disabled:opacity-50 mt-6"
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}