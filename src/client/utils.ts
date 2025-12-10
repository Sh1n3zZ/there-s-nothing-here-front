/**
 * Download a blob as a file
 * @param blob - The blob to download
 * @param filename - The filename for the downloaded file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Extract filename from Content-Disposition header
 * @param contentDisposition - Content-Disposition header value
 * @returns The filename or null if not found
 */
export function extractFilenameFromContentDisposition(
  contentDisposition: string | null,
): string | null {
  if (!contentDisposition) return null;

  const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (filenameMatch && filenameMatch[1]) {
    return filenameMatch[1].replace(/['"]/g, "");
  }

  return null;
}
