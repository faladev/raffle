import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import ScratchCard from "../components/ScratchCard";
import { getMyMatch } from "../lib/supabase-helpers";

export const Route = createFileRoute("/reveal/$token")({
  loader: async ({ params }) => {
    const matchName = await getMyMatch(params.token);
    return { matchName };
  },
  component: Reveal,
});

function Reveal() {
  const { matchName } = useLoaderData({ from: "/reveal/$token" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg shadow-yellow-500/50 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seu Amigo Secreto
          </h1>
          <p className="text-gray-600 text-sm">
            Raspe o ticket abaixo para descobrir quem você tirou
          </p>
        </div>

        <ScratchCard name={matchName} />

        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Lembre-se
              </p>
              <p className="text-xs text-gray-600">
                Mantenha o segredo! Não compartilhe com ninguém quem você tirou
                no sorteio. A surpresa é a melhor parte! 🎁
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
