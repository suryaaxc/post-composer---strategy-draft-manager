import { useState, useEffect } from 'react';
import { Draft, Platform } from '../types';

const STORAGE_KEY = 'drafts';

// Initial starter drafts so the user sees real content immediately
const INITIAL_DEMO_DRAFTS: Draft[] = [
  {
    id: 1711531200000,
    platform: 'Twitter',
    content: 'Shipped Experiment 1: Post Composer with Real-Time Strategy Pattern Validation! 🚀 Check out character limits, dynamic strategies, and async retry states.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 1711534800000,
    platform: 'LinkedIn',
    content: "I'm excited to share our architecture for decoupled client-side validation using the Strategy Pattern in React. By abstracting Twitter (280 chars), LinkedIn (3,000 chars), and Instagram (2,200 chars) into individual strategy modules, our team can scale platform constraints independently without modifying UI components.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 1711538400000,
    platform: 'Instagram',
    content: 'Designing clean UI with zero-pill discipline and real-time feedback loops. Always test your boundary conditions! 📸✨ #react #frontend #webdev #cleancode',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

export const useDrafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Populate demo drafts on first run so the UI isn't empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DRAFTS));
      return INITIAL_DEMO_DRAFTS;
    } catch {
      return INITIAL_DEMO_DRAFTS;
    }
  });

  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

  // Sync to localStorage whenever drafts change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.error('Failed to sync drafts to localStorage', e);
    }
  }, [drafts]);

  /**
   * Step 6 & 8: Save or update draft
   */
  const saveDraft = (platform: Platform, content: string, existingId?: number): Draft => {
    let updated: Draft[];
    let targetDraft: Draft;

    if (existingId) {
      // Editing existing draft
      targetDraft = {
        id: existingId,
        platform,
        content,
        createdAt: drafts.find(d => d.id === existingId)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = drafts.map(d => (d.id === existingId ? targetDraft : d));
    } else {
      // Step 6: Create new draft
      targetDraft = {
        id: Date.now(),
        platform,
        content,
        createdAt: new Date().toISOString(),
      };
      updated = [targetDraft, ...drafts];
    }

    setDrafts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEditingDraft(null);
    return targetDraft;
  };

  /**
   * Step 8: Edit Draft
   * Sets the editing draft so PostComposer loads it and removes/updates it
   */
  const selectDraftForEdit = (draft: Draft) => {
    setEditingDraft(draft);
  };

  const cancelEdit = () => {
    setEditingDraft(null);
  };

  /**
   * Step 9: Delete Draft
   */
  const deleteDraft = (id: number) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (editingDraft?.id === id) {
      setEditingDraft(null);
    }
  };

  /**
   * Clear all drafts
   */
  const clearAllDrafts = () => {
    setDrafts([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setEditingDraft(null);
  };

  /**
   * Reset demo data
   */
  const resetDemoData = () => {
    setDrafts(INITIAL_DEMO_DRAFTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DRAFTS));
    setEditingDraft(null);
  };

  return {
    drafts,
    editingDraft,
    saveDraft,
    selectDraftForEdit,
    cancelEdit,
    deleteDraft,
    clearAllDrafts,
    resetDemoData,
  };
};
