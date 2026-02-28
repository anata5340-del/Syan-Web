/**
 * Gumlet API Service
 * 
 * This service handles importing videos from S3 to Gumlet and managing Gumlet video IDs.
 * 
 * Required Environment Variable:
 * - GUMLET_API_KEY: Your Gumlet API key from the Gumlet dashboard
 */

const GUMLET_API_BASE_URL = "https://api.gumlet.com/v1";

interface GumletVideoResponse {
  id: string;
  status: string;
  source_url?: string;
  title?: string;
  [key: string]: any;
}

interface ImportVideoOptions {
  sourceUrl: string;
  title?: string;
  collectionId?: string;
}

/**
 * Import a video from S3 URL to Gumlet
 * @param options - Import options including S3 URL, title, and optional collection ID
 * @returns Promise with Gumlet video ID
 */
export const importVideoFromS3 = async (
  options: ImportVideoOptions
): Promise<string> => {
  const apiKey = process.env.GUMLET_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GUMLET_API_KEY is not configured. Please add it to your .env file."
    );
  }

  try {
    const response = await fetch(`${GUMLET_API_BASE_URL}/videos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_url: options.sourceUrl,
        title: options.title || "Video",
        ...(options.collectionId && { collection_id: options.collectionId }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gumlet API error: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    const data: GumletVideoResponse = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error importing video to Gumlet:", error);
    throw error;
  }
};

/**
 * Get the status of a Gumlet video
 * @param videoId - Gumlet video ID
 * @returns Promise with video status information
 */
export const getVideoStatus = async (
  videoId: string
): Promise<GumletVideoResponse> => {
  const apiKey = process.env.GUMLET_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GUMLET_API_KEY is not configured. Please add it to your .env file."
    );
  }

  try {
    const response = await fetch(`${GUMLET_API_BASE_URL}/videos/${videoId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gumlet API error: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    const data: GumletVideoResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting video status from Gumlet:", error);
    throw error;
  }
};

/**
 * Check if a video is ready (processed) in Gumlet
 * @param videoId - Gumlet video ID
 * @returns Promise<boolean> - true if video is ready
 */
export const isVideoReady = async (videoId: string): Promise<boolean> => {
  try {
    const status = await getVideoStatus(videoId);
    return status.status === "ready" || status.status === "published";
  } catch (error) {
    console.error("Error checking video readiness:", error);
    return false;
  }
};

