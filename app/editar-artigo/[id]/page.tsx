"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EditarArtigo() {
  const router = useRouter();
  const { id } = useParams(); // ◄— Captura o ID do artigo diretamente da URL dinâmica
  const { user, loading } = useAuth();

  // Estados para gerenciar os campos do formulário
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega os dados atuais do artigo para preencher o formulário
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const fetchArtigoDados = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:5000/articles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setImageUrl(data.imageUrl || "");
        } else {
          // Fallback de segurança caso a API falhe em encontrar o artigo específico
          setError("Não foi possível carregar os dados originais do artigo.");
        }
      } catch (err) {
        console.error("Erro ao buscar dados do artigo para edição:", err);
        setError("Erro de conexão com o servidor backend.");
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchArtigoDados();
    }
  }, [id, user, loading, router]);

  // Função para enviar as alterações para o banco de dados
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          imageUrl,
        }),
      });

      if (response.ok) {
        // Retorna ao dashboard com os dados já atualizados salvos
        router.push("/dashboard");
      } else {
        setError("Falha ao atualizar o artigo. Verifique os campos e tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao atualizar artigo:", err);
      setError("Erro de rede. Não foi possível contatar o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="w-full min-h-screen bg-[#0B0E13] flex items-center justify-center text-zinc-400 text-xs uppercase tracking-widest animate-pulse">
        Carregando dados do artigo...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white antialiased font-sans">
      <main className="w-full max-w-2xl mx-auto px-6 py-12 flex flex-col gap-6">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col gap-1 border-b border-zinc-900 pb-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs text-zinc-500 hover:text-cyan-400 flex items-center gap-1.5 mb-2 transition-colors cursor-pointer w-max"
          >
            &larr; Cancelar e voltar ao Dashboard
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-white">Editar Artigo</h1>
          <p className="text-xs text-zinc-500">Atualize as informações, o conteúdo ou a imagem de capa da sua publicação.</p>
        </div>

        {/* FEEDBACK DE ERRO */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        {/* FORMULÁRIO DE EDIÇÃO */}
        <form onSubmit={handleSalvarEdicao} className="w-full flex flex-col gap-5">
          
          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Título da Publicação</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: O Guia Definitivo de Inteligência Artificial..."
              className="w-full bg-[#14181F] border border-zinc-900 focus:border-cyan-500/40 rounded-lg px-4 py-2.5 text-xs text-zinc-200 focus:outline-none transition-colors"
            />
          </div>

          {/* Resumo/Excerpt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Breve Resumo (Excerpt)</label>
            <input
              type="text"
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Uma linha que descreva o artigo na listagem..."
              className="w-full bg-[#14181F] border border-zinc-900 focus:border-cyan-500/40 rounded-lg px-4 py-2.5 text-xs text-zinc-200 focus:outline-none transition-colors"
            />
          </div>

          {/* URL da Imagem de Capa */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">URL da Imagem de Capa</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[#14181F] border border-zinc-900 focus:border-cyan-500/40 rounded-lg px-4 py-2.5 text-xs text-zinc-200 focus:outline-none transition-colors"
            />
          </div>

          {/* Conteúdo Completo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Conteúdo do Artigo</label>
            <textarea
              rows={10}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva aqui o corpo completo do seu artigo utilizando quebras de linha..."
              className="w-full bg-[#14181F] border border-zinc-900 focus:border-cyan-500/40 rounded-lg px-4 py-2.5 text-xs text-zinc-200 focus:outline-none resize-none leading-relaxed transition-colors"
            />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900/60 mt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              {submitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}