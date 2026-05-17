import React from "react";

interface DeleteModalProps {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  title,
  description,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#14181F] border border-zinc-800 p-6 rounded-xl max-w-sm w-full text-center">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-zinc-400 mb-6">{description}</p>
        <div className="flex w-full gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer hover:bg-zinc-700 text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-600 text-white transition-colors"
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
