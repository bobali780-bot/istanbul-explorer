import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { searchTerm, category = 'activities' } = await request.json();

    if (!searchTerm) {
      return NextResponse.json({
        success: false,
        error: 'Search term is required'
      }, { status: 400 });
    }

    console.log(`Testing Firecrawl scraping for: ${searchTerm}`);

    // Create scraping job record
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        job_type: 'test_scrape',
        category: category,
        input_data: { search_terms: [searchTerm] },
        status: 'running',
        total_items: 1,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    // Check if Firecrawl API key is available
    if (!process.env.FIRECRAWL_API_KEY) {
      await supabase
        .from('scraping_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_log: { errors: ['FIRECRAWL_API_KEY not found in environment'] }
        })
        .eq('id', job.id);

      return NextResponse.json({
        success: false,
        error: 'Firecrawl API key not configured. Please add FIRECRAWL_API_KEY to your .env.local file.',
        job_id: job.id,
        next_step: 'Add your Firecrawl API key to continue with real scraping'
      });
    }

    // Try multiple sources until one works
    const testUrls = [
      // Try static pages for popular attractions first (most reliable)
      ...(searchTerm.toLowerCase().includes('blue mosque') ? [
        'https://www.getyourguide.com/istanbul-l39/blue-mosque-t33648/',
        'https://istanbul-tourist-information.com/blue-mosque'
      ] : []),
      ...(searchTerm.toLowerCase().includes('hagia sophia') ? [
        'https://www.getyourguide.com/istanbul-l39/hagia-sophia-t33649/',
        'https://istanbul-tourist-information.com/hagia-sophia'
      ] : []),
      ...(searchTerm.toLowerCase().includes('galata tower') ? [
        'https://www.getyourguide.com/istanbul-l39/galata-tower-t195462/',
        'https://istanbul-tourist-information.com/galata-tower'
      ] : []),

      // Try official tourism sites
      `https://www.go-turkey.com/search?q=${encodeURIComponent(searchTerm + ' istanbul')}`,
      `https://www.getyourguide.com/s/?q=${encodeURIComponent(searchTerm + ' istanbul')}`,

      // Fallback to travel sites
      `https://www.viator.com/searchResults/all?text=${encodeURIComponent(searchTerm + ' istanbul')}`,
      `https://www.tripadvisor.com/Search?q=${encodeURIComponent(searchTerm + ' istanbul')}`
    ];

    let firecrawlData = null;
    let successfulUrl = '';
    let lastError = '';

    for (const testUrl of testUrls) {
      try {
        console.log(`Trying to scrape: ${testUrl}`);

        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: testUrl,
            formats: ['markdown'],
            includeTags: ['title', 'meta', 'img', 'p', 'h1', 'h2', 'h3', 'span'],
            excludeTags: ['nav', 'footer', 'header', 'script', 'style'],
            waitFor: 3000,
            timeout: 30000,
            onlyMainContent: true
          })
        });

        if (firecrawlResponse.ok) {
          const data = await firecrawlResponse.json();
          if (data.success && data.data) {
            firecrawlData = data;
            successfulUrl = testUrl;
            console.log(`Successfully scraped: ${testUrl}`);
            break;
          }
        }

        const errorData = await firecrawlResponse.text();
        lastError = `${firecrawlResponse.status}: ${errorData}`;
        console.log(`Failed to scrape ${testUrl}: ${lastError}`);

      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Unknown error';
        console.log(`Error scraping ${testUrl}: ${lastError}`);
        continue;
      }
    }

    if (!firecrawlData) {
      throw new Error(`All sources failed. Last error: ${lastError}`);
    }

    // Extract basic info from scraped data
    const extractedData = {
      title: firecrawlData.data?.metadata?.title || searchTerm,
      description: firecrawlData.data?.metadata?.description || '',
      content: firecrawlData.data?.markdown || firecrawlData.data?.html || '',
      images: extractImages(firecrawlData.data),
      sourceUrl: successfulUrl
    };

    // Insert into staging table
    const { data: stagingItem, error: stagingError } = await supabase
      .from('staging_queue')
      .insert({
        title: extractedData.title,
        category: category,
        primary_image: extractedData.images[0] || null,
        images: extractedData.images,
        image_count: extractedData.images.length,
        raw_content: {
          description: extractedData.description,
          content: extractedData.content.substring(0, 5000), // Limit content size
          source_url: extractedData.sourceUrl,
          scraped_at: new Date().toISOString()
        },
        processed_content: {
          // We'll populate this later with structured data
        },
        confidence_score: calculateConfidenceScore(extractedData),
        source_urls: [extractedData.sourceUrl],
        scraping_job_id: job.id,
        has_description: extractedData.description.length > 0,
        has_location: extractedData.content.toLowerCase().includes('istanbul'),
        has_rating: extractedData.content.includes('rating') || extractedData.content.includes('star')
      })
      .select()
      .single();

    if (stagingError) {
      throw stagingError;
    }

    // Update job as completed
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        processed_items: 1,
        successful_items: 1,
        staging_ids: [stagingItem.id],
        credits_used: 1 // Estimate
      })
      .eq('id', job.id);

    return NextResponse.json({
      success: true,
      message: 'Test scraping completed successfully!',
      job_id: job.id,
      staging_item: {
        id: stagingItem.id,
        title: stagingItem.title,
        category: stagingItem.category,
        confidence_score: stagingItem.confidence_score,
        images_found: stagingItem.image_count,
        has_description: stagingItem.has_description,
        has_location: stagingItem.has_location,
        created_at: stagingItem.created_at
      },
      firecrawl_credits_used: 1,
      next_step: 'Check the staging queue to review the scraped data'
    });

  } catch (error) {
    console.error('Scrape test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to extract images from Firecrawl response
function extractImages(data: any): string[] {
  const images: string[] = [];

  // Extract from metadata
  if (data?.metadata?.ogImage) {
    images.push(data.metadata.ogImage);
  }

  // Extract from HTML content if available
  if (data?.html) {
    const imgRegex = /<img[^>]+src="([^">]+)"/gi;
    let match;
    while ((match = imgRegex.exec(data.html)) !== null) {
      const imgUrl = match[1];
      if (isValidImageUrl(imgUrl)) {
        images.push(imgUrl);
      }
    }
  }

  // Return unique, high-quality images
  return [...new Set(images)]
    .filter(img => isHighQualityImage(img))
    .slice(0, 5); // Limit to 5 for testing
}

function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|webp|avif)$/i.test(url);
  } catch {
    return false;
  }
}

function isHighQualityImage(url: string): boolean {
  const lowQualityPatterns = [
    'icon', 'logo', 'avatar', 'thumb', 'small', 'tiny',
    'ad', 'banner', 'widget', 'button', 'sprite'
  ];

  const urlLower = url.toLowerCase();
  return !lowQualityPatterns.some(pattern => urlLower.includes(pattern));
}

function calculateConfidenceScore(data: any): number {
  let score = 0;
  if (data.title.length > 0) score += 25;
  if (data.description.length > 0) score += 25;
  if (data.content.length > 500) score += 25;
  if (data.images.length > 0) score += 25;
  return Math.min(score, 100);
}