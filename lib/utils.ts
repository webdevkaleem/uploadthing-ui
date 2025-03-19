import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redisNameToSlug(str: string) {
  return str.replaceAll(" ", "-").toLowerCase();
}
