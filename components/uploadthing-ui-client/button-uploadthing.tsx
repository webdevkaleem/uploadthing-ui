"use client";

import UTUIButtonUploadthing from "@/registry/new-york/button-uploadthing/button-uploadthing";
import PreviewComponentsWrapper from "../preview-components-wrapper";
import { removeFile } from "@/app/actions";

export default function UTUIClientButtonUploadthing() {
  return (
    <PreviewComponentsWrapper>
      <UTUIButtonUploadthing
        UTUIFunctionsProps={{
          fileRoute: "imageUploader",
          onClientUploadComplete: (res) => {
            if (!res[0]) return;

            removeFile(res[0].key);
          },
        }}
      />
    </PreviewComponentsWrapper>
  );
}
