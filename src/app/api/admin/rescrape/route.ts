import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { tileId, structuredIntent, instructions } = await request.json()
    
    // console.log('Rescrape request:', { tileId, structuredIntent, instructions })

    if (!tileId || !structuredIntent) {
      return NextResponse.json({
        success: false,
        message: 'Tile ID and structured intent are required'
      }, { status: 400 })
    }

    // Get the current tile data
    const { data: currentTile, error: tileError } = await supabase
      .from('staging_queue')
      .select('*')
      .eq('id', tileId)
      .single()

    if (tileError || !currentTile) {
      return NextResponse.json({
        success: false,
        message: 'Tile not found'
      }, { status: 404 })
    }

    const versionData = {
      images: currentTile.images || [],
      description: currentTile.description || '',
      metadata: currentTile.raw_content || {}
    }

    let changesSummary = 'Updated via rescrape'

    // Route to appropriate action based on structured intent
    if (structuredIntent.full_rescrape) {
      // Full rescrape - call existing scrape pipeline
      const scrapeResult = await performFullRescrape(currentTile.title, currentTile.category)
      versionData.images = scrapeResult.images || versionData.images
      versionData.description = scrapeResult.description || versionData.description
      changesSummary = 'Full rescrape completed'
    }

    if (structuredIntent.images > 0) {
      // Add more images via Firecrawl
      const additionalImages = await fetchAdditionalImages(currentTile.title, structuredIntent.images)
      if (structuredIntent.replace_images) {
        versionData.images = additionalImages
        changesSummary = `Replaced images with ${additionalImages.length} new ones`
      } else {
        // Get existing images and deduplicate aggressively
        const existingImages = currentTile.images || []
        const requestedCount = structuredIntent.images
        
        // First, deduplicate against existing images
        const deduplicatedImages = additionalImages.filter(newImage => {
          const normalizedNew = normalizeImageUrl(newImage)
          return !existingImages.some(existing => normalizeImageUrl(existing) === normalizedNew)
        })
        
        // Then, deduplicate within the new images themselves
        const uniqueNewImages: string[] = []
        for (const image of deduplicatedImages) {
          const normalizedImage = normalizeImageUrl(image)
          if (!uniqueNewImages.some(existing => normalizeImageUrl(existing) === normalizedImage)) {
            uniqueNewImages.push(image)
            if (uniqueNewImages.length >= requestedCount) break
          }
        }
        
        versionData.images = [...existingImages, ...uniqueNewImages]
        changesSummary = `Added ${uniqueNewImages.length} additional images (${versionData.images.length} total)`
        
        // If we didn't get enough unique images, log a warning
        if (uniqueNewImages.length < requestedCount) {
          console.log(`⚠️ Only found ${uniqueNewImages.length} unique images out of ${requestedCount} requested`)
          console.log(`📊 Deduplication stats: ${additionalImages.length} fetched, ${deduplicatedImages.length} after deduplication against existing, ${uniqueNewImages.length} after internal deduplication`)
        }
      }
    }

    if (structuredIntent.description_update) {
      // Enhance description with AI
      const currentDescription = currentTile.description || 'No description available'
      const enhancedDescription = await enhanceDescription(currentDescription, instructions, currentTile.title)
      versionData.description = enhancedDescription
      changesSummary += changesSummary.includes('Added') || changesSummary.includes('Replaced') 
        ? ' and enhanced description' 
        : 'Enhanced description with AI'
    }

    // For now, update the main tile directly without version management
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Store version tracking in raw_content
    const currentRescrapeCount = currentTile.raw_content?.rescrape_count || 0
    const newRescrapeCount = currentRescrapeCount + 1
    
    updateData.raw_content = {
      ...currentTile.raw_content,
      rescrape_count: newRescrapeCount,
      last_rescrape_at: new Date().toISOString()
    }
    
    console.log(`🔄 Rescraping tile ${tileId}: version ${newRescrapeCount}`)

    // Only update fields that have been modified and exist in the database
    if (versionData.images && versionData.images.length > 0) {
      updateData.images = versionData.images
    }
    
    // Check if description field exists in the current tile data
    if (versionData.description && currentTile.description !== undefined) {
      updateData.description = versionData.description
    } else if (versionData.description) {
      // If description doesn't exist as a column, store it in raw_content
      updateData.raw_content = {
        ...currentTile.raw_content,
        description: versionData.description
      }
    }

    const { error: updateError } = await supabase
      .from('staging_queue')
      .update(updateData)
      .eq('id', tileId)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error(`Failed to update tile: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      changesSummary,
      message: 'Rescrape completed successfully'
    })

  } catch (error) {
    console.error('Error in rescrape:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      success: false,
      message: `Failed to complete rescrape: ${errorMessage}`
    }, { status: 500 })
  }
}

async function performFullRescrape(title: string, category: string) {
  // Call the existing scrape pipeline
  const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/admin/scrape-hybrid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      searchTerms: [title],
      category: category,
      imagesPerItem: 15,
      isReScrape: true
    })
  })

  const result = await response.json()
  
  if (result.success && result.results && result.results.length > 0) {
    const scrapedData = result.results[0]
    return {
      images: scrapedData.images || [],
      description: scrapedData.description || ''
    }
  }

  return { images: [], description: '' }
}

async function fetchAdditionalImages(title: string, count: number) {
  // Fetch additional images using Unsplash and Pexels APIs directly
  console.log(`Fetching ${count} additional images for ${title}`)
  
  try {
    const allImages: string[] = []
    
    // Try Unsplash first with multiple search variations
    if (process.env.UNSPLASH_ACCESS_KEY) {
      const searchTerms = [
        // ONLY exact place name - no additional terms
        title
      ]
      
      for (const searchTerm of searchTerms) {
        if (allImages.length >= count * 5) break // Get 5x more to ensure we have enough unique ones
        
        const unsplashResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=30&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        )
      
        if (unsplashResponse.ok) {
          const unsplashData = await unsplashResponse.json()
          const unsplashImages = unsplashData.results?.map((photo: any) => {
            const imageUrl = `${photo.urls.regular}?w=1200&h=800&fit=crop`
            return {
              url: imageUrl,
              relevanceScore: scoreImageRelevance(imageUrl, searchTerm, title)
            }
          }) || []
          
          // Since we're searching for exact name, take all images (they're all relevant)
          const bestImages = unsplashImages.map(img => img.url) // Take all images from exact search
          
          allImages.push(...bestImages)
          console.log(`✅ Got ${bestImages.length} relevant images from Unsplash for "${searchTerm}" (top ${Math.min(5, unsplashImages.length)} of ${unsplashImages.length})`)
        }
      }
    }
    
    // If we still need more, try Pexels
    if (allImages.length < count * 3 && process.env.PEXELS_API_KEY) {
      const pexelsSearchTerms = [
        // ONLY exact place name - no additional terms
        title
      ]
      
      for (const searchTerm of pexelsSearchTerms) {
        if (allImages.length >= count * 5) break
        
        const pexelsResponse = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=30`,
          {
            headers: {
              'Authorization': process.env.PEXELS_API_KEY
            }
          }
        )
        
        if (pexelsResponse.ok) {
          const pexelsData = await pexelsResponse.json()
          const pexelsImages = pexelsData.photos?.map((photo: any) => {
            const imageUrl = `${photo.src.large}?w=1200&h=800&fit=crop`
            return {
              url: imageUrl,
              relevanceScore: scoreImageRelevance(imageUrl, searchTerm, title)
            }
          }) || []
          
          // Since we're searching for exact name, take all images (they're all relevant)
          const bestImages = pexelsImages.map(img => img.url) // Take all images from exact search
          
          allImages.push(...bestImages)
          console.log(`✅ Got ${bestImages.length} relevant images from Pexels for "${searchTerm}" (top ${Math.min(5, pexelsImages.length)} of ${pexelsImages.length})`)
        }
      }
    }
    
    console.log(`🎯 Total images fetched from all sources: ${allImages.length}`)
    return allImages.slice(0, count * 5) // Return up to 5x the requested amount for deduplication
    
  } catch (error) {
    console.error(`❌ Error fetching additional images for ${title}:`, error)
    return []
  }
}

