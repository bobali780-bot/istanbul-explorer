import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ScrapingJob {
  searchTerms: string[];
  category: string;
  imagesPerItem: number;
  maxResults?: number;
}

export async function POST(request: Request) {
  try {
    const { searchTerms, category = 'activities', imagesPerItem = 12, maxResults = 100 }: ScrapingJob = await request.json();

    if (!searchTerms || searchTerms.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Search terms are required'
      }, { status: 400 });
    }

    console.log(`Starting production scraping for ${searchTerms.length} terms in category: ${category}`);

    // Create scraping job record
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        job_type: 'production_batch',
        category: category,
        input_data: { search_terms: searchTerms, images_per_item: imagesPerItem },
        status: 'running',
        total_items: searchTerms.length,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    if (!process.env.FIRECRAWL_API_KEY) {
      await supabase
        .from('scraping_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_log: { errors: ['FIRECRAWL_API_KEY not found'] }
        })
        .eq('id', job.id);

      return NextResponse.json({
        success: false,
        error: 'Firecrawl API key not configured',
        job_id: job.id
      });
    }

    const results: any[] = [];
    const errors: string[] = [];
    let processedCount = 0;
    let successCount = 0;
    let creditsUsed = 0;

    // Process each search term
    for (const searchTerm of searchTerms) {
      try {
        console.log(`Processing: ${searchTerm} (${processedCount + 1}/${searchTerms.length})`);

        // Get all source URLs for this search term
        const sourceUrls = await generateSourceUrls(searchTerm, category);
        const scrapedData: any[] = [];

        // Scrape from multiple sources
        for (const sourceUrl of sourceUrls) {
          try {
            console.log(`  Scraping: ${sourceUrl}`);

            const scraped = await scrapeWithFirecrawl(sourceUrl);
            if (scraped) {
              scrapedData.push(scraped);
              creditsUsed++;
            }

            // Add delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (sourceError) {
            console.log(`  Failed to scrape ${sourceUrl}: ${sourceError}`);
          }
        }

        if (scrapedData.length === 0) {
          errors.push(`No data scraped for: ${searchTerm}`);
          processedCount++;
          continue;
        }

        // Combine and process scraped data
        const processedItem = await processScrapedData(scrapedData, searchTerm, category, imagesPerItem);

        // Check for duplicates
        const isDuplicate = await checkDuplicate(processedItem.title, category);
        if (isDuplicate) {
          errors.push(`Duplicate found for: ${searchTerm}`);
          processedCount++;
          continue;
        }

        // Insert into staging
        const { data: stagingItem, error: stagingError } = await supabase
          .from('staging_queue')
          .insert({
            title: processedItem.title,
            category: category,
            primary_image: processedItem.images[0] || null,
            images: processedItem.images,
            image_count: processedItem.images.length,
            raw_content: {
              description: processedItem.description,
              content: processedItem.content,
              price_range: processedItem.price_range,
              duration: processedItem.duration,
              rating: processedItem.rating,
              review_count: processedItem.review_count,
              highlights: processedItem.highlights,
              scraped_sources: scrapedData.map(s => s.sourceUrl)
            },
            confidence_score: processedItem.confidence_score,
            source_urls: scrapedData.map(s => s.sourceUrl),
            scraping_job_id: job.id,
            has_description: processedItem.description.length > 50,
            has_price: processedItem.price_range.length > 0,
            has_location: processedItem.content.toLowerCase().includes('istanbul'),
            has_rating: processedItem.rating > 0
          })
          .select()
          .single();

        if (stagingError) {
          errors.push(`Failed to save ${processedItem.title}: ${stagingError.message}`);
        } else {
          results.push({
            id: stagingItem.id,
            title: stagingItem.title,
            confidence_score: stagingItem.confidence_score,
            images_count: stagingItem.image_count,
            sources_used: scrapedData.length
          });
          successCount++;
        }

        processedCount++;

        // Update job progress
        await supabase
          .from('scraping_jobs')
          .update({
            processed_items: processedCount,
            successful_items: successCount,
            credits_used: creditsUsed,
            staging_ids: results.map(r => r.id)
          })
          .eq('id', job.id);

      } catch (error) {
        console.error(`Error processing ${searchTerm}:`, error);
        errors.push(`Failed to process ${searchTerm}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        processedCount++;
      }
    }

    // Complete the job
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        processed_items: processedCount,
        successful_items: successCount,
        failed_items: processedCount - successCount,
        credits_used: creditsUsed,
        error_log: errors.length > 0 ? { errors } : null
      })
      .eq('id', job.id);

    return NextResponse.json({
      success: true,
      job_id: job.id,
      results,
      summary: {
        total_terms: searchTerms.length,
        processed: processedCount,
        successful: successCount,
        failed: processedCount - successCount,
        credits_used: creditsUsed,
        errors: errors
      }
    });

  } catch (error) {
    console.error('Production scraping error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Generate comprehensive source URLs for a search term
async function generateSourceUrls(searchTerm: string, category: string): Promise<string[]> {
  const urls: string[] = [];
  const encodedTerm = encodeURIComponent(searchTerm + ' istanbul');

  // Get specific URLs for popular attractions
  const specificUrls = getSpecificUrls(searchTerm);
  urls.push(...specificUrls);

  // TripAdvisor - multiple approaches
  urls.push(
    `https://www.tripadvisor.com/Search?q=${encodedTerm}`,
    `https://www.tripadvisor.com/Attractions-g293974-Activities-Istanbul.html#KEYWORD=${encodedTerm}`
  );

  // GetYourGuide
  urls.push(
    `https://www.getyourguide.com/s/?q=${encodedTerm}`,
    `https://www.getyourguide.com/istanbul-l39/?q=${encodedTerm}`
  );

  // Viator
  urls.push(
    `https://www.viator.com/searchResults/all?text=${encodedTerm}`,
    `https://www.viator.com/Istanbul-tours/d585?text=${encodedTerm}`
  );

  // Category-specific sources
  if (category === 'activities') {
    urls.push(
      `https://www.getyourguide.com/istanbul-l39/activities-c1/?q=${encodedTerm}`,
      `https://www.klook.com/en-GB/search/activities?query=${encodedTerm}`
    );
  } else if (category === 'restaurants') {
    urls.push(
      `https://www.tripadvisor.com/Restaurants-g293974-Istanbul.html#KEYWORD=${encodedTerm}`,
      `https://www.opentable.com/istanbul-restaurant-listings?query=${encodedTerm}`
    );
  } else if (category === 'hotels') {
    urls.push(
      `https://www.booking.com/searchresults.html?ss=${encodedTerm}`,
      `https://www.hotels.com/search.do?destination=${encodedTerm}`
    );
  }

  // Official tourism sources
  urls.push(
    `https://www.go-turkey.com/search?q=${encodedTerm}`,
    `https://istanbul-tourist-information.com/search?q=${encodeURIComponent(searchTerm)}`
  );

  return urls.slice(0, 8); // Limit to 8 sources to manage credits
}

// Get specific URLs for well-known attractions
function getSpecificUrls(searchTerm: string): string[] {
  const term = searchTerm.toLowerCase();
  const urls: string[] = [];

  const attractionMappings: { [key: string]: string[] } = {
    'blue mosque': [
      'https://www.getyourguide.com/istanbul-l39/blue-mosque-skip-the-line-guided-tour-t33648/',
      'https://www.viator.com/tours/Istanbul/Istanbul-Blue-Mosque-Hagia-Sophia-and-Topkapi-Palace-Small-Group-Tour/d585-2305BLUMOSQ',
      'https://www.tripadvisor.com/Attraction_Review-g293974-d294452-Reviews-Blue_Mosque-Istanbul.html',
      'https://istanbul-tourist-information.com/blue-mosque-istanbul'
    ],
    'hagia sophia': [
      'https://www.getyourguide.com/istanbul-l39/hagia-sophia-skip-the-line-ticket-with-audio-guide-t33649/',
      'https://www.viator.com/tours/Istanbul/Hagia-Sophia-Skip-the-Line-Guided-Tour/d585-7224HAGIA',
      'https://www.tripadvisor.com/Attraction_Review-g293974-d294453-Reviews-Hagia_Sophia_Museum-Istanbul.html',
      'https://love-istanbul.com/hagia-sophia-istanbul'
    ],
    'galata tower': [
      'https://www.getyourguide.com/istanbul-l39/galata-tower-skip-the-line-entrance-ticket-t195462/',
      'https://www.viator.com/tours/Istanbul/Galata-Tower-Skip-the-Line-Ticket/d585-5449GALATA',
      'https://www.tripadvisor.com/Attraction_Review-g293974-d294456-Reviews-Galata_Tower-Istanbul.html'
    ],
    'topkapi palace': [
      'https://www.getyourguide.com/istanbul-l39/topkapi-palace-skip-the-line-ticket-and-audio-guide-t33650/',
      'https://www.viator.com/tours/Istanbul/Topkapi-Palace-Skip-the-Line-Ticket-with-Audio-Guide/d585-3770TOPKAPI',
      'https://www.tripadvisor.com/Attraction_Review-g293974-d294454-Reviews-Topkapi_Palace-Istanbul.html'
    ],
    'grand bazaar': [
      'https://www.getyourguide.com/istanbul-l39/grand-bazaar-guided-tour-t33651/',
      'https://www.viator.com/tours/Istanbul/Grand-Bazaar-Shopping-Tour-with-Local-Guide/d585-6623GRAND',
      'https://www.tripadvisor.com/Attraction_Review-g293974-d294455-Reviews-Grand_Bazaar-Istanbul.html'
    ],
    'basilica cistern': [
      'https://www.getyourguide.com/istanbul-l39/basilica-cistern-skip-the-line-entrance-ticket-t34567/',
      'https://www.viator.com/tours/Istanbul/Basilica-Cistern-Skip-the-Line-Ticket/d585-8834BASILICA',
      'https://www.tripadvisor.com/Attraction_Review-g293974-d294457-Reviews-Basilica_Cistern-Istanbul.html'
    ],
    'dolmabahce palace': [
      'https://www.getyourguide.com/istanbul-l39/dolmabahce-palace-skip-the-line-guided-tour-t45123/',
      'https://www.viator.com/tours/Istanbul/Dolmabahce-Palace-Guided-Tour/d585-9945DOLMA',
      'https://www.tripadvisor.com/Attraction_Review-g293974-d294458-Reviews-Dolmabahce_Palace-Istanbul.html'
    ],
    'bosphorus cruise': [
      'https://www.getyourguide.com/istanbul-l39/bosphorus-cruise-with-audio-guide-t56789/',
      'https://www.viator.com/tours/Istanbul/Bosphorus-Sunset-Cruise-with-Audio-Guide/d585-7756BOSPH',
      'https://www.tripadvisor.com/Attraction_Review-g293974-d1234567-Reviews-Bosphorus_Cruise-Istanbul.html'
    ]
  };

  for (const [attraction, urlList] of Object.entries(attractionMappings)) {
    if (term.includes(attraction)) {
      urls.push(...urlList);
      break;
    }
  }

  return urls;
}

// Scrape a single URL with Firecrawl
async function scrapeWithFirecrawl(url: string): Promise<any | null> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        includeTags: ['title', 'meta', 'img', 'p', 'h1', 'h2', 'h3', 'span', 'div'],
        excludeTags: ['nav', 'footer', 'header', 'script', 'style', 'aside'],
        waitFor: 3000,
        timeout: 30000,
        onlyMainContent: true
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      return null;
    }

    return {
      title: data.data.metadata?.title || '',
      description: data.data.metadata?.description || '',
      content: data.data.markdown || '',
      images: extractImages(data.data),
      sourceUrl: url
    };

  } catch (error) {
    console.error(`Firecrawl error for ${url}:`, error);
    return null;
  }
}

// Extract up to 15 high-quality images
function extractImages(data: any): string[] {
  const images: string[] = [];

  // Extract from metadata
  if (data?.metadata?.ogImage) {
    images.push(data.metadata.ogImage);
  }

  // Extract from screenshots if available
  if (data?.screenshot) {
    images.push(data.screenshot);
  }

  // Extract from HTML content with multiple patterns
  if (data?.html) {
    // Standard img tags
    const imgRegex = /<img[^>]+src=["']([^"'>]+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(data.html)) !== null) {
      const imgUrl = match[1];
      if (isValidImageUrl(imgUrl) && isHighQualityImage(imgUrl)) {
        images.push(imgUrl);
      }
    }

    // Background images from style attributes
    const bgRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
    while ((match = bgRegex.exec(data.html)) !== null) {
      const imgUrl = match[1];
      if (isValidImageUrl(imgUrl) && isHighQualityImage(imgUrl)) {
        images.push(imgUrl);
      }
    }

    // Data-src attributes (lazy loading)
    const dataSrcRegex = /<img[^>]+data-src=["']([^"'>]+)["'][^>]*>/gi;
    while ((match = dataSrcRegex.exec(data.html)) !== null) {
      const imgUrl = match[1];
      if (isValidImageUrl(imgUrl) && isHighQualityImage(imgUrl)) {
        images.push(imgUrl);
      }
    }

    // Picture source tags
    const pictureRegex = /<source[^>]+srcset=["']([^"'>]+)["'][^>]*>/gi;
    while ((match = pictureRegex.exec(data.html)) !== null) {
      const srcset = match[1];
      const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
      urls.forEach(url => {
        if (isValidImageUrl(url) && isHighQualityImage(url)) {
          images.push(url);
        }
      });
    }
  }

  // Extract from links (JSON-LD, etc.)
  if (data?.links) {
    data.links.forEach((link: any) => {
      if (link.href && isValidImageUrl(link.href) && isHighQualityImage(link.href)) {
        images.push(link.href);
      }
    });
  }

  // Return unique, high-quality images (up to 15)
  return [...new Set(images)]
    .filter(img => isValidImageUrl(img) && isHighQualityImage(img))
    .slice(0, 15);
}

