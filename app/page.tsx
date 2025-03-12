"use client";

import UTUIButtonGenericDrive from "@/registry/new-york/button-generic-drive/button-generic-drive";
import UTUIButtonUploadthing from "@/registry/new-york/button-uploadthing/button-uploadthing";

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
          A custom opinionated registry for the Uploadthing UI.
        </p>
        <p className="text-muted-foreground">
          Made for Next JS projects with TailwindCSS, ShadcnUI, Lucide React and
          Uploadthing (duh)
        </p>
      </header>
      <main className="flex flex-1 flex-col-reverse gap-8">
        <div className="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              Workflow: Inside storage drive applications
            </h2>
          </div>
          <div className="relative flex min-h-[400px] items-center justify-center">
            <UTUIButtonGenericDrive
              UTUIFunctionsProps={{
                fileRoute: "imageUploader",
                onBeforeUploadBegin: (files) => {
                  // Your additional code here
                  console.log(files);

                  return files;
                },
                onUploadBegin: (fileName) => {
                  // Your additional code here
                  console.log(fileName);
                },
                onUploadProgress: (progress) => {
                  // Your additional code here
                  console.log(progress);
                },
                onClientUploadComplete: (res) => {
                  // Your additional code here
                  console.log(res);
                },
                onUploadError: (error) => {
                  // Your additional code here
                  console.log(error);
                },
              }}
            />
          </div>
        </div>
        <div className="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              Workflow: Inside the uploadthing&apos;s admin dashboard
            </h2>
          </div>
          <div className="relative flex min-h-[400px] items-center justify-center">
            <UTUIButtonUploadthing
              UTUIFunctionsProps={{
                fileRoute: "imageUploader",
                onBeforeUploadBegin: (files) => {
                  // Your additional code here
                  console.log(files);

                  return files;
                },
                onUploadBegin: (fileName) => {
                  // Your additional code here
                  console.log(fileName);
                },
                onUploadProgress: (progress) => {
                  // Your additional code here
                  console.log(progress);
                },
                onClientUploadComplete: (res) => {
                  // Your additional code here
                  console.log(res);
                },
                onUploadError: (error) => {
                  // Your additional code here
                  console.log(error);
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
