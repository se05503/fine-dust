import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, translations } from '@/i18n/translations';

interface LanguageState {
  language: Language;
  isHydrated: boolean;
  setLanguage: (language: Language) => void;
  setHydrated: (hydrated: boolean) => void;
  t: (key: string) => any;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'ko',
      isHydrated: false,
      setLanguage: (language: Language) => set({ language }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
      t: (key: string) => {
        const lang = get().language;
        const keys = key.split('.');
        let value: any = translations[lang];
        for (const k of keys) {
          value = value?.[k];
        }
        return value ?? key;
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
