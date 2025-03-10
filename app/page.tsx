import UTUIButtonProton from "@/registry/new-york/button-proton/button-proton";
import UTUIButtonUploadthing from "@/registry/new-york/button-uploadthing/button-uploadthing";

// This page displays items from the custom registry.
// You are free to implement this with your own design as needed.

export default function Home() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Uploadthing UI Registry
        </h1>
        <p className="text-muted-foreground">
          A custom registry for the Uploadthing UI Components.
        </p>
      </header>
      <main className="flex flex-1 flex-col-reverse gap-8">
        <div className="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A button taken inspiration from the proton drive UI
            </h2>
          </div>
          <div className="relative flex min-h-[400px] items-center justify-center">
            <UTUIButtonProton />
          </div>
        </div>
        <div className="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A button taken inspiration from the uploadthing&apos;s admin page
            </h2>
          </div>
          <div className="relative flex min-h-[400px] items-center justify-center">
            <UTUIButtonUploadthing />
          </div>
        </div>
      </main>
    </div>
  );
}
