"use client";

import React, { useState } from "react";
import Link from "next/link"; // Adicionado para o botão de login
import { useAuth } from "@/context/AuthContext";
import { IComment } from "@/services/comment/comment.client";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentsSectionProps {
  articleId: string;
  initialComments: IComment[];
}

export default function CommentsSection({ articleId, initialComments }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<IComment[]>(initialComments);

  // Mantém o estado local sincronizado com a API sem recarregar a tela
  const handleCommentCreated = (newComment: IComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentUpdated = (updatedComment: IComment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? { ...c, content: updatedComment.content } : c))
    );
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <section className="w-full border-t border-zinc-800/60 pt-10 mt-10">
      {/* Título idêntico ao design */}
      <h3 className="text-xs font-bold text-zinc-300 mb-6">
        Comentários ({comments.length})
      </h3>

      {/* Condicional de Login */}
      {user ? (
        <CommentForm articleId={articleId} onCommentCreated={handleCommentCreated} />
      ) : (
        <div className="w-full border border-zinc-800/60 bg-[#0a0d17] p-10 rounded flex flex-col items-center justify-center gap-4 mb-8">
          <span className="text-xs text-zinc-500">Faça login para comentar</span>
          <Link 
            href="/login" 
            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-2 rounded text-xs font-bold transition-colors cursor-pointer"
          >
            Fazer login
          </Link>
        </div>
      )}

      {/* Lista de Comentários */}
      <div className="flex flex-col gap-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-zinc-600 text-xs">
            Seja o primeiro a comentar!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              onUpdate={handleCommentUpdated}
              onDelete={handleCommentDeleted}
            />
          ))
        )}
      </div>
    </section>
  );
}