'use client';

import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage('auth-complete', window.location.origin);
      window.close();
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Signing in…</p>
    </div>
  );
}
