'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // Navigation complete — finish the bar
    setProgress(100);
    timerRef.current = setTimeout(() => setVisible(false), 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  // Expose start function via a global for the search form to call
  useEffect(() => {
    const start = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setVisible(true);
      setProgress(10);

      let current = 10;
      intervalRef.current = setInterval(() => {
        // Slow down as it approaches 90
        const increment = current < 30 ? 8 : current < 60 ? 4 : current < 80 ? 2 : 0.5;
        current = Math.min(current + increment, 90);
        setProgress(current);
      }, 200);
    };

    window.__nprogress_start = start;
    return () => {
      delete window.__nprogress_start;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 top-0 z-50 h-0.5 bg-green-400 transition-all duration-200 ease-out"
      style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
    />
  );
}
