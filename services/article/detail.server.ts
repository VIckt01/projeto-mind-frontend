"use server";

import { IComment } from "../comment/comment.client";

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
  comments: IComment[];
}

export async function getArticleBySlugServer(
  slug: string,
): Promise<ArticleDetailResponse | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // CORREÇÃO: Batendo no caminho exato isolado por slug (/article/slug/:slug)
    const response = await fetch(`${apiUrl}/article/slug/${slug}`, {
      method: "GET",
      cache: "no-store",
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
