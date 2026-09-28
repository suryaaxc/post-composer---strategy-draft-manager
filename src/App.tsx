import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDrafts } from './hooks/useDrafts';
import { PostComposer } from './components/PostComposer';
import { DraftList } from './components/DraftList';
import { PlatformPreview } from './components/PlatformPreview';
import { VsCodeSetupGuide } from './components/VsCodeSetupGuide';
import { Platform, Draft } from './types';
import { platforms } from './strategies/validationStrategies';
import { 
  PenTool, 
  Eye, 
  Code, 
  Layers, 
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const {
    drafts,
    editingDraft,
    saveDraft,
    selectDraftForEdit,
    cancelEdit,
    deleteDraft,
    resetDemoData,
  } = useDrafts();

  // Active view tab in main container: 'composer' | 'preview' | 'vscode'
  const [activeTab, setActiveTab] = useState<'composer' | 'preview' | 'vscode'>('composer');

  // Preview state (tracks what's currently in the composer or selected)
  const [currentPlatform, setCurrentPlatform] = useState<Platform>('Twitter');
  const [previewContent, setPreviewContent] = useState<string>('');

  const handleDraftSaved = (platform: Platform, content: string, existingId?: number) => {
    saveDraft(platform, content, existingId);
  };

  const handleEditDraft = (draft: Draft) => {
    selectDraftForEdit(draft);
    setCurrentPlatform(draft.platform);
    setPreviewContent(draft.content);
    // Switch to composer if on another tab
    setActiveTab('composer');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-900">
      {/* Top Bar Contract: 3 Zones (Brand, Nav tabs, Primary action) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single element brand wordmark */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
              PostComposer
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              · Experiment 1
            </span>
          </div>

          {/* Zone 2: Navigation segmented tabs */}
          <nav className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('composer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'composer'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Composer &amp; Drafts</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Social Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('vscode')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'vscode'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>VS Code Setup Guide</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tabular-nums text-neutral-500 hidden md:inline">
              {drafts.length} drafts saved
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner with experiment summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Experiment 1: Post Composer with Strategy Validation &amp; Drafts
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Decoupled Strategy Pattern (Twitter: 280 · LinkedIn: 3000 · Instagram: 2200), async retry mock API with toast alerts, and persistent localStorage draft CRUD.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('vscode')}
              className="text-xs px-3 py-1.5 font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-750 flex items-center gap-1.5 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>How to run in VS Code</span>
            </button>
          </div>
        </div>

        {/* View: Composer & Drafts */}
        {activeTab === 'composer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Post Composer (7 cols) */}
            <div className="lg:col-span-7">
              <PostComposer
                onDraftSaved={handleDraftSaved}
                editingDraft={editingDraft}
                onCancelEdit={cancelEdit}
              />
            </div>

            {/* Right Column: Draft List (5 cols) */}
            <div className="lg:col-span-5">
              <DraftList
                drafts={drafts}
                onEdit={handleEditDraft}
                onDelete={deleteDraft}
                onResetDemo={resetDemoData}
              />
            </div>
          </div>
        )}

        {/* View: Social Preview */}
        {activeTab === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <PostComposer
                onDraftSaved={handleDraftSaved}
                editingDraft={editingDraft}
                onCancelEdit={cancelEdit}
              />
            </div>
            <div className="lg:col-span-5">
              <PlatformPreview
                platform={editingDraft ? editingDraft.platform : currentPlatform}
                content={editingDraft ? editingDraft.content : (drafts[0]?.content || '')}
              />
            </div>
          </div>
        )}

        {/* View: VS Code Setup Guide */}
        {activeTab === 'vscode' && (
          <VsCodeSetupGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 px-4 text-center text-xs text-neutral-400">
        <p>Post Composer Experiment 1 · React 19 + TypeScript + Vite + Tailwind CSS</p>
      </footer>

      {/* Step 14: React Toastify Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
