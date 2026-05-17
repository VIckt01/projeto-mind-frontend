"use server";

import { getCookieServer } from "@/lib/cookies/cookieServer";

export interface ArticleResponse {
  id: string;
  createdAt: string | Date;
  title: string;
  content: string;
  authorId: string;
  slug: string;
  excerpt: string;
  banner: string | null;
  views: number;
  likes: number;
  author: {
    name: string;
    profileImg: string | null;
  };
}

export async function getHomeArticlesServer() {
  const token = await getCookieServer();

  // 1. Validando a URL no servidor
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log("🔥 [SSR] A URL da API resolvida no servidor é:", apiUrl);

  try {
    // Montando os headers de forma mais segura (não envia header se não tiver token)
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 2. Trocando Axios por Fetch nativo (Padrão Next.js App Router)
    const response = await fetch(`${apiUrl}/article/home`, {
      method: "GET",
      headers,
      cache: "no-store", // Garante que o Next.js não vai usar cache antigo
    });

    // 3. Checando se a resposta da API foi sucesso (Status 200-299)
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ [SSR] Dados recebidos da API com sucesso!");

    return {
      featured: (data.destaques || []) as ArticleResponse[],
      recent: (data.recentes || []) as ArticleResponse[],
    };
  } catch (error: any) {
    // 4. Agora sim vamos ver o erro real no terminal do Next.js!
    console.error("❌ [SSR] Erro REAL ao buscar artigos da Home:");
    console.error(error.message || error);
    return { featured: [], recent: [] };
  }
}
