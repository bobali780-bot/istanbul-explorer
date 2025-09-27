import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const dryRun = searchParams.get('dryRun') === 'true';
    const sources = searchParams.get('sources')?.split(',') || ['firecrawl', 'openai'];

    if (!itemId) {
      return NextResponse.json({
        success: false,
        error: 'itemId parameter is required'
      }, { status: 400 });
    }

    const supabase = getSupabase();

    // Load the staging item
    const { data: item, error } = await supabase
      .from('staging_queue')
      .select('*')
      .eq('id', parseInt(itemId))
      .single();

    if (error || !item) {
      return NextResponse.json({
        success: false,
        error: `Item ${itemId} not found: ${error?.message}`
      }, { status: 404 });
    }

    const rawContent = item.raw_content || {};
    const inputs = {
      title: rawContent.title || item.title,
      address: rawContent.address || '',
      website_url: rawContent.website_url || '',
      place_id: rawContent.place_id || '',
      category: item.category || 'activities'
    };

    const result: any = {
      itemId: itemId,
      inputs: inputs,
      firecrawl: { called: false, status: null, error: null, bodySnippet: null },
      openai: { called: false, status: null, error: null, model: null, textSnippet: null }
    };

    // Test Firecrawl if requested
    if (sources.includes('firecrawl')) {
      result.firecrawl.called = true;
      
      if (!process.env.FIRECRAWL_API_KEY) {
        result.firecrawl.error = 'FIRECRAWL_API_KEY not configured';
      } else if (!inputs.website_url) {
        result.firecrawl.error = 'No website_url available for scraping';
      } else {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);

          const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: inputs.website_url,
              formats: ['markdown'],
              onlyMainContent: true,
              maxDepth: 1
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          
          result.firecrawl.status = response.status;
          const responseText = await response.text();
          result.firecrawl.bodySnippet = responseText.substring(0, 2000);
          
          if (!response.ok) {
            result.firecrawl.error = `HTTP ${response.status}: ${responseText.substring(0, 200)}`;
          }
        } catch (error: any) {
          result.firecrawl.error = error.message;
          if (error.name === 'AbortError') {
            result.firecrawl.error = 'Request timeout (8s)';
          }
        }
      }
    }

    // Test OpenAI if requested
    if (sources.includes('openai')) {
      result.openai.called = true;
      
      if (!process.env.OPENAI_API_KEY) {
        result.openai.error = 'OPENAI_API_KEY not configured';
      } else {
        try {
          const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          });

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);

          const prompt = `Create a premium travel description for "${inputs.title}" in Istanbul (${inputs.category}). Write 2-3 paragraphs about what makes this place special for visitors.`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert luxury travel writer specializing in Istanbul."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 200,
            temperature: 0.7,
          }, {
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          const text = completion.choices[0]?.message?.content || '';
          result.openai.status = 200;
          result.openai.model = completion.model;
          result.openai.textSnippet = text.substring(0, 700);

        } catch (error: any) {
          result.openai.error = error.message;
          if (error.name === 'AbortError') {
            result.openai.error = 'Request timeout (8s)';
          }
          if (error.status) {
            result.openai.status = error.status;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      dryRun: dryRun,
      timestamp: new Date().toISOString(),
      ...result
    });

  } catch (error) {
    console.error('❌ Enrich diagnostic error:', error);
    return NextResponse.json({
      success: false,
      error: 'Diagnostic failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
