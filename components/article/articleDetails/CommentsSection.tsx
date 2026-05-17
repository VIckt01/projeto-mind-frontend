"use client";

import React from "react";

export default function CommentsSection() {
  return (
    <section className="border-t border-zinc-900 pt-6 mt-10">
      <h2 className="text-xs font-bold text-white mb-5">Comentários (0)</h2>

      <div className="bg-[#0d111e]/40 border border-zinc-900 rounded-xl p-4 mb-8">
        <textarea
          rows={3}
          disabled
          placeholder="A secção de comentários estará disponível em breve..."
          className="w-full bg-transparent text-sm text-zinc-500 outline-none resize-none cursor-not-allowed"
        />
        <div className="flex justify-end mt-2">
          <button
            disabled
            className="bg-zinc-800 text-zinc-600 font-bold px-4 py-1.5 rounded-md text-xs cursor-not-allowed"
          >
            Comentar
          </button>
        </div>
      </div>

      <div className="text-center py-8 text-zinc-600 text-xs">
        Seja o primeiro a comentar quando a funcionalidade for lançada!
      </div>
    </section>
  );
}
