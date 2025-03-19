"use client";

import UTUIDropzoneGenericDrive from "@/registry/new-york/dropzone-generic-drive/dropzone-generic-drive";
import PreviewComponentsWrapper from "../preview-components-wrapper";
import { removeFile } from "@/app/actions";

export default function UTUIClientDropzoneGenericDrive() {
  return (
    <PreviewComponentsWrapper>
      <UTUIDropzoneGenericDrive
        UTUIFunctionsProps={{
          fileRoute: "imageUploader",
          onClientUploadComplete: (res) => {
            if (!res[0]) return;

            try {
              removeFile(res[0].key);
            } catch (error) {
              console.log(
                `Failed to remove file upon onUploadComplete | ${error instanceof Error ? error.message : error}`,
              );
            }
          },
        }}
      />
    </PreviewComponentsWrapper>
  );
}
