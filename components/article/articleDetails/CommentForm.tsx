"use client";

import React, { useState } from "react";
import {
  commentClientService,
  IComment,
} from "@/services/comment/comment.client";

interface CommentFormProps {
  articleId: string;
  onCommentCreated: (newComment: IComment) => void;
}

export default function CommentForm({
  articleId,
  onCommentCreated,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newComment = await commentClientService.create({
        content,
        articleId,
      });
      onCommentCreated(newComment); // Atualiza a lista no componente pai
      setContent(""); // Limpa o campo
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao publicar comentário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d111e]/40 border border-zinc-900 rounded-xl p-4 mb-8"
    >
      <textarea
        required
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Adicione um comentário..."
        className="w-full bg-transparent text-sm text-zinc-300 outline-none resize-none placeholder:text-zinc-600"
      />
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-4 py-1.5 rounded-md text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Comentar"}
        </button>
      </div>
    </form>
  );
}
