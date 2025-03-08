import { useUploadThing } from "@/lib/uploadthing";
import { useState, useRef, useEffect } from "react";
import { FileStatus } from "./store";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface FileUploaderProps {
  fileId: string;
  file: File;
  status: FileStatus;
  onStatusChange: (id: string, status: FileStatus, url?: string) => void;
}

export const FileRow = ({
  fileId,
  file,
  status,
  onStatusChange,
}: FileUploaderProps) => {
  // Keep progress state local
  const [progress, setProgress] = useState(0);
  // Ref to prevent state updates after unmount
  const isMounted = useRef(true);
  // Inside your FileRow component
  const hasStartedUpload = useRef(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    uploadProgressGranularity: "fine",
    onUploadProgress: (progress) => {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setProgress(progress);
      }

      console.log("PROGRESS", progress);
    },
    onClientUploadComplete: (res) => {
      if (isMounted.current && res?.[0]) {
        onStatusChange(fileId, "complete", res[0].url);
      }
    },
    onUploadError: (error) => {
      if (isMounted.current) {
        onStatusChange(fileId, "error");
        console.log("ERROR", error);
      }
    },
  });

  useEffect(() => {
    // Only start upload if we haven't already
    if (!hasStartedUpload.current || isUploading) {
      hasStartedUpload.current = true;
      startUpload([file]);
      onStatusChange(fileId, "uploading");
    }

    // Add a cleanup function
    return () => {
      // Any cleanup code needed
    };
  }, [fileId, file, startUpload, onStatusChange]);

  return (
    <TableRow>
      <TableCell className="font-medium truncate max-w-48 text-left">
        {file.name}
      </TableCell>
      <TableCell>
        <Badge
          variant={
            status === "complete"
              ? "success"
              : status === "error"
              ? "destructive"
              : "default"
          }
        >
          {capitalizeFirstLetter(status)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        {getUploadedAmount(progress, file.size)} / {formatBytes(file.size)}
      </TableCell>
    </TableRow>
  );
};

// Helper function to convert size into readable format
function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

// A Helper function which takes the percentage of the file uploaded and the file size. It then return the amount of file uploaded in a readable format.
function getUploadedAmount(progress: number, fileSize: number) {
  const uploadedAmount = (progress / 100) * fileSize;
  return formatBytes(uploadedAmount);
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
