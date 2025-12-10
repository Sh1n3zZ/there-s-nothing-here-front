"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { replaceDocumentKeywords } from "@/client/upload";
import type { ReplacementOption } from "@/components/SelectBeReplaced";
import {
  pause_symbols,
  punctuation_marks,
} from "@/client/punctuation_marks";

interface FileUploadComponentProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  replacementOptions?: Set<ReplacementOption>;
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => Promise<void> | void;
  autoDownload?: boolean;
  className?: string;
}

export function FileUploadComponent({
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  multiple = true,
  replacementOptions,
  onUpload,
  autoDownload = true,
  className = "w-full max-w-md",
}: FileUploadComponentProps) {
  const [files, setFiles] = React.useState<File[]>([]);

  const handleUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      },
    ) => {
      if (onUpload) {
        try {
          await onUpload(files, { onProgress, onSuccess, onError });
        } catch (error) {
          console.error("Upload error:", error);
        }
        return;
      }

      try {
        const replacements: Record<string, string> = {};
        if (replacementOptions) {
          if (replacementOptions.has("remove_all_punctuation_marks")) {
            punctuation_marks.forEach((symbol) => {
              replacements[symbol] = "";
            });
          } else if (replacementOptions.has("only_remove_pause_symbols")) {
            pause_symbols.forEach((symbol) => {
              replacements[symbol] = "";
            });
          }
        }

        const uploadPromises = files.map(async (file) => {
          try {
            await replaceDocumentKeywords({
              file,
              replacements,
              autoDownload,
              onProgress: (progress) => {
                onProgress(file, progress);
              },
            });
            onSuccess(file);
            toast.success("File processed successfully", {
              description: file.name,
            });
            setFiles((prevFiles) =>
              prevFiles.filter(
                (f) => f.name !== file.name || f.size !== file.size,
              ),
            );
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Upload failed";
            onError(file, new Error(errorMessage));
            toast.error("Upload failed", {
              description: `${file.name}: ${errorMessage}`,
            });
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
        toast.error("Unexpected error", {
          description: "An unexpected error occurred during upload",
        });
      }
    },
    [onUpload, replacementOptions, autoDownload],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const onFileValidate = React.useCallback((file: File): string | null => {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".docx")) {
      return "Only .docx files are allowed";
    }
    return null;
  }, []);

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      maxFiles={maxFiles}
      maxSize={maxSize}
      className={className}
      onUpload={handleUpload}
      onFileReject={onFileReject}
      onFileValidate={onFileValidate}
      accept={accept}
      multiple={multiple}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
                <span className="sr-only">Delete</span>
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
