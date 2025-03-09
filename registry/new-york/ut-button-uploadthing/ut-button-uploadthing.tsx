"use client";

import { Button } from "@/components/ui/button";
import { createId } from "@paralleldrive/cuid2";
import { useRef } from "react";
import DisplayingToasts from "./displaying-toasts";
import { UTUIFileStatus } from "@/lib/uploadthing-ui-types";
import { useFilesStore } from "@/store/button-uploadthing-store";

export default function UTButtonUploadthing() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFiles, historicFiles } = useFilesStore();

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

  return (
    <div className="flex flex-col gap-8 text-sm">
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
          accept="image/*"
        />
        <Button onClick={handleButtonClick}>Select Files to Upload</Button>
      </div>

      {historicFiles.map((fileObj) => (
        <DisplayingToasts key={fileObj.id} uploadFile={fileObj} />
      ))}
    </div>
  );
}
