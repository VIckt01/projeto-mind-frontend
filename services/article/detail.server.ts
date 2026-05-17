"use server";

// Tipagem exata do retorno do backend
export interface ArticleDetailResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  banner: string | null;
  views: number;
  likes: number;
  authorId: string;
  createdAt: string | Date;
  author: {
    name: string;
    profileImg: string | null;
  };
}

export async function getArticleBySlugServer(
  slug: string,
): Promise<ArticleDetailResponse | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // O Next.js fará o fetch no servidor (SSR).
    const response = await fetch(`${apiUrl}/article/${slug}`, {
      method: "GET",
      cache: "no-store", // Garante que trará os dados mais frescos
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data as ArticleDetailResponse;
  } catch (error) {
    console.error(`Erro ao buscar o artigo com slug ${slug}:`, error);
    return null;
  }
}
