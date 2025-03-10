//////////////////////////////////////////////////////////////////////////////////
// UTButtonUploadthing
//////////////////////////////////////////////////////////////////////////////////

"use client";

// Global Imports
import { createId } from "@paralleldrive/cuid2";
import { generatePermittedFileTypes } from "uploadthing/client";
import { Json } from "@uploadthing/shared";
import { CircleCheck, GripVertical, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";

// Local Imports
import { useFilesStore } from "@/store/button-uploadthing-store";
import { UTUIFileStatus } from "@/lib/uploadthing-ui-types";
import { useUploadThing } from "@/lib/uploadthing";
import { UTUIUploadFile } from "@/lib/uploadthing-ui-types";
import { Button } from "@/components/ui/button";

// Body
export default function UTUIButtonUploadthing() {
  // [1] Refs & States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFiles, historicFiles } = useFilesStore();

  // [2] Deriving the accepted file types
  const { routeConfig } = useUploadThing("imageUploader");
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
        }))
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
        <Button onClick={handleButtonClick}>Select Files to Upload</Button>
      </div>

      {historicFiles.map((fileObj) => (
        <DisplayingToasts key={fileObj.id} uploadFile={fileObj} />
      ))}
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// DIsplaying Toasts
//////////////////////////////////////////////////////////////////////////////////

function DisplayingToasts({
  uploadFile,
  onUploadProgress,
  onClientUploadComplete,
  onUploadError,
}: {
  uploadFile: UTUIUploadFile;
  onUploadProgress?: (progress: number) => void;
  onClientUploadComplete?: (res: any) => void;
  onUploadError?: (error: UploadThingError<Json>) => void;
}) {
  // [1] Refs & States
  const isMounted = useRef(true);
  const hasStartedUpload = useRef(false);
  const [progress, setProgress] = useState(0);
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );
  const { updateFileStatus, removeFile } = useFilesStore();

  // [2] Uploadthing
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    uploadProgressGranularity: "fine",
    onUploadProgress: (progress) => {
      if (isMounted.current) {
        setProgress(progress);

        // Your additional code here
        onUploadProgress?.(progress);
      }
    },
    onClientUploadComplete: (res) => {
      if (isMounted.current && res?.[0]) {
        updateFileStatus(uploadFile.id, "complete", res[0].url);

        // Your additional code here
        onClientUploadComplete?.(res);
      }
    },
    onUploadError: (error) => {
      if (isMounted.current) {
        updateFileStatus(uploadFile.id, "error");

        // Your additional code here
        onUploadError?.(error);
      }
    },
  });

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
          }
        )
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
        { id: toastId }
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
    <div className="py-4 px-4 w-96 flex gap-4 text-xs items-center select-none">
      <div className="min-w-10">
        <CircularProgressBar percentage={progress} />
      </div>
      <p className="truncate">Uploading {uploadFile.file.name}</p>
      <GripVertical className="stroke-1 min-w-10 ml-auto" />
    </div>
  );
}

function ToastComponentCompleted({
  uploadFile,
}: {
  uploadFile: UTUIUploadFile;
}) {
  return (
    <div className="py-4 px-4 w-96 flex gap-4 text-xs items-center select-none">
      <CircleCheck className="stroke-1 stroke-background min-w-6 fill-foreground" />
      <div className="flex flex-col truncate">
        <p className="truncate">File uploaded successfully!</p>
        <p className="truncate">Uploaded {uploadFile.file.name}</p>
      </div>
      <GripVertical className="stroke-1 min-w-10 ml-auto" />
    </div>
  );
}

function ToastComponentError({ uploadFile }: { uploadFile: UTUIUploadFile }) {
  return (
    <div className="py-4 px-4 truncate w-96 flex gap-4 text-xs items-center select-none">
      <Info className="stroke-1 min-w-6 stroke-background fill-foreground" />
      <div className="flex flex-col truncate">
        <p className="truncate">File couldn't be uploaded</p>
        <p className="truncate">{uploadFile.file.name}</p>
      </div>
      <GripVertical className="stroke-1 min-w-10 ml-auto" />
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
          className="stroke-current text-primary stroke-2"
        ></circle>
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-secondary stroke-2"
          strokeDasharray="100"
          strokeDashoffset={percentage}
          strokeLinecap="round"
        ></circle>
      </svg>
      <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className="text-center text-xs font-semibold text-primary">
          {percentage}
        </span>
      </div>
    </div>
  );
}
