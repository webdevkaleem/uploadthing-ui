"use client";

import UTUIButtonUploadthing from "@/registry/new-york/button-uploadthing/button-uploadthing";
import UTUIDropzoneGenericDrive from "@/registry/new-york/dropzone-generic-drive/dropzone-generic-drive";
import Link from "next/link";
import { removeFile } from "./actions";
import PreviewComponentsWrapper from "@/components/preview-components-wrapper";
import { Badge } from "@/components/ui/badge";

// This page displays items from the custom registry.
// You are free to implement this with your own design as needed.

export default function Home() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Uploadthing UI Registry
        </h1>
        <p className="text-muted-foreground">
          Custom UI components for Uploadthing built on top of the{" "}
          <Link
            className="underline"
            href={"https://ui.shadcn.com/docs/registry"}
          >
            Shadcn Registry
          </Link>
          . This project is for{" "}
          <Link className="underline" href={"https://nextjs.org"}>
            Next JS
          </Link>{" "}
          /{" "}
          <Link className="underline" href={"https://react.dev"}>
            React
          </Link>{" "}
          only. It&apos;s an opinionated way of handling uploadthing&apos;s
          client side state.
        </p>
      </header>
      <main className="flex flex-1 flex-col gap-8">
        {/* [1] UTUIDropzoneGenericDrive */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>UTUIDropzoneGenericDrive</Badge>
          <h2 className="text-sm text-muted-foreground">
            Inside storage drive applications
          </h2>
        </div>
        <PreviewComponentsWrapper>
          <UTUIDropzoneGenericDrive
            UTUIFunctionsProps={{
              fileRoute: "imageUploader",
              onClientUploadComplete: (res) => {
                if (!res[0]) return;

                removeFile(res[0].key);
              },
            }}
          />
        </PreviewComponentsWrapper>

        {/* [2] UTUIButtonUploadthing */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>UTUIButtonUploadthing</Badge>
          <h2 className="text-sm text-muted-foreground">
            Inside the uploadthing&apos;s admin dashboard
          </h2>
        </div>
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
      </main>
    </div>
  );
}
