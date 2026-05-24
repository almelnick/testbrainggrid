import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';
import { Client } from '@/lib/types';
import { generateId } from '@/lib/utils';

export async function GET() {
  return NextResponse.json(Store.getClients());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client: Client = {
    id: generateId(), name: body.name, adAccountId: body.adAccountId,
    facebookToken: body.facebookToken || '',
    tokenExpiry: body.tokenExpiry || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    googleSheetId: body.googleSheetId || '', geminiApiKey: body.geminiApiKey || '',
    status: 'active', createdAt: new Date().toISOString(),
  };
  Store.setClient(client);
  return NextResponse.json(client, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const existing = Store.getClient(body.id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated = { ...existing, ...body };
  Store.setClient(updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  Store.deleteClient(id);
  return NextResponse.json({ ok: true });
}
