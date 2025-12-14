import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import ScratchCard from "../components/ScratchCard";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/reveal/$token")({
  loader: async ({ params }) => {
    const { data, error } = await supabase.rpc("get_my_match", {
      p_public_token: params.token,
    });

    if (error || !data) {
      throw new Error("Token inválido ou erro ao buscar sorteio");
    }

    return { matchName: data.match_name };
  },
  component: Reveal,
});

function Reveal() {
  const { matchName } = useLoaderData({ from: "/reveal/$token" });
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Seu Amigo Secreto
      </h1>

      <div className="bg-white p-4 rounded-xl shadow-lg">
        <ScratchCard
          width={300}
          height={150}
          isRevealed={isRevealed}
          onReveal={() => setIsRevealed(true)}
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Você tirou:</p>
            <p className="text-2xl font-bold text-blue-600">{matchName}</p>
          </div>
        </ScratchCard>
      </div>

      <button
        type="button"
        onClick={handleReveal}
        disabled={isRevealed}
        className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRevealed ? "Revelado!" : "Revelar Automaticamente"}
      </button>

      <p className="mt-4 text-sm text-gray-500 max-w-xs text-center">
        Raspe o cartão acima ou clique no botão para descobrir quem você tirou.
      </p>
    </div>
  );
}
