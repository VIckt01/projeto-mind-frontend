import React from "react";
import { FiMessageSquare } from "react-icons/fi";

export default function AtividadeRecente() {
  // Dados simulados para bater com o design (até termos uma tabela de atividades no Prisma)
  const activities = [
    { id: 1, name: "Marie Smith", time: "5 min atrás", article: "O Futuro da Inteligência Artificial em 2025" },
    { id: 2, name: "Marie Smith", time: "5 min atrás", article: "O Futuro da Inteligência Artificial em 2025" },
    { id: 3, name: "Marie Smith", time: "5 min atrás", article: "O Futuro da Inteligência Artificial em 2025" },
  ];

  return (
    <div className="bg-transparent border border-zinc-800/80 rounded-lg p-6 flex flex-col w-full">
      <h2 className="text-base font-normal text-white mb-6">Atividade Recente</h2>
      
      <div className="flex flex-col">
        {activities.map((item, index) => (
          <div 
            key={item.id} 
            className={`flex items-start gap-3 py-4 ${index !== activities.length - 1 ? "border-b border-zinc-800/60" : ""}`}
          >
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" 
              alt={item.name} 
              className="w-8 h-8 rounded object-cover shrink-0 border border-zinc-800"
            />
            <div className="flex flex-col gap-1">
              <p className="text-[11px] text-zinc-400 leading-snug">
                <strong className="text-zinc-200 font-semibold">{item.name}</strong> comentou em <br/>
                <span className="text-zinc-100 font-medium">{item.article}</span>
              </p>
              <span className="flex items-center gap-1 text-[9px] text-zinc-600 mt-0.5">
                <FiMessageSquare size={10} />
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}