"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsBookmarkFill } from "react-icons/bs"; // <-- Importando o react-icons aqui

interface MyArticlesProps {
  artigos: any[];
  onDelete: (id: string) => void;
}

export default function MyArticles({ artigos, onDelete }: MyArticlesProps) {
  const router = useRouter();

  return (
    <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
      <h2 className="text-sm font-bold text-white tracking-wide">
        Meus Artigos
      </h2>
      <div className="flex flex-col gap-4">
        {artigos.map((artigo) => (
          <div
            key={artigo.id}
            className="border border-zinc-900/60 bg-[#0B0E13]/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
          >
            <Link
              href={`/artigos/${artigo.slug}`}
              className="flex items-center gap-4 flex-1"
            >
              <div className="w-24 h-16 rounded overflow-hidden shrink-0">
                <img
                  src={artigo.banner || ""}
                  alt={artigo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <BsBookmarkFill
                    className="text-cyan-400 shrink-0"
                    size={12}
                  />{" "}
                  {artigo.title}
                </h3>
                <p className="text-[11px] text-zinc-500 line-clamp-1">
                  {artigo.excerpt}
                </p>
              </div>
            </Link>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => router.push(`/editar-artigo/${artigo.id}`)}
                className="px-2.5 py-1.5 border border-zinc-800 text-[11px] font-semibold rounded cursor-pointer hover:bg-zinc-800"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(artigo.id)}
                className="px-2.5 py-1.5 border border-red-950/20 text-red-400 text-[11px] font-semibold rounded cursor-pointer hover:bg-red-950/40"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
        {artigos.length === 0 && (
          <div className="text-center text-xs text-zinc-500 py-8 border border-dashed border-zinc-800/80 rounded-lg">
            Você ainda não tem artigos publicados.
          </div>
        )}
      </div>
    </div>
  );
}
