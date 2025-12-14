import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import {
  getGroupByAdminToken,
  getParticipantsByAdminToken,
} from "../lib/supabase-helpers";
import type { Participant } from "../types";

export const Route = createFileRoute("/admin/$token")({
  loader: async ({ params }) => {
    const group = await getGroupByAdminToken(params.token);
    const participants = await getParticipantsByAdminToken(params.token);

    return { group, participants };
  },
  component: Admin,
});

function Admin() {
  const { group, participants } = useLoaderData({ from: "/admin/$token" });
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);

  const adminLink = globalThis.location.href;
  const publicLink = `${globalThis.location.origin}${import.meta.env.BASE_URL}p/${group.id}`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50 mb-4">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {group.name}
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-700">
              {group.status === "open" ? "Sorteio Aberto" : "Sorteio Realizado"}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-50">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Link de Administração
                </h3>
                <p className="text-xs text-red-600 mb-3">
                  ⚠️ Não compartilhe este link! Use apenas para gerenciar o
                  sorteio
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={adminLink}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(adminLink, setCopiedAdmin)}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/25 flex items-center gap-2 shrink-0"
                  >
                    {copiedAdmin ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-200/50 p-6 border border-blue-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-50">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Link para Participantes
                </h3>
                <p className="text-xs text-blue-600 mb-3">
                  📤 Compartilhe este link com todos os participantes do sorteio
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={publicLink}
                    className="flex-1 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(publicLink, setCopiedPublic)}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shrink-0"
                  >
                    {copiedPublic ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                Lista de Participantes
              </h3>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                {participants.length}{" "}
                {participants.length === 1 ? "pessoa" : "pessoas"}
              </span>
            </div>
            <div className="space-y-2">
              {participants.map((p: Participant, index: number) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                      {index + 1}
                    </div>
                    <span className="text-gray-900 font-medium">{p.name}</span>
                  </div>
                  {p.revealed_at ? (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Já visualizou
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Aguardando revelação
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Mantenha este link de administração em segurança
          </p>
        </div>
      </div>
    </div>
  );
}
