"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function Configuracoes() {
  const router = useRouter();
  const { user, loginState } = useAuth();

  // Estados dos campos editáveis
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

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
        const response = await api.get(`/auth/me/${user.id}`);
        const { data } = response.data;

        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setAvatarPreview(data.profileImg || "");
        setRole(data.role || "Admin");

        if (data.createdAt) {
          const dataFormatada = new Date(data.createdAt).toLocaleDateString(
            "pt-BR",
          );
          setMembroDesde(dataFormatada);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil do banco", err);
      }
    };

    fetchPerfil();
  }, [user]);

  // Lida com a seleção de arquivo para gerar preview imediato
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Gera um link local temporário para a pessoa ver a foto antes de enviar
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
      // ◄— Transição para FormData para suportar envio de arquivos (Multipart)
      const formData = new FormData();
      formData.append("id", user?.id || "");
      formData.append("name", name);
      formData.append("email", email);
      formData.append("bio", bio);

      // Se houver arquivo selecionado, o Multer lá no backend espera um campo chamado 'file'
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // ◄— Disparando a requisição PUT com Axios + FormData
      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Configurações atualizadas com sucesso!");

      // Atualiza o estado da aplicação com os novos dados recebidos do backend
      if (response.data && response.data.data) {
        loginState(response.data.data);
      }
    } catch (err: any) {
      // O Axios embute a resposta de erro do servidor dentro de err.response.data
      setError(err.response?.data?.error || "Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  // Foto padrão caso o usuário não tenha nenhuma cadastrada
  const avatarVisualizacao =
    avatarPreview ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop";

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white flex flex-col justify-between antialiased font-sans select-none">
      <main className="w-full max-w-[1440px] mx-auto xl:px-[360px] lg:px-[180px] md:px-[80px] px-4 py-12 flex flex-col gap-6 flex-1 justify-center">
        {/* Link Voltar ao Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer self-start font-medium bg-transparent border-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Voltar ao Dashboard
        </button>

        {/* Título da Página */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Configurações do Perfil
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Gerencie suas informações pessoais
          </p>
        </div>

        {/* CARD CENTRAL */}
        <div className="w-full bg-[#14181F] border border-zinc-900/80 rounded-xl p-8 shadow-2xl">
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

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {/* Bloco de Preview e Input de Arquivo Customizado */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={avatarVisualizacao}
                alt="Preview do Perfil"
                className="w-24 h-24 rounded-lg object-cover border-2 border-zinc-800 shadow-md"
              />
              <div className="flex flex-col gap-1.5 w-full max-w-md text-center">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide text-left">
                  Foto de Perfil
                </label>

                {/* ◄— INPUT FILE CUSTOMIZADO */}
                <div className="w-full flex items-center bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 gap-3">
                  <label className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-4 py-2 rounded text-[11px] transition-colors cursor-pointer select-none">
                    Escolher ficheiro
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-zinc-500 truncate">
                    {selectedFile
                      ? selectedFile.name
                      : "Nenhum ficheiro selecionado"}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 text-left mt-0.5">
                  Adicione uma imagem nos formatos JPG ou PNG
                </span>
              </div>
            </div>

            {/* Input: Nome Completo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-zinc-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-zinc-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
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
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Escreva um pouco sobre você..."
                className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200 resize-none"
              />
              <span className="text-[10px] text-zinc-500 text-right">
                {bio.length}/500 caracteres
              </span>
            </div>

            {/* Linha Divisória */}
            <div className="border-t border-zinc-800/80 my-2"></div>

            {/* Seção Inalterável: Informações da Conta */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Informações da conta
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-[#0B0E13] border border-zinc-900 rounded-lg p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Tipo de conta
                  </span>
                  <span className="text-xs text-zinc-200 font-semibold">
                    {role}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Membro desde
                  </span>
                  <span className="text-xs text-zinc-200 font-semibold">
                    {membroDesde || "20/01/2026"}
                  </span>
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
    </div>
  );
}
