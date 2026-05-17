import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Pega o token salvo nos cookies com o nome "session"
  const sessionToken = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Define quais rotas são privadas
  const rotasPrivadas = ["/dashboard", "/criar-artigo", "/editar-artigo"];

  const isRotaPrivada = rotasPrivadas.some((route) =>
    pathname.startsWith(route),
  );

  // Se for rota privada e não tiver o cookie "session", redireciona para o login
  if (isRotaPrivada && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Bônus UX: Se estiver logado e tentar acessar o /login, manda pro dashboard
  if (pathname === "/login" && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next(); // Libera o acesso
}

// Configuração para dizer ao Next.js em quais rotas ele deve ativar esse proxy
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/criar-artigo/:path*",
    "/editar-artigo/:path*",
    "/login",
  ],
};
