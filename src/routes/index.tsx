import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../lib/supabase";

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
      const { data, error: rpcError } = await supabase.rpc(
        "create_raffle_group",
        {
          p_group_name: groupName,
          p_participant_names: validNames,
        },
      );

      if (rpcError) throw rpcError;

      if (data) {
        navigate({
          to: "/admin/$token",
          params: { token: data.admin_token },
        });
      }
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Criar Sorteio
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome do Grupo
          </label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Amigo Secreto da Firma"
            required
          />
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            Participantes
          </legend>
          {names.map((item, index) => (
            <div key={item.id} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleNameChange(item.id, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Participante ${index + 1}`}
                aria-label={`Participante ${index + 1}`}
              />
              {names.length > 3 && (
                <button
                  type="button"
                  onClick={() => removeNameField(item.id)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-md"
                  title="Remover"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addNameField}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Adicionar Participante
          </button>
        </fieldset>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Criando..." : "Criar Sorteio"}
        </button>
      </form>
    </div>
  );
}
