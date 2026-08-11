import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibrarySettingsState {
  showHiddenGames: boolean;
  setShowHiddenGames: (show: boolean) => void;
}

export const useLibrarySettingsStore = create<LibrarySettingsState>()(
  persist(
    (set) => ({
      showHiddenGames: false,
      setShowHiddenGames: (show) => set({ showHiddenGames: show }),
    }),
    {
      name: "hydra-bp-library-settings",
    }
  )
);
