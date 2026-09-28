import { Platform } from '../types';

/**
 * Step 3: Define Platform Rules
 * Maps each supported social platform to its maximum allowable character count.
 */
export const platforms: Record<Platform, number> = {
  Twitter: 280,
  LinkedIn: 3000,
  Instagram: 2200,
};

/**
 * Step 10: Strategy Pattern implementations for each platform's character rule.
 * Each strategy encapsulates specific platform validation algorithms.
 */
export const twitterStrategy = (text: string): boolean => {
  return text.length <= platforms.Twitter;
};

export const linkedInStrategy = (text: string): boolean => {
  return text.length <= platforms.LinkedIn;
};

export const instagramStrategy = (text: string): boolean => {
  return text.length <= platforms.Instagram;
};

/**
 * Strategy Registry:
 * Allows dynamic lookup of validation logic via strategies[platform](content).
 */
export const strategies: Record<Platform, (text: string) => boolean> = {
  Twitter: twitterStrategy,
  LinkedIn: linkedInStrategy,
  Instagram: instagramStrategy,
};

/**
 * Validates post content for a given platform using the Strategy Pattern.
 * Returns an error string if invalid, or an empty string ("") if valid.
 */
export const validatePost = (platform: Platform, content: string): string => {
  const limit = platforms[platform];

  if (!content.trim()) {
    return "Post cannot be empty";
  }

  // Strategy Pattern dynamic invocation
  const strategy = strategies[platform];
  const isWithinLimit = strategy ? strategy(content) : content.length <= limit;

  if (!isWithinLimit) {
    return `Maximum ${limit} characters allowed`;
  }

  return "";
};

/**
 * Utility helpers for UI calculations
 */
export const getRemainingCharacters = (platform: Platform, content: string): number => {
  return platforms[platform] - content.length;
};

export const getCharacterProgressPercent = (platform: Platform, content: string): number => {
  const limit = platforms[platform];
  return Math.min(100, Math.round((content.length / limit) * 100));
};
