import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

// 테마별 색상 정의
export const themes = {
  light: {
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    cardBg: '#ffffff',
    headerText: '#1f2937',
    iconColor: '#374151',
    recommendationBg: '#eff6ff',
    cloudColor: '#94a3b8',
  },
  dark: {
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    border: '#374151',
    cardBg: '#1f2937',
    headerText: '#f9fafb',
    iconColor: '#d1d5db',
    recommendationBg: '#1e3a5f',
    cloudColor: '#64748b',
  },
} as const;

interface ThemeState {
  theme: Theme;
  isHydrated: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setHydrated: (hydrated: boolean) => void;
  colors: typeof themes.light;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isHydrated: false,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (theme: Theme) => set({ theme }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
      get colors() {
        return themes[get().theme];
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
