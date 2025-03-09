// Global Imports

import { create } from "zustand";

// Local Imports

// Body
export type FileStatus = "pending" | "uploading" | "complete" | "error";

export interface UploadFile {
  id: string;
  file: File;
  status: FileStatus;
  url?: string;
  createdAt: Date;
}

interface FilesState {
  files: UploadFile[];
  historicFiles: UploadFile[];
  displayModel: boolean;
  addFiles: (newFiles: UploadFile[]) => void;
  setFiles: (newFiles: UploadFile[]) => void;
  updateFileStatus: (id: string, status: FileStatus, url?: string) => void;
  removeFile: (id: string) => void;
  resetFiles: () => void;
  openModel: () => void;
  closeModel: () => void;
  toggleModel: () => void;
}

export const useFilesStore = create<FilesState>((set) => ({
  files: [],
  historicFiles: [],
  displayModel: false,
  setFiles: (newFiles) =>
    set((state) => {
      // Check if the file is already in the historicFiles array. If not, add it as well
      const newHistoricFiles = Array.from(newFiles).filter(
        (file) =>
          !state.historicFiles.some(
            (historicFile) => historicFile.id === file.id
          )
      );

      return {
        files: newFiles,
        historicFiles: [...state.historicFiles, ...newHistoricFiles],
      };
    }),
  addFiles: (newFiles) =>
    set((state) => {
      // Check if the file is already in the historicFiles array. If not, add it as well
      const newHistoricFiles = Array.from(newFiles).filter(
        (file) =>
          !state.historicFiles.some(
            (historicFile) => historicFile.id === file.id
          )
      );

      return {
        files: [...state.files, ...newFiles],
        historicFiles: [...state.historicFiles, ...newHistoricFiles],
      };
    }),
  updateFileStatus: (id, status, url) =>
    set((state) => ({
      files: state.files.map((item) =>
        item.id === id ? { ...item, status, url } : item
      ),
      historicFiles: state.historicFiles.map((item) =>
        item.id === id ? { ...item, status, url } : item
      ),
    })),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((item) => item.id !== id),
      historicFiles: state.historicFiles.filter((item) => item.id !== id),
    })),
  resetFiles: () =>
    set({
      files: [],
    }),
  openModel: () => set({ displayModel: true }),
  closeModel: () => set({ displayModel: false }),
  toggleModel: () => set((state) => ({ displayModel: !state.displayModel })),
}));
