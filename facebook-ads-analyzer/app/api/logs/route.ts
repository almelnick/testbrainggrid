import { NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET() {
  return NextResponse.json(Store.getLogs());
}
