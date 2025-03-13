//////////////////////////////////////////////////////////////////////////////////
// UTUIButtonGenericDrive
//////////////////////////////////////////////////////////////////////////////////

"use client";

// Global Imports
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { generatePermittedFileTypes } from "uploadthing/client";

// Local Imports
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { UTUIFileStatus, UTUIFunctionsProps } from "@/lib/uploadthing-ui-types";
import {
  capitalizeFirstLetter,
  formatBytes,
  getUploadedAmount,
} from "@/lib/uploadthing-ui-utils";
import { useGenericDriveStore } from "@/store/button-generic-drive-store";

// Body
export default function UTUIButtonGenericDrive({
  UTUIFunctionsProps,
}: {
  UTUIFunctionsProps: UTUIFunctionsProps;
}) {
  // [1] Refs & States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFiles, openModel, files, resetFiles } = useGenericDriveStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  // [2] Derived states
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

  const [abortSignal, setAbortSignal] = useState<AbortSignal | undefined>(
    undefined,
  );

  // [3] Handlers
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    openModel();

    // Create a new AbortController for this upload
    abortControllerRef.current = new AbortController();
    setAbortSignal(abortControllerRef.current.signal);

    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0 && fileInputRef.current) {
      // Convert FileList to Array and add them to state
      addFiles(Array.from(selectedFiles));

      // Reset the input to allow selecting the same files again
      fileInputRef.current.value = "";
    }
  };

  function resetAbortController() {
    if (abortControllerRef.current) {
      resetFiles();
      abortControllerRef.current.abort();
      setAbortSignal(abortControllerRef.current.signal);
    }
  }

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
      <Button className="w-fit" onClick={handleButtonClick}>
        Select Files to Upload
      </Button>
      <FileModel
        abortSignal={abortSignal}
        resetAbortController={resetAbortController}
        UTUIFunctionsProps={UTUIFunctionsProps}
      />
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// File Model
//////////////////////////////////////////////////////////////////////////////////

function FileModel({
  abortSignal,
  resetAbortController,
  UTUIFunctionsProps,
}: {
  abortSignal?: AbortSignal;
  resetAbortController: () => void;
  UTUIFunctionsProps: UTUIFunctionsProps;
}) {
  // [1] Refs & States & Callbacks
  const { files, displayModel, updateFileStatus, closeModel, resetFiles } =
    useGenericDriveStore();
  const [stopConfirmationModel, setStopConfirmationModel] = useState(false);

  const handleStatusChange = useCallback(
    (id: string, status: UTUIFileStatus, url?: string) => {
      updateFileStatus(id, status, url);
    },
    [updateFileStatus],
  );

  // [2] Derived State
  const isUploadComplete = files.every(
    (file) => file.status === "complete" || file.status === "error",
  );

  // [3] Handlers
  function toggleIsStopConfirmationModel() {
    setStopConfirmationModel((cur) => !cur);
  }

  function onStopTransfers() {
    closeModel();
    resetFiles();
    closeStopConfirmationModel();

    resetAbortController();
  }

  function closeStopConfirmationModel() {
    setStopConfirmationModel(false);
  }

  function closeModelAfterUpload() {
    closeStopConfirmationModel();
    closeModel();
    resetFiles();
  }

  // [4] JSX
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
                {files.filter((file) => {
                  if (file.status === "error") return;
                  if (file.status === "complete") return;

                  return file;
                }).length > 0 ? (
                  <StopUploadConfirmation
                    filesSum={files.length}
                    open={stopConfirmationModel}
                    toggleOpen={toggleIsStopConfirmationModel}
                    onStopTransfers={onStopTransfers}
                    closeOpen={closeStopConfirmationModel}
                  />
                ) : (
                  <Button variant={"outline"} onClick={closeModelAfterUpload}>
                    <X className="stroke-1" />
                  </Button>
                )}
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
                    abortSignal={abortSignal}
                    onStatusChange={handleStatusChange}
                    status={fileItem.status}
                    UTUIFunctionsProps={UTUIFunctionsProps}
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

function StopUploadConfirmation({
  open,
  filesSum,
  toggleOpen,
  closeOpen,
  onStopTransfers,
}: {
  open: boolean;
  filesSum: number;
  toggleOpen: () => void;
  closeOpen: () => void;
  onStopTransfers: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={toggleOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>
          <X className="stroke-1" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Stop transfers?</AlertDialogTitle>
          <AlertDialogDescription>
            There
            {`${filesSum > 1 ? " are " : " is "}${filesSum} file${
              filesSum > 1 ? "s" : ""
            }`}{" "}
            that still need to be transfered. Closing the transfer manager will
            end all operations
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <Button variant={"outline"} onClick={closeOpen}>
            Continue transfers
          </Button>
          <Button variant={"destructive"} onClick={onStopTransfers}>
            Stop transfers
          </Button>
        </AlertDialogFooter>
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
  abortSignal?: AbortSignal;
  onStatusChange: (id: string, status: UTUIFileStatus, url?: string) => void;
  UTUIFunctionsProps: UTUIFunctionsProps;
}

function FileRow({
  fileId,
  file,
  status,
  abortSignal,
  onStatusChange,
  UTUIFunctionsProps,
}: FileUploaderProps) {
  // [1] State & Ref
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(true);
  const hasStartedUpload = useRef(false);
  const {} = useGenericDriveStore();

  // [2] Uploadthing
  const { startUpload, isUploading } = useUploadThing(
    UTUIFunctionsProps.fileRoute,
    {
      uploadProgressGranularity: "fine",
      signal: abortSignal,
      onUploadProgress: (progress) => {
        if (isMounted.current) {
          setProgress(progress);

          // Your additional code here
          UTUIFunctionsProps.onUploadProgress?.(progress);
        }
      },
      onClientUploadComplete: (res) => {
        if (isMounted.current && res?.[0]) {
          onStatusChange(fileId, "complete", res[0].url);

          // Your additional code here
          UTUIFunctionsProps.onClientUploadComplete?.(res);
        }
      },
      onUploadError: (error) => {
        if (isMounted.current) {
          onStatusChange(fileId, "error");

          // Your additional code here
          UTUIFunctionsProps.onUploadError?.(error);
        }
      },
      onBeforeUploadBegin: UTUIFunctionsProps.onBeforeUploadBegin,
      onUploadBegin: UTUIFunctionsProps.onUploadBegin,
    },
  );

  // [3] Effects
  useEffect(() => {
    // Only start upload if we haven't already and not abort has happened
    if (!hasStartedUpload.current && !isUploading) {
      hasStartedUpload.current = true;

      startUpload([file]).catch(() => {
        // Handling the abort
        onStatusChange(fileId, "error");
      });

      onStatusChange(fileId, "uploading");
    }
  }, [fileId, file, startUpload, onStatusChange]);

  // [4] JSX
  return (
    <TableRow>
      <TableCell className="max-w-48 truncate text-left font-medium">
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
