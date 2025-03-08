import { create } from "zustand";

interface FileState {
  bears: number;
  increase: (by: number) => void;
}

const useFileStore = create<FileState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