function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|webp|avif)$/i.test(url) && !url.includes('data:');
  } catch {
    return false;
  }
}

function isHighQualityImage(url: string): boolean {
  const lowQualityPatterns = [
    'icon', 'logo', 'avatar', 'thumb', 'small', 'tiny', 'placeholder',
    'ad', 'banner', 'widget', 'button', 'sprite', '1x1', 'tracking'
  ];

  const urlLower = url.toLowerCase();
  return !lowQualityPatterns.some(pattern => urlLower.includes(pattern));
}

// Process and combine scraped data from multiple sources
async function processScrapedData(scrapedData: any[], searchTerm: string, category: string, imagesPerItem: number): Promise<any> {
  // Combine all content
  const allContent = scrapedData.map(d => d.content).join('\n\n');
  const allImages = scrapedData.flatMap(d => d.images);
  const titles = scrapedData.map(d => d.title).filter(Boolean);
  const descriptions = scrapedData.map(d => d.description).filter(Boolean);

  // Extract structured information
  const processed = {
    title: getBestTitle(titles, searchTerm),
    description: getBestDescription(descriptions, allContent),
    content: allContent.substring(0, 3000), // Limit content size
    images: [...new Set(allImages)].slice(0, imagesPerItem),
    price_range: extractPriceRange(allContent),
    duration: extractDuration(allContent),
    rating: extractRating(allContent),
    review_count: extractReviewCount(allContent),
    highlights: extractHighlights(allContent),
    confidence_score: calculateConfidenceScore(scrapedData, allContent)
  };

  return processed;
}

