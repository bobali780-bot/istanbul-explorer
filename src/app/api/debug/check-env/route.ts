import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 15) || 'NOT SET',
    openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  });
}
