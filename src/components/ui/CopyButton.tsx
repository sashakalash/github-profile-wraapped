'use client';

import { useState } from 'react';
import { Check, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  username: string;
  className?: string;
}

export function CopyButton({ username, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/u/${username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const fallbackUrl = `${window.location.origin}/u/${username}`;
      const input = document.createElement('input');
      input.value = fallbackUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5',
        'text-sm text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900',
        'dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:text-white',
        className
      )}
      aria-label="Copy profile link"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Link className="h-3.5 w-3.5" />
          <span>Copy link</span>
        </>
      )}
    </button>
  );
}
