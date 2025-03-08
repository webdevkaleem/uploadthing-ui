// Global Imports

import { create } from "zustand";
import { createId } from "@paralleldrive/cuid2";
import { UTUIFileStatus, UTUIUploadFile } from "@/lib/uploadthing-ui-types";

// Local Imports

// Body
// [1] Types
interface FilesState {
  files: UTUIUploadFile[];
  displayModel: boolean;
  addFiles: (newFiles: File[]) => void;
  updateFileStatus: (id: string, status: UTUIFileStatus, url?: string) => void;
  resetFiles: () => void;
  openModel: () => void;
  closeModel: () => void;
  toggleModel: () => void;
}

// [2] Store
export const useFilesStore = create<FilesState>((set) => ({
  files: [],
  displayModel: false,
  addFiles: (newFiles) =>
    set((state) => ({
      files: [
        ...state.files,
        ...newFiles.map((file) => ({
          id: createId(),
          file,
          status: "pending" as UTUIFileStatus,
          createdAt: new Date(),
        })),
      ],
    })),
  updateFileStatus: (id, status, url) =>
    set((state) => ({
      files: state.files.map((item) =>
        item.id === id ? { ...item, status, url } : item
      ),
    })),
  resetFiles: () =>
    set({
      files: [],
    }),
  openModel: () => set({ displayModel: true }),
  closeModel: () => set({ displayModel: false }),
  toggleModel: () => set((state) => ({ displayModel: !state.displayModel })),
}));
