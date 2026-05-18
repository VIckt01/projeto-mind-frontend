"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import DashboardHeader from "./DashboardHeader";
import MyArticles from "./MyArticles";
import Metrics from "./Metrics";
import DeleteModal from "../ui/DeleteModal";
import AtividadeRecente from "./SidebarPlaceholders";

interface Artigo {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  createdAt: string;
  views: number;
  likes: number;
  commentsCount?: number;
  banner?: string | null;
}

export default function DashboardClient({ initialArticles }: { initialArticles: any[] }) {
  const router = useRouter();

  const [artigos, setArtigos] = useState<Artigo[]>(
    initialArticles.map((art: any) => ({
      id: String(art.id),
      title: art.title,
      slug: art.slug,
      content: art.content || "",
      excerpt: art.excerpt || art.content?.substring(0, 120),
      createdAt: new Date(art.createdAt).toLocaleDateString("pt-BR"),
      views: art.views || 0,
      likes: art.likes || 0,
      commentsCount: art.comments?.length || 0,
      banner: art.banner || art.imageUrl,
    }))
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  // Lógica matemática para as métricas do topo
  const totalArtigos = artigos.length;
  const totalEngajamento = artigos.reduce((acc, curr) => acc + curr.views + (curr.commentsCount || 0), 0);
  const totalCurtidas = artigos.reduce((acc, curr) => acc + curr.likes, 0);
  const tempoMedio = artigos.length > 0 
    ? Math.ceil(artigos.reduce((acc, curr) => acc + (curr.content.split(/\s+/).length / 200), 0) / artigos.length) 
    : 0;

  const confirmDeleteClick = (id: string) => {
    setArticleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!articleToDelete) return;
    try {
      await api.delete(`/article/${articleToDelete}`);
      setArtigos((prev) => prev.filter((a) => a.id !== articleToDelete));
      router.refresh();
    } catch (e) {
      console.error("Erro ao deletar o artigo:", e);
    } finally {
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
    }
  };

  return (
    <>
      {isDeleteModalOpen && (
        <DeleteModal
          title="Excluir Artigo?"
          description="Esta ação é permanente. O artigo vai ser apagado de todas as secções."
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={executeDelete}
        />
      )}

      <main className="w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-10">
        <DashboardHeader />
        
        <Metrics 
          total={totalArtigos} 
          engajamento={totalEngajamento} 
          curtidas={totalCurtidas} 
          tempoMedio={Math.max(1, tempoMedio)} // Para nunca mostrar "0 min"
        />

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6 w-full">
            <MyArticles artigos={artigos} onDelete={confirmDeleteClick} />
          </div>
          <div className="lg:col-span-1">
            <AtividadeRecente />
          </div>
        </div>
      </main>
    </>
  );
}