import { Badge } from "@/components/ui/badge";
import UTUIClientButtonUploadthing from "@/components/uploadthing-ui-client/button-uploadthing";
import UTUIClientDropzoneGenericDrive from "@/components/uploadthing-ui-client/dropzone-generic-drive";
import { redis } from "@/server/db/redis";
import { Download } from "lucide-react";
import Link from "next/link";

// This page displays items from the custom registry.
// You are free to implement this with your own design as needed.

export default async function Home() {
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
        <div className="relative">
          <DisplayDownloads componentName="dropzone-generic-drive" />
          <UTUIClientDropzoneGenericDrive />
        </div>
        {/* [2] UTUIButtonUploadthing */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>UTUIButtonUploadthing</Badge>
          <h2 className="text-sm text-muted-foreground">
            Inside the uploadthing&apos;s admin dashboard
          </h2>
        </div>
        <div className="relative">
          <DisplayDownloads componentName="button-uploadthing" />
          <UTUIClientButtonUploadthing />
        </div>
      </main>
    </div>
  );
}

async function DisplayDownloads({ componentName }: { componentName: string }) {
  const views =
    (await redis.get<number>(["component-views", componentName].join(":"))) ??
    0;
  return (
    <Badge className="absolute right-5 top-5 gap-2">
      <Download className="w-4" />
      <span>{views}</span>
    </Badge>
  );
}
