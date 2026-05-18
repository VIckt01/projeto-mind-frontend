import React from "react";
import { FiFileText, FiMessageSquare, FiHeart, FiTrendingUp } from "react-icons/fi";

interface MetricsProps {
  total: number;
  engajamento: number;
  curtidas: number;
  tempoMedio: number;
}

export default function Metrics({ total, engajamento, curtidas, tempoMedio }: MetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-transparent border border-zinc-800/80 rounded-lg p-5 flex flex-col justify-between h-28 relative">
        <FiFileText className="text-zinc-600 absolute top-5 right-5" size={18} />
        <span className="text-zinc-500 text-xs">Total de Artigos</span>
        <span className="text-3xl font-light text-white">{total}</span>
      </div>
      <div className="bg-transparent border border-zinc-800/80 rounded-lg p-5 flex flex-col justify-between h-28 relative">
        <FiMessageSquare className="text-zinc-600 absolute top-5 right-5" size={18} />
        <span className="text-zinc-500 text-xs">Engajamento</span>
        <span className="text-3xl font-light text-white">{engajamento}</span>
      </div>
      <div className="bg-transparent border border-zinc-800/80 rounded-lg p-5 flex flex-col justify-between h-28 relative">
        <FiHeart className="text-zinc-600 absolute top-5 right-5" size={18} />
        <span className="text-zinc-500 text-xs">Curtidas</span>
        <span className="text-3xl font-light text-white">{curtidas}</span>
      </div>
      <div className="bg-transparent border border-zinc-800/80 rounded-lg p-5 flex flex-col justify-between h-28 relative">
        <FiTrendingUp className="text-zinc-600 absolute top-5 right-5" size={18} />
        <span className="text-zinc-500 text-xs">Tempo médio de leitura</span>
        <span className="text-3xl font-light text-white">{tempoMedio} <span className="text-lg">min</span></span>
      </div>
    </div>
  );
}