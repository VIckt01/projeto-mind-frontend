import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor: Pega o cookie 'session' e injeta na requisição
api.interceptors.request.use((config) => {
  // Função nativa simples para ler cookies no client-side
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const token = getCookie("session");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
