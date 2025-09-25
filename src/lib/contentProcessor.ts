/**
 * Content Processor for Firecrawl Raw Data
 * Converts raw Firecrawl markdown/HTML content into clean, user-friendly descriptions
 */

export interface ProcessedContent {
  cleanDescription: string;
  highlights: string[];
  keyInfo: {
    duration?: string;
    bestTime?: string;
    dressCode?: string;
    entryRequirements?: string;
  };
}

export function processFirecrawlContent(rawContent: string, venueTitle: string): ProcessedContent {
  if (!rawContent || typeof rawContent !== 'string') {
    return {
      cleanDescription: `Experience ${venueTitle} in Istanbul, Turkey.`,
      highlights: [],
      keyInfo: {}
    };
  }

  // Clean up the raw content
  let cleanContent = rawContent
    // Remove markdown image syntax
    .replace(/!\[.*?\]\([^)]+\)/g, '')
    // Remove reCAPTCHA text
    .replace(/reCAPTCHA/g, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Extract meaningful sentences (avoid single words or very short phrases)
  const sentences = cleanContent
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && !s.match(/^[A-Z]{2,}$/)) // Filter out acronyms and short text
    .slice(0, 3); // Take first 3 meaningful sentences

  // Create clean description
  let cleanDescription = sentences.join('. ');
  if (cleanDescription && !cleanDescription.endsWith('.')) {
    cleanDescription += '.';
  }

  // Fallback if no meaningful content found
  if (!cleanDescription || cleanDescription.length < 50) {
    cleanDescription = `${venueTitle} is a remarkable destination in Istanbul that offers visitors an authentic glimpse into the rich history and vibrant culture of this incredible city. Whether you're interested in history, architecture, or local culture, this destination provides an unforgettable experience.`;
  }

  // Extract potential highlights from the content
  const highlights = extractHighlights(cleanContent, venueTitle);

  // Extract key information
  const keyInfo = extractKeyInfo(cleanContent);

  return {
    cleanDescription,
    highlights,
    keyInfo
  };
}

function extractHighlights(content: string, venueTitle: string): string[] {
  const highlights: string[] = [];
  
  // Look for common highlight patterns
  const highlightPatterns = [
    /(\d+)\s*(minarets?|domes?|columns?|rooms?|years?)/gi,
    /(UNESCO|World Heritage)/gi,
    /(free|gratis)/gi,
    /(panoramic|360-degree|views?)/gi,
    /(historic|ancient|medieval)/gi,
    /(active|working|operational)/gi
  ];

  highlightPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (match.length > 2 && match.length < 30) {
          highlights.push(match.trim());
        }
      });
    }
  });

  // Remove duplicates and limit to 6 highlights
  const uniqueHighlights = [...new Set(highlights)].slice(0, 6);
  
  // Add venue-specific highlights if we don't have enough
  if (uniqueHighlights.length < 3) {
    const defaultHighlights = [
      'Historic landmark',
      'Cultural significance',
      'Visitor attraction'
    ];
    
    defaultHighlights.forEach(highlight => {
      if (!uniqueHighlights.includes(highlight) && uniqueHighlights.length < 6) {
        uniqueHighlights.push(highlight);
      }
    });
  }

  return uniqueHighlights;
}

function extractKeyInfo(content: string): ProcessedContent['keyInfo'] {
  const keyInfo: ProcessedContent['keyInfo'] = {};

  // Extract duration
  const durationMatch = content.match(/(\d+[-–]\d+|\d+)\s*(minutes?|hours?|mins?|hrs?)/gi);
  if (durationMatch) {
    keyInfo.duration = durationMatch[0];
  }

  // Extract best time to visit
  const timeMatch = content.match(/(early morning|late afternoon|sunset|morning|afternoon)/gi);
  if (timeMatch) {
    keyInfo.bestTime = timeMatch[0];
  }

  // Extract dress code
  const dressMatch = content.match(/(modest dress|dress code|covered|shoulders|head)/gi);
  if (dressMatch) {
    keyInfo.dressCode = 'Modest dress required';
  }

  // Extract entry requirements
  const entryMatch = content.match(/(free entry|entrance fee|ticket|booking)/gi);
  if (entryMatch) {
    keyInfo.entryRequirements = entryMatch[0];
  }

  return keyInfo;
}

/**
 * Format content for display in staging preview
 */
export function formatContentForPreview(processed: ProcessedContent, venueTitle: string): string {
  let formatted = `**${venueTitle}**\n\n`;
  
  formatted += processed.cleanDescription + '\n\n';
  
  if (processed.highlights.length > 0) {
    formatted += '**Key Highlights:**\n';
    processed.highlights.forEach(highlight => {
      formatted += `• ${highlight}\n`;
    });
    formatted += '\n';
  }
  
  if (processed.keyInfo.duration || processed.keyInfo.bestTime || processed.keyInfo.entryRequirements) {
    formatted += '**Visitor Information:**\n';
    if (processed.keyInfo.duration) formatted += `• Duration: ${processed.keyInfo.duration}\n`;
    if (processed.keyInfo.bestTime) formatted += `• Best time: ${processed.keyInfo.bestTime}\n`;
    if (processed.keyInfo.entryRequirements) formatted += `• Entry: ${processed.keyInfo.entryRequirements}\n`;
  }
  
  return formatted;
}