function getBestTitle(titles: string[], searchTerm: string): string {
  if (titles.length === 0) return searchTerm;

  // Find the cleanest title (remove site names, etc.)
  return titles[0]
    .replace(/\s*-\s*(TripAdvisor|GetYourGuide|Viator).*$/i, '')
    .replace(/\s*\|\s*.*$/i, '')
    .trim() || searchTerm;
}

function getBestDescription(descriptions: string[], content: string): string {
  // Clean and filter descriptions
  const cleanDescriptions = descriptions
    .map(desc => cleanText(desc))
    .filter(desc => desc.length > 50 && desc.length < 1000)
    .filter(desc => !desc.includes('404') && !desc.includes('Page not found'))
    .filter(desc => !desc.includes('svg') && !desc.includes('xml'))
    .filter(desc => desc.split(' ').length > 8); // Must have at least 8 words

  if (cleanDescriptions.length > 0) {
    return cleanDescriptions[0].substring(0, 500);
  }

  // Extract meaningful paragraphs from content
  const cleanContent = cleanText(content);
  const paragraphs = cleanContent.split(/\n\n+/).filter(p => p.trim().length > 100);

  for (const paragraph of paragraphs) {
    const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 50);
    if (sentences.length > 0) {
      const desc = sentences[0].trim();
      if (desc.length > 50 && !desc.includes('404') && !desc.includes('svg')) {
        return desc.substring(0, 500);
      }
    }
  }

  return '';
}

