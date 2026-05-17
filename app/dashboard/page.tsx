import React, { Suspense } from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getMyArticlesServer } from "@/services/article/dashboard.server";

async function DataLoader() {
  const articles = await getMyArticlesServer();

  return <DashboardClient initialArticles={articles} />;
}

export default function DashboardPage() {
  return (
    <div className="w-full min-h-screen bg-[#0B0E13] text-white antialiased font-sans select-none relative">
      <Suspense
        fallback={
          <div className="flex flex-col h-screen w-full items-center justify-center gap-4">
            <svg
              className="animate-spin h-10 w-10 text-cyan-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            <span className="text-zinc-500 text-sm font-semibold animate-pulse">
              A carregar o painel...
            </span>
          </div>
        }
      >
        <DataLoader />
      </Suspense>
    </div>
  );
}
