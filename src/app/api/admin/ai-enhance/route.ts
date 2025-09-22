import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AIEnhancementRequest {
  staging_ids: string[]
  enhancement_type: 'description' | 'title' | 'highlights' | 'full'
  target_audience?: 'tourists' | 'locals' | 'families' | 'couples' | 'general'
  style?: 'professional' | 'casual' | 'engaging' | 'informative'
}

export async function POST(request: Request) {
  try {
    const { staging_ids, enhancement_type, target_audience = 'tourists', style = 'engaging' }: AIEnhancementRequest = await request.json();

    if (!staging_ids || staging_ids.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No staging items specified'
      }, { status: 400 });
    }

    console.log(`Starting AI enhancement for ${staging_ids.length} items (type: ${enhancement_type})`);

    // Get staging items
    const { data: stagingItems, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .in('id', staging_ids);

    if (fetchError) throw fetchError;

    if (!stagingItems || stagingItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No staging items found'
      });
    }

    const enhancedItems = [];
    const errors = [];

    for (const item of stagingItems) {
      try {
        console.log(`Enhancing: ${item.title}`);

        const enhanced = await enhanceItemContent(item, enhancement_type, target_audience, style);

        if (enhanced) {
          // Update staging item with enhanced content
          const { error: updateError } = await supabase
            .from('staging_queue')
            .update({
              title: enhanced.title || item.title,
              raw_content: {
                ...item.raw_content,
                description: enhanced.description || item.raw_content.description,
                highlights: enhanced.highlights || item.raw_content.highlights,
                enhanced_at: new Date().toISOString(),
                enhancement_type,
                original_content: {
                  title: item.title,
                  description: item.raw_content.description,
                  highlights: item.raw_content.highlights
                }
              },
              confidence_score: Math.min(item.confidence_score + 10, 100) // Boost confidence for AI-enhanced content
            })
            .eq('id', item.id);

          if (updateError) throw updateError;

          // Log enhancement
          await supabase
            .from('ai_enhancement_log')
            .insert({
              staging_id: item.id,
              action_type: `ai_enhance_${enhancement_type}`,
              input_data: {
                original_title: item.title,
                original_description: item.raw_content.description,
                target_audience,
                style
              },
              output_data: enhanced,
              confidence_score: enhanced.confidence || 85,
              processing_time: enhanced.processing_time || 1000,
              created_at: new Date().toISOString()
            });

          enhancedItems.push({
            staging_id: item.id,
            original_title: item.title,
            enhanced_title: enhanced.title,
            original_description: item.raw_content.description?.substring(0, 100) + '...',
            enhanced_description: enhanced.description?.substring(0, 100) + '...',
            improvement_score: enhanced.confidence || 85
          });
        }

      } catch (itemError) {
        console.error(`Error enhancing ${item.title}:`, itemError);
        errors.push(`Failed to enhance "${item.title}": ${itemError instanceof Error ? itemError.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Enhanced ${enhancedItems.length} of ${stagingItems.length} items`,
      enhanced_items: enhancedItems,
      errors: errors.length > 0 ? errors : null,
      summary: {
        total_items: stagingItems.length,
        enhanced: enhancedItems.length,
        failed: errors.length,
        enhancement_type,
        target_audience,
        style
      }
    });

  } catch (error) {
    console.error('AI enhancement error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Simulate AI enhancement (in production, this would call OpenAI, Claude, etc.)
async function enhanceItemContent(item: any, type: string, audience: string, style: string): Promise<any> {
  const startTime = Date.now();

  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const context = {
      location: 'Istanbul, Turkey',
      category: item.category,
      audience,
      style,
      original_content: item.raw_content
    };

    let enhanced: any = {
      confidence: 85 + Math.floor(Math.random() * 15),
      processing_time: Date.now() - startTime
    };

    switch (type) {
      case 'title':
        enhanced.title = enhanceTitle(item.title, context);
        break;

      case 'description':
        enhanced.description = enhanceDescription(item.raw_content.description, context);
        break;

      case 'highlights':
        enhanced.highlights = enhanceHighlights(item.raw_content.highlights, context);
        break;

      case 'full':
        enhanced.title = enhanceTitle(item.title, context);
        enhanced.description = enhanceDescription(item.raw_content.description, context);
        enhanced.highlights = enhanceHighlights(item.raw_content.highlights, context);
        break;

      default:
        throw new Error('Invalid enhancement type');
    }

    return enhanced;

  } catch (error) {
    console.error('Enhancement processing error:', error);
    return null;
  }
}

function enhanceTitle(originalTitle: string, context: any): string {
  const audience = context.audience;
  const style = context.style;

  // Title enhancement templates based on audience and style
  const templates = {
    tourists: {
      professional: ['Essential Visit: {title}', 'Must-See Istanbul: {title}', 'Top Attraction: {title}'],
      engaging: ['Discover Amazing {title}', 'Unforgettable {title} Experience', 'Breathtaking {title} Adventure'],
      casual: ['Check Out {title}', 'Amazing {title} Spot', 'Cool {title} Experience']
    },
    families: {
      professional: ['Family-Friendly {title}', 'Perfect for Families: {title}', 'Kid-Approved {title}'],
      engaging: ['Fun Family Day at {title}', 'Kids Love {title}!', 'Family Adventure: {title}'],
      casual: ['Great for Kids: {title}', 'Family Fun at {title}', 'Perfect Family Spot: {title}']
    },
    couples: {
      professional: ['Romantic {title} Experience', 'Couples Retreat: {title}', 'Intimate {title} Visit'],
      engaging: ['Romantic Escape to {title}', 'Perfect Date: {title}', 'Love & {title}'],
      casual: ['Date Night: {title}', 'Romantic {title}', 'Couples Love {title}']
    }
  };

  const audienceTemplates = templates[audience as keyof typeof templates] || templates.tourists;
  const styleTemplates = audienceTemplates[style as keyof typeof audienceTemplates] || audienceTemplates.engaging;

  // Choose random template and apply
  const template = styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
  return template.replace('{title}', originalTitle);
}

function enhanceDescription(originalDescription: string, context: any): string {
  if (!originalDescription || originalDescription.length < 10) {
    return generateDefaultDescription(context);
  }

  const audience = context.audience;
  const style = context.style;

  // Enhancement prefixes/suffixes based on audience
  const enhancements = {
    tourists: {
      prefix: "A must-visit destination in Istanbul, ",
      suffix: " This iconic attraction offers visitors an authentic taste of Turkish culture and history."
    },
    families: {
      prefix: "Perfect for families visiting Istanbul, ",
      suffix: " Children and adults alike will enjoy this memorable experience together."
    },
    couples: {
      prefix: "An ideal romantic destination, ",
      suffix: " Create unforgettable memories with your loved one in this enchanting setting."
    },
    general: {
      prefix: "Located in the heart of Istanbul, ",
      suffix: " Experience the rich heritage and vibrant culture of this magnificent city."
    }
  };

  const enhancement = enhancements[audience as keyof typeof enhancements] || enhancements.general;

  // Clean and enhance the description
  let enhanced = originalDescription
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/\.$/, ''); // Remove trailing period

  // Add enhancement
  if (!enhanced.toLowerCase().includes('istanbul')) {
    enhanced = enhancement.prefix + enhanced;
  }

  if (!enhanced.endsWith('.')) {
    enhanced += '.';
  }

  enhanced += enhancement.suffix;

  return enhanced;
}

