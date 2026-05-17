"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";

export default function EditarArtigo() {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading } = useAuth();

  // Estados do formulário
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Desenvolvimento web");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>(["Typescript", "Backend", "IA"]);
  const [currentTag, setCurrentTag] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const fetchArtigoDados = async () => {
      if (!id) return;
      try {
        setFetching(true);
        setError(null);
        
        const response = await api.get(`/article/id/${id}`);
        const data = response.data;

        // Preenche os estados com as informações que vieram do banco
        setTitle(data.title || "");
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setCurrentImageUrl(data.banner || "");
      } catch (err: any) {
        console.error("Erro ao buscar dados do artigo:", err);
        setError(err.response?.data?.error || "Não foi possível carregar os dados deste artigo.");
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchArtigoDados();
    }
  }, [id, user, loading, router]);

  // Cálculos dinâmicos de texto
  const characterCount = content.length;
  const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (characterCount > 8000) {
      setError("O conteúdo do artigo excede o limite de 8000 caracteres.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await api.put(`/article/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Erro ao salvar edições.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || fetching)
    return (
      <div className="min-h-screen bg-[#070a13] text-center pt-24 text-zinc-500 animate-pulse">
        Carregando dados...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-white antialiased font-sans">
      <main className="w-full max-w-3xl mx-auto px-4 py-12 flex flex-col">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-xs text-zinc-500 hover:text-cyan-400 flex items-center gap-1.5 mb-6 transition-colors border-0 bg-transparent cursor-pointer w-max"
        >
          &larr; Voltar ao Dashboard
        </button>

        <h1 className="text-2xl font-bold text-white tracking-tight">
          Editar Artigo
        </h1>
        <p className="text-xs text-zinc-500 mt-1 mb-8">
          Atualize as informações do seu artigo
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSalvarEdicao}
          className="w-full flex flex-col gap-6 bg-[#0d111e]/20 border border-zinc-900/60 p-6 rounded-xl"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              Título do Artigo *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#14181F] border border-zinc-900 rounded-lg px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                Resumo *
              </label>
              <span className="text-[10px] text-zinc-600 font-mono">
                {excerpt.length}/120
              </span>
            </div>
            <textarea
              required
              maxLength={120}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full bg-[#14181F] border border-zinc-900 rounded-lg px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/40 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              Categoria *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#14181F] border border-zinc-900 rounded-lg px-3 py-2.5 text-xs text-zinc-400 focus:outline-none cursor-pointer"
            >
              <option>Desenvolvimento web</option>
              <option>Inteligência Artificial</option>
              <option>DevOps</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              Imagem de Capa *
            </label>
            <div className="w-full flex items-center bg-[#14181F] border border-zinc-900 rounded-lg p-2 gap-3">
              <label className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-4 py-2 rounded text-xs transition-colors cursor-pointer select-none">
                Escolher ficheiro
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-zinc-500 truncate max-w-[200px] sm:max-w-xs block">
                {selectedFile
                  ? selectedFile.name
                  : currentImageUrl
                    ? "Imagem atual selecionada"
                    : "Nenhum ficheiro selecionado"}
              </span>
            </div>
            {currentImageUrl && !selectedFile && (
              <img
                src={currentImageUrl}
                alt="Capa atual"
                className="w-24 h-16 object-cover rounded mt-2 border border-zinc-800"
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              Tags
            </label>
            <div className="w-full flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Adicionar tag..."
                className="w-full bg-[#14181F] border border-zinc-900 rounded-lg px-4 py-2 text-xs text-zinc-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-zinc-900 border border-zinc-800 px-4 text-xs font-bold text-zinc-300 rounded-lg hover:text-white transition-colors cursor-pointer"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 px-2 py-1 rounded"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-zinc-600 hover:text-red-400 text-[9px] border-0 bg-transparent cursor-pointer font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              Conteúdo do Artigo *
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-[#14181F] border border-zinc-900 rounded-lg px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/40 font-mono leading-relaxed resize-none"
            />
            <div className="text-[10px] text-zinc-500 font-mono mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span>{characterCount}/8000 caracteres</span>
              <span>•</span>
              <span>{wordCount} palavras</span>
              <span>•</span>
              <span>
                {readingTime} {readingTime === 1 ? "minuto" : "minutos"} de leitura
              </span>
            </div>
          </div>

          <div className="w-full flex items-center justify-start gap-3 pt-6 border-t border-zinc-900 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold px-6 py-2.5 rounded text-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="bg-transparent text-zinc-500 hover:text-zinc-300 px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}