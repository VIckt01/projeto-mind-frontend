"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { IComment } from "@/services/comment/comment.client";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentsSectionProps {
  articleId: string;
  initialComments: IComment[];
}

export default function CommentsSection({ articleId, initialComments }: CommentsSectionProps) {
  const { user } = useAuth(); // Pega o usuário logado do seu contexto
  const [comments, setComments] = useState<IComment[]>(initialComments);

  // Funções para manter o estado local sincronizado com a API sem recarregar a tela
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
    <section className="border-t border-zinc-900 pt-6 mt-10">
      <h2 className="text-xs font-bold text-white mb-5 flex items-center gap-2">
        Comentários
        <span className="bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-full font-mono text-[10px]">
          {comments.length}
        </span>
      </h2>

      {/* Só exibe o formulário de criar se o usuário estiver logado */}
      {user ? (
        <CommentForm articleId={articleId} onCommentCreated={handleCommentCreated} />
      ) : (
        <div className="bg-[#0f1322] border border-zinc-900 p-4 rounded-xl text-center text-xs text-zinc-500 mb-8">
          Faça login para deixar um comentário neste artigo.
        </div>
      )}

      {/* Mapeando a lista de comentários */}
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
              currentUserId={user?.id} // Passa o ID do usuário logado para validar permissões
              onUpdate={handleCommentUpdated}
              onDelete={handleCommentDeleted}
            />
          ))
        )}
      </div>
    </section>
  );
}