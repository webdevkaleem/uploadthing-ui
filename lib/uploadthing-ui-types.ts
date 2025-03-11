import { Json, UploadThingError } from "@uploadthing/shared";

export type UTUIFileStatus = "pending" | "uploading" | "complete" | "error";

export interface UTUIUploadFile {
  id: string;
  file: File;
  status: UTUIFileStatus;
  url?: string;
  createdAt: Date;
}

export interface UTUIFunctionsProps {
  onUploadProgress?: (progress: number) => void;
  onClientUploadComplete?: (res: any) => void;
  onUploadError?: (error: UploadThingError<Json>) => void;
  onBeforeUploadBegin?:
    | ((files: File[]) => Promise<File[]> | File[])
    | undefined;
  onUploadBegin?: ((fileName: string) => void) | undefined;
}
