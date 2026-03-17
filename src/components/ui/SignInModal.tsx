'use client';

import { useEffect, useRef } from 'react';
import { Github, X } from 'lucide-react';
import { useGitHubSignIn } from '@/hooks/useGitHubSignIn';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  description?: string;
}

export function SignInModal({ isOpen, onClose, description }: SignInModalProps) {
  const signIn = useGitHubSignIn();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
            <Github className="h-6 w-6 text-white dark:text-gray-900" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sign in with GitHub
          </h2>
          {description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>

        <button
          onClick={() => {
            onClose();
            signIn();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <Github className="h-4 w-4" />
          Continue with GitHub
        </button>

        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          Read-only access · No write permissions
        </p>
      </div>
    </div>
  );
}
