import { create } from "zustand";

interface useProModalProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useProModal = create<useProModalProps>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
