import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import ScratchCard from "../components/ScratchCard";
import { getMyMatch } from "../lib/supabase-helpers";

export const Route = createFileRoute("/reveal/$token")({
  loader: async ({ params }) => {
    const matchData = await getMyMatch(params.token);
    return { matchData };
  },
  component: Reveal,
});

function Reveal() {
  const { matchData } = useLoaderData({ from: "/reveal/$token" });

  // Fallback para o caso do backend não ter sido atualizado ainda
  const groupName = matchData.group_name || "Amigo Secreto";
  const matchName = matchData.match_name;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="relative">
          {/* Gift box lid with 3D effect */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[95%] h-16 bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 rounded-t-2xl border-2 border-blue-300/30 shadow-2xl z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {/* Lid decoration line */}
            <div className="absolute inset-x-0 top-2 flex justify-center gap-2">
              <div className="w-16 h-2 bg-yellow-400/60 rounded-full" />
            </div>
            {/* Bow on top */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-300/20 shadow-lg">
              <div className="text-xl">🎀</div>
            </div>
          </div>

          {/* Main gift box body */}
          <div className="relative bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200 hover:shadow-blue-500/20 transition-shadow duration-500 pt-12">
            {/* Ribbon lines */}
            <div className="absolute inset-x-0 top-12 h-2 bg-gradient-to-r from-blue-500/20 via-yellow-400/40 to-blue-500/20" />
            <div className="absolute inset-x-0 top-16 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

            <div className="p-8 relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                    <svg
                      className="w-8 h-8 text-blue-600"
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
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {groupName}
                    </h1>
                    <p className="text-sm text-gray-600 font-mono uppercase tracking-wider flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-yellow-500 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      Raspe para Descobrir
                    </p>
                  </div>
                </div>
              </div>

              {/* Scratch area */}
              <ScratchCard name={matchName} />

              <p className="text-xs text-gray-500 text-center mt-4 font-mono animate-pulse flex items-center justify-center gap-2">
                <span>👆</span>
                <span>Use o mouse ou toque para raspar</span>
                <span>👆</span>
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50/50">
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <p className="text-xs text-gray-600 font-mono">
                    #AMIGO-SECRETO-2025
                  </p>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              </div>
            </div>
          </div>

          {/* Shadow effect below package */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-blue-500/5 rounded-full blur-xl" />
        </div>
      </div>
    </main>
  );
}
