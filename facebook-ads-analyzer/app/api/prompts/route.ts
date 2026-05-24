import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET() {
  return NextResponse.json(Store.getPrompt());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = Store.getPrompt()!;
  const updated = { ...current, ...body, updatedAt: new Date().toISOString() };
  Store.setPrompt(updated);
  return NextResponse.json(updated);
}
