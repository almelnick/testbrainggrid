import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET() {
  const s = Store.getSettings();
  return NextResponse.json({
    ...s,
    anthropicApiKey: s.anthropicApiKey ? '••••••••' + s.anthropicApiKey.slice(-4) : '',
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  Store.setSettings(body);
  return NextResponse.json({ ok: true });
}