function enhanceHighlights(originalHighlights: string[], context: any): string[] {
  const category = context.category;

  // Category-specific highlight templates
  const categoryHighlights = {
    activities: [
      'Professional guided tour included',
      'Skip-the-line access available',
      'Perfect for photography enthusiasts',
      'Audio guide in multiple languages',
      'Wheelchair accessible',
      'Free Wi-Fi available'
    ],
    restaurants: [
      'Authentic Turkish cuisine',
      'Fresh, locally-sourced ingredients',
      'Traditional Ottoman recipes',
      'Vegetarian options available',
      'Halal certified',
      'Stunning Bosphorus views'
    ],
    hotels: [
      '24-hour concierge service',
      'Free airport shuttle',
      'Rooftop terrace with city views',
      'Traditional Turkish breakfast',
      'Walking distance to major attractions',
      'Complimentary Wi-Fi throughout'
    ]
  };

  let enhanced = [...(originalHighlights || [])];

  // Add category-specific highlights if missing
  const categorySpecs = categoryHighlights[category as keyof typeof categoryHighlights] || categoryHighlights.activities;

  // Add 2-3 relevant highlights if we have fewer than 5
  while (enhanced.length < 5 && categorySpecs.length > 0) {
    const randomHighlight = categorySpecs[Math.floor(Math.random() * categorySpecs.length)];
    if (!enhanced.some(h => h.toLowerCase().includes(randomHighlight.toLowerCase().split(' ')[0]))) {
      enhanced.push(randomHighlight);
    }
    // Remove to avoid duplicates
    categorySpecs.splice(categorySpecs.indexOf(randomHighlight), 1);
  }

  return enhanced.slice(0, 8); // Limit to 8 highlights
}

function generateDefaultDescription(context: any): string {
  const category = context.category;
  const location = context.location;

  const defaultDescriptions = {
    activities: `Experience one of Istanbul's most captivating attractions. This remarkable destination showcases the rich history and vibrant culture that makes ${location} a world-renowned travel destination. Perfect for visitors seeking authentic Turkish experiences.`,
    restaurants: `Savor the authentic flavors of Turkish cuisine at this exceptional dining establishment in ${location}. Using traditional recipes and fresh local ingredients, this restaurant offers a true taste of Ottoman culinary heritage.`,
    hotels: `Enjoy comfortable accommodations in the heart of ${location}. This welcoming hotel provides modern amenities while maintaining the warm hospitality that Turkey is famous for, making it perfect for exploring Istanbul's many attractions.`
  };

  return defaultDescriptions[category as keyof typeof defaultDescriptions] || defaultDescriptions.activities;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'stats') {
      // Get AI enhancement statistics
      const { data: logs, error } = await supabase
        .from('ai_enhancement_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const stats = {
        total_enhancements: logs.length,
        recent_24h: logs.filter(log =>
          new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length,
        by_type: logs.reduce((acc: any, log) => {
          const type = log.action_type || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {}),
        avg_confidence: logs.length > 0
          ? Math.round(logs.reduce((sum, log) => sum + (log.confidence_score || 0), 0) / logs.length)
          : 0,
        avg_processing_time: logs.length > 0
          ? Math.round(logs.reduce((sum, log) => sum + (log.processing_time || 0), 0) / logs.length)
          : 0
      };

      return NextResponse.json({ success: true, stats });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action specified'
    }, { status: 400 });

  } catch (error) {
    console.error('AI enhancement stats error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}