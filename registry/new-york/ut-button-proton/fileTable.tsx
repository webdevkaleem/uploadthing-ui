import { useCallback } from "react";
import { FileStatus, useFilesStore } from "./store";
import { FileRow } from "./fileRow";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FileTable() {
  const { files, updateFileStatus } = useFilesStore();

  const handleStatusChange = useCallback(
    (id: string, status: FileStatus, url?: string) => {
      updateFileStatus(id, status, url);
    },
    [updateFileStatus]
  );

  return (
    <div className="">
      <h2>File Uploads</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Type</TableHead>
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
