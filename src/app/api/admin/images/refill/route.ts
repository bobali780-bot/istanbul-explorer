import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Advanced image deduplication function (copied from hybrid scraping)
function advancedImageDeduplication(urls: string[]): string[] {
  const seen = new Set<string>();
  const filenameHashes = new Set<string>();
  const deduplicated: string[] = [];

  for (const url of urls) {
    if (!url || typeof url !== 'string') continue;

    try {
      // Normalize URL by removing query parameters and converting to lowercase
      const normalizedUrl = url.split('?')[0].toLowerCase();

      // Extract filename for additional duplicate detection
      const filename = normalizedUrl.split('/').pop() || '';
      const filenameParts = filename.split('.');
      const baseFilename = filenameParts.length > 1 ? filenameParts.slice(0, -1).join('.') : filename;

      // Create a simple hash of the filename for variant detection
      const filenameHash = baseFilename.replace(/[-_\d+]/g, ''); // Remove numbers, hyphens, underscores

      // Skip if we've seen this exact URL or filename variant
      if (seen.has(normalizedUrl) ||
          (filenameHash.length > 5 && filenameHashes.has(filenameHash))) {
        continue;
      }

      seen.add(normalizedUrl);
      if (filenameHash.length > 5) {
        filenameHashes.add(filenameHash);
      }
      deduplicated.push(url);

    } catch (error) {
      console.warn(`Error processing URL for deduplication: ${url}`, error);
      // If URL parsing fails, still include it but check for exact duplicates
      if (!seen.has(url)) {
        seen.add(url);
        deduplicated.push(url);
      }
    }
  }

  return deduplicated;
}

// Get images from Unsplash API
async function getUnsplashImages(query: string, count: number): Promise<string[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) return [];

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape&order_by=relevant&content_filter=high`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const photos = data.results?.map((photo: any) => photo.urls.regular) || [];
      return photos.slice(0, count);
    }
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
  }

  return [];
}

// Get images from Pexels API
async function getPexelsImages(query: string, count: number): Promise<string[]> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) return [];

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`,
      {
        headers: {
          'Authorization': pexelsKey
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const photos = data.photos?.map((photo: any) => photo.src.large) || [];
      return photos.slice(0, count);
    }
  } catch (error) {
    console.error('Error fetching Pexels images:', error);
  }

  return [];
}

// Normalize venue names to tourist-friendly aliases
function normalizeTitleToAlias(title: string): string {
  const titleLower = title.toLowerCase();

  // Map canonical/Google names back to tourist-friendly aliases
  const aliasMapping: { [key: string]: string } = {
    'sultan ahmed mosque': 'Blue Mosque',
    'sultanahmet mosque': 'Blue Mosque',
    'sultan ahmet camii': 'Blue Mosque',
    'ayasofya': 'Hagia Sophia',
    'aya sofia': 'Hagia Sophia',
    'santa sophia': 'Hagia Sophia',
    'topkapi sarayi': 'Topkapi Palace',
    'topkapi museum': 'Topkapi Palace',
    'kapali carsi': 'Grand Bazaar',
    'covered bazaar': 'Grand Bazaar',
    'great bazaar': 'Grand Bazaar',
    'galata kulesi': 'Galata Tower',
    'christ tower': 'Galata Tower',
    'yerebatan sarayi': 'Basilica Cistern',
    'sunken palace': 'Basilica Cistern',
    'yerebatan cistern': 'Basilica Cistern',
    'dolmabahce sarayi': 'Dolmabahce Palace',
    'halic': 'Golden Horn',
    'taksim meydani': 'Taksim Square',
    'istiklal caddesi': 'Istiklal Street',
    'misir carsisi': 'Spice Bazaar',
    'egyptian bazaar': 'Spice Bazaar',
    'suleymaniye camii': 'Suleymaniye Mosque',
    'istanbul museum of modern art': 'Istanbul Modern',
    'modern sanat müzesi': 'Istanbul Modern'
  };

  // Check for exact matches first
  for (const [canonical, alias] of Object.entries(aliasMapping)) {
    if (titleLower === canonical || titleLower === canonical + ', istanbul' || titleLower === canonical + ' istanbul') {
      return alias;
    }
  }

  // Check for partial matches (for longer venue names)
  for (const [canonical, alias] of Object.entries(aliasMapping)) {
    if (titleLower.includes(canonical)) {
      return title.replace(new RegExp(canonical, 'gi'), alias);
    }
  }

  return title;
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const { id, target = 15 }: { id: number; target?: number } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Staging item ID is required'
      }, { status: 400 });
    }

    // Get the staging item
    const { data: stagingItem, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !stagingItem) {
      return NextResponse.json({
        success: false,
        error: 'Staging item not found'
      }, { status: 404 });
    }

    const currentImages = stagingItem.images || [];
    const currentCount = currentImages.length;

    if (currentCount >= target) {
      return NextResponse.json({
        success: true,
        before: currentCount,
        after: currentCount,
        added: 0,
        message: 'Already at target image count'
      });
    }

    const needed = target - currentCount;
    console.log(`Refilling images for "${stagingItem.title}": need ${needed} more (${currentCount}/${target})`);

    // Build search queries with alias normalization
    const normalizedTitle = normalizeTitleToAlias(stagingItem.title);
    const searchQueries = [
      normalizedTitle,
      stagingItem.title,
      `${normalizedTitle} Istanbul`,
      `${stagingItem.title} Istanbul`,
      `${stagingItem.category} Istanbul`
    ].filter((term, index, arr) => arr.indexOf(term) === index);

    let newImages: string[] = [];

    // Try Unsplash first
    if (process.env.UNSPLASH_ACCESS_KEY && newImages.length < needed) {
      for (const query of searchQueries.slice(0, 3)) { // Limit queries to avoid rate limits
        if (newImages.length >= needed) break;

        const unsplashImages = await getUnsplashImages(query, Math.ceil(needed * 1.5));
        newImages.push(...unsplashImages);
        console.log(`Added ${unsplashImages.length} images from Unsplash for "${query}"`);

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // Try Pexels as fallback
    if (process.env.PEXELS_API_KEY && newImages.length < needed) {
      for (const query of searchQueries.slice(0, 2)) { // Fewer queries for Pexels due to stricter limits
        if (newImages.length >= needed) break;

        const pexelsImages = await getPexelsImages(query, Math.ceil(needed * 1.5));
        newImages.push(...pexelsImages);
        console.log(`Added ${pexelsImages.length} images from Pexels for "${query}"`);

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Combine existing and new images, then deduplicate
    const allImages = [...currentImages, ...newImages];
    const deduplicatedImages = advancedImageDeduplication(allImages);
    const finalImages = deduplicatedImages.slice(0, target);

    const finalCount = finalImages.length;
    const addedCount = finalCount - currentCount;

    // Update the staging item
    const { error: updateError } = await supabase
      .from('staging_queue')
      .update({
        images: finalImages,
        image_count: finalCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Image refill complete: ${currentCount} → ${finalCount} (added ${addedCount})`);

    return NextResponse.json({
      success: true,
      before: currentCount,
      after: finalCount,
      added: addedCount
    });

  } catch (error) {
    console.error('Image refill error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}