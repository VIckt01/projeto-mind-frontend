"use server";

// Tipagem exata do retorno do backend
export interface ExploreArticleResponse {
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
  category?: string;
  author: {
    name: string;
    email: string;
  };
}

export async function getAllArticlesServer(): Promise<
  ExploreArticleResponse[]
> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/article`, {
      method: "GET",
      cache: "no-store", // Garante execução no servidor (SSR) sem cache estático
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();

    // Retornamos os dados brutos como vieram do backend, sem fazer .map()
    return data as ExploreArticleResponse[];
  } catch (error) {
    console.error("Erro ao buscar todos os artigos:", error);
    return [];
  }
}
