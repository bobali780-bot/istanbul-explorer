import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || 'Spice Bazaar Istanbul';
    const targetImages = parseInt(searchParams.get('images') || '20', 10);

    console.log(`🧪 Testing single venue: "${term}" (target: ${targetImages} images)`);

    // Import the image pipeline functions
    const { callGooglePlacesAPI } = await import('@/app/api/admin/scrape-hybrid/route');
    
    // Test Google Places API
    const googleResult = await callGooglePlacesAPI(term, 'activities');
    const googlePhotos = googleResult?.photos || [];
    
    // Test Unsplash API
    let unsplashResult = { asked: 0, got: 0, sample: '' };
    if (process.env.UNSPLASH_ACCESS_KEY) {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=5&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
          {
            headers: {
              'User-Agent': 'Istanbul Explorer Bot 1.0'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          unsplashResult = {
            asked: 5,
            got: data.results?.length || 0,
            sample: data.results?.[0]?.urls?.regular || ''
          };
        }
      } catch (error) {
        console.error('Unsplash test error:', error);
      }
    }

    // Test Pexels API
    let pexelsResult = { asked: 0, got: 0, sample: '' };
    if (process.env.PEXELS_API_KEY) {
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&per_page=5`,
          {
            headers: {
              'Authorization': process.env.PEXELS_API_KEY,
              'User-Agent': 'Istanbul Explorer Bot 1.0'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          pexelsResult = {
            asked: 5,
            got: data.photos?.length || 0,
            sample: data.photos?.[0]?.src?.medium || ''
          };
        }
      } catch (error) {
        console.error('Pexels test error:', error);
      }
    }

    // Test Wikimedia Commons
    let wikimediaResult = { asked: 0, got: 0, sample: '' };
    try {
      const response = await fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size&iiurlwidth=1200&origin=*`,
        { signal: AbortSignal.timeout(10000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        const pages = data.query?.pages || {};
        const images = Object.values(pages).filter((page: any) => page.imageinfo?.[0]?.url);
        
        wikimediaResult = {
          asked: 5,
          got: images.length,
          sample: images[0]?.imageinfo?.[0]?.url || ''
        };
      }
    } catch (error) {
      console.error('Wikimedia test error:', error);
    }

    // Test the full image pipeline (without saving to DB)
    let pipelineResult = { count: 0, sample: [], rejections: {} };
    try {
      // Import the main pipeline function
      const { getImagesForCategory } = await import('@/app/api/admin/scrape-hybrid/route');
      const allImages = await getImagesForCategory(term, 'activities', googlePhotos, targetImages);
      
      pipelineResult = {
        count: allImages.length,
        sample: allImages.slice(0, 5),
        rejections: {} // This would be populated by validation stats
      };
    } catch (error) {
      console.error('Pipeline test error:', error);
      pipelineResult = {
        count: 0,
        sample: [],
        rejections: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }

    const result = {
      success: true,
      message: `Single venue test completed for "${term}"`,
      data: {
        term,
        targetImages,
        timestamp: new Date().toISOString(),
        sources: {
          google: {
            asked: googlePhotos.length,
            got: googlePhotos.length,
            sample: googlePhotos[0] || ''
          },
          unsplash: unsplashResult,
          pexels: pexelsResult,
          wikimedia: wikimediaResult
        },
        pipeline: pipelineResult
      }
    };

    console.log(`🧪 Test Results: Google=${googlePhotos.length}, Unsplash=${unsplashResult.got}, Pexels=${pexelsResult.got}, Wikimedia=${wikimediaResult.got}, Pipeline=${pipelineResult.count}`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Single venue test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test single venue',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
