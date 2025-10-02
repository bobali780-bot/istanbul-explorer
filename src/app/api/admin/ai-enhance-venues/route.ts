import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function POST(request: Request) {
  try {
    const { category, limit = 5, forceReenhance = false } = await request.json();

    console.log(`🤖 Starting AI enhancement for ${category}...`);
    console.log(`🔄 Force re-enhance mode: ${forceReenhance}`);

    // Determine table and entity type
    const tableMap: Record<string, string> = {
      'activities': 'activities',
      'hotels': 'hotels',
      'shopping': 'shopping',
      'restaurants': 'restaurants'
    };

    const table = tableMap[category] || 'activities';

    // Build query based on re-enhance mode
    let query = supabase
      .from(table)
      .select('id, name, description, short_overview, full_description, location, why_visit')
      .limit(limit);

    // If NOT force re-enhancing, only get venues with empty why_visit
    if (!forceReenhance) {
      query = query.or('why_visit.is.null,why_visit.eq.[]');
    }

    const { data: venues, error } = await query;

    if (error) throw error;

    const results = {
      enhanced: [] as string[],
      failed: [] as string[],
      skipped: [] as string[]
    };

    for (const venue of venues || []) {
      try {
        console.log(`🔄 Enhancing: ${venue.name}`);

        // Create AI prompt
        const prompt = `You are a travel content expert specializing in Istanbul tourism. Analyze this venue and provide structured enhancement data.

Venue Name: ${venue.name}
Category: ${category}
Description: ${venue.full_description || venue.description || venue.short_overview || 'No description available'}
Location: ${venue.location}

Please provide the following in valid JSON format:

{
  "why_visit": ["reason 1", "reason 2", "reason 3", "reason 4", "reason 5"],
  "accessibility": {
    "wheelchair": true/false,
    "stroller": true/false,
    "kid_friendly": true/false,
    "senior_friendly": true/false,
    "notes": "Any specific accessibility notes"
  },
  "facilities": {
    "toilets": true/false,
    "cafe": true/false,
    "gift_shop": true/false,
    "parking": true/false,
    "wifi": true/false,
    "tours": true/false,
    "audio_guides": true/false
  },
  "practical_info": {
    "dress_code": "Casual / Smart casual / Formal / etc",
    "photography": "Allowed / Restricted / Not allowed",
    "entry_requirements": "Any specific requirements",
    "safety": "Safety tips if relevant",
    "etiquette": "Cultural etiquette tips if relevant"
  }
}

Rules:
- Be realistic and accurate based on typical Istanbul venues of this type
- Only include practical_info fields if they're relevant (omit if not applicable)
- For mosques: mention modest dress code, photography restrictions
- For restaurants: mention typical dress code, photography usually allowed
- For shopping: casual dress, photography allowed
- For hotels: smart casual, photography in public areas
- Base accessibility on typical Istanbul venue standards
- Return ONLY valid JSON, no additional text`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: prompt
          }],
          response_format: { type: 'json_object' }
        });

        const responseText = completion.choices[0].message.content || '';

        // Parse AI response
        const enhancementData = JSON.parse(responseText);

        // Update venue with enhanced data
        const { error: updateError } = await supabase
          .from(table)
          .update({
            why_visit: enhancementData.why_visit,
            accessibility: enhancementData.accessibility,
            facilities: enhancementData.facilities,
            practical_info: enhancementData.practical_info,
            updated_at: new Date().toISOString()
          })
          .eq('id', venue.id);

        if (updateError) {
          console.error(`❌ Failed to update ${venue.name}:`, updateError);
          results.failed.push(`${venue.name}: ${updateError.message}`);
        } else {
          console.log(`✅ Enhanced: ${venue.name}`);
          results.enhanced.push(venue.name);
        }

        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (venueError) {
        console.error(`❌ Error enhancing ${venue.name}:`, venueError);
        results.failed.push(`${venue.name}: ${venueError instanceof Error ? venueError.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      category,
      total: venues?.length || 0,
      results
    });

  } catch (error) {
    console.error('AI enhancement error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
