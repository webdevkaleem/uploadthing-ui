//////////////////////////////////////////////////////////////////////////////////
// UTButtonProton
//////////////////////////////////////////////////////////////////////////////////

"use client";

// Global Imports
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { generatePermittedFileTypes } from "uploadthing/client";

// Local Imports
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUploadThing } from "@/lib/uploadthing";
import { UTUIFileStatus } from "@/lib/uploadthing-ui-types";
import {
  capitalizeFirstLetter,
  formatBytes,
  getUploadedAmount,
} from "@/lib/uploadthing-ui-utils";
import { useFilesStore } from "@/store/button-proton-store";

// Body
export default function UTUIButtonProton() {
  // [1] Refs & States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFiles, openModel } = useFilesStore();

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
    openModel();

    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0 && fileInputRef.current) {
      // Convert FileList to Array and add them to state
      addFiles(Array.from(selectedFiles));

      // Reset the input to allow selecting the same files again
      fileInputRef.current.value = "";
    }
  };

  // JSX
  return (
    <div className="flex flex-col gap-8 text-sm">
      {/* Hidden input for selecting files */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
        accept={acceptedFileTypes}
      />
      {/* Button to trigger the file selection */}
      <Button onClick={handleButtonClick}>Select Files to Upload</Button>
      <FileModel />
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// File Model
//////////////////////////////////////////////////////////////////////////////////

function FileModel() {
  // [1] Refs & States & Callbacks
  const {
    files,
    displayModel,
    updateFileStatus,
    closeModel,
    toggleModel,
    resetFiles,
  } = useFilesStore();

  const handleStatusChange = useCallback(
    (id: string, status: UTUIFileStatus, url?: string) => {
      updateFileStatus(id, status, url);
    },
    [updateFileStatus]
  );

  // [2] Derived State
  const isUploadComplete = files.every(
    (file) => file.status === "complete" || file.status === "error"
  );

  // [3] JSX
  return (
    <AlertDialog open={displayModel} onOpenChange={closeModel}>
      <AlertDialogContent location="bottom-right" hideOverlay>
        <AlertDialogHeader>
          <AlertDialogTitle asChild>
            <div className="flex items-center justify-between">
              {isUploadComplete ? (
                <p>
                  {files.length} file{files.length > 1 ? "s" : ""} uploaded
                </p>
              ) : (
                <p>
                  {files.length} file{files.length > 1 ? "s" : ""} uploading
                </p>
              )}
              <div className="flex gap-2">
                <AlertDialogCancel
                  disabled={!isUploadComplete}
                  onClick={() => {
                    toggleModel();

                    setTimeout(() => {
                      resetFiles();
                    }, 500);
                  }}
                >
                  <X className="stroke-1" />
                </AlertDialogCancel>
              </div>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Uploading</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((fileItem) => (
                  <FileRow
                    key={fileItem.id}
                    fileId={fileItem.id}
                    file={fileItem.file}
                    onStatusChange={handleStatusChange}
                    status={fileItem.status}
                  />
                ))}
              </TableBody>
            </Table>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// File Row
//////////////////////////////////////////////////////////////////////////////////

interface FileUploaderProps {
  fileId: string;
  file: File;
  status: UTUIFileStatus;
  onStatusChange: (id: string, status: UTUIFileStatus, url?: string) => void;
}

function FileRow({ fileId, file, status, onStatusChange }: FileUploaderProps) {
  // [1] State & Ref
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(true);
  const hasStartedUpload = useRef(false);

  // [2] Uploadthing
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    uploadProgressGranularity: "fine",
    onUploadProgress: (progress) => {
      if (isMounted.current) {
        setProgress(progress);
      }
    },
    onClientUploadComplete: (res) => {
      if (isMounted.current && res?.[0]) {
        onStatusChange(fileId, "complete", res[0].url);
      }
    },
    onUploadError: () => {
      if (isMounted.current) {
        onStatusChange(fileId, "error");
      }
    },
  });

  // [3] Effects
  useEffect(() => {
    // Only start upload if we haven't already
    if (!hasStartedUpload.current || isUploading) {
      hasStartedUpload.current = true;

      // startUpload([file]);
      onStatusChange(fileId, "uploading");
    }
  }, [fileId, file, startUpload, onStatusChange]);

  // [4] JSX
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
}
