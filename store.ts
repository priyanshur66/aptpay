import { create } from "zustand";

interface User {
  email: string | null;
  publicKey: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  setPublicKey: (key: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  setPublicKey: (key) => set((state) => ({
    user: state.user ? { ...state.user, publicKey: key } : null,
  })),
}));
