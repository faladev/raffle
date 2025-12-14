import { createFileRoute, useLoaderData } from "@tanstack/react-router";
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-purple-100 to-pink-100 p-4">
      <ScratchCard name={matchName} />
    </div>
  );
}
