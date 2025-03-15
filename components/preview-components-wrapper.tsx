"use client";

export default function PreviewComponentsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[450px] flex-col items-center justify-center gap-4 rounded-lg border p-4 py-10">
      {children}
    </div>
  );
}
