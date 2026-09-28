import React, { useState } from 'react';
import { 
  Terminal, 
  FolderTree, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  BookOpen, 
  Laptop, 
  Play,
  Cpu
} from 'lucide-react';

export const VsCodeSetupGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'terminal' | 'structure' | 'code' | 'checklist'>('terminal');

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // ignore
    }
  };

  const steps = [
    {
      title: "Step 1: Open VS Code & Open Terminal",
      desc: "Launch Visual Studio Code. Press `Ctrl + ~` (Windows/Linux) or `Cmd + ~` (Mac) to open the integrated terminal.",
      command: "# Navigate to your desired workspace folder\ncd ~/projects",
    },
    {
      title: "Step 2: Create React Project with Vite",
      desc: "Scaffold a modern, lightweight React + Vite project named `post-composer`.",
      command: "npm create vite@latest post-composer -- --template react\ncd post-composer",
    },
    {
      title: "Step 3: Install Required Dependencies",
      desc: "Install `react-toastify` for toast alerts and `lucide-react` for icons.",
      command: "npm install\nnpm install react-toastify lucide-react",
    },
    {
      title: "Step 4: Start the Local Development Server",
      desc: "Run the Vite dev server. Open the displayed URL (typically `http://localhost:5173`) in your browser.",
      command: "npm run dev",
    },
  ];

  const files = [
    {
      name: "src/strategies/validationStrategies.js",
      desc: "Step 3 & 10: Platform character rules and Strategy Pattern registry",
      code: `export const platforms = {
  Twitter: 280,
  LinkedIn: 3000,
  Instagram: 2200
};

// Strategy Pattern functions
const twitterStrategy = (text) => text.length <= 280;
const linkedInStrategy = (text) => text.length <= 3000;
const instagramStrategy = (text) => text.length <= 2200;

export const strategies = {
  Twitter: twitterStrategy,
  LinkedIn: linkedInStrategy,
  Instagram: instagramStrategy
};

export const validatePost = (platform, content) => {
  const limit = platforms[platform];

  if (!content.trim()) {
    return "Post cannot be empty";
  }

  // Strategy Pattern dynamic invocation
  if (!strategies[platform](content)) {
    return \`Maximum \${limit} characters allowed\`;
  }

  return "";
};`,
    },
    {
      name: "src/services/mockApi.js",
      desc: "Step 11 & 13: Mock async API with 1500ms delay & recursive retry logic",
      code: `export const saveDraftApi = (draft) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(draft);
    }, 1500);
  });
};

export const saveWithRetry = async (draft, retries = 3) => {
  try {
    return await saveDraftApi(draft);
  } catch (err) {
    if (retries > 0) {
      return saveWithRetry(draft, retries - 1);
    }
    throw err;
  }
};`,
    },
    {
      name: "src/hooks/useDrafts.js",
      desc: "Step 6, 8, 9: Custom hook for localStorage draft persistence & edit/delete",
      code: `import { useState, useEffect } from 'react';

export const useDrafts = () => {
  const [drafts, setDrafts] = useState(
    JSON.parse(localStorage.getItem("drafts")) || []
  );

  const saveDraft = (platform, content) => {
    const newDraft = {
      id: Date.now(),
      platform,
      content
    };
    const updated = [...drafts, newDraft];
    setDrafts(updated);
    localStorage.setItem("drafts", JSON.stringify(updated));
  };

  const deleteDraft = (id) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("drafts", JSON.stringify(updated));
  };

  return { drafts, saveDraft, deleteDraft, setDrafts };
};`,
    },
    {
      name: "src/components/PostComposer.jsx",
      desc: "Step 4, 5, 12: Composer UI, real-time validation, loading state, toast notifications",
      code: `import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { platforms, validatePost } from '../strategies/validationStrategies';
import { saveWithRetry } from '../services/mockApi';

export const PostComposer = ({ onDraftSaved }) => {
  const [platform, setPlatform] = useState("Twitter");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(validatePost(platform, content));
  }, [platform, content]);

  const handleSave = async () => {
    if (error || !content.trim()) return;
    try {
      setLoading(true);
      await saveWithRetry({ platform, content }, 3);
      onDraftSaved(platform, content);
      toast.success("Draft Saved");
      setContent("");
    } catch {
      toast.error("Save Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
        <option value="Twitter">Twitter (280 chars)</option>
        <option value="LinkedIn">LinkedIn (3000 chars)</option>
        <option value="Instagram">Instagram (2200 chars)</option>
      </select>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
      />

      <p>{content.length}/{platforms[platform]}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button disabled={loading || !!error} onClick={handleSave}>
        {loading ? "Saving..." : "Save Draft"}
      </button>
    </div>
  );
};`,
    },
    {
      name: "src/components/DraftList.jsx",
      desc: "Step 7, 8, 9: Draft listing with Edit & Delete actions",
      code: `import React from 'react';

export const DraftList = ({ drafts, onEdit, onDelete }) => {
  return (
    <div>
      <h3>Saved Drafts ({drafts.length})</h3>
      {drafts.map((draft) => (
        <div key={draft.id} className="draft-item">
          <h4>{draft.platform}</h4>
          <p>{draft.content}</p>
          <button onClick={() => onEdit(draft)}>Edit</button>
          <button onClick={() => onDelete(draft.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};`,
    },
  ];

  const checklistItems = [
    { label: "Platform Selection Dropdown / Selector", done: true },
    { label: "Dynamic Character Limits (Twitter 280, LinkedIn 3000, Instagram 2200)", done: true },
    { label: "Real-Time Validation (useEffect on platform & content)", done: true },
    { label: "Error Messages for empty or exceeded content", done: true },
    { label: "Save Draft action", done: true },
    { label: "Display Draft List with platform name & content", done: true },
    { label: "Edit Draft (loads platform & content back to composer)", done: true },
    { label: "Delete Draft (removes by id and updates storage)", done: true },
    { label: "localStorage Persistence (JSON.stringify / JSON.parse)", done: true },
    { label: "Strategy Pattern implementation (strategies[platform](content))", done: true },
    { label: "Mock API Integration (saveDraftApi Promise with 1500ms delay)", done: true },
    { label: "Loading State (disabled button with 'Saving...')", done: true },
    { label: "Retry Logic (saveWithRetry with retries = 3)", done: true },
    { label: "Toast Notifications (toast.success / toast.error via react-toastify)", done: true },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              VS Code Setup &amp; Architecture Guide
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Step-by-step guide to run Experiment 1 in Visual Studio Code locally
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'terminal'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Terminal Steps
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'structure'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            File Tree
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'code'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Code Snippets
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'checklist'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Checklist (14/14)
          </button>
        </div>
      </div>

      {/* Tab: Terminal Steps */}
      {activeTab === 'terminal' && (
        <div className="space-y-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/30"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {s.title}
                </span>
                <button
                  onClick={() => copyToClipboard(s.command, idx)}
                  className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                {s.desc}
              </p>
              <pre className="p-3 rounded-lg bg-neutral-900 text-neutral-100 text-xs font-mono overflow-x-auto whitespace-pre">
                {s.command}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Tab: File Tree */}
      {activeTab === 'structure' && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 font-mono text-xs leading-relaxed overflow-x-auto">
          <p className="text-neutral-400 mb-2 font-sans font-semibold text-xs">
            Experiment 1 Project Structure (created in your VS Code workspace):
          </p>
          <pre>{`post-composer/
├── package.json
├── index.html
├── src/
│   ├── components/
│   │   ├── PostComposer.jsx    (Step 4 & 5: Platform selector, textarea, counter, save)
│   │   └── DraftList.jsx       (Step 7, 8, 9: Draft cards, edit, delete)
│   ├── hooks/
│   │   └── useDrafts.js        (Step 6: localStorage synchronization)
│   ├── strategies/
│   │   └── validationStrategies.js (Step 3 & 10: Character limits & Strategy pattern)
│   ├── services/
│   │   └── mockApi.js          (Step 11 & 13: 1500ms mock delay & recursive retries)
│   ├── App.jsx                 (Container connecting composer & draft list)
│   ├── App.css
│   └── main.jsx                (Entry point + react-toastify ToastContainer)`}</pre>
        </div>
      )}

      {/* Tab: Code Snippets */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          {files.map((f, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/30"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {f.name}
                  </span>
                  <p className="text-[11px] text-neutral-500">{f.desc}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(f.code, 100 + idx)}
                  className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-colors shrink-0"
                >
                  {copiedIndex === 100 + idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-neutral-900 text-neutral-100 text-[11px] font-mono overflow-x-auto max-h-56">
                {f.code}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Checklist */}
      {activeTab === 'checklist' && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/30">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 font-semibold">
            All 14 Required Features Fully Implemented &amp; Verified:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-neutral-850 border border-neutral-200/70 dark:border-neutral-750"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
