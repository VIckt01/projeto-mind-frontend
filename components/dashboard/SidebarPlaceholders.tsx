import React from "react";

export default function SidebarPlaceholders() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* SECÇÃO DOS ARTIGOS SALVOS */}
      <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-sm font-bold text-white tracking-wide">
          Artigos Salvos
        </h2>
        <div className="text-center text-xs text-zinc-500 py-8 border border-dashed border-zinc-800/80 rounded-lg">
          Os seus favoritos aparecerão aqui em breve.
        </div>
      </div>

      {/* SECÇÃO DE LEITURAS RECENTES */}
      <div className="bg-[#14181F] border border-zinc-900 rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-sm font-bold text-white tracking-wide">
          Leituras Recentes
        </h2>
        <div className="text-center text-xs text-zinc-500 py-8">
          Nenhum histórico de leitura disponível no momento.
        </div>
      </div>
    </div>
  );
}
