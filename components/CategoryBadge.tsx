import { PerformanceCategory } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/utils';

export default function CategoryBadge({ category }: { category: PerformanceCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: cfg.color + '22',
        color: cfg.color,
        border: `1px solid ${cfg.color}44`,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.emoji} {category}
    </span>
  );
}
