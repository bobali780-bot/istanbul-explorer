import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface HybridScrapingJob {
  searchTerms: string[];
  category: string;
  imagesPerItem: number;
  maxResults?: number;
}

interface StructuredActivityData {
  title: string;
  description: string;
  rating: number;
  review_count: number;
  price_range: string;
  duration: string;
  location: string;
  website_url: string;
  phone: string;
  address: string;
  coordinates: { lat: number; lng: number };
  opening_hours: string[];
  types: string[];
  photos: string[];
  confidence_score: number;
  sources: string[];
}

export async function POST(request: Request) {
  try {
    const { searchTerms, category = 'activities', imagesPerItem = 12, maxResults = 100 }: HybridScrapingJob = await request.json();

    if (!searchTerms || searchTerms.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Search terms are required'
      }, { status: 400 });
    }

    console.log(`Starting hybrid scraping for ${searchTerms.length} terms in category: ${category}`);

    // Create scraping job record
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        job_type: 'hybrid_api_enrichment',
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

    const results: any[] = [];
    const errors: string[] = [];
    let processedCount = 0;
    let successCount = 0;
    let creditsUsed = 0;

    // Process each search term using hybrid approach
    for (const searchTerm of searchTerms) {
      try {
        console.log(`Processing: ${searchTerm} (${processedCount + 1}/${searchTerms.length})`);

        // Step 1: Get structured data from APIs
        const structuredData = await getStructuredData(searchTerm, category);

        if (!structuredData || !validateContent(structuredData, searchTerm)) {
          errors.push(`No valid structured data found for: ${searchTerm}`);
          processedCount++;
          continue;
        }

        // Step 2: Enrich with Firecrawl on official pages
        const enrichedData = await enrichWithFirecrawl(structuredData);
        creditsUsed += enrichedData.creditsUsed || 0;

        // Step 3: Get additional images from stock APIs if needed
        if (structuredData.photos.length < imagesPerItem) {
          const additionalImages = await getStockImages(searchTerm, imagesPerItem - structuredData.photos.length);
          structuredData.photos.push(...additionalImages);
        }

        // Step 4: Check for duplicates
        const isDuplicate = await checkDuplicate(structuredData.title, category);
        if (isDuplicate) {
          errors.push(`Duplicate found for: ${searchTerm}`);
          processedCount++;
          continue;
        }

        // Step 5: Insert into staging with enriched data
        const stagingItem = await createStagingItem(structuredData, enrichedData, job.id);

        if (stagingItem) {
          results.push({
            id: stagingItem.id,
            title: stagingItem.title,
            confidence_score: stagingItem.confidence_score,
            images_count: stagingItem.image_count,
            sources_used: structuredData.sources.length,
            apis_used: structuredData.sources.filter(s => s.includes('api')).length,
            firecrawl_enriched: enrichedData.success || false
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
    console.error('Hybrid scraping error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get structured data from Google Places API
async function getStructuredData(searchTerm: string, category: string): Promise<StructuredActivityData | null> {
  try {
    console.log(`  Getting structured data for: ${searchTerm}`);

    // Use real Google Places API if available, otherwise fall back to mock data
    const placesData = process.env.GOOGLE_PLACES_API_KEY
      ? await callGooglePlacesAPI(searchTerm, category)
      : await simulateGooglePlacesAPI(searchTerm, category);

    if (!placesData) {
      return null;
    }

    return {
      title: placesData.name,
      description: placesData.description || `Experience ${placesData.name} in Istanbul, Turkey.`,
      rating: placesData.rating || 0,
      review_count: placesData.user_ratings_total || 0,
      price_range: placesData.price_level ? `${'$'.repeat(placesData.price_level)}` : '',
      duration: estimateDuration(category),
      location: placesData.formatted_address || 'Istanbul, Turkey',
      website_url: placesData.website || '',
      phone: placesData.formatted_phone_number || '',
      address: placesData.formatted_address || '',
      coordinates: placesData.geometry?.location || { lat: 41.0082, lng: 28.9784 },
      opening_hours: placesData.opening_hours?.weekday_text || [],
      types: placesData.types || [],
      photos: placesData.photos || [],
      confidence_score: calculatePlacesConfidence(placesData, searchTerm),
      sources: [process.env.GOOGLE_PLACES_API_KEY ? 'google_places_api' : 'simulated_data']
    };

  } catch (error) {
    console.error(`Error getting structured data for ${searchTerm}:`, error);
    return null;
  }
}

// Real Google Places API call
async function callGooglePlacesAPI(searchTerm: string, category: string): Promise<any> {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // First, search for the place
    const query = `${searchTerm} Istanbul Turkey`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      console.log(`No places found for: ${searchTerm}`);
      return null;
    }

    const place = searchData.results[0];

    // Get detailed information using place_id
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,rating,user_ratings_total,price_level,website,formatted_phone_number,opening_hours,types,photos&key=${apiKey}`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsData.result) {
      console.log(`No details found for place_id: ${place.place_id}`);
      return null;
    }

    const result = detailsData.result;

    // Process photos to get URLs
    const photos: string[] = [];
    if (result.photos) {
      for (const photo of result.photos.slice(0, 5)) {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`;
        photos.push(photoUrl);
      }
    }

    return {
      name: result.name,
      description: `${result.name} in ${result.formatted_address}`,
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      price_level: result.price_level,
      formatted_address: result.formatted_address,
      website: result.website,
      formatted_phone_number: result.formatted_phone_number,
      geometry: result.geometry,
      opening_hours: result.opening_hours,
      types: result.types,
      photos: photos
    };

  } catch (error) {
    console.error('Google Places API error:', error);
    return null;
  }
}

// Simulate Google Places API (fallback when no API key)
async function simulateGooglePlacesAPI(searchTerm: string, category: string): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const mockData = {
    'blue mosque': {
      name: 'Blue Mosque (Sultan Ahmed Mosque)',
      description: 'Historic mosque built in the early 17th century, famous for its blue tiles and six minarets.',
      rating: 4.5,
      user_ratings_total: 45678,
      price_level: 0, // Free
      formatted_address: 'Sultanahmet, Atmeydanı Cd. No:7, 34122 Fatih/İstanbul, Turkey',
      website: 'https://www.sultanahmetcamii.org/',
      formatted_phone_number: '+90 212 458 4468',
      geometry: { location: { lat: 41.0054, lng: 28.9768 } },
      opening_hours: {
        weekday_text: [
          'Monday: 8:30 AM – 6:00 PM',
          'Tuesday: 8:30 AM – 6:00 PM',
          'Wednesday: 8:30 AM – 6:00 PM',
          'Thursday: 8:30 AM – 6:00 PM',
          'Friday: 8:30 AM – 6:00 PM',
          'Saturday: 8:30 AM – 6:00 PM',
          'Sunday: 8:30 AM – 6:00 PM'
        ]
      },
      types: ['mosque', 'tourist_attraction', 'place_of_worship'],
      photos: [
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
      ]
    },
    'hagia sophia': {
      name: 'Hagia Sophia',
      description: 'Former Byzantine cathedral and Ottoman mosque, now a museum showcasing both Christian and Islamic heritage.',
      rating: 4.6,
      user_ratings_total: 67890,
      price_level: 1,
      formatted_address: 'Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul, Turkey',
      website: 'https://ayasofyacamii.gov.tr/',
      geometry: { location: { lat: 41.0086, lng: 28.9802 } },
      types: ['museum', 'tourist_attraction', 'mosque'],
      photos: [
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800'
      ]
    },
    'galata tower': {
      name: 'Galata Tower',
      description: 'Medieval stone tower offering panoramic views of Istanbul and the Bosphorus.',
      rating: 4.4,
      user_ratings_total: 23456,
      price_level: 2,
      formatted_address: 'Bereketzade, Galata Kulesi Sk., 34421 Beyoğlu/İstanbul, Turkey',
      website: 'https://galatatower.com/',
      geometry: { location: { lat: 41.0256, lng: 28.9744 } },
      types: ['tourist_attraction', 'historical_landmark'],
      photos: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
      ]
    }
  };

  const key = searchTerm.toLowerCase();
  return mockData[key as keyof typeof mockData] || null;
}

