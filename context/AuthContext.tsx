"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  profileImg?: string;
  bio?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loginState: (userData: User) => void; // Apenas seta o state
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const hydrateSession = async () => {
      // Verifica se o cookie 'session' existe
      const hasSessionCookie = document.cookie.includes("session=");

      if (!hasSessionCookie) {
        setLoading(false);
        return;
      }

      try {
        // Se tem cookie, busca os dados reais e atualizados do usuário
        const response = await api.get("/auth/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Sessão inválida. Limpando...");
        logout();
      } finally {
        setLoading(false);
      }
    };

    hydrateSession();
  }, []);

  // Método usado na tela de login apenas para salvar o usuário em memória
  const loginState = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    // Deleta o cookie setando a data de expiração para o passado
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loginState, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
