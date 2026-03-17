import Link from 'next/link';
import { Github } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AuthButton } from '@/components/ui/AuthButton';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-[#0d1117]/80">
      <div className="mx-auto flex h-14 max-w-[900px] items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"
        >
          <Github className="h-5 w-5" />
          GitHub Wrapped
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
