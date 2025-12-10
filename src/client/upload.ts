import client from "@/lib/client";
import { downloadBlob, extractFilenameFromContentDisposition } from "@/client/utils";

export interface ReplaceOptions {
  /** File to upload */
  file: File;
  /** Dictionary of keyword replacements */
  replacements: Record<string, string>;
  /** Callback for upload progress (0-100) */
  onProgress?: (progress: number) => void;
  /** Whether to automatically download the response file */
  autoDownload?: boolean;
}

export interface ReplaceResult {
  /** The processed file as Blob */
  blob: Blob;
  /** The filename from Content-Disposition header */
  filename: string | null;
  /** Download the file */
  download: (filename?: string) => void;
}

/**
 * Upload a docx file and replace keywords
 * @param options - Upload options
 * @returns Promise that resolves with the processed file
 */
export async function replaceDocumentKeywords(
  options: ReplaceOptions,
): Promise<ReplaceResult> {
  const { file, replacements, onProgress, autoDownload = false } = options;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("replacements", JSON.stringify(replacements));

  const response = await client.post("/documents/replace", formData, {
    responseType: "blob",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress(percentCompleted);
      }
    },
  });

  const contentDisposition = response.headers["content-disposition"];
  const filename = extractFilenameFromContentDisposition(contentDisposition);

  const blob = response.data as Blob;

  const result: ReplaceResult = {
    blob,
    filename,
    download: (customFilename?: string) => {
      const downloadFilename = customFilename || filename || file.name;
      downloadBlob(blob, downloadFilename);
    },
  };

  if (autoDownload) {
    result.download();
  }

  return result;
}
