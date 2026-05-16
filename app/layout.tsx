import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; 
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; // Importamos o novo Footer padronizado

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
      <body className="antialiased bg-[#070a13] text-white flex flex-col min-h-screen">
        
        <AuthProvider>
          
          {/* TOPO/NAVBAR */}
          <header className="w-full border-b border-zinc-900 bg-[#070a13] sticky top-0 z-50">
            <div className="w-full max-w-[1440px] mx-auto px-10 h-[90px] flex items-center justify-between">
              <div className="text-2xl font-bold tracking-tight text-white select-none">
                &lt;M/&gt;
              </div>
              <Navbar />
            </div>
          </header>

          {/* CONTEÚDO DINÂMICO DAS PÁGINAS */}
          <div className="flex-1 flex flex-col w-full">
            {children}
          </div>

          {/* INJEÇÃO DO FOOTER PADRONIZADO PARA TODO O SITE */}
          <Footer />

        </AuthProvider>

      </body>
    </html>
  );
}