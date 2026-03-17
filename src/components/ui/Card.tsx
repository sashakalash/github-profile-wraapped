import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
}

export function Card({ className, children, title }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-[#f6f8fa] p-5 shadow-sm dark:border-white/10 dark:bg-[#161b22]',
        className
      )}
    >
      {title && (
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
