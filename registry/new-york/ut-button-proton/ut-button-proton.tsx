"use client";

// Global Imports
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useFilesStore } from "./store";
import FileTable from "./fileTable";

// Local Imports

// Body
export default function UTButtonProton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFiles = useFilesStore((state) => state.addFiles);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      // Convert FileList to Array and add to store
      addFiles(Array.from(selectedFiles));

      // Reset the input to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
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
      <FileTable />
    </div>
  );
}
