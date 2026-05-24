import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';
import { PerformanceRule } from '@/lib/types';

export async function GET() {
  return NextResponse.json(Store.getRules());
}

export async function PUT(req: NextRequest) {
  const rule: PerformanceRule = await req.json();
  Store.setRule(rule);
  return NextResponse.json(rule);
}
