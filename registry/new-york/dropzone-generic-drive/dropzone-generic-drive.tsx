//////////////////////////////////////////////////////////////////////////////////
// UTUIDropzoneGenericDrive
//////////////////////////////////////////////////////////////////////////////////

"use client";

// Global Imports
import { createId } from "@paralleldrive/cuid2";
import { useDropzone } from "@uploadthing/react";
import {
  FileSize,
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "@uploadthing/shared";
import {
  Check,
  Dot,
  FileUpIcon,
  Info,
  Loader2,
  Trash,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Local Imports
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUploadThing } from "@/lib/uploadthing";
import {
  UTUIFileStatus,
  UTUIFunctionsProps,
  UTUIUploadFile,
} from "@/lib/uploadthing-ui-types";
import { checkFileObjectKey, formatBytes } from "@/lib/uploadthing-ui-utils";
import { useDropzoneGenericDriveStore } from "@/store/dropzone-generic-drive-store";

// Body
export default function UTUIDropzoneGenericDrive({
  UTUIFunctionsProps,
}: {
  UTUIFunctionsProps: UTUIFunctionsProps;
}) {
  // [1] State and Refs
  const { historicFiles, setFiles, abortAllFiles, resetFiles } =
    useDropzoneGenericDriveStore();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((fileObj) => ({
        id: createId(),
        file: fileObj,
        status: "pending" as UTUIFileStatus,
        createdAt: new Date(),
      })),
    );
  }, []);

  // [2] Uploadthing
  const { routeConfig } = useUploadThing(UTUIFunctionsProps.fileRoute);
  const acceptedFileTypes = generatePermittedFileTypes(routeConfig)
    .fileTypes.map((fileType) => {
      if (fileType.includes("/")) {
        return fileType;
      } else {
        return `${fileType}/*`;
      }
    })
    .join(",");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  // [3] Derived State
  const fileRouteOptions = checkFileObjectKey({
    str: generatePermittedFileTypes(routeConfig).fileTypes[0],
    obj: routeConfig,
  });
  const allFilesUploaded = historicFiles.every(
    (file) => file.status === "complete" || file.status === "error",
  );

  // [4] Conditionals checks
  // If the file route options are not found, display an error message
  if (!fileRouteOptions)
    return (
      <div className="flex flex-col gap-4 text-sm">
        Please add a correct file route
      </div>
    );

  const maxFileCount = fileRouteOptions.maxFileCount;
  const minFileCount = fileRouteOptions.minFileCount;
  const maxFileSize = fileRouteOptions.maxFileSize;

  // [5] JSX
  return (
    <div className="flex w-2/3 flex-col gap-4 text-sm">
      <Title />
      <input {...getInputProps()} />
      {/* Limit the file dropzone area */}
      <div
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-4 rounded-md border"
        {...getRootProps()}
      >
        <Upload className="w-5 stroke-1" />
        <span className="text-muted-foreground">Drop your files here</span>
        <span>|</span>
        <span className="font-semibold">Browse files</span>
      </div>

      <Information
        fileTypes={acceptedFileTypes}
        maxFileCount={maxFileCount}
        minFileCount={minFileCount}
        maxFileSize={maxFileSize}
      />

      <Separator />

      {historicFiles.map((fileObj) => {
        return (
          <FileContainer
            key={fileObj.id}
            uploadFile={fileObj}
            UTUIFunctionsProps={UTUIFunctionsProps}
          />
        );
      })}

      {historicFiles.length > 0 && <Separator />}

      {allFilesUploaded && historicFiles.length > 0 && (
        <div className="flex w-full items-center justify-end">
          <Button onClick={resetFiles}>Reset All</Button>
        </div>
      )}

      {!allFilesUploaded && historicFiles.length > 0 && (
        <div className="flex w-full items-center justify-end">
          <Button variant={"destructive"} onClick={abortAllFiles}>
            Cancel All
          </Button>
        </div>
      )}
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// File Container
//////////////////////////////////////////////////////////////////////////////////

function FileContainer({
  uploadFile,
  UTUIFunctionsProps,
}: {
  uploadFile: UTUIUploadFile & { abort?: boolean };
  UTUIFunctionsProps: UTUIFunctionsProps;
}) {
  // [1] State & Ref
  const isMounted = useRef(true);
  const hasStartedUpload = useRef(false);
  const [progress, setProgress] = useState(0);
  const { updateFileStatus, removeFile } = useDropzoneGenericDriveStore();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [abortSignal, setAbortSignal] = useState<AbortSignal | undefined>(
    undefined,
  );

  // [2] Uploadthing
  const { startUpload, isUploading } = useUploadThing(
    UTUIFunctionsProps.fileRoute,
    {
      signal: abortSignal,
      uploadProgressGranularity: "fine",
      onUploadProgress: (progress) => {
        if (isMounted.current) {
          setProgress(progress);

          // Your additional code here
          UTUIFunctionsProps.onUploadProgress?.(progress);
        }
      },
      onClientUploadComplete: (res) => {
        if (isMounted.current && res?.[0]) {
          updateFileStatus(uploadFile.id, "complete", res[0].url);

          // Your additional code here
          UTUIFunctionsProps.onClientUploadComplete?.(res);
        }
      },
      onUploadError: (error) => {
        if (isMounted.current) {
          updateFileStatus(uploadFile.id, "error");
          setErrorMessage(error.message);

          // Your additional code here
          UTUIFunctionsProps.onUploadError?.(error);
        }
      },
      onBeforeUploadBegin: (files) => {
        // Create a new AbortController for this upload
        abortControllerRef.current = new AbortController();
        setAbortSignal(abortControllerRef.current.signal);

        UTUIFunctionsProps.onBeforeUploadBegin?.(files);

        return files;
      },
      onUploadBegin: UTUIFunctionsProps.onUploadBegin,
    },
  );

  // [3] Handlers
  function resetAbortController() {
    if (abortControllerRef.current) {
      removeFile(uploadFile.id);
      abortControllerRef.current.abort();
      setAbortSignal(abortControllerRef.current.signal);
    }
  }

  // [4] Effects
  // When a file isn't uploading
  useEffect(() => {
    if (!hasStartedUpload.current && !isUploading) {
      hasStartedUpload.current = true;

      startUpload([uploadFile.file]);
      updateFileStatus(uploadFile.id, "uploading");
    }
  }, [
    uploadFile,
    isUploading,
    hasStartedUpload,
    startUpload,
    updateFileStatus,
  ]);

  useEffect(() => {
    // Check if the file has an abort status
    // If it does, abort the upload and remove it from the state
    if (uploadFile.abort) {
      resetAbortController();
    }
  }, [uploadFile, resetAbortController]);

  // [5] JSX
  return (
    <div className="flex h-20 w-full items-center gap-4 rounded-md border">
      <div className="flex h-full min-w-20 items-center justify-center bg-accent">
        {uploadFile.status === "pending" ||
        uploadFile.status === "uploading" ? (
          <Loader2 className="animate-spin stroke-1" />
        ) : uploadFile.status === "error" ? (
          <Info className="stroke-1" />
        ) : (
          <FileUpIcon className="stroke-1" />
        )}
      </div>

      <div className="flex flex-col gap-1 truncate">
        <p className="truncate">{uploadFile.file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(uploadFile.file.size)} ({progress}%)
        </p>
        <p className="truncate text-xs text-destructive">{errorMessage}</p>
      </div>

      {uploadFile.status === "complete" && (
        <div className="ml-auto min-w-10 text-chart-2">
          <Check className="w-5 stroke-1" />
        </div>
      )}
      {uploadFile.status === "pending" ||
        (uploadFile.status === "uploading" && (
          <div
            className="ml-auto flex min-w-20 cursor-pointer items-center justify-center hover:text-destructive"
            onClick={resetAbortController}
          >
            <Trash className="w-5 stroke-1" />
          </div>
        ))}
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// Title
//////////////////////////////////////////////////////////////////////////////////

function Title() {
  // [1] JSX
  return (
    <p className="font-semibold">
      Upload file <span className="text-destructive">*</span>
    </p>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// Information
//////////////////////////////////////////////////////////////////////////////////

function Information({
  fileTypes,
  maxFileCount,
  minFileCount,
  maxFileSize,
}: {
  fileTypes: string;
  maxFileCount: number;
  minFileCount: number;
  maxFileSize: FileSize;
}) {
  // [1] JSX
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <span>Up to {maxFileSize}</span>
      <Dot />
      <span>Allowed files: {fileTypes}</span>
      <Dot />
      <span>Max {maxFileCount}</span>
      <Dot />
      <span>Min {minFileCount}</span>
    </div>
  );
}
