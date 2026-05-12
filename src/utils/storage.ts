import type { AppState } from '../types';

const STORAGE_KEY = 'text-to-manga-editor-state';

export const saveAppState = (state: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadAppState = (): AppState | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
};

export const resetAppState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
