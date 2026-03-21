import type { ReflectionRecord } from "@/components/ReflectionModal";

const STORAGE_KEY = "sandbox_reflections";

export function getSavedReflections(): ReflectionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReflection(record: ReflectionRecord): void {
  const existing = getSavedReflections();
  existing.unshift(record);
  // Keep max 20 records
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
}
