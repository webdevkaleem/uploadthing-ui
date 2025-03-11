//////////////////////////////////////////////////////////////////////////////////
// UTUIButtonUploadthing
//////////////////////////////////////////////////////////////////////////////////

"use client";

// Global Imports
import { createId } from "@paralleldrive/cuid2";
import { CircleCheck, GripVertical, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { generatePermittedFileTypes } from "uploadthing/client";

// Local Imports
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import {
  UTUIFileStatus,
  UTUIFunctionsProps,
  UTUIUploadFile,
} from "@/lib/uploadthing-ui-types";
import { useUploadthingStore } from "@/store/button-uploadthing-store";

// Body
export default function UTUIButtonUploadthing({
  UTUIFunctionsProps,
}: {
  UTUIFunctionsProps: UTUIFunctionsProps;
}) {
  // [1] Refs & States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFiles, historicFiles } = useUploadthingStore();

  // [2] Deriving the accepted file types
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

  // [3] Handlers
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      // Convert FileList to Array and add to store
      setFiles(
        Array.from(selectedFiles).map((fileObj) => ({
          file: fileObj,
          id: createId(),
          fileObj,
          status: "pending" as UTUIFileStatus, // Use type assertion here
          createdAt: new Date(),
        })),
      );

      // Reset the input to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // [4] JSX
  return (
    <div className="flex flex-col gap-8 text-sm">
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
          accept={acceptedFileTypes}
        />
        <Button className="w-fit" onClick={handleButtonClick}>
          Select Files to Upload
        </Button>
      </div>

      {historicFiles.map((fileObj) => (
        <DisplayingToasts
          key={fileObj.id}
          uploadFile={fileObj}
          UTUIFunctionsProps={UTUIFunctionsProps}
        />
      ))}
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// DIsplaying Toasts
//////////////////////////////////////////////////////////////////////////////////

function DisplayingToasts({
  uploadFile,
  UTUIFunctionsProps,
}: {
  uploadFile: UTUIUploadFile;
  UTUIFunctionsProps: UTUIFunctionsProps;
}) {
  // [1] Refs & States
  const isMounted = useRef(true);
  const hasStartedUpload = useRef(false);
  const [progress, setProgress] = useState(0);
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined,
  );
  const { updateFileStatus, removeFile } = useUploadthingStore();

  // [2] Uploadthing
  const { startUpload, isUploading } = useUploadThing(
    UTUIFunctionsProps.fileRoute,
    {
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

          // Your additional code here
          UTUIFunctionsProps.onUploadError?.(error);
        }
      },
      onBeforeUploadBegin: UTUIFunctionsProps.onBeforeUploadBegin,
      onUploadBegin: UTUIFunctionsProps.onUploadBegin,
    },
  );

  // [3] Effects
  // When a file isn't uploading
  useEffect(() => {
    if (!hasStartedUpload.current && !isUploading) {
      hasStartedUpload.current = true;

      startUpload([uploadFile.file]);
      updateFileStatus(uploadFile.id, "uploading");

      // Adding a toast for the upload
      setToastId(
        toast.custom(
          (t) => <ToastComponent progress={progress} uploadFile={uploadFile} />,
          {
            duration: Infinity,
          },
        ),
      );

      return;
    }
  }, [
    uploadFile,
    progress,
    isUploading,
    hasStartedUpload,
    toast,
    startUpload,
    updateFileStatus,
    setToastId,
  ]);

  // When a file changes its status during the uploading process
  useEffect(() => {
    if (uploadFile.status === "complete" && toastId) {
      toast.custom((t) => <ToastComponentCompleted uploadFile={uploadFile} />, {
        id: toastId,
        duration: 4000,
      });

      // Removing file from state
      removeFile(uploadFile.id);

      return;
    }

    if (uploadFile.status === "error" && toastId) {
      toast.custom((t) => <ToastComponentError uploadFile={uploadFile} />, {
        id: toastId,
        duration: 4000,
      });

      return;
    }
  }, [uploadFile, toastId, toast, removeFile]);

  // When a file starts its uploading process
  useEffect(() => {
    if (toastId && isUploading) {
      // Update the progress inside the toast
      toast.custom(
        (t) => <ToastComponent progress={progress} uploadFile={uploadFile} />,
        { id: toastId },
      );
    }
  }, [progress, toastId, isUploading]);

  return <div className="hidden">{uploadFile.id}</div>;
}

function ToastComponent({
  progress,
  uploadFile,
}: {
  progress: number;
  uploadFile: UTUIUploadFile;
}) {
  return (
    <div className="flex w-96 select-none items-center gap-4 px-4 py-4 text-xs">
      <div className="min-w-10">
        <CircularProgressBar percentage={progress} />
      </div>
      <p className="truncate">Uploading {uploadFile.file.name}</p>
      <GripVertical className="ml-auto min-w-10 stroke-1" />
    </div>
  );
}

function ToastComponentCompleted({
  uploadFile,
}: {
  uploadFile: UTUIUploadFile;
}) {
  return (
    <div className="flex w-96 select-none items-center gap-4 px-4 py-4 text-xs">
      <CircleCheck className="min-w-6 fill-foreground stroke-background stroke-1" />
      <div className="flex flex-col truncate">
        <p className="truncate">File uploaded successfully!</p>
        <p className="truncate">Uploaded {uploadFile.file.name}</p>
      </div>
      <GripVertical className="ml-auto min-w-10 stroke-1" />
    </div>
  );
}

function ToastComponentError({ uploadFile }: { uploadFile: UTUIUploadFile }) {
  return (
    <div className="flex w-96 select-none items-center gap-4 truncate px-4 py-4 text-xs">
      <Info className="min-w-6 fill-foreground stroke-background stroke-1" />
      <div className="flex flex-col truncate">
        <p className="truncate">File couldn't be uploaded</p>
        <p className="truncate">{uploadFile.file.name}</p>
      </div>
      <GripVertical className="ml-auto min-w-10 stroke-1" />
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// Circular Progress Bar
//////////////////////////////////////////////////////////////////////////////////

function CircularProgressBar({ percentage }: { percentage: number }) {
  // [1] JSX
  return (
    <div className="relative">
      <svg
        className="-rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current stroke-2 text-primary"
        ></circle>
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current stroke-2 text-secondary"
          strokeDasharray="100"
          strokeDashoffset={percentage}
          strokeLinecap="round"
        ></circle>
      </svg>
      <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <span className="text-center text-xs font-semibold text-primary">
          {percentage}
        </span>
      </div>
    </div>
  );
}
