/**
 * Image Policy Configuration with Feature Flags
 * 
 * Controls image validation rules and behavior via environment variables.
 * Defaults to relaxed settings for immediate results.
 */

export const IMAGE_POLICY = {
  // Feature flags (string envs: "true"/"false")
  RELAXED_VALIDATION: process.env.IMG_RELAXED !== "false", // Default: true
  SKIP_HEAD_FOR_TRUSTED: process.env.IMG_SKIP_HEAD !== "false", // Default: true

  // Thresholds (use relaxed defaults when RELAXED_VALIDATION=true)
  MIN_WIDTH: process.env.IMG_MIN_WIDTH
    ? parseInt(process.env.IMG_MIN_WIDTH, 10)
    : (process.env.IMG_RELAXED !== "false" ? 400 : 800),
    
  MIN_FILE_KB: process.env.IMG_MIN_FILE_KB
    ? parseInt(process.env.IMG_MIN_FILE_KB, 10)
    : (process.env.IMG_RELAXED !== "false" ? 30 : 50),

  // Aspect ratio (w/h)
  MIN_AR: process.env.IMG_MIN_AR ? parseFloat(process.env.IMG_MIN_AR) : 0.4, // relaxed
  MAX_AR: process.env.IMG_MAX_AR ? parseFloat(process.env.IMG_MAX_AR) : 3.2,

  // Allowed mime/extensions
  ALLOW_EXTS: (process.env.IMG_ALLOW_EXTS || "jpg,jpeg,webp,png").split(","),

  // Hosts we trust so we can skip HEAD/size checks if SKIP_HEAD_FOR_TRUSTED=true
  TRUSTED_HOSTS: (process.env.IMG_TRUSTED_HOSTS ||
    "maps.googleapis.com,images.unsplash.com,images.pexels.com,upload.wikimedia.org").split(","),
};

/**
 * Check if a URL is from a trusted host
 */
export function isTrustedHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return IMAGE_POLICY.TRUSTED_HOSTS.some(trusted => 
      hostname.includes(trusted.toLowerCase())
    );
  } catch {
    return false;
  }
}

/**
 * Check if file extension is allowed
 */
export function isAllowedExtension(url: string): boolean {
  try {
    const ext = url.split('.').pop()?.toLowerCase();
    return ext ? IMAGE_POLICY.ALLOW_EXTS.includes(ext) : false;
  } catch {
    return false;
  }
}

/**
 * Get validation mode description for logging
 */
export function getValidationMode(): string {
  return IMAGE_POLICY.RELAXED_VALIDATION ? 'RELAXED' : 'STRICT';
}
