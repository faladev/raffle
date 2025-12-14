import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin/$token")({
  loader: async ({ params }) => {
    const { data: group, error: groupError } = await supabase
      .rpc("get_group_by_admin_token", { p_admin_token: params.token })
      .single();

    if (groupError || !group) {
      throw new Error("Grupo não encontrado ou token inválido");
    }

    const { data: participants, error: partError } = await supabase.rpc(
      "get_participants_by_admin_token",
      { p_admin_token: params.token },
    );

    if (partError) {
      throw new Error("Erro ao carregar participantes");
    }

    return { group, participants };
  },
  component: Admin,
});

function Admin() {
  const { group, participants } = useLoaderData({ from: "/admin/$token" });
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);

  const adminLink = globalThis.location.href;
  const publicLink = `${globalThis.location.origin}/p/${group.id}`; // Using group ID for public access entry point

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">{group.name}</h1>
      <span className="inline-block px-2 py-1 text-xs font-semibold tracking-wide text-green-800 bg-green-100 rounded-full mb-6">
        Status: {group.status === "open" ? "Aberto" : "Sorteado"}
      </span>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Link de Administração (Não compartilhe com ninguém!)
          </h3>
          <div className="flex gap-2">
            <input
              readOnly
              value={adminLink}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(adminLink, setCopiedAdmin)}
              className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-900 transition-colors"
            >
              {copiedAdmin ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Link para Participantes (Envie este para o grupo)
          </h3>
          <div className="flex gap-2">
            <input
              readOnly
              value={publicLink}
              className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-md text-sm text-gray-600"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(publicLink, setCopiedPublic)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              {copiedPublic ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Participantes ({participants?.length || 0})
          </h3>
          <ul className="divide-y divide-gray-200">
            {participants?.map((p) => (
              <li key={p.id} className="py-3 flex justify-between items-center">
                <span className="text-gray-700">{p.name}</span>
                <span className="text-xs text-gray-500">
                  {/* Placeholder for status if we add it later */}
                  Aguardando revelação
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