function cleanText(text: string): string {
  if (!text) return '';

  return text
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s.,!?()-]/g, '') // Remove special characters except punctuation
    .trim();
}

function extractPriceRange(content: string): string {
  const priceMatch = content.match(/(?:€|₺|TL|USD?|£)\s*\d+(?:[-–]\d+)?/i);
  return priceMatch?.[0] || '';
}

function extractDuration(content: string): string {
  const durationMatch = content.match(/(\d+(?:[-–]\d+)?)\s*(?:hours?|hrs?|minutes?|mins?|days?)/i);
  return durationMatch?.[0] || '';
}

function extractRating(content: string): number {
  const ratingMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*5|stars?|rating)/i);
  return ratingMatch ? parseFloat(ratingMatch[1]) : 0;
}

function extractReviewCount(content: string): number {
  const reviewMatch = content.match(/(\d+(?:,\d+)*)\s*reviews?/i);
  return reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 0;
}

function extractHighlights(content: string): string[] {
  const highlights: string[] = [];

  // Remove HTML tags and clean content
  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Pattern 1: Bullet points
  const bulletPoints = cleanContent.match(/[•·*-]\s*([^.\n]{10,80})/g);
  if (bulletPoints) {
    highlights.push(...bulletPoints.map(h => h.replace(/^[•·*-]\s*/, '').trim()));
  }

  // Pattern 2: Numbered lists
  const numberedList = cleanContent.match(/\d+\.\s*([^.\n]{10,80})/g);
  if (numberedList) {
    highlights.push(...numberedList.map(h => h.replace(/^\d+\.\s*/, '').trim()));
  }

  // Pattern 3: Common highlight phrases
  const highlightPhrases = [
    /(?:includes?|features?|offers?)[:\s]+([^.\n]{10,80})/gi,
    /(?:highlights?|attractions?)[:\s]+([^.\n]{10,80})/gi,
    /(?:visit|see|experience)[:\s]+([^.\n]{10,80})/gi
  ];

  highlightPhrases.forEach(pattern => {
    const matches = cleanContent.match(pattern);
    if (matches) {
      highlights.push(...matches.map(m => m.replace(pattern, '$1').trim()));
    }
  });

  // Filter out low-quality highlights
  const filtered = highlights
    .filter(h => h.length > 10 && h.length < 100)
    .filter(h => !h.includes('http'))
    .filter(h => !h.includes('svg'))
    .filter(h => !h.includes('xml'))
    .filter(h => !/^\d+$/.test(h))
    .filter(h => h.includes(' ')) // Must contain at least one space (real sentence)
    .slice(0, 8);

  return [...new Set(filtered)]; // Remove duplicates
}

function calculateConfidenceScore(scrapedData: any[], content: string): number {
  let score = 0;

  // Multiple sources boost confidence
  score += Math.min(scrapedData.length * 15, 60);

  // Content quality indicators
  if (content.length > 500) score += 15;
  if (content.toLowerCase().includes('istanbul')) score += 10;
  if (content.includes('rating') || content.includes('review')) score += 10;
  if (content.match(/€|₺|TL|USD/)) score += 5;

  return Math.min(score, 100);
}

// Check for duplicates
async function checkDuplicate(title: string, category: string): Promise<boolean> {
  const { data } = await supabase
    .from('staging_queue')
    .select('id')
    .eq('category', category)
    .ilike('title', `%${title.substring(0, 20)}%`)
    .limit(1);

  return !!(data && data.length > 0);
}