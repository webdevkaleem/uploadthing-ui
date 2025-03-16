"use client";

export default function PreviewComponentsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[450px] w-full flex-col items-center justify-center gap-4 rounded-lg border p-4 py-10">
      <div className="flex h-full w-full items-center justify-center sm:w-2/3">
        {children}
      </div>
    </div>
  );
}
