import React from "react";
import Link from "next/link";

interface Comment {
  id: number;
  author: string;
  avatarInitials: string;
  date: string;
  content: string;
}

export default async function DetalheArtigoPage() {
  // Simulando dados de um artigo aberto baseado no padrão do seu app/page.tsx
  const article = {
    title: "O Futuro da Inteligência Artificial em 2025",
    description: "Explorando as tendências e inovações que moldarão o futuro da IA nos próximos anos.",
    category: "Desenvolvimento web",
    date: "20/05/2026",
    readTime: "6 min",
    author: "John Doe",
    views: "122",
    likes: "1",
    commentsCount: "2",
    content: `A inteligência artificial continua a evoluir em um ritmo acelerado. Neste artigo, vamos explorar as principais tendências e inovações que estão moldando o futuro da IA.

    Modelos de Linguagem Avançados
    Os modelos de linguagem como GPT-4 e além estão se tornando cada vez mais sofisticados, capazes de entender e gerar texto com precisão impressionante.

    Automação Inteligente
    A automação está alcançando novos patamares com sistemas de IA que podem tomar decisões complexas e adaptar-se a novas situações.

    Ética e Responsabilidade
    Com o avanço da IA, questões éticas se tornam cada vez mais importantes. É crucial desenvolver sistemas responsáveis e transparentes.`
  };

  const comments: Comment[] = [
    {
      id: 1,
      author: "John Doe",
      avatarInitials: "JD",
      date: "20/05/2026",
      content: "Excelente artigo! Muito bem detalhado todas as tendências da IA."
    },
    {
      id: 2,
      author: "Maria Smith",
      avatarInitials: "MS",
      date: "19/05/2026",
      content: "Artigo muito interessante, mostra claramente como a IA está deixando de ser uma tendência para se tornar parte essencial das soluções do dia a dia."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-zinc-100 antialiased font-sans flex flex-col items-center">
      <main className="w-full max-w-3xl px-4 py-12 flex flex-col">
        
        {/* BOTÃO VOLTAR */}
        <Link href="/artigos" className="text-xs text-zinc-500 hover:text-cyan-400 flex items-center gap-2 mb-8 group transition-colors w-max">
          <span>&larr;</span> Voltar aos Artigos
        </Link>

        {/* TAG DA CATEGORIA */}
        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold w-max mb-4 uppercase">
          {article.category}
        </span>

        {/* TÍTULO E SUBTÍTULO */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
          {article.description}
        </p>

        {/* METADADOS DO AUTOR */}
        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-4 mt-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-xs text-zinc-300">
              JD
            </div>
            <div className="flex flex-col text-[11px]">
              <span className="font-bold text-zinc-200">{article.author}</span>
              <span className="text-zinc-500">{article.date} • {article.readTime}</span>
            </div>
          </div>
          
          {/* Ícones de Interação Lateral Sutil */}
          <div className="flex items-center gap-3 text-zinc-500 text-xs">
            <button className="hover:text-white transition-colors cursor-pointer">🤍</button>
            <button className="hover:text-white transition-colors cursor-pointer">🔖</button>
            <button className="hover:text-white transition-colors cursor-pointer">🔗</button>
          </div>
        </div>

        {/* CONTADORES VISUAIS */}
        <div className="flex items-center gap-4 text-[10px] text-zinc-500 mt-3 font-mono">
          <span>❤️ {article.likes} curtida</span>
          <span>👁️ {article.views} visualizações</span>
          <span>💬 {article.commentsCount} comentários</span>
        </div>

        {/* IMAGEM BANNER PRINCIPAL (PLACEHOLDER FIEL) */}
        <div className="w-full h-64 md:h-80 bg-[#ffb6b6] relative flex items-center justify-center overflow-hidden select-none rounded-xl my-8">
          <span className="text-zinc-900 font-serif font-black text-4xl tracking-tighter">Lorem ipsum</span>
          <div className="absolute bottom-0 right-0 w-44 h-20 bg-[#bfdbfe] transform rotate-12 translate-x-10 translate-y-10"></div>
        </div>

        {/* CONTEÚDO TEXTUAL DO ARTIGO */}
        <div className="text-zinc-300 text-sm md:text-base leading-relaxed space-y-6 whitespace-pre-line border-b border-zinc-900 pb-10">
          {article.content}
        </div>

        {/* FOOTER DO ARTIGO (TAGS) */}
        <div className="flex flex-wrap gap-2 mt-4 mb-12">
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded">Desenvolvimento web</span>
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded">Inteligência Artificial</span>
        </div>

        {/* SEÇÃO DE COMENTÁRIOS */}
        <section className="w-full">
          <h2 className="text-sm font-bold text-white mb-4">Comentários ({article.commentsCount})</h2>

          {/* Bloqueio / Caixa de Login simulada */}
          <div className="w-full bg-[#0d111e]/40 border border-zinc-900 rounded-xl p-6 text-center mb-6">
            <p className="text-xs text-zinc-500 mb-3">Faça login para comentar</p>
            <button className="bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold px-4 py-1.5 rounded-md text-xs transition-colors cursor-pointer">
              Fazer login
            </button>
          </div>

          {/* Iteração de Comentários */}
          <div className="flex flex-col gap-4 w-full">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-[#0d111e]/20 border border-zinc-900/60 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-400">
                      {comment.avatarInitials}
                    </div>
                    <span className="text-xs font-bold text-zinc-200">{comment.author}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{comment.date}</span>
                </div>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed pl-1">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}