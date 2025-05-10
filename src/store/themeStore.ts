import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  colorMode: 'light' | 'dark';
  toggleColorMode: () => void;
  setColorMode: (mode: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      colorMode: 'light',
      toggleColorMode: () =>
        set(state => ({
          colorMode: state.colorMode === 'light' ? 'dark' : 'light',
        })),
      setColorMode: mode => set({colorMode: mode}),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
