import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; // Importa o provedor da raiz

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
      <body className="antialiased bg-[#070a13] text-white">
        
        {/* Envolvemos toda a aplicação com o provedor de autenticação */}
        <AuthProvider>
          
          {/* TOPO/NAVBAR DO FIGMA */}
          <header className="w-full border-b border-zinc-900 bg-[#070a13] sticky top-0 z-50">
            <div className="w-full max-w-[1440px] mx-auto px-10 h-[90px] flex items-center justify-between">
              
              {/* Logo */}
              <div className="text-2xl font-bold tracking-tight text-white select-none">
                &lt;M/&gt;
              </div>

              {/* Menu */}
              <nav className="flex items-center gap-6 text-[13px] font-medium text-zinc-300">
                <a href="/" className="hover:text-white transition-colors">Home</a>
                <a href="/artigos" className="text-zinc-400 hover:text-white transition-colors">Artigos</a>
                
                <span className="text-zinc-800 select-none">|</span>

                {/* ícone Outline da Lua (Dark Mode) */}
                <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                </button>

                <a href="/login" className="hover:text-white transition-colors">Entrar</a>

                <a href="/cadastro" className="bg-cyan-400 text-zinc-950 px-5 py-2.5 rounded font-bold hover:bg-cyan-300 transition-all text-xs uppercase tracking-wider">
                  Cadastrar
                </a>
              </nav>

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