import { ExpandedRouteConfig, FileRouterInputKey } from "@uploadthing/shared";

// Converts the size into readable format
export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 B";
  if (bytes < 0) return "Invalid size";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

// Return the amount of file uploaded
export function getUploadedAmount(progress: number, fileSize: number) {
  const uploadedAmount = (progress / 100) * fileSize;
  return formatBytes(uploadedAmount);
}

// Capitalize the first letter
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Return the objects value
export function checkFileObjectKey({
  str,
  obj,
}: {
  str: FileRouterInputKey | undefined;
  obj: ExpandedRouteConfig | undefined;
}) {
  if (!str || !obj) return null;

  if (obj && typeof obj === "object" && obj.hasOwnProperty(str)) {
    return obj[str];
  } else {
    return null;
  }
}
