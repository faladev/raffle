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
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-purple-100 to-pink-100 p-4">
      <ScratchCard name={matchName} />
    </div>
  );
}
