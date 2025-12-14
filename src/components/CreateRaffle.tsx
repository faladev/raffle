"use client";

import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { generateId, saveRaffle } from "../utils/storage";

interface ParticipantInput {
  id: string;
  value: string;
}

export default function CreateRaffle() {
  const navigate = useNavigate();
  const [raffleName, setRaffleName] = useState("");
  const [participants, setParticipants] = useState<ParticipantInput[]>([
    { id: generateId(), value: "" },
  ]);
  const [error, setError] = useState("");

  const addParticipant = () => {
    setParticipants([...participants, { id: generateId(), value: "" }]);
  };

  const removeParticipant = (id: string) => {
    const newParticipants = participants.filter((p) => p.id !== id);
    setParticipants(newParticipants);
  };

  const updateParticipant = (id: string, value: string) => {
    const newParticipants = participants.map((p) =>
      p.id === id ? { ...p, value } : p,
    );
    setParticipants(newParticipants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!raffleName.trim()) {
      setError("Por favor, insira um nome para o sorteio");
      return;
    }

    const validParticipants = participants
      .map((p) => p.value.trim())
      .filter((p) => p !== "");

    if (validParticipants.length < 2) {
      setError("É necessário pelo menos 2 participantes");
      return;
    }

    const participantObjects = validParticipants.map((name) => ({
      id: generateId(),
      name,
      hasDrawn: false,
    }));

    const raffle = {
      id: generateId(),
      name: raffleName,
      participants: participantObjects,
      createdAt: Date.now(),
    };

    saveRaffle(raffle);
    navigate({ to: `/admin/${raffle.id}` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🎉 Raffle</h1>
          <p className="text-gray-600">Crie seu sorteio de amigo secreto</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="raffleName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome do Sorteio
            </label>
            <input
              id="raffleName"
              type="text"
              value={raffleName}
              onChange={(e) => setRaffleName(e.target.value)}
              placeholder="Ex: Amigo Secreto da Família 2024"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              Participantes
            </div>
            <div className="space-y-3">
              {participants.map((participant, index) => (
                <div key={participant.id} className="flex gap-2">
                  <input
                    type="text"
                    value={participant.value}
                    onChange={(e) =>
                      updateParticipant(participant.id, e.target.value)
                    }
                    placeholder={`Participante ${index + 1}`}
                    aria-label={`Participante ${index + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  />
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant.id)}
                      aria-label="Remover participante"
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addParticipant}
              className="mt-3 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition font-medium"
            >
              + Adicionar Participante
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-linear-to-r from-primary to-secondary text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition shadow-lg"
          >
            Criar Sorteio
          </button>
        </form>
      </div>
    </div>
  );
}
