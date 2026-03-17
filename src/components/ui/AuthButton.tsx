'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogIn, LogOut } from 'lucide-react';
import { SignInModal } from './SignInModal';

export function AuthButton() {
  const { data: session, status } = useSession();
  const [modalOpen, setModalOpen] = useState(false);

  if (status === 'loading') {
    return <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? 'avatar'}
            width={28}
            height={28}
            className="rounded-full ring-1 ring-gray-200 dark:ring-white/20"
          />
        )}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <LogIn className="h-3.5 w-3.5" />
        Sign in with GitHub
      </button>

      <SignInModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
