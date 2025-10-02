import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const tables = ['activities', 'shopping', 'hotels', 'restaurants'];
    const allSlugs: any = {};

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('name, slug')
        .limit(100);

      if (!error && data) {
        allSlugs[table] = data;
      }
    }

    return NextResponse.json(allSlugs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slugs' }, { status: 500 });
  }
}
