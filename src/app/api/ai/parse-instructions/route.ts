import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { instructions, itemTitle } = await request.json()

    if (!instructions) {
      return NextResponse.json({
        success: false,
        message: 'Instructions are required'
      }, { status: 400 })
    }

    // Call Claude/GPT for intent parsing
    const aiResponse = await parseInstructionsWithAI(instructions, itemTitle)

    return NextResponse.json({
      success: true,
      understanding: aiResponse.humanSummary,
      structuredIntent: aiResponse.structuredIntent
    })

  } catch (error) {
    console.error('Error parsing instructions:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to parse instructions'
    }, { status: 500 })
  }
}

async function parseInstructionsWithAI(instructions: string, itemTitle: string) {
  // Try OpenAI first, fallback to Claude
  try {
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      return await parseWithOpenAI(instructions, itemTitle, openaiKey)
    }
  } catch (error) {
    console.log('OpenAI parsing failed, trying Claude...', error)
  }

  // Fallback to Claude
  try {
    const claudeKey = process.env.CLAUDE_API_KEY
    if (claudeKey) {
      return await parseWithClaude(instructions, itemTitle, claudeKey)
    }
  } catch (error) {
    console.log('Claude parsing failed, using fallback...', error)
  }

  // Fallback to simple parsing
  return parseInstructionsFallback(instructions, itemTitle)
}

async function parseWithOpenAI(instructions: string, itemTitle: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `The user is requesting a rescrape of a venue tile named "${itemTitle}". 
Extract clear, structured instructions from their request.

Possible actions include:
- Add X additional images
- Replace existing images  
- Improve or rewrite description
- Add tags or metadata
- Re-run the whole scrape

Output JSON only:
{
  "images": <integer|null>,
  "replace_images": <boolean>,
  "description_update": <boolean>,
  "tags_update": <boolean>,
  "full_rescrape": <boolean>,
  "raw_summary": "<AI's human-friendly summary>"
}`
        },
        {
          role: 'user',
          content: instructions
        }
      ],
      temperature: 0.1,
      max_tokens: 500
    })
  })

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content returned from OpenAI')
  }

  try {
    const structuredIntent = JSON.parse(content)
    return {
      structuredIntent,
      humanSummary: structuredIntent.raw_summary || `I understand you want to update "${itemTitle}" with: ${instructions}`
    }
  } catch (parseError) {
    throw new Error('Failed to parse OpenAI response as JSON')
  }
}

async function parseWithClaude(instructions: string, itemTitle: string, apiKey: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `The user is requesting a rescrape of a venue tile named "${itemTitle}". 
Extract clear, structured instructions from their request: "${instructions}"

Possible actions include:
- Add X additional images
- Replace existing images  
- Improve or rewrite description
- Add tags or metadata
- Re-run the whole scrape

Output JSON only:
{
  "images": <integer|null>,
  "replace_images": <boolean>,
  "description_update": <boolean>,
  "tags_update": <boolean>,
  "full_rescrape": <boolean>,
  "raw_summary": "<AI's human-friendly summary>"
}`
        }
      ]
    })
  })

  const data = await response.json()
  const content = data.content[0]?.text

  if (!content) {
    throw new Error('No content returned from Claude')
  }

  try {
    const structuredIntent = JSON.parse(content)
    return {
      structuredIntent,
      humanSummary: structuredIntent.raw_summary || `I understand you want to update "${itemTitle}" with: ${instructions}`
    }
  } catch (parseError) {
    throw new Error('Failed to parse Claude response as JSON')
  }
}

