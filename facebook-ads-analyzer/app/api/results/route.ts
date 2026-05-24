import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const executionId = searchParams.get('executionId') ?? undefined;
  const clientId = searchParams.get('clientId') ?? undefined;
  return NextResponse.json(Store.getResults({ executionId, clientId }));
}
