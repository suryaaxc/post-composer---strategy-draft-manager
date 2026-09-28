import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Draft, Platform } from '../types';
import { platforms } from '../strategies/validationStrategies';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  Calendar, 
  Search, 
  Filter, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface DraftListProps {
  drafts: Draft[];
  onEdit: (draft: Draft) => void;
  onDelete: (id: number) => void;
  onResetDemo: () => void;
}

export const DraftList: React.FC<DraftListProps> = ({
  drafts,
  onEdit,
  onDelete,
  onResetDemo,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCopy = async (draft: Draft) => {
    try {
      await navigator.clipboard.writeText(draft.content);
      setCopiedId(draft.id);
      toast.success('Draft copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    toast.info('Draft deleted');
  };

  const handleEdit = (draft: Draft) => {
    onEdit(draft);
  };

  // Filter drafts based on platform filter and search query
  const filteredDrafts = drafts.filter((d) => {
    const matchesPlatform = filterPlatform === 'All' || d.platform === filterPlatform;
    const matchesSearch =
      searchQuery.trim() === '' ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6 shadow-sm">
      {/* Step 7 Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Saved Drafts
            </h3>
            <span className="text-xs font-mono tabular-nums text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
              {drafts.length}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Persisted in browser localStorage (Step 6 & 7)
          </p>
        </div>

        {/* Filter and reset actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {drafts.length === 0 && (
            <button
              onClick={onResetDemo}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Load Samples</span>
            </button>
          )}

          {/* Platform filter tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            {(['All', 'Twitter', 'LinkedIn', 'Instagram'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPlatform(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  filterPlatform === p
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar if multiple drafts */}
      {drafts.length > 2 && (
        <div className="relative mb-4">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved drafts..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
          />
        </div>
      )}

      {/* Drafts List or Empty State */}
      {filteredDrafts.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
          <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {drafts.length === 0 ? 'No drafts saved yet' : 'No matching drafts found'}
          </p>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            {drafts.length === 0
              ? 'Compose a post above and click Save Draft to store your content in localStorage with Strategy validation.'
              : 'Try clearing your search query or choosing another platform filter.'}
          </p>
          {drafts.length === 0 && (
            <button
              onClick={onResetDemo}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Drafts</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Step 7: Display Draft List */}
          {filteredDrafts.map((draft) => {
            const maxChars = platforms[draft.platform];
            const charCount = draft.content.length;
            const dateStr = new Date(draft.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={draft.id}
                className="group relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/40 dark:bg-neutral-850/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {/* Platform Badge */}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        draft.platform === 'Twitter'
                          ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900'
                          : draft.platform === 'LinkedIn'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                          : 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900'
                      }`}
                    >
                      {draft.platform}
                    </span>

                    <span className="text-[11px] text-neutral-400">·</span>

                    <span className="text-[11px] text-neutral-400 font-mono tabular-nums">
                      {charCount}/{maxChars} chars
                    </span>

                    <span className="text-[11px] text-neutral-400 hidden sm:inline">·</span>

                    <span className="text-[11px] text-neutral-400 hidden sm:inline flex items-center gap-1">
                      <Calendar className="w-3 h-3 inline" />
                      {dateStr}
                    </span>
                  </div>

                  {/* Actions: Edit (Step 8), Delete (Step 9), Copy */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(draft)}
                      title="Copy content"
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-750 rounded transition-colors"
                    >
                      {copiedId === draft.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Step 8: Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleEdit(draft)}
                      title="Edit draft in composer"
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-750 rounded transition-colors flex items-center gap-1 text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium hidden sm:inline">Edit</span>
                    </button>

                    {/* Step 9: Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(draft.id)}
                      title="Delete draft"
                      className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Draft Content */}
                <p className="text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans line-clamp-4">
                  {draft.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