// Enrich structured data with Firecrawl on official pages
async function enrichWithFirecrawl(structuredData: StructuredActivityData): Promise<any> {
  if (!process.env.FIRECRAWL_API_KEY || !structuredData.website_url) {
    return { success: false, creditsUsed: 0 };
  }

  try {
    console.log(`  Enriching with Firecrawl: ${structuredData.website_url}`);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: structuredData.website_url,
        formats: ['markdown'],
        includeTags: ['title', 'meta', 'img', 'p', 'h1', 'h2', 'h3', 'li'],
        excludeTags: ['nav', 'footer', 'header', 'script', 'style', 'aside'],
        waitFor: 3000,
        timeout: 20000,
        onlyMainContent: true
      })
    });

    if (!response.ok) {
      return { success: false, creditsUsed: 1 };
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      return { success: false, creditsUsed: 1 };
    }

    // Extract additional images from the official page
    const additionalImages = extractImagesFromFirecrawl(data.data);

    // Extract highlights and additional details
    const highlights = extractHighlightsFromFirecrawl(data.data.markdown || '');
    const additionalInfo = extractAdditionalInfo(data.data.markdown || '');

    return {
      success: true,
      creditsUsed: 1,
      additional_images: additionalImages,
      highlights: highlights,
      additional_info: additionalInfo,
      enriched_content: data.data.markdown?.substring(0, 2000) || ''
    };

  } catch (error) {
    console.error('Firecrawl enrichment error:', error);
    return { success: false, creditsUsed: 1 };
  }
}

