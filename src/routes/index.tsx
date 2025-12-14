import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createRaffleGroup } from "../lib/supabase-helpers";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [names, setNames] = useState<{ id: string; value: string }[]>([
    { id: crypto.randomUUID(), value: "" },
    { id: crypto.randomUUID(), value: "" },
    { id: crypto.randomUUID(), value: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (id: string, value: string) => {
    setNames(names.map((n) => (n.id === id ? { ...n, value } : n)));
  };

  const addNameField = () => {
    setNames([...names, { id: crypto.randomUUID(), value: "" }]);
  };

  const removeNameField = (id: string) => {
    if (names.length <= 3) return;
    setNames(names.filter((n) => n.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validNames = names.map((n) => n.value).filter((n) => n.trim() !== "");

    if (validNames.length < 3) {
      setError("Você precisa de pelo menos 3 participantes.");
      setLoading(false);
      return;
    }

    if (!groupName.trim()) {
      setError("O nome do grupo é obrigatório.");
      setLoading(false);
      return;
    }

    try {
      const result = await createRaffleGroup(groupName, validNames);
      navigate({
        to: "/admin/$token",
        params: { token: result.admin_token },
      });
    } catch (err: unknown) {
      console.error("Error creating group:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao criar grupo. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 mb-4">
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
            Criar Novo Sorteio
          </h1>
          <p className="text-gray-600 text-sm">
            Organize seu sorteio de forma rápida e profissional
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Nome do Grupo
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  hover:border-gray-300 shadow-sm"
                placeholder="Ex: Amigo Secreto da Firma 2024"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <legend className="block text-sm font-semibold text-gray-900">
                  Participantes
                </legend>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {names.filter((n) => n.value.trim()).length} de {names.length}
                </span>
              </div>

              <div className="space-y-3">
                {names.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-center group">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          handleNameChange(item.id, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          hover:border-gray-300 shadow-sm
                          invalid:border-red-300 invalid:text-red-600
                          focus:invalid:ring-red-500 focus:invalid:border-transparent"
                        placeholder={`Nome do participante ${index + 1}`}
                        aria-label={`Participante ${index + 1}`}
                      />
                    </div>
                    {names.length > 3 && (
                      <button
                        type="button"
                        onClick={() => removeNameField(item.id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Remover participante"
                        aria-label={`Remover participante ${index + 1}`}
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addNameField}
                className="mt-4 w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Adicionar Participante
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    Erro ao criar sorteio
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Criando sorteio...
                </>
              ) : (
                <>
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Criar Sorteio
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Os links serão gerados após a criação do sorteio
        </p>
      </div>
    </div>
  );
}
