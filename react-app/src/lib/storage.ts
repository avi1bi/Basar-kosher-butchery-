// localStorage can be unavailable (private mode, blocked storage) — fall back to memory.
const memory: Record<string, unknown> = {};

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return key in memory ? (memory[key] as T) : fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    memory[key] = value;
  }
}
