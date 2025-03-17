import { Json, MaybePromise, UploadThingError } from "@uploadthing/shared";
import { ClientUploadedFileData, EndpointArg } from "uploadthing/types";

export type UTUIFileStatus = "pending" | "uploading" | "complete" | "error";

export interface UTUIUploadFile {
  id: string;
  file: File;
  status: UTUIFileStatus;
  url?: string;
  createdAt: Date;
}

export interface UTUIFunctionsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileRoute: EndpointArg<any, any>;
  onUploadProgress?: (progress: number) => void;
  onClientUploadComplete?:
    | ((
        res: ClientUploadedFileData<{
          uploadedBy: string;
        }>[],
      ) => MaybePromise<void>)
    | undefined;
  onUploadError?: (error: UploadThingError<Json>) => void;
  onBeforeUploadBegin?:
    | ((files: File[]) => Promise<File[]> | File[])
    | undefined;
  onUploadBegin?: ((fileName: string) => void) | undefined;
  onUploadAborted?: ((file: File) => void) | undefined;
}
