export type UTUIFileStatus = "pending" | "uploading" | "complete" | "error";

export interface UTUIUploadFile {
  id: string;
  file: File;
  status: UTUIFileStatus;
  url?: string;
  createdAt: Date;
}
