import { PerformanceCategory } from './types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export const CATEGORY_CONFIG: Record<
  PerformanceCategory,
  { color: string; bg: string; text: string; emoji: string; border: string }
> = {
  'HELL YES': { color: '#22c55e', bg: 'bg-green-900/30', text: 'text-green-400', emoji: '🔥', border: 'border-green-700' },
  YES: { color: '#84cc16', bg: 'bg-lime-900/30', text: 'text-lime-400', emoji: '✅', border: 'border-lime-700' },
  MAYBE: { color: '#f59e0b', bg: 'bg-amber-900/30', text: 'text-amber-400', emoji: '🤔', border: 'border-amber-700' },
  'NOT REALLY': { color: '#f97316', bg: 'bg-orange-900/30', text: 'text-orange-400', emoji: '👎', border: 'border-orange-700' },
  'WE WASTED MONEY': { color: '#ef4444', bg: 'bg-red-900/30', text: 'text-red-400', emoji: '💸', border: 'border-red-700' },
  'INSUFFICIENT DATA/SPEND': { color: '#6b7280', bg: 'bg-gray-800/50', text: 'text-gray-400', emoji: '📊', border: 'border-gray-600' },
};

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
