import { create } from "zustand";

interface User {
  email: string | null;
  publicKey: string;
  encData: string;
  iv: string;
  dpk: string;
}

interface PaymentInfo {
  address: string | null;
  token: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  setPublicKey: (key: string) => void;
  setEncData: (key: string) => void;
  setIv: (key: string) => void;
  setDpk: (key: string) => void;
}

interface PaymentInfoState {
  paymentInfo: PaymentInfo | null;
  setPaymentAddress: (address: string | null) => void;
  setPaymentToken: (token: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  setPublicKey: (key) =>
    set((state) => ({
      user: state.user ? { ...state.user, publicKey: key } : null,
    })),
  setEncData: (key) =>
    set((state) => ({
      user: state.user ? { ...state.user, encData: key } : null,
    })),
  setIv(key) {
    set((state) => ({
      user: state.user ? { ...state.user, iv: key } : null,
    }));
  },
  setDpk(key) {
    set((state) => ({
      user: state.user ? { ...state.user, dpk: key } : null,
    }));
  },
}));

export const usePaymentInfoStore = create<PaymentInfoState>((set) => ({
  paymentInfo: null,
  setPaymentAddress: (address) =>
    set((state) => ({
      paymentInfo: state.paymentInfo
        ? { ...state.paymentInfo, address }
        : { address, token: "" },
    })),
  setPaymentToken: (token) =>
    set((state) => ({
      paymentInfo: state.paymentInfo
        ? { ...state.paymentInfo, token }
        : { address: null, token },
    })),
}));
