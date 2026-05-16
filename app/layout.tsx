import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; // Importa o provedor da raiz
import Navbar from "../components/Navbar"; // Componente dinâmico importado

export const metadata: Metadata = {
  title: "TechBlog - O Futuro da IA",
  description: "Seu portal de tecnologia com artigos e tutoriais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#070a13] text-whiteflex flex-col min-h-screen">
        
        {/* Envolvemos toda a aplicação com o provedor de autenticação */}
        <AuthProvider>
          
         {/* TOPO/NAVBAR DO FIGMA */}
          <header className="w-full border-b border-zinc-900 bg-[#070a13] sticky top-0 z-50">
            <div className="w-full max-w-[1440px] mx-auto px-10 h-[90px] flex items-center justify-between">

             {/* Logo */}
              <div className="text-2xl font-bold tracking-tight text-white select-none">
                &lt;M/&gt;
              </div>

              {/* AQUI ENTRA A NAVBAR DINÂMICA QUE CONVERSA COM O AUTHCONTEXT */}
              <Navbar />

            </div>
          </header>

          {/* O conteúdo de cada página vai aparecer aqui dentro com acesso ao login */}
          <div className="flex-1 flex flex-col w-full">
            {children}
          </div>

        </AuthProvider>

      </body>
    </html>
  );
}