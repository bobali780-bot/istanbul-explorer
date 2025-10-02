import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// Cache the knowledge base to avoid regenerating on every request
let cachedKnowledgeBase: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getKnowledgeBase() {
  const now = Date.now();

  // Return cached version if still valid
  if (cachedKnowledgeBase && (now - cacheTime) < CACHE_DURATION) {
    return cachedKnowledgeBase;
  }

  // Fetch fresh knowledge base
  const knowledgeResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ai/generate-knowledge-base`);
  const { knowledge_base } = await knowledgeResponse.json();

  // Update cache
  cachedKnowledgeBase = knowledge_base;
  cacheTime = now;

  return knowledge_base;
}

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json();

    // Get knowledge base (cached)
    const knowledge_base = await getKnowledgeBase();

    // Create system prompt with knowledge base
    const systemPrompt = `You are a friendly and knowledgeable Istanbul travel assistant for "Best Istanbul" - a curated travel guide platform.

BUSINESS CONTEXT:
${JSON.stringify(knowledge_base.business_info, null, 2)}

AVAILABLE VENUES:
- ${knowledge_base.statistics.total_activities} Activities
- ${knowledge_base.statistics.total_shopping} Shopping venues
- ${knowledge_base.statistics.total_restaurants} Restaurants
- ${knowledge_base.statistics.total_hotels} Hotels

POPULAR NEIGHBORHOODS:
${knowledge_base.popular_areas.map((area: any) => `- ${area.name} (${area.venue_count} venues)`).join('\n')}

TRAVEL TIPS:
${knowledge_base.tips.map((tip: string) => `- ${tip}`).join('\n')}

VENUE DATABASE:
${JSON.stringify({
  activities: knowledge_base.venues.activities.slice(0, 30),
  shopping: knowledge_base.venues.shopping.slice(0, 20),
  restaurants: knowledge_base.venues.restaurants.slice(0, 20),
  hotels: knowledge_base.venues.hotels.slice(0, 15)
}, null, 2)}

YOUR ROLE:
- Help travelers discover the best places in Istanbul
- Provide personalized recommendations based on their preferences
- Answer questions about neighborhoods, pricing, accessibility, and practical info
- Suggest itineraries and combinations of venues
- Be warm, helpful, and enthusiastic about Istanbul
- When recommending venues, mention specific names, locations, and why they're special
- If asked about a specific venue, provide detailed info including ratings, location, facilities, and tips
- Always suggest exploring our website for booking and more details

IMPORTANT:
- Use the venue database to make specific, accurate recommendations
- Include ratings and review counts when relevant
- Mention neighborhoods to help travelers navigate
- Consider accessibility, family-friendliness, budget when asked
- Be concise but informative (2-4 sentences per recommendation)
- Always end with a helpful follow-up question or suggestion`;

    // Build conversation messages
    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (last 6 messages to manage token usage)
    const recentHistory = conversationHistory.slice(-6);
    recentHistory.forEach((msg: any) => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.8,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({
      success: true,
      response
    });

  } catch (error: any) {
    console.error('AI Chat error:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      apiKeyExists: !!process.env.OPENAI_API_KEY,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10)
    });
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to process chat message',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}
