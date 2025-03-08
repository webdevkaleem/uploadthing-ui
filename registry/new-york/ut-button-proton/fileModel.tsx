import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback } from "react";
import { FileRow } from "./fileRow";
import { FileStatus, useFilesStore } from "./store";

import { X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FileModel() {
  const {
    files,
    updateFileStatus,
    displayModel,
    closeModel,
    toggleModel,
    resetFiles,
  } = useFilesStore();

  const handleStatusChange = useCallback(
    (id: string, status: FileStatus, url?: string) => {
      updateFileStatus(id, status, url);
    },
    [updateFileStatus]
  );

  const isUploadComplete = files.every((file) => file.status === "complete");

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
