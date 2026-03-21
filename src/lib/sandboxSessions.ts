import type { PlacedObject } from "@/components/SandboxCanvas3D";

export interface SandboxSession {
  id: string;
  label: string;
  timestamp: string;
  objects: PlacedObject[];
  objectCount: number;
  objectTypes: string[];
}

const STORAGE_KEY = "sandbox_sessions";

export function getSavedSessions(): SandboxSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getSessionById(id: string): SandboxSession | null {
  return getSavedSessions().find((s) => s.id === id) ?? null;
}

export function saveSession(objects: PlacedObject[]): SandboxSession {
  const session: SandboxSession = {
    id: Date.now().toString(),
    label: "Sandbox session completed",
    timestamp: new Date().toISOString(),
    objects: [...objects],
    objectCount: objects.length,
    objectTypes: [...new Set(objects.map((o) => o.type))],
  };
  const existing = getSavedSessions();
  existing.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
  return session;
}
