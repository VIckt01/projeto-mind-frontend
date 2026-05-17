"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/services/api";
import DashboardHeader from "./DashboardHeader";
import MyArticles from "./MyArticles";
import DeleteModal from "./DeleteModal";
import Metrics from "./Metrics";
import SidebarPlaceholders from "./SidebarPlaceholders";

interface Artigo {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  createdAt: string;
  views: number;
  likes: number;
  banner?: string | null;
}

export default function DashboardClient({
  initialArticles,
}: {
  initialArticles: any[];
}) {
  const router = useRouter();

  // Formatando os dados vindos do servidor
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
      banner: art.banner || art.imageUrl,
    })),
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const confirmDeleteClick = (id: string) => {
    setArticleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!articleToDelete) return;

    try {
      // O seu interceptor do Axios vai injetar o token "session" automaticamente aqui
      await api.delete(`/article/${articleToDelete}`);

      // Remove da UI imediatamente sem precisar dar F5
      setArtigos((prev) => prev.filter((a) => a.id !== articleToDelete));
      router.refresh(); // Força o Next.js a atualizar os dados do servidor silenciosamente em background
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
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={executeDelete}
        />
      )}

      <main className="w-full max-w-[1440px] mx-auto px-10 py-12 flex flex-col gap-8">
        <DashboardHeader />
        <Metrics />

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6 w-full">
            <MyArticles artigos={artigos} onDelete={confirmDeleteClick} />
          </div>

          <div className="lg:col-span-1">
            <SidebarPlaceholders />
          </div>
        </div>
      </main>
    </>
  );
}