// Get stock images from Unsplash API
async function getStockImages(searchTerm: string, count: number): Promise<string[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    console.log('UNSPLASH_ACCESS_KEY not found in environment variables, using placeholder images');
    return Array(count).fill(0).map((_, i) =>
      `https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop&auto=format&q=80&sig=${i}`
    );
  }

  try {
    const query = `${searchTerm} istanbul turkey`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Unsplash API error');
    }

    const data = await response.json();
    return data.results?.map((photo: any) => photo.urls.regular) || [];

  } catch (error) {
    console.error('Error fetching stock images:', error);
    // Return placeholder images as fallback
    return Array(count).fill(0).map((_, i) =>
      `https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop&auto=format&q=80&sig=${i}`
    );
  }
}

// Validation logic to ensure content relevance
function validateContent(data: StructuredActivityData, searchTerm: string): boolean {
  const titleLower = data.title.toLowerCase();
  const searchLower = searchTerm.toLowerCase();

  // Must contain the search term or be a close match
  const containsSearchTerm = titleLower.includes(searchLower) ||
                            searchLower.includes(titleLower.split(' ')[0]);

  // Must be in Istanbul
  const isInIstanbul = data.location.toLowerCase().includes('istanbul') ||
                       data.address.toLowerCase().includes('istanbul');

  // Must have basic required fields
  const hasRequiredFields = data.title.length > 3 &&
                           data.description.length > 20;

  // Reject obvious mismatches
  const isNotMismatch = !titleLower.includes('lisbon') &&
                       !titleLower.includes('madrid') &&
                       !titleLower.includes('paris');

  return containsSearchTerm && isInIstanbul && hasRequiredFields && isNotMismatch;
}

// Helper functions
function calculatePlacesConfidence(placesData: any, searchTerm: string): number {
  let score = 60; // Base score for API data

  if (placesData.rating > 4.0) score += 15;
  if (placesData.user_ratings_total > 1000) score += 10;
  if (placesData.website) score += 10;
  if (placesData.photos && placesData.photos.length > 0) score += 5;

  return Math.min(score, 100);
}

function estimateDuration(category: string): string {
  const durations = {
    activities: '2-3 hours',
    restaurants: '1-2 hours',
    hotels: 'Overnight',
    shopping: '1-3 hours'
  };
  return durations[category as keyof typeof durations] || '2-3 hours';
}

