import React from "react";

export default function Metrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28">
        <span className="text-zinc-500 font-bold text-[11px]">
          Total de Artigos
        </span>
        <span className="text-3xl font-bold">12</span>
      </div>
      <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28">
        <span className="text-zinc-500 font-bold text-[11px]">Engajamento</span>
        <span className="text-3xl font-bold">340</span>
      </div>
      <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28">
        <span className="text-zinc-500 font-bold text-[11px]">Curtidas</span>
        <span className="text-3xl font-bold">150</span>
      </div>
      <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-28">
        <span className="text-zinc-500 font-bold text-[11px]">
          Tempo de Leitura
        </span>
        <span className="text-3xl font-bold">45 min</span>
      </div>
    </div>
  );
}
