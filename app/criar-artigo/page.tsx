"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function CriarArtigo() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Estados do formulário
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Estados de feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  // Proteção de rota: se não estiver logado, vai para o login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Manipula o upload da imagem e gera o preview visual
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Gera link temporário para a tag <img>
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !content.trim()) {
      setError("Por favor, preencha o título e o conteúdo do artigo.");
      return;
    }

    setSending(true);

    try {
      // Enviamos um arquivo binário, então precisamos usar FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("authorId", String(user?.id));
      if (image) {
        formData.append("banner", image); // O nome 'banner' deve bater com o seu upload.single('banner') no backend
      }

      const response = await fetch("http://localhost:5000/articles", {
        method: "POST",
        body: formData, // ⚠️ ATENÇÃO: Não adicione instâncias de Header Content-Type aqui. O navegador faz isso sozinho para FormData.
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao publicar o artigo.");
      }

      setSuccess("Artigo publicado com sucesso! Redirecionando...");
      
      // Limpa os campos
      setTitle("");
      setContent("");
      setImage(null);
      setPreviewUrl("");

      // Redireciona de volta para o Dashboard após 2 segundos
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0B0E13] flex items-center justify-center text-zinc-500 text-xs uppercase tracking-widest animate-pulse">
        Verificando permissões...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white antialiased font-sans select-none">
      
      <main className="w-full max-w-[1440px] mx-auto xl:px-[360px] lg:px-[180px] md:px-[80px] px-4 py-12 flex flex-col gap-6 flex-1 justify-center">
        
        {/* Botão de Voltar */}
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer self-start font-medium"
        >
          &larr; Cancelar e Voltar
        </button>

        {/* Título da Página */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">Novo Artigo</h1>
          <p className="text-xs text-zinc-500 mt-1">Compartilhe seu conhecimento com o mundo tech</p>
        </div>

        {/* Formulário Central */}
        <div className="w-full bg-[#14181F] border border-zinc-900/80 rounded-xl p-8 shadow-2xl">
          
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded text-center font-medium">{error}</div>}
          {success && <div className="mb-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs p-3 rounded text-center font-medium">{success}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Campo: Imagem de Capa (Banner) */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Capa do Artigo (Opcional)</label>
              
              {previewUrl && (
                <div className="w-full h-44 rounded-lg overflow-hidden border border-zinc-800 mb-2 relative bg-zinc-950">
                  <img src={previewUrl} alt="Preview da Capa" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="w-full relative flex items-center justify-center bg-[#0B0E13] border border-zinc-800 border-dashed rounded-lg p-6 hover:border-zinc-700 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 0 1 1-.75 0 .375 0 0 1 /75 0Z" />
                  </svg>
                  <span className="text-xs text-zinc-400 font-medium">
                    {image ? image.name : "Clique aqui para fazer upload do banner"}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-medium">Formatos aceitos: PNG, JPG ou WEBP</span>
                </div>
              </div>
            </div>

            {/* Campo: Título */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Título do Artigo</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Dominando o TypeScript de uma vez por todas"
                className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200 placeholder-zinc-700 font-semibold"
              />
            </div>

            {/* Campo: Conteúdo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Conteúdo</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder="Escreva o artigo completo aqui..."
                className="bg-[#0B0E13] border border-zinc-800 rounded px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-cyan-500 text-zinc-200 resize-none placeholder-zinc-700 leading-relaxed font-normal"
              />
            </div>

            {/* Botão de Publicação */}
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-lg shadow-cyan-500/5"
            >
              {sending ? "Publicando Artigo..." : "Publicar Artigo"}
            </button>

          </form>

        </div>
      </main>
    </div>
  );
}