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

import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FileTable() {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={!displayModel ? { opacity: 0 } : { opacity: 1 }}
      transition={{
        duration: 0.4,
      }}
      className="fixed max-w-3xl bottom-4 right-4 flex h-fit min-w-[calc(100%-2rem)] bg-background flex-col gap-4 rounded-md border p-4 text-sm"
    >
      <Dialog open={displayModel} onOpenChange={toggleModel}>
        <DialogContent location="bottom-right" hideCloseButton hideOverlay>
          <DialogHeader>
            <DialogTitle asChild>
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
                <div className="flex gap-4">
                  <Button
                    variant={"outline"}
                    disabled={!isUploadComplete}
                    onClick={() => {
                      closeModel();

                      setTimeout(() => {
                        resetFiles();
                      }, 400);
                    }}
                  >
                    <X className="stroke-1" />
                  </Button>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription asChild>
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
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
