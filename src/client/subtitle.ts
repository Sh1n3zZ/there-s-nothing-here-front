import client from "@/lib/client";

/**
 * Request options for YouTube subtitle download
 */
export interface YouTubeSubtitleRequest {
  /** List of YouTube URLs to download subtitles from */
  urls: string[];
  /** Whether to output as Word document (default: false) */
  output_word?: boolean;
}

/**
 * Response structure when output_word is false
 */
export interface YouTubeSubtitleResponse {
  /** Whether the request was successful */
  success: boolean;
  /** Response message */
  message: string;
  /** List of subtitle texts (optional) */
  subtitle_texts?: string[] | null;
}

/**
 * Result when output_word is true (binary file response)
 */
export interface YouTubeSubtitleFileResult {
  /** The file as Blob */
  blob: Blob;
  /** Download the file */
  download: () => void;
}

/**
 * Download YouTube subtitles
 * @param options - Request options
 * @returns Promise that resolves with subtitle data or file blob based on output_word flag
 */
export async function downloadYouTubeSubtitles(
  options: YouTubeSubtitleRequest,
): Promise<YouTubeSubtitleResponse | YouTubeSubtitleFileResult> {
  const { urls, output_word = false } = options;

  if (output_word) {
    // When output_word is true, response is a binary file
    const response = await client.post("/youtube/download", { urls, output_word }, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const blob = response.data as Blob;
    
    // Get Content-Type from response headers
    const contentType = response.headers["content-type"] || blob.type;
    
    // Create blob with proper type
    const typedBlob = new Blob([blob], { type: contentType });

    return {
      blob: typedBlob,
      download: () => {
        // Let browser determine filename and type from response headers
        // by not setting the download attribute, browser will use Content-Disposition header
        const url = window.URL.createObjectURL(typedBlob);
        const link = document.createElement("a");
        link.href = url;
        // Don't set link.download - let browser use Content-Disposition header
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    };
  } else {
    // When output_word is false, response is JSON
    const response = await client.post<YouTubeSubtitleResponse>(
      "/youtube/download",
      { urls, output_word },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  }
}