function parseInstructionsFallback(instructions: string, itemTitle: string) {
  const lowerInstructions = instructions.toLowerCase()
  
  // Parse different types of requests
  const structuredIntent = {
    images: null as number | null,
    replace_images: false,
    description_update: false,
    tags_update: false,
    full_rescrape: false,
    raw_summary: `Update ${itemTitle} based on your request`
  }
  
  // Image requests
  if (lowerInstructions.includes('picture') || lowerInstructions.includes('image') || lowerInstructions.includes('photo')) {
    if (lowerInstructions.includes('more') || lowerInstructions.includes('additional')) {
      const match = lowerInstructions.match(/(\d+)/)
      structuredIntent.images = match ? parseInt(match[1]) : 15
      structuredIntent.raw_summary = `Add ${structuredIntent.images} more images to ${itemTitle}`
    } else if (lowerInstructions.includes('replace') || lowerInstructions.includes('different')) {
      structuredIntent.replace_images = true
      structuredIntent.raw_summary = `Replace existing images for ${itemTitle}`
    }
  }
  
  // Content requests
  if (lowerInstructions.includes('description') || lowerInstructions.includes('content')) {
    structuredIntent.description_update = true
    structuredIntent.raw_summary += structuredIntent.raw_summary.includes('Add') ? ' and update description' : `Update description for ${itemTitle}`
  }
  
  // Tags requests
  if (lowerInstructions.includes('tag') || lowerInstructions.includes('metadata')) {
    structuredIntent.tags_update = true
    structuredIntent.raw_summary += structuredIntent.raw_summary.includes('Add') ? ' and update tags' : `Update tags for ${itemTitle}`
  }
  
  // Full rescrape
  if (lowerInstructions.includes('rescrape') || lowerInstructions.includes('re-scrape') || lowerInstructions.includes('everything')) {
    structuredIntent.full_rescrape = true
    structuredIntent.raw_summary = `Perform full rescrape of ${itemTitle}`
  }
  
  return {
    structuredIntent,
    humanSummary: structuredIntent.raw_summary
  }
}

function parseInstructions(instructions: string, itemTitle: string): string {
  const lowerInstructions = instructions.toLowerCase()
  
  // Parse different types of requests
  const requests = []
  
  // Image requests
  if (lowerInstructions.includes('picture') || lowerInstructions.includes('image') || lowerInstructions.includes('photo')) {
    if (lowerInstructions.includes('more') || lowerInstructions.includes('additional')) {
      requests.push('Get additional high-quality images')
    } else if (lowerInstructions.includes('different') || lowerInstructions.includes('other')) {
      requests.push('Get different images from various sources')
    } else {
      requests.push('Update the image collection')
    }
    
    // Source-specific requests
    if (lowerInstructions.includes('google places') || lowerInstructions.includes('google')) {
      requests.push('Focus on Google Places Photos API')
    }
    if (lowerInstructions.includes('unsplash')) {
      requests.push('Use Unsplash for additional images')
    }
    if (lowerInstructions.includes('pexels')) {
      requests.push('Use Pexels for additional images')
    }
  }
  
  // Content requests
  if (lowerInstructions.includes('description') || lowerInstructions.includes('content')) {
    if (lowerInstructions.includes('seo') || lowerInstructions.includes('optimize')) {
      requests.push('Rewrite description for better SEO')
    } else if (lowerInstructions.includes('better') || lowerInstructions.includes('improve')) {
      requests.push('Improve the description quality')
    } else {
      requests.push('Update the description content')
    }
  }
  
  // Category-specific requests
  if (lowerInstructions.includes('food') || lowerInstructions.includes('restaurant') || lowerInstructions.includes('dining')) {
    requests.push('Focus on food and dining information')
  }
  if (lowerInstructions.includes('architecture') || lowerInstructions.includes('building')) {
    requests.push('Emphasize architectural details')
  }
  if (lowerInstructions.includes('history') || lowerInstructions.includes('historical')) {
    requests.push('Include more historical information')
  }
  
  // Default fallback
  if (requests.length === 0) {
    requests.push('Update content based on your instructions')
  }
  
  // Generate understanding text
  let understanding = `I understand you want to re-scrape "${itemTitle}" with the following changes:\n\n`
  
  requests.forEach((request, index) => {
    understanding += `• ${request}\n`
  })
  
  understanding += '\nIs this correct?'
  
  return understanding
}
