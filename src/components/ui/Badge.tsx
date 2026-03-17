import { LANGUAGE_COLORS, DEFAULT_LANGUAGE_COLOR } from '@/lib/constants';

interface BadgeProps {
  language: string;
}

export function LanguageBadge({ language }: BadgeProps) {
  const color = LANGUAGE_COLORS[language] ?? DEFAULT_LANGUAGE_COLOR;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-300">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {language}
    </span>
  );
}
