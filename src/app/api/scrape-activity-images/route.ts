import { NextRequest, NextResponse } from 'next/server'
import FirecrawlApp from '@mendable/firecrawl-js'

// Initialize Firecrawl
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { activityName, searchSites } = await request.json()

    if (!activityName) {
      return NextResponse.json({ error: 'Activity name is required' }, { status: 400 })
    }

    const sites = searchSites || [
      'https://www.booking.com',
      'https://www.expedia.com',
      'https://www.tripadvisor.com'
    ]

    const scrapedImages: { site: string; images: string[]; title: string }[] = []

    for (const site of sites) {
      try {
        console.log(`Scraping ${site} for ${activityName}...`)

        // Create search URL for the activity
        const searchQuery = `${activityName} Istanbul`
        let searchUrl = ''

        if (site.includes('booking.com')) {
          searchUrl = `${site}/searchresults.html?ss=${encodeURIComponent(searchQuery)}&dest_type=landmark`
        } else if (site.includes('expedia.com')) {
          searchUrl = `${site}/Things-To-Do-In-Istanbul.d6053103.Travel-Guide-Activities?q=${encodeURIComponent(searchQuery)}`
        } else if (site.includes('tripadvisor.com')) {
          searchUrl = `${site}/Search?q=${encodeURIComponent(searchQuery)}&geo=293974&pid=3826&redirect=&startTime=&uiOrigin=MASTHEAD`
        }

        // Scrape the search results page
        const scrapeResponse = await app.scrape(searchUrl, {
          formats: ['html', 'markdown'],
          includeTags: ['img'],
          onlyMainContent: true
        })

        if (scrapeResponse?.html) {
          // Extract images from the HTML
          const imageRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi
          const images: string[] = []
          let match

          while ((match = imageRegex.exec(scrapeResponse.html)) !== null) {
            const imageUrl = match[1]
            const altText = match[2]

            // Filter for relevant images (check if alt text or URL contains activity-related keywords)
            const activityKeywords = activityName.toLowerCase().split(' ')
            const isRelevant = activityKeywords.some((keyword: string) =>
              altText.toLowerCase().includes(keyword) ||
              imageUrl.toLowerCase().includes(keyword)
            )

            // Only include high-quality images (exclude icons, thumbnails, etc.)
            if (isRelevant &&
                imageUrl.includes('http') &&
                !imageUrl.includes('icon') &&
                !imageUrl.includes('logo') &&
                !imageUrl.includes('sprite') &&
                (imageUrl.includes('jpg') || imageUrl.includes('jpeg') || imageUrl.includes('png') || imageUrl.includes('webp'))) {
              images.push(imageUrl)
            }
          }

          // Remove duplicates and limit to top 10
          const uniqueImages = [...new Set(images)].slice(0, 10)

          scrapedImages.push({
            site: site,
            images: uniqueImages,
            title: `${activityName} from ${new URL(site).hostname}`
          })

        }
      } catch (siteError) {
        console.error(`Error scraping ${site}:`, siteError)
        // Continue with other sites even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      activityName,
      scrapedData: scrapedImages,
      totalImages: scrapedImages.reduce((sum, site) => sum + site.images.length, 0)
    })

  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to scrape all activities
export async function GET(request: NextRequest) {
  try {
    // List of activities to scrape
    const activities = [
      'Hagia Sophia',
      'Blue Mosque',
      'Topkapi Palace',
      'Grand Bazaar',
      'Bosphorus Cruise',
      'Galata Tower',
      'Basilica Cistern',
      'Spice Bazaar',
      'Turkish Hammam',
      'Dolmabahce Palace'
    ]

    const allResults = []

    for (const activity of activities) {
      console.log(`Processing ${activity}...`)

      // Call our own POST endpoint for each activity
      const response = await fetch(`${request.nextUrl.origin}/api/scrape-activity-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityName: activity,
          searchSites: [
            'https://www.booking.com',
            'https://www.tripadvisor.com'
          ]
        })
      })

      if (response.ok) {
        const result = await response.json()
        allResults.push(result)
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    return NextResponse.json({
      success: true,
      message: `Scraped images for ${activities.length} activities`,
      results: allResults
    })

  } catch (error) {
    console.error('Batch scraping error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}