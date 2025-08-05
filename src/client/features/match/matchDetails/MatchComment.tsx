'use client';

import { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import { decodeHtmlEntities } from '@/lib/sanitization';

type Props = {
  comment: string;
};

export const MatchComment = memo(function MatchComment({ comment }: Props) {
  return (
    <div
      className="relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 mt-8"
      style={{ backgroundColor: 'var(--color-comment-bg)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-lg" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <span className="font-bold text-xl" style={{ color: 'var(--color-foreground)' }}>
            Commentaire
          </span>
        </div>
        <div className="relative pt-4">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
          <div
            className="relative p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
            style={{ backgroundColor: 'var(--color-card)' }}
          >
            <p
              className="italic leading-relaxed break-words text-sm"
              style={{ color: 'var(--color-foreground)' }}
            >
              &quot;{decodeHtmlEntities(comment)}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
