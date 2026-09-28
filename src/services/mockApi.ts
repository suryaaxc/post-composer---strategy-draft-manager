import { Draft } from '../types';

/**
 * Step 11: Mock API Integration
 * Simulates saving a draft to a remote server with a 1500ms delay.
 * Allows an optional `simulateError` flag to demonstrate retry logic & error handling.
 */
export const saveDraftApi = (
  draft: Omit<Draft, 'id' | 'createdAt'> & { id?: number; createdAt?: string },
  simulateFailure = false
): Promise<Draft> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateFailure) {
        reject(new Error("Network Error: Failed to reach remote draft sync service"));
      } else {
        const persistedDraft: Draft = {
          id: draft.id || Date.now(),
          platform: draft.platform,
          content: draft.content,
          createdAt: draft.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resolve(persistedDraft);
      }
    }, 1500);
  });
};

/**
 * Step 13: Retry Logic
 * Recursively attempts to call saveDraftApi up to `retries` times when failures occur.
 * Notifies caller of progress via `onRetry` callback for interactive observability.
 */
export const saveWithRetry = async (
  draft: Omit<Draft, 'id' | 'createdAt'> & { id?: number; createdAt?: string },
  retries = 3,
  simulateFailure = false,
  onRetry?: (remainingRetries: number, totalRetries: number) => void
): Promise<Draft> => {
  try {
    return await saveDraftApi(draft, simulateFailure);
  } catch (error) {
    if (retries > 0) {
      if (onRetry) {
        onRetry(retries - 1, 3);
      }
      // Small backoff before retrying
      await new Promise((res) => setTimeout(res, 500));
      return saveWithRetry(draft, retries - 1, simulateFailure, onRetry);
    }
    throw error;
  }
};
