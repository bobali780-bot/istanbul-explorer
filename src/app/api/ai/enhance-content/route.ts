import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content, instructions, itemTitle } = await request.json()

    if (!content || !instructions) {
      return NextResponse.json({
        success: false,
        message: 'Content and instructions are required'
      }, { status: 400 })
    }

    // Call AI to enhance the content
    const enhancedContent = await enhanceContentWithAI(content, instructions, itemTitle)

    return NextResponse.json({
      success: true,
      enhancedContent
    })

  } catch (error) {
    console.error('Error enhancing content:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to enhance content'
    }, { status: 500 })
  }
}

async function enhanceContentWithAI(content: string, instructions: string, itemTitle: string) {
  // Try OpenAI first, fallback to Claude
  try {
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      return await enhanceWithOpenAI(content, instructions, itemTitle, openaiKey)
    }
  } catch (error) {
    console.log('OpenAI enhancement failed, trying Claude...', error)
  }

  // Fallback to Claude
  try {
    const claudeKey = process.env.CLAUDE_API_KEY
    if (claudeKey) {
      return await enhanceWithClaude(content, instructions, itemTitle, claudeKey)
    }
  } catch (error) {
    console.log('Claude enhancement failed, using fallback...', error)
  }

  // Fallback - return original content with prefix
  return `Enhanced: ${content}`
}

async function enhanceWithOpenAI(content: string, instructions: string, itemTitle: string, apiKey: string) {
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
          content: `You are a professional travel content writer specializing in Istanbul tourism. 
Your task is to enhance the description for "${itemTitle}" based on the user's specific instructions.

Guidelines:
- Maintain a professional, engaging tone
- Keep the content accurate and informative
- Make it SEO-friendly with relevant keywords
- Ensure it's suitable for travelers
- Keep the length reasonable (200-400 words)
- Focus on what makes this venue special`
        },
        {
          role: 'user',
          content: `Original description for "${itemTitle}":
${content}

User instructions: ${instructions}

Please enhance this description according to the instructions while maintaining accuracy and appeal to travelers.`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    })
  })

  const data = await response.json()
  const enhancedContent = data.choices[0]?.message?.content

  if (!enhancedContent) {
    throw new Error('No enhanced content returned from OpenAI')
  }

  return enhancedContent
}

async function enhanceWithClaude(content: string, instructions: string, itemTitle: string, apiKey: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `You are a professional travel content writer specializing in Istanbul tourism. 
Your task is to enhance the description for "${itemTitle}" based on the user's specific instructions.

Guidelines:
- Maintain a professional, engaging tone
- Keep the content accurate and informative
- Make it SEO-friendly with relevant keywords
- Ensure it's suitable for travelers
- Keep the length reasonable (200-400 words)
- Focus on what makes this venue special

Original description for "${itemTitle}":
${content}

User instructions: ${instructions}

Please enhance this description according to the instructions while maintaining accuracy and appeal to travelers.`
        }
      ]
    })
  })

  const data = await response.json()
  const enhancedContent = data.content[0]?.text

  if (!enhancedContent) {
    throw new Error('No enhanced content returned from Claude')
  }

  return enhancedContent
}
