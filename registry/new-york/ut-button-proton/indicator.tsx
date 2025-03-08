import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useFilesStore } from "./store";

export default function Indicator() {
  const { toggleModel, displayModel, files } = useFilesStore();

  return (
    <Button
      className={cn(
        "fixed z-50 flex justify-center items-center w-fit gap-4 p-6 shadow-lg duration-200 sm:rounded-lg right-[5%] bottom-[5%] translate-x-[5%] translate-y-[5%]",
        {
          "hidden animate-in fade-in-0 zoom-in-95 slide-in-from-right-1/2 slide-in-from-bottom-[48%]":
            displayModel,
        },
        // {
        //   "animate-out fade-out-0 zoom-out-95 slide-out-to-right-1/2 slide-out-to-bottom-[48%]":
        //     !displayModel,
        // },
        { hidden: files.length === 0 },
        { hidden: displayModel }
      )}
      onClick={toggleModel}
    >
      <div className="flex gap-4 items-center justify-center relative animate-pulse">
        {files.length > 99 ? "99+" : files.length}
        <Upload className="stroke-1 fill-black" />
      </div>
    </Button>
  );
}
