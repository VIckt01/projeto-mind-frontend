"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMessageSquare, FiHeart, FiEdit2, FiTrash2 } from "react-icons/fi";

interface MyArticlesProps {
  artigos: any[];
  onDelete: (id: string) => void;
}

export default function MyArticles({ artigos, onDelete }: MyArticlesProps) {
  const router = useRouter();

  return (
    <div className="bg-transparent border border-zinc-800/80 rounded-lg p-6 flex flex-col w-full">
      <h2 className="text-base font-normal text-white mb-6">Meus Artigos</h2>

      <div className="flex flex-col">
        {artigos.map((artigo, index) => (
          <div
            key={artigo.id}
            className={`flex flex-col sm:flex-row justify-between sm:items-center gap-6 py-5 ${
              index !== artigos.length - 1 ? "border-b border-zinc-800/60" : ""
            }`}
          >
            <div className="flex items-start gap-5 flex-1 overflow-hidden">
              <Link
                href={`/artigos/${artigo.slug}`}
                className="w-32 h-20 rounded overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800"
              >
                <img
                  src={
                    artigo.banner ||
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
                  }
                  alt={artigo.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col w-full">
                <Link href={`/artigos/${artigo.slug}`} className="group">
                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors mb-1 truncate">
                    {artigo.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mb-3">
                    {artigo.excerpt}
                  </p>
                </Link>

                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium">
                  <span>{artigo.createdAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <FiMessageSquare size={10} /> {artigo.commentsCount || 0}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <FiHeart size={10} /> {artigo.likes || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-24">
              <button
                onClick={() => router.push(`/editar-artigo/${artigo.id}`)}
                className="w-full px-3 py-1.5 border border-zinc-700 text-zinc-300 text-[11px] rounded hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiEdit2 size={10} />
                Editar
              </button>
              <button
                onClick={() => onDelete(artigo.id)}
                className="w-full px-3 py-1.5 border border-red-900/50 text-red-400 text-[11px] rounded hover:bg-red-950/40 hover:border-red-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiTrash2 size={10} />
                Excluir
              </button>
            </div>
          </div>
        ))}

        {artigos.length === 0 && (
          <div className="text-center text-xs text-zinc-500 py-12 border border-dashed border-zinc-800/80 rounded-lg">
            Você ainda não publicou nenhum artigo.
          </div>
        )}
      </div>
    </div>
  );
}