async function enhanceDescription(description: string, instructions: string, title: string) {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/ai/enhance-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: description,
        instructions,
        itemTitle: title
      })
    })

    const result = await response.json()
    return result.success ? result.enhancedContent : description
  } catch (error) {
    console.error('Error enhancing description:', error)
    return description
  }
}

function normalizeImageUrl(url: string): string {
  try {
    // Remove common query parameters that don't affect the image content
    const urlObj = new URL(url)
    
    // Remove size/quality parameters that are commonly added
    const paramsToRemove = ['w', 'h', 'fit', 'crop', 'q', 'auto', 'cs', 'fm', 'ixlib', 'ixid']
    paramsToRemove.forEach(param => urlObj.searchParams.delete(param))
    
    // Normalize the path (remove trailing slashes, etc.)
    let pathname = urlObj.pathname
    if (pathname.endsWith('/') && pathname.length > 1) {
      pathname = pathname.slice(0, -1)
    }
    
    // Return normalized URL
    return `${urlObj.protocol}//${urlObj.hostname}${pathname}${urlObj.search}`
  } catch (error) {
    // If URL parsing fails, return the original URL
    return url
  }
}

function scoreImageRelevance(imageUrl: string, searchTerm: string, title: string): number {
  // Since we're only searching for exact place name, accept all results
  // The search term IS the title, so all results should be relevant
  return 100 // Accept all images from exact name search
}
