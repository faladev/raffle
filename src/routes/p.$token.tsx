import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/p/$token")({
  loader: async ({ params }) => {
    const { data: participants, error } = await supabase.rpc(
      "get_participants_public_list",
      { p_group_id: params.token },
    );

    if (error) {
      throw new Error("Grupo não encontrado ou erro ao carregar participantes");
    }

    return { participants };
  },
  component: ParticipantSelection,
});

function ParticipantSelection() {
  const { participants } = useLoaderData({ from: "/p/$token" });
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSelect = async (participantId: string) => {
    setLoadingId(participantId);
    try {
      const { data: token, error } = await supabase.rpc(
        "get_participant_token",
        {
          p_participant_id: participantId,
        },
      );

      if (error) throw error;

      if (token) {
        navigate({
          to: "/reveal/$token",
          params: { token },
        });
      }
    } catch (err) {
      console.error("Error fetching token:", err);
      alert("Erro ao entrar. Tente novamente.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Quem é você?
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Selecione seu nome para descobrir seu amigo secreto.
      </p>

      <div className="grid gap-3">
        {participants?.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => handleSelect(p.id)}
            disabled={loadingId !== null}
            className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span className="font-medium text-gray-800">{p.name}</span>
            {loadingId === p.id && (
              <span className="float-right text-sm text-blue-600">
                Entrando...
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
