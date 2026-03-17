import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function formatHour(hour: number): string {
  if (hour === 0) return '12am';
  if (hour < 12) return `${hour}am`;
  if (hour === 12) return '12pm';
  return `${hour - 12}pm`;
}

export function getYearsOnGitHub(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return now.getFullYear() - created.getFullYear();
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9-]+$/.test(username) && username.length <= 39;
}

export function getOneYearAgoDate(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d;
}
