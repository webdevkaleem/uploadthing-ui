"use server";

import { UTApi } from "uploadthing/server";

export async function removeFile(id: string) {
  try {
    // Delete the file from the server after upload
    const utapi = new UTApi();

    await utapi.deleteFiles(id);
    return true;
  } catch {
    return false;
  }
}
