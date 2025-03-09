"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { CircleCheck, GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CircularProgressBar from "./circular-progress-bar";
import { useFilesStore } from "@/store/button-uploadthing-store";
import { UTUIUploadFile } from "@/lib/uploadthing-ui-types";

export default function DisplayingToasts({
  uploadFile,
}: {
  uploadFile: UTUIUploadFile;
}) {
  const { updateFileStatus } = useFilesStore();
  // Keep progress state local
  const [progress, setProgress] = useState(0);
  // Ref to prevent state updates after unmount
  const isMounted = useRef(true);
  // Inside your FileRow component
  const hasStartedUpload = useRef(false);
  // Your toast id
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    uploadProgressGranularity: "fine",
    onUploadProgress: (progress) => {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setProgress(progress);
      }
    },
    onClientUploadComplete: (res) => {
      if (isMounted.current && res?.[0]) {
        updateFileStatus(uploadFile.id, "complete", res[0].url);
      }
    },
    onUploadError: (error) => {
      if (isMounted.current) {
        updateFileStatus(uploadFile.id, "error");
      }
    },
  });
  console.log(progress);

  // Update toast whenever progress changes
  useEffect(() => {
    if (toastId && isUploading) {
      // Update the existing toast with new progress
      toast.custom(
        (t) => <ToastComponent progress={progress} uploadFile={uploadFile} />,
        { id: toastId }
      );
    }
  }, [progress, toastId, isUploading]);

  useEffect(() => {
    // Only start upload if we haven't already
    if (!hasStartedUpload.current && !isUploading) {
      hasStartedUpload.current = true;
      startUpload([uploadFile.file]);
      updateFileStatus(uploadFile.id, "uploading");

      // Show a toast when the upload starts
      setToastId(
        toast.custom(
          (t) => <ToastComponent progress={progress} uploadFile={uploadFile} />,
          {
            duration: Infinity,
          }
        )
      );
    }

    if (uploadFile.status === "complete" && toastId) {
      //   toast.dismiss(toastId);
      toast.custom((t) => <ToastComponentCompleted uploadFile={uploadFile} />, {
        id: toastId,
        duration: 4000,
      });
    }

    if (uploadFile.status === "error" && toastId) {
      //   toast.dismiss(toastId);
      toast.custom((t) => <ToastComponentError uploadFile={uploadFile} />, {
        id: toastId,
        duration: 4000,
      });
    }
  }, [startUpload, updateFileStatus, uploadFile, progress]);
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
    <div className="py-4 px-8 truncate w-96 flex gap-4 text-xs items-center">
      <div className="min-w-[32]">
        <CircularProgressBar
          sqSize={32}
          strokeWidth={1}
          percentage={progress}
        />
      </div>
      <p className="truncate">Uploading {uploadFile.file.name}</p>
      <div className="h-full py-1 hover:bg-foreground hover:text-background rounded-md cursor-pointer ml-auto">
        <GripVertical className="stroke-1 transition-all duration-100" />
      </div>
    </div>
  );
}

function ToastComponentCompleted({
  uploadFile,
}: {
  uploadFile: UTUIUploadFile;
}) {
  return (
    <div className="py-4 px-8 truncate w-96 flex gap-4 text-xs items-center">
      <CircleCheck className="stroke-1 stroke-background fill-foreground" />
      <div className="flex flex-col">
        <p className="truncate line-clamp-1">File uploaded successfully</p>
        <div className="flex items-center justify-between">
          <p className="truncate max-w-52">{uploadFile.file.name} &nbsp;</p>
          <p>uploaded!</p>
        </div>
      </div>
    </div>
  );
}

function ToastComponentError({ uploadFile }: { uploadFile: UTUIUploadFile }) {
  return (
    <div className="py-4 px-8 truncate w-96 flex gap-4 text-xs items-center">
      <CircleCheck className="stroke-1 stroke-background fill-foreground" />
      <div className="flex flex-col">
        <p className="truncate line-clamp-1">File couldn't be uploaded</p>
        <div className="flex items-center justify-between">
          <p className="truncate max-w-52">{uploadFile.file.name}</p>
        </div>
      </div>
    </div>
  );
}
