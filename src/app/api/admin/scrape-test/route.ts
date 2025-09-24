import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  return NextResponse.json({
    success: false,
    error: "This endpoint is deprecated. Please use /api/admin/scrape-hybrid instead."
  });
}