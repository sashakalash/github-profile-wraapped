'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useGitHubSignIn() {
  const router = useRouter();

  const signIn = useCallback(() => {
    const callbackUrl = encodeURIComponent('/auth/callback');
    const url = `/api/auth/signin/github?callbackUrl=${callbackUrl}`;

    const popup = window.open(
      url,
      'github-signin',
      'popup,width=600,height=700,left=' +
        Math.round(window.screenX + (window.outerWidth - 600) / 2) +
        ',top=' +
        Math.round(window.screenY + (window.outerHeight - 700) / 2)
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === 'auth-complete') {
        window.removeEventListener('message', handleMessage);
        popup?.close();
        router.refresh();
      }
    };

    window.addEventListener('message', handleMessage);

    // Fallback: if popup is closed manually, still refresh
    const pollClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(pollClosed);
        window.removeEventListener('message', handleMessage);
        router.refresh();
      }
    }, 500);
  }, [router]);

  return signIn;
}
