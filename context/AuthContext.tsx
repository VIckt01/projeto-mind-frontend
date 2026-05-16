"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedAuth = localStorage.getItem("techblog_auth");
    
    if (storedAuth) {
      const { user, expiresAt } = JSON.parse(storedAuth);

      // SISTEMA DE EXPIRAÇÃO: Se o tempo atual passou do prazo, desloga
      if (Date.now() > expiresAt) {
        logout();
      } else {
        setUser(user);
      }
    }
    setLoading(false);
  }, []);

  // PROTEÇÃO DE ROTAS: Se o usuário não estiver logado e tentar acessar rotas restritas
  useEffect(() => {
    const rotasRestritas = ["/dashboard", "/novo-artigo", "/editar-artigo"];
    
    if (!loading && !user && rotasRestritas.includes(pathname)) {
      router.push("/"); // Chuta o usuário de volta para a Home se a sessão expirar
    }
  }, [user, pathname, loading]);

  const login = (userData: User) => {
    // Define que a sessão vai expirar em 40 dias a partir de agora
   const dias = 40;
    const tempoExpiracao = Date.now() + (dias * 24 * 60 * 60 * 1000); 
    
    localStorage.setItem(
      "techblog_auth",
      JSON.stringify({ user: userData, expiresAt: tempoExpiracao })
    );
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("techblog_auth");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);