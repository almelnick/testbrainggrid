'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/clients', label: 'Clients', icon: '👥' },
  { href: '/results', label: 'Results', icon: '🎯' },
  { href: '/logs', label: 'Execution Logs', icon: '📋' },
  { href: '/rules', label: 'Rules Editor', icon: '⚙️' },
  { href: '/prompts', label: 'Prompt Config', icon: '🤖' },
  { href: '/settings', label: 'Settings', icon: '🔧' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col"
      style={{
        width: '240px',
        backgroundColor: '#161b27',
        borderRight: '1px solid #1e293b',
        zIndex: 50,
      }}
    >
      <div className="px-6 py-5" style={{ borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '22px' }}>⚡</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.02em' }}>
              FB Ads Analyzer
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>AI Media Buyer</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600, padding: '0 12px 8px', letterSpacing: '0.08em' }}>
          MENU
        </div>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '2px',
                fontSize: '13.5px',
                fontWeight: active ? 600 : 400,
                color: active ? '#f1f5f9' : '#94a3b8',
                backgroundColor: active ? '#1e293b' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '15px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              {active && (
                <span style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4" style={{ borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: '11px', color: '#475569' }}>Powered by Claude AI</div>
        <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>v1.0.0 · n8n → Next.js</div>
      </div>
    </aside>
  );
}
