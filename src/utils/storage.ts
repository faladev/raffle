interface LocalRaffle {
  id: string;
  name: string;
  participants: LocalParticipant[];
  createdAt: number;
}

interface LocalParticipant {
  id: string;
  name: string;
  hasDrawn: boolean;
}

const STORAGE_KEY = "raffles";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function getRaffles(): LocalRaffle[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getRaffle(id: string): LocalRaffle | undefined {
  const raffles = getRaffles();
  return raffles.find((r) => r.id === id);
}

export function saveRaffle(raffle: LocalRaffle): void {
  const raffles = getRaffles();
  const existingIndex = raffles.findIndex((r) => r.id === raffle.id);

  if (existingIndex >= 0) {
    raffles[existingIndex] = raffle;
  } else {
    raffles.push(raffle);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(raffles));
}

export function deleteRaffle(id: string): void {
  const raffles = getRaffles();
  const filtered = raffles.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
