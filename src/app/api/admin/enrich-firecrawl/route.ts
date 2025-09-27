import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Firecrawl enrichment function (copied from scrape-hybrid)
async function enrichWithFirecrawl(structuredData: any): Promise<any> {
  if (!process.env.FIRECRAWL_API_KEY || !structuredData.website_url) {
    return { success: false, creditsUsed: 0 };
  }

  try {
    const url = structuredData.website_url;
    console.log(`  Enriching with Firecrawl: ${url}`);

    // Check if the URL domain is in our allowlist
    const allowedDomains = [
      'goturkey.com',
      'turkey.travel',
      'istanbul.gov.tr',
      'ibb.istanbul',
      'muslera.istanbul.gov.tr',
      'wikipedia.org',
      'en.wikipedia.org',
      'tr.wikipedia.org',
      'unesco.org',
      'whc.unesco.org',
      'fourseasons.com',
      'kempinskihotels.com',
      'swissotel.com',
      'fairmont.com',
      'marriott.com',
      'hilton.com',
      'sultanahmetcamii.org',
      'ayasofyacamii.gov.tr',
      'topkapisarayi.gov.tr',
      'muze.gov.tr',
      'galatatower.com',
      'dolmabahcepalace.com',
      'istanbulmodern.org',
      'millisaraylar.gov.tr',
      'tripadvisor.com',
      'booking.com',
      'hotels.com',
      'expedia.com',
      'agoda.com',
      'nusr-et.com',
      'karakoylokantasi.com',
      'istinyepark.com',
      'zorlu.com.tr',
      'galataport.com'
    ];

    const domain = new URL(url).hostname.toLowerCase();
    if (!allowedDomains.includes(domain)) {
      console.log(`  Skipping enrichment - domain not in allowlist: ${domain}`);
      return { success: false, creditsUsed: 0, skipReason: 'Domain not in allowlist' };
    }

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown'],
        includeTags: ['h1', 'h2', 'h3', 'p', 'ul', 'li', 'div'],
        excludeTags: ['script', 'style', 'nav', 'footer', 'header'],
        onlyMainContent: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Firecrawl API error: ${response.status} ${errorText}`);
      return { success: false, creditsUsed: 0, error: `API error: ${response.status}` };
    }

    const result = await response.json();
    console.log(`  Firecrawl enrichment successful for ${url}`);

    return {
      success: true,
      creditsUsed: 1,
      content: result.data?.content || '',
      metadata: result.data?.metadata || {}
    };

  } catch (error) {
    console.error('Firecrawl enrichment error:', error);
    return { success: false, creditsUsed: 0, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({
        success: false,
        error: 'Item ID is required'
      }, { status: 400 });
    }

    // Get the staging item
    const { data: item, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .eq('id', itemId)
      .single();

    if (fetchError || !item) {
      return NextResponse.json({
        success: false,
        error: 'Item not found'
      }, { status: 404 });
    }

    const rawContent = item.raw_content;
    
    if (!rawContent.website_url) {
      return NextResponse.json({
        success: false,
        error: 'No website URL found for this item'
      }, { status: 400 });
    }

    // Trigger Firecrawl enrichment
    const enrichmentResult = await enrichWithFirecrawl(rawContent);

    if (!enrichmentResult.success) {
      return NextResponse.json({
        success: false,
        error: enrichmentResult.error || 'Enrichment failed',
        skipReason: enrichmentResult.skipReason
      }, { status: 400 });
    }

    // Parse the enriched content and update the raw_content
    const enrichedContent = enrichmentResult.content;
    const updatedRawContent = {
      ...rawContent,
      firecrawl_enriched: true,
      content: enrichedContent,
      // Extract structured information from the content
      description: enrichedContent ? extractDescription(enrichedContent) : rawContent.description,
      why_visit: extractWhyVisit(enrichedContent),
      facilities: extractFacilities(enrichedContent),
      accessibility: extractAccessibility(enrichedContent),
      practical_info: extractPracticalInfo(enrichedContent),
      insider_tips: extractInsiderTips(enrichedContent),
      highlights: extractHighlights(enrichedContent),
      opening_hours: extractOpeningHours(enrichedContent),
      additional_info: {
        ...rawContent.additional_info,
        firecrawl_metadata: enrichmentResult.metadata
      }
    };

    // Update the staging item with enriched content
    const { error: updateError } = await supabase
      .from('staging_queue')
      .update({
        raw_content: updatedRawContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId);

    if (updateError) {
      console.error('Error updating item:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update item with enriched content'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Item enriched successfully',
      creditsUsed: enrichmentResult.creditsUsed,
      enrichedFields: Object.keys(updatedRawContent).filter(key => 
        key !== 'firecrawl_enriched' && updatedRawContent[key] !== rawContent[key]
      )
    });

  } catch (error) {
    console.error('Enrichment API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Helper functions to extract structured data from Firecrawl content
function extractDescription(content: string): string {
  // Extract first meaningful paragraph
  const paragraphs = content.split('\n').filter(p => p.trim().length > 50);
  return paragraphs[0] || content.substring(0, 500);
}

function extractWhyVisit(content: string): string[] {
  const reasons: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('why visit') || line.toLowerCase().includes('must see')) {
      // Look for bullet points or numbered lists after this
      const nextLines = lines.slice(lines.indexOf(line) + 1, lines.indexOf(line) + 6);
      for (const nextLine of nextLines) {
        if (nextLine.trim().startsWith('-') || nextLine.trim().startsWith('•') || /^\d+\./.test(nextLine.trim())) {
          reasons.push(nextLine.trim().replace(/^[-•\d\.\s]+/, ''));
        }
      }
      break;
    }
  }
  
  return reasons.slice(0, 5); // Limit to 5 reasons
}

function extractFacilities(content: string): any {
  const facilities: any = {
    wifi: null,
    parking: null,
    toilets: null,
    gift_shop: null,
    audio_guide: null,
    guided_tours: null,
    cafe_restaurant: null
  };

  const lowerContent = content.toLowerCase();
  
  // Simple keyword matching for facilities
  if (lowerContent.includes('wifi') || lowerContent.includes('internet')) {
    facilities.wifi = 'Available';
  }
  if (lowerContent.includes('parking')) {
    facilities.parking = 'Available';
  }
  if (lowerContent.includes('toilet') || lowerContent.includes('restroom')) {
    facilities.toilets = 'Available';
  }
  if (lowerContent.includes('gift shop') || lowerContent.includes('souvenir')) {
    facilities.gift_shop = 'Available';
  }
  if (lowerContent.includes('audio guide') || lowerContent.includes('audioguide')) {
    facilities.audio_guide = 'Available';
  }
  if (lowerContent.includes('guided tour') || lowerContent.includes('tour guide')) {
    facilities.guided_tours = 'Available';
  }
  if (lowerContent.includes('cafe') || lowerContent.includes('restaurant') || lowerContent.includes('coffee')) {
    facilities.cafe_restaurant = 'Available';
  }

  return facilities;
}

function extractAccessibility(content: string): any {
  const accessibility: any = {
    wheelchair_accessible: null,
    stroller_friendly: null,
    kid_friendly: null,
    senior_friendly: null,
    accessibility_notes: null
  };

  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('wheelchair') || lowerContent.includes('accessible')) {
    accessibility.wheelchair_accessible = 'Accessible';
  }
  if (lowerContent.includes('stroller') || lowerContent.includes('pram')) {
    accessibility.stroller_friendly = 'Stroller friendly';
  }
  if (lowerContent.includes('children') || lowerContent.includes('kids') || lowerContent.includes('family')) {
    accessibility.kid_friendly = 'Family friendly';
  }
  if (lowerContent.includes('senior') || lowerContent.includes('elderly')) {
    accessibility.senior_friendly = 'Senior friendly';
  }

  return accessibility;
}

function extractPracticalInfo(content: string): any {
  const practicalInfo: any = {
    dress_code: null,
    photography_policy: null,
    entry_requirements: null,
    safety_notes: null,
    etiquette_tips: null
  };

  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('dress code') || lowerContent.includes('clothing')) {
    // Extract dress code information
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes('dress') || line.toLowerCase().includes('clothing')) {
        practicalInfo.dress_code = line.trim();
        break;
      }
    }
  }
  
  if (lowerContent.includes('photography') || lowerContent.includes('photo')) {
    practicalInfo.photography_policy = 'Photography allowed';
  }
  
  if (lowerContent.includes('entry') || lowerContent.includes('ticket') || lowerContent.includes('admission')) {
    practicalInfo.entry_requirements = 'Entry requirements may apply';
  }

  return practicalInfo;
}

function extractInsiderTips(content: string): string[] {
  const tips: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('tip') || line.toLowerCase().includes('advice') || line.toLowerCase().includes('insider')) {
      if (line.trim().length > 20 && line.trim().length < 200) {
        tips.push(line.trim());
      }
    }
  }
  
  return tips.slice(0, 3); // Limit to 3 tips
}

function extractHighlights(content: string): string[] {
  const highlights: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('highlight') || line.toLowerCase().includes('feature') || line.toLowerCase().includes('attraction')) {
      if (line.trim().length > 20 && line.trim().length < 200) {
        highlights.push(line.trim());
      }
    }
  }
  
  return highlights.slice(0, 5); // Limit to 5 highlights
}

function extractOpeningHours(content: string): string[] {
  const hours: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('hour') || line.toLowerCase().includes('open') || line.toLowerCase().includes('time')) {
      if (line.trim().length > 10 && line.trim().length < 100) {
        hours.push(line.trim());
      }
    }
  }
  
  return hours.slice(0, 3); // Limit to 3 hours entries
}
