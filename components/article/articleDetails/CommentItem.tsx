"use client";

import React, { useState } from "react";
import {
  commentClientService,
  IComment,
} from "@/services/comment/comment.client";
import DeleteModal from "@/components/ui/DeleteModal";

interface CommentItemProps {
  comment: IComment;
  currentUserId?: string;
  onUpdate: (updatedComment: IComment) => void;
  onDelete: (commentId: string) => void;
}

export default function CommentItem({
  comment,
  currentUserId,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controle do modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isOwner = currentUserId === comment.authorId;

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    setIsSubmitting(true);
    try {
      const updated = await commentClientService.update({
        id: comment.id,
        content: editContent,
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar", error);
      alert("Erro ao atualizar o comentário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await commentClientService.delete(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error("Erro ao deletar", error);
      alert("Erro ao excluir o comentário.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      {isDeleteModalOpen && (
        <DeleteModal
          title="Excluir Comentário?"
          description="Tem certeza de que deseja excluir este comentário? Esta ação não pode ser desfeita."
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <div className="flex gap-4 p-4 rounded-lg bg-zinc-900/20 border border-zinc-900/50">
        <img
          src={
            comment.author.profileImg ||
            "https://ui-avatars.com/api/?name=" + comment.author.name
          }
          alt={comment.author.name}
          className="w-8 h-8 rounded-full object-cover border border-zinc-800"
        />

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-bold text-zinc-300">
                {comment.author.name}
              </span>
              <span className="text-[10px] text-zinc-600 ml-2">
                {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>

            {isOwner && !isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-2 mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-[#0d111e] border border-zinc-800 text-xs text-zinc-300 p-2 rounded outline-none resize-none focus:border-cyan-500/50 transition-colors"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-[10px] font-bold px-3 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
