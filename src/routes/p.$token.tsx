import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import {
  getParticipantsPublicList,
  getParticipantToken,
} from "../lib/supabase-helpers";

export const Route = createFileRoute("/p/$token")({
  loader: async ({ params }) => {
    const participants = await getParticipantsPublicList(params.token);
    return { participants };
  },
  component: ParticipantSelection,
});

function ParticipantSelection() {
  const { participants } = useLoaderData({ from: "/p/$token" });
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredParticipants =
    query.length >= 3
      ? participants.filter((p: { name: string }) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const handleSelect = (participant: { id: string; name: string } | null) => {
    if (!participant) return;
    setSelectedParticipant(participant);
  };

  const handleConfirm = async () => {
    if (!selectedParticipant) return;

    setLoading(true);
    try {
      const token = await getParticipantToken(selectedParticipant.id);
      navigate({
        to: "/reveal/$token",
        params: { token },
      });
    } catch (err) {
      console.error("Error fetching token:", err);
      alert("Erro ao entrar. Tente novamente.");
      setSelectedParticipant(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50 mb-4">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quem é você?
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Selecione seu nome abaixo para revelar seu amigo secreto
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Buscar Participante
            </h2>
            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              {participants.length}{" "}
              {participants.length === 1 ? "pessoa" : "pessoas"}
            </span>
          </div>

          <Combobox
            value={selectedParticipant}
            onChange={handleSelect}
            disabled={loading}
          >
            <div className="relative">
              <ComboboxInput
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder:text-gray-400"
                placeholder="Digite seu nome (mínimo 3 letras)..."
                displayValue={(participant: { name: string } | null) =>
                  participant?.name || ""
                }
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
              />

              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="animate-spin h-5 w-5 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              )}

              {query.length > 0 && query.length < 3 && (
                <p className="mt-2 text-sm text-gray-500">
                  Digite pelo menos 3 letras para buscar
                </p>
              )}

              {query.length >= 3 && filteredParticipants.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Nenhum participante encontrado
                </p>
              )}

              <ComboboxOptions className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {filteredParticipants.map(
                  (participant: { id: string; name: string }) => (
                    <ComboboxOption
                      key={participant.id}
                      value={participant}
                      className="group cursor-pointer select-none px-5 py-3 data-[focus]:bg-purple-50 data-[focus]:text-purple-900 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 group-data-[focus]:text-purple-900">
                          {participant.name}
                        </span>
                      </div>
                    </ComboboxOption>
                  ),
                )}
              </ComboboxOptions>
            </div>
          </Combobox>

          {selectedParticipant && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
                    {selectedParticipant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 font-medium">
                      Participante selecionado
                    </p>
                    <p className="text-lg font-bold text-purple-900">
                      {selectedParticipant.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedParticipant(null)}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                  disabled={loading}
                  aria-label="Cancelar seleção"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="mt-4 w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar e Revelar</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-purple-600 shrink-0 mt-0.5"
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
                <p className="text-sm font-semibold text-purple-900 mb-1">
                  Dica importante
                </p>
                <p className="text-xs text-purple-700">
                  Digite seu nome no campo acima (mínimo 3 letras) e selecione
                  na lista para revelar quem você tirou. Não compartilhe o
                  resultado com ninguém!
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Divirta-se e mantenha o segredo! 🎁
        </p>
      </div>
    </div>
  );
}
