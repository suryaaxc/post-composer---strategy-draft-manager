import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Platform, Draft } from '../types';
import { platforms, validatePost, strategies, getRemainingCharacters, getCharacterProgressPercent } from '../strategies/validationStrategies';
import { saveWithRetry } from '../services/mockApi';
import { 
  Send, 
  RotateCw, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Layers, 
  HelpCircle,
  Bug,
  Trash2
} from 'lucide-react';

interface PostComposerProps {
  onDraftSaved: (platform: Platform, content: string, editingId?: number) => void;
  editingDraft: Draft | null;
  onCancelEdit: () => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  onDraftSaved,
  editingDraft,
  onCancelEdit,
}) => {
  // Step 4: States
  const [platform, setPlatform] = useState<Platform>('Twitter');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Step 12: Loading State
  const [loading, setLoading] = useState<boolean>(false);
  const [retryStatus, setRetryStatus] = useState<string>('');
  
  // Interactive testing controls for Step 13 (Simulate network retry/fail)
  const [simulateNetworkFailure, setSimulateNetworkFailure] = useState<boolean>(false);

  // Sync state when an existing draft is clicked for editing (Step 8)
  useEffect(() => {
    if (editingDraft) {
      setPlatform(editingDraft.platform);
      setContent(editingDraft.content);
      toast.info(`Editing ${editingDraft.platform} draft`);
    }
  }, [editingDraft]);

  // Step 5: Real-Time Validation
  useEffect(() => {
    // Uses validatePost which internally delegates to strategies[platform]
    setError(validatePost(platform, content));
  }, [platform, content]);

  const limit = platforms[platform];
  const remaining = getRemainingCharacters(platform, content);
  const progressPercent = getCharacterProgressPercent(platform, content);
  const isOverLimit = content.length > limit;
  const isApproachingLimit = remaining <= 20 && !isOverLimit;

  // Step 6 & 11, 12, 13, 14: Save Draft with API, Retry, and Toast
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Prevent saving if validation fails
    const validationError = validatePost(platform, content);
    if (validationError) {
      setError(validationError);
      toast.warn(validationError);
      return;
    }

    try {
      setLoading(true);
      setRetryStatus('');

      const draftPayload = {
        platform,
        content,
        id: editingDraft ? editingDraft.id : undefined,
      };

      // Step 13: Retry Logic with observable callback
      await saveWithRetry(
        draftPayload,
        3,
        simulateNetworkFailure,
        (remainingRetries) => {
          setRetryStatus(`Network glitch. Retrying (${remainingRetries} attempts left)...`);
        }
      );

      // Persist in localStorage via parent hook
      onDraftSaved(platform, content, editingDraft?.id);

      // Step 14: Toast Notification
      toast.success(editingDraft ? 'Draft updated successfully!' : 'Draft Saved');

      // Clear composer if not in edit mode, or reset after update
      setContent('');
      setRetryStatus('');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Save Failed';
      // Step 14: Error toast
      toast.error(`Save Failed: ${message}`);
      setRetryStatus('Request failed after 3 retries');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    if (editingDraft) {
      onCancelEdit();
    }
  };

  const handleInsertSample = (type: 'short' | 'boundary' | 'overflow') => {
    if (type === 'short') {
      setContent(
        platform === 'Twitter'
          ? 'Excited to announce our new developer tool! Real-time strategy validation is live. 🚀 #buildinpublic'
          : `Delighted to share our latest project milestone. Today we are launching our multi-platform composer featuring clean software design patterns and reliable local caching.`
      );
    } else if (type === 'boundary') {
      const targetLength = platforms[platform];
      const base = `[Exactly ${targetLength} chars] `;
      setContent((base + 'A'.repeat(targetLength)).slice(0, targetLength));
    } else if (type === 'overflow') {
      const overflowCount = platforms[platform] + 15;
      setContent('⚠️ Overflow test content: ' + 'X'.repeat(overflowCount));
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6 shadow-sm">
      {/* Header bar with editing badge & simulated retry toggler */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Compose Post</span>
            {editingDraft && (
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                Editing Draft #{editingDraft.id.toString().slice(-4)}
              </span>
            )}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real-time validation via Strategy Pattern with dynamic platform limits
          </p>
        </div>

        {/* Retry simulation switch for Experiment 1 verification */}
        <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300 cursor-pointer select-none bg-neutral-50 dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
          <Bug className="w-3.5 h-3.5 text-neutral-500" />
          <span>Simulate Network Failure (Step 13)</span>
          <input
            type="checkbox"
            checked={simulateNetworkFailure}
            onChange={(e) => setSimulateNetworkFailure(e.target.checked)}
            className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:bg-neutral-900 cursor-pointer"
          />
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Step 4: Form Elements - Platform Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="platform-select" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Select Target Platform
            </label>
            <span className="text-xs text-neutral-400">
              Strategy rule: <code className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300">{`strategies[${platform}](content)`}</code>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['Twitter', 'LinkedIn', 'Instagram'] as Platform[]).map((p) => {
              const isSelected = platform === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold">{p}</span>
                    <span
                      className={`text-[11px] font-mono tabular-nums ${
                        isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'
                      }`}
                    >
                      {platforms[p]} chars
                    </span>
                  </div>
                  <span
                    className={`text-[10px] mt-1 line-clamp-1 ${
                      isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    {p === 'Twitter' ? 'Microblogging · strict 280' : p === 'LinkedIn' ? 'Professional · 3,000' : 'Visual caption · 2,200'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Form Elements - Textarea */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="post-content" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Post Content
            </label>
            
            {/* Quick sample fillers to test limits */}
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span>Quick tests:</span>
              <button
                type="button"
                onClick={() => handleInsertSample('short')}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 underline decoration-dotted"
              >
                Normal
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleInsertSample('boundary')}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 underline decoration-dotted"
              >
                Exact Limit
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleInsertSample('overflow')}
                className="hover:text-red-600 dark:hover:text-red-400 underline decoration-dotted text-red-500"
              >
                Overflow
              </button>
            </div>
          </div>

          <textarea
            id="post-content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Draft your ${platform} post here... (Max ${platforms[platform]} characters)`}
            className={`w-full p-3.5 text-sm rounded-lg border transition-all resize-y outline-none font-sans text-neutral-900 dark:text-neutral-100 bg-neutral-50/50 dark:bg-neutral-850/50 focus:bg-white dark:focus:bg-neutral-900 ${
              isOverLimit
                ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                : 'border-neutral-200 dark:border-neutral-750 focus:border-neutral-900 dark:focus:border-neutral-200'
            }`}
          />

          {/* Visual progress bar at bottom edge of textarea */}
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1 rounded-b-lg overflow-hidden -mt-1.5 mb-2">
            <div
              className={`h-full transition-all duration-150 ${
                isOverLimit
                  ? 'bg-red-500'
                  : isApproachingLimit
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step 5: Real-Time Validation & Character Counter Display */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          {/* Error Message */}
          <div className="min-h-[22px] flex items-center">
            {error ? (
              <p className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </p>
            ) : content.trim() ? (
              <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Valid for {platform}</span>
              </p>
            ) : (
              <p className="text-neutral-400">Type content to validate in real time</p>
            )}
          </div>

          {/* Character Counter Display as required: {content.length}/{platforms[platform]} */}
          <div className="flex items-center gap-2">
            <p
              className={`font-mono text-xs tabular-nums px-2 py-1 rounded ${
                isOverLimit
                  ? 'bg-red-50 text-red-600 font-bold dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900'
                  : isApproachingLimit
                  ? 'bg-amber-50 text-amber-600 font-medium dark:bg-amber-950/40 dark:text-amber-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {content.length}/{platforms[platform]}
            </p>
            <span className="text-[11px] text-neutral-400 tabular-nums">
              ({remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over`})
            </span>
          </div>
        </div>

        {/* Retry status indicator */}
        {retryStatus && (
          <div className="p-2.5 rounded-lg text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 animate-spin shrink-0" />
              {retryStatus}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-mono">Step 13</span>
          </div>
        )}

        {/* Step 4 & 12: Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {content && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="px-3 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            {editingDraft && (
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={loading}
                className="px-3 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Edit</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Step 4 & 12: Save Draft Button with Loading State */}
            <button
              type="submit"
              disabled={loading || !!error || !content.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 text-white bg-neutral-900 hover:bg-neutral-800 active:scale-98 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none shadow-sm"
            >
              {loading ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{editingDraft ? 'Update Draft' : 'Save Draft'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
