// Global Imports

import { UTUIFileStatus, UTUIUploadFile } from "@/lib/uploadthing-ui-types";
import { create } from "zustand";

// Local Imports

// Body
// [1] Types
interface FilesState {
  historicFiles: UTUIUploadFile[] & { abort?: boolean };
  setFiles: (newFiles: UTUIUploadFile[]) => void;
  updateFileStatus: (id: string, status: UTUIFileStatus, url?: string) => void;
  removeFile: (id: string) => void;
  resetFiles: () => void;
  abortAllFiles: () => void;
}

// [2] Store
export const useDropzoneGenericDriveStore = create<FilesState>()((set) => ({
  historicFiles: [],
  setFiles: (newFiles) =>
    set((state) => {
      // Check if the file is already in the historicFiles array. If not, add it as well
      const newHistoricFiles = Array.from(newFiles).filter(
        (file) =>
          !state.historicFiles.some(
            (historicFile) => historicFile.id === file.id,
          ),
      );

      return {
        files: newFiles,
        historicFiles: [...state.historicFiles, ...newHistoricFiles],
      };
    }),
  updateFileStatus: (id, status, url) =>
    set((state) => ({
      historicFiles: state.historicFiles.map((item) =>
        item.id === id ? { ...item, status, url } : item,
      ),
    })),
  removeFile: (id) =>
    set((state) => ({
      historicFiles: state.historicFiles.filter((item) => item.id !== id),
    })),
  resetFiles: () =>
    set({
      historicFiles: [],
    }),
  abortAllFiles: () =>
    set((state) => ({
      historicFiles: state.historicFiles.map((item) => ({
        ...item,
        abort: true,
      })),
    })),
}));
