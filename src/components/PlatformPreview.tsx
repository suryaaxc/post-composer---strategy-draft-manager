import React from 'react';
import { Platform } from '../types';
import { platforms } from '../strategies/validationStrategies';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share, 
  Bookmark, 
  ThumbsUp, 
  Send,
  MoreHorizontal,
  BadgeCheck
} from 'lucide-react';

interface PlatformPreviewProps {
  platform: Platform;
  content: string;
}

export const PlatformPreview: React.FC<PlatformPreviewProps> = ({
  platform,
  content,
}) => {
  const displayContent = content.trim() || 'Your post preview will appear here in real time...';
  const charLimit = platforms[platform];
  const isOverflow = content.length > charLimit;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Live Feed Preview
          </h3>
          <p className="text-xs text-neutral-400">
            Rendered as seen on {platform}
          </p>
        </div>
        <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
          {platform} Format
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center p-2">
        {/* Twitter Preview */}
        {platform === 'Twitter' && (
          <div className="w-full max-w-md bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm text-neutral-900 dark:text-neutral-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black flex items-center justify-center font-bold text-sm shrink-0">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-bold">John Developer</span>
                  <BadgeCheck className="w-4 h-4 text-sky-500 fill-sky-500 text-white" />
                  <span className="text-xs text-neutral-500">@johndev</span>
                  <span className="text-xs text-neutral-400">· 2m</span>
                </div>

                <div className={`mt-2 text-sm leading-relaxed whitespace-pre-wrap ${isOverflow ? 'text-red-600 dark:text-red-400' : ''}`}>
                  {displayContent}
                </div>

                {isOverflow && (
                  <div className="mt-2 text-xs text-red-500 font-medium">
                    ⚠️ Exceeds Twitter limit of 280 characters
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 text-neutral-500 text-xs max-w-xs">
                  <span className="flex items-center gap-1.5 hover:text-sky-500 cursor-pointer">
                    <MessageCircle className="w-4 h-4" /> 12
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-emerald-500 cursor-pointer">
                    <Repeat2 className="w-4 h-4" /> 4
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-pink-500 cursor-pointer">
                    <Heart className="w-4 h-4" /> 89
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-sky-500 cursor-pointer">
                    <Share className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LinkedIn Preview */}
        {platform === 'LinkedIn' && (
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm text-neutral-900 dark:text-neutral-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  JD
                </div>
                <div>
                  <h4 className="text-sm font-semibold leading-tight">John Developer</h4>
                  <p className="text-[11px] text-neutral-500">Senior Software Architect</p>
                  <p className="text-[10px] text-neutral-400">1h · Edited · 🌐</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-neutral-400" />
            </div>

            <div className={`mt-3 text-sm leading-relaxed whitespace-pre-wrap ${isOverflow ? 'text-red-600 dark:text-red-400' : ''}`}>
              {displayContent}
            </div>

            {isOverflow && (
              <div className="mt-2 text-xs text-red-500 font-medium">
                ⚠️ Exceeds LinkedIn limit of 3,000 characters
              </div>
            )}

            <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 mt-4 pt-3 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer">
                <ThumbsUp className="w-4 h-4" /> Like
              </span>
              <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer">
                <MessageCircle className="w-4 h-4" /> Comment
              </span>
              <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer">
                <Repeat2 className="w-4 h-4" /> Repost
              </span>
              <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer">
                <Send className="w-4 h-4" /> Send
              </span>
            </div>
          </div>
        )}

        {/* Instagram Preview */}
        {platform === 'Instagram' && (
          <div className="w-full max-w-sm bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm text-neutral-900 dark:text-neutral-100">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-neutral-100 dark:border-neutral-850">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center text-xs font-bold">
                    JD
                  </div>
                </div>
                <span className="text-xs font-semibold">johndev</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Media Simulation */}
            <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center p-6 text-center text-white">
              <span className="text-xs tracking-wider uppercase text-neutral-400">Instagram Media Placeholder</span>
              <p className="text-sm font-semibold mt-2 max-w-[200px] line-clamp-3">
                {content.slice(0, 80) || 'Visual Creative'}
              </p>
            </div>

            {/* Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200 mb-2">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer" />
                  <MessageCircle className="w-5 h-5 cursor-pointer" />
                  <Send className="w-5 h-5 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 cursor-pointer" />
              </div>

              {/* Caption */}
              <div className="text-xs">
                <span className="font-semibold mr-1.5">johndev</span>
                <span className={`whitespace-pre-wrap ${isOverflow ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                  {displayContent}
                </span>
              </div>

              {isOverflow && (
                <div className="mt-1 text-[11px] text-red-500 font-medium">
                  ⚠️ Exceeds Instagram limit of 2,200 characters
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
