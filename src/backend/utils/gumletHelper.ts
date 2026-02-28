/**
 * Gumlet Helper Utilities
 * 
 * Functions to detect and extract Gumlet video IDs from URLs
 */

/**
 * Extract Gumlet video ID from a Gumlet embed URL
 * 
 * Supports various formats:
 * - https://play.gumlet.io/embed/{videoId}
 * - http://play.gumlet.io/embed/{videoId}
 * - play.gumlet.io/embed/{videoId}
 * - With or without trailing slashes
 * - With query parameters (ignored)
 * 
 * @param url - The URL to check
 * @returns The Gumlet video ID if it's a Gumlet URL, null otherwise
 * 
 * @example
 * extractGumletVideoId("https://play.gumlet.io/embed/6958db7015b21a591c5c2c4f")
 * // Returns: "6958db7015b21a591c5c2c4f"
 * 
 * @example
 * extractGumletVideoId("https://example.com/video.mp4")
 * // Returns: null
 */
export const extractGumletVideoId = (url: string): string | null => {
  if (!url || typeof url !== "string") {
    return null;
  }

  // Pattern to match Gumlet embed URLs
  // Matches: https://play.gumlet.io/embed/{videoId}
  // Group 1 captures the video ID
  const gumletUrlPattern = /(?:https?:\/\/)?(?:www\.)?play\.gumlet\.io\/embed\/([a-zA-Z0-9]+)/i;

  const match = url.trim().match(gumletUrlPattern);

  if (match && match[1]) {
    return match[1];
  }

  return null;
};

/**
 * Check if a URL is a Gumlet embed URL
 * 
 * @param url - The URL to check
 * @returns true if it's a Gumlet embed URL, false otherwise
 */
export const isGumletUrl = (url: string): boolean => {
  return extractGumletVideoId(url) !== null;
};

