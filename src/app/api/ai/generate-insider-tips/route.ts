import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { venueName, venueType, location, category } = await request.json();

    if (!venueName) {
      return NextResponse.json(
        { success: false, error: 'Venue name is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate 4-6 insider tips for "${venueName}" in ${location || 'Istanbul'}. 
    
    Venue Type: ${venueType || 'activity'}
    Category: ${category || 'general'}
    
    Generate practical, location-specific tips that would help visitors. Include:
    - Best times to visit (timing)
    - Photography tips (photography)
    - How to avoid crowds (crowds)
    - Local customs/etiquette (local)
    - Safety considerations (safety)
    - Unique experiences (experience)
    
    Return as JSON array with this structure:
    [
      {
        "id": "1",
        "title": "Best Time to Visit",
        "description": "Specific tip description",
        "icon": "clock",
        "category": "timing"
      }
    ]
    
    Use these icon options: lightbulb, clock, map, users, camera, star
    Use these category options: timing, photography, crowds, local, safety, experience
    
    Make tips specific to ${venueName} and Istanbul context.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a local Istanbul travel expert. Generate practical, insider tips for visitors. Be specific and helpful."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let tips;
    try {
      tips = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('Invalid JSON response from OpenAI');
    }

    return NextResponse.json({
      success: true,
      tips: tips
    });

  } catch (error: any) {
    console.error('Error generating insider tips:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to generate insider tips: ${error.message}` 
      },
      { status: 500 }
    );
  }
}