function extractImagesFromFirecrawl(data: any): string[] {
  const images: string[] = [];

  if (data?.html) {
    const imgRegex = /<img[^>]+src=["']([^"'>]+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(data.html)) !== null) {
      const imgUrl = match[1];
      if (isValidImageUrl(imgUrl)) {
        images.push(imgUrl);
      }
    }
  }

  return [...new Set(images)].slice(0, 10);
}

function extractHighlightsFromFirecrawl(markdown: string): string[] {
  const highlights: string[] = [];

  // Extract bullet points
  const bulletRegex = /^[•·*-]\s+(.+)$/gm;
  let match;
  while ((match = bulletRegex.exec(markdown)) !== null) {
    highlights.push(match[1].trim());
  }

  return highlights.slice(0, 8);
}

function extractAdditionalInfo(markdown: string): any {
  return {
    tips: extractTips(markdown),
    cultural_context: extractCulturalContext(markdown),
    best_time_to_visit: extractBestTime(markdown)
  };
}

function extractTips(content: string): string[] {
  const tipPatterns = [
    /tip[s]?[:\s]+([^.\n]{20,100})/gi,
    /advice[:\s]+([^.\n]{20,100})/gi,
    /remember[:\s]+([^.\n]{20,100})/gi
  ];

  const tips: string[] = [];
  tipPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      tips.push(match[1].trim());
    }
  });

  return tips.slice(0, 5);
}

function extractCulturalContext(content: string): string {
  const contextPatterns = [
    /built in (\d{4})/i,
    /constructed in (\d{4})/i,
    /dating back to (\d{4})/i,
    /history[:\s]+([^.\n]{30,200})/gi
  ];

  for (const pattern of contextPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return '';
}

function extractBestTime(content: string): string {
  const timePatterns = [
    /best time[:\s]+([^.\n]{20,100})/gi,
    /visit[:\s]+([^.\n]{20,100})/gi
  ];

  for (const pattern of timePatterns) {
    const match = content.match(pattern);
    if (match && match[1].toLowerCase().includes('time')) {
      return match[1].trim();
    }
  }

  return '';
}

function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|webp|avif)$/i.test(url) && !url.includes('data:');
  } catch {
    return false;
  }
}

async function createStagingItem(structuredData: StructuredActivityData, enrichedData: any, jobId: string): Promise<any> {
  try {
    const allImages = [
      ...structuredData.photos,
      ...(enrichedData.additional_images || [])
    ].filter(Boolean);

    const { data: stagingItem, error } = await supabase
      .from('staging_queue')
      .insert({
        title: structuredData.title,
        category: 'activities',
        primary_image: allImages[0] || null,
        images: allImages.slice(0, 15),
        image_count: allImages.length,
        raw_content: {
          description: structuredData.description,
          content: enrichedData.enriched_content || '',
          price_range: structuredData.price_range,
          duration: structuredData.duration,
          rating: structuredData.rating,
          review_count: structuredData.review_count,
          highlights: enrichedData.highlights || [],
          location: structuredData.location,
          address: structuredData.address,
          website_url: structuredData.website_url,
          phone: structuredData.phone,
          coordinates: structuredData.coordinates,
          opening_hours: structuredData.opening_hours,
          types: structuredData.types,
          additional_info: enrichedData.additional_info || {},
          api_sources: structuredData.sources,
          firecrawl_enriched: enrichedData.success
        },
        confidence_score: structuredData.confidence_score,
        source_urls: [structuredData.website_url].filter(Boolean),
        scraping_job_id: jobId,
        has_description: structuredData.description.length > 50,
        has_price: structuredData.price_range.length > 0,
        has_location: true,
        has_rating: structuredData.rating > 0
      })
      .select()
      .single();

    if (error) throw error;
    return stagingItem;

  } catch (error) {
    console.error('Error creating staging item:', error);
    return null;
  }
}

async function checkDuplicate(title: string, category: string): Promise<boolean> {
  const { data } = await supabase
    .from('staging_queue')
    .select('id')
    .eq('category', category)
    .ilike('title', `%${title.substring(0, 20)}%`)
    .limit(1);

  return !!(data && data.length > 0);
}