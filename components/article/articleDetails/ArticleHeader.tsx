"use client";

import React, { useState } from "react";
import {
  BsHeart,
  BsHeartFill,
  BsBookmark,
  BsBookmarkFill,
} from "react-icons/bs";
import { ArticleDetailResponse } from "@/services/article/detail.server";

interface ArticleHeaderProps {
  article: ArticleDetailResponse;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  // Estados visuais apenas (como o backend ainda não tem essas features, mantemos a UI reativa)
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const readTime = `${Math.ceil((article.content?.split(/\s+/).length || 0) / 200) || 1} min`;
  const formattedDate = new Date(article.createdAt).toLocaleDateString("pt-BR");

  return (
    <>
      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-max mb-4">
        {/* Como o backend não manda category, deixei Tecnologia como genérico */}
        Tecnologia
      </span>

      <h1 className="text-3xl font-extrabold text-white">{article.title}</h1>
      <p className="text-zinc-400 text-sm mt-2">{article.excerpt}</p>

      <div className="w-full flex items-center justify-between border-b border-zinc-900 pb-4 mt-6">
        <div className="flex items-center gap-3">
          {article.author.profileImg ? (
            <img
              src={article.author.profileImg}
              alt={article.author.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#14181F] flex items-center justify-center font-bold text-xs">
              {getInitials(article.author.name)}
            </div>
          )}
          <div className="flex flex-col text-[11px]">
            <span className="font-bold">{article.author.name}</span>
            <span className="text-zinc-500">
              {formattedDate} • {readTime} de leitura
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 cursor-pointer transition-transform active:scale-90 ${liked ? "text-red-500" : "text-zinc-500 hover:text-white"}`}
            title="Curtir Artigo"
          >
            {liked ? <BsHeartFill size={18} /> : <BsHeart size={18} />}
            <span className="text-xs">{likesCount}</span>
          </button>

          <button
            onClick={handleSave}
            className={`cursor-pointer transition-transform active:scale-90 ${saved ? "text-cyan-400" : "text-zinc-500 hover:text-white"}`}
            title="Salvar Artigo"
          >
            {saved ? <BsBookmarkFill size={18} /> : <BsBookmark size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
