"use server";

import axios from "axios";
import { getCookieServer } from "@/lib/cookies/cookieServer";

// Tipagem baseada nos dados do seu Client
interface DashboardArticleProps {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  createdAt: string;
  views: number;
  likes: number;
  banner?: string | null;
  imageUrl?: string | null;
}

export async function getMyArticlesServer(): Promise<DashboardArticleProps[]> {
  const token = await getCookieServer();

  try {
    // Usamos o axios puro e montamos a URL manualmente.
    // Injetamos o token no header Authorization, garantindo que rode no servidor sem quebrar.
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/article/user/me`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    );

    return response.data as DashboardArticleProps[];
  } catch (error) {
    console.log("Erro ao buscar os artigos do usuário:");
    return [];
  }
}
