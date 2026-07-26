import type { User } from "../context/AuthContext.types";

const STORAGE_KEY = "eagle-user";

export function loadUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export function saveUserToStorage(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function removeUserFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
