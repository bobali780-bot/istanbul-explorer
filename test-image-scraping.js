// Test Firecrawl image scraping locally
const FirecrawlApp = require('@mendable/firecrawl-js').default
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '.env.local' })

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

async function testImageScraping() {
  try {
    console.log('Testing Firecrawl image scraping for Hagia Sophia...')

    // Test scraping TripAdvisor for Hagia Sophia
    const searchUrl = 'https://www.tripadvisor.com/Attraction_Review-g293974-d293976-Reviews-Hagia_Sophia-Istanbul.html'

    console.log(`Scraping: ${searchUrl}`)

    const result = await app.scrape({
      url: searchUrl,
      formats: ['html'],
      includeTags: ['img'],
      onlyMainContent: true
    })

    if (result.success && result.data?.html) {
      console.log('✅ Successfully scraped page')

      // Extract image URLs
      const imageRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi
      const images = []
      let match

      while ((match = imageRegex.exec(result.data.html)) !== null && images.length < 10) {
        const imageUrl = match[1]
        const altText = match[2]

        // Filter for relevant, high-quality images
        if (imageUrl.includes('http') &&
            !imageUrl.includes('icon') &&
            !imageUrl.includes('logo') &&
            !imageUrl.includes('sprite') &&
            (imageUrl.includes('jpg') || imageUrl.includes('jpeg') || imageUrl.includes('png') || imageUrl.includes('webp'))) {

          images.push({
            url: imageUrl,
            alt: altText
          })
        }
      }

      console.log(`\n📸 Found ${images.length} potential images:`)
      images.forEach((img, index) => {
        console.log(`${index + 1}. ${img.url}`)
        console.log(`   Alt: ${img.alt}`)
        console.log('')
      })

      return images

    } else {
      console.error('❌ Failed to scrape:', result.error)
      return []
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    return []
  }
}

// Alternative: Test with a simple Booking.com search
async function testBookingSearch() {
  try {
    console.log('\n🔍 Testing Booking.com search...')

    const searchUrl = 'https://www.booking.com/attractions/country/tr.html?aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaFKIAQGYAQm4ARfIAQzYAQHoAQH4AQKIAgGoAgO4Avny-bEGwAIB0gIkZTY5NGY4ZDktOGE4My00ZDUzLWE4NjktYjI2NjZjZTJlMmY12AIF4AIB&sid=b2cd23ce59b41e7ee899c0b62c0dd555&sb=1&src=searchresults&dest_id=900047975&dest_type=city&ac_position=0&ac_langcode=en&ac_click_type=b&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure&sr_lon=28.9773&sr_lat=41.0082'

    const result = await app.scrape({
      url: searchUrl,
      formats: ['markdown'],
      onlyMainContent: true
    })

    if (result.success) {
      console.log('✅ Successfully scraped Booking.com')
      console.log('📄 Content preview:')
      console.log(result.data?.markdown?.substring(0, 500) + '...')
    } else {
      console.error('❌ Failed to scrape Booking.com:', result.error)
    }

  } catch (error) {
    console.error('❌ Booking.com error:', error.message)
  }
}

// Run the tests
console.log('🚀 Starting Firecrawl image scraping test...\n')

testImageScraping().then(images => {
  if (images.length > 0) {
    console.log('🎉 Image scraping test completed successfully!')

    // Generate SQL to update database
    console.log('\n📝 SQL to update Hagia Sophia images:')
    console.log('DELETE FROM activity_images WHERE activity_id = 1;')

    images.slice(0, 5).forEach((img, index) => {
      console.log(`INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES (1, '${img.url}', '${img.alt.replace(/'/g, "''")}', ${index === 0}, ${index + 1});`)
    })
  }

  return testBookingSearch()
})