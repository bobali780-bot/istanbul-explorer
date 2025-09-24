import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Safely check if environment variables are loaded (without exposing actual values)
    const envCheck = {
      google_places: {
        loaded: !!process.env.GOOGLE_PLACES_API_KEY,
        key_length: process.env.GOOGLE_PLACES_API_KEY?.length || 0,
        key_prefix: process.env.GOOGLE_PLACES_API_KEY?.substring(0, 8) || 'NOT_SET'
      },
      unsplash: {
        loaded: !!process.env.UNSPLASH_ACCESS_KEY,
        key_length: process.env.UNSPLASH_ACCESS_KEY?.length || 0,
        key_prefix: process.env.UNSPLASH_ACCESS_KEY?.substring(0, 8) || 'NOT_SET'
      },
      pexels: {
        loaded: !!process.env.PEXELS_API_KEY,
        key_length: process.env.PEXELS_API_KEY?.length || 0,
        key_prefix: process.env.PEXELS_API_KEY?.substring(0, 8) || 'NOT_SET'
      },
      deployment_info: {
        environment: process.env.NODE_ENV,
        vercel_url: process.env.VERCEL_URL,
        timestamp: new Date().toISOString()
      }
    };

    console.log('🔑 Environment Variables Check:', {
      google_places_loaded: envCheck.google_places.loaded,
      unsplash_loaded: envCheck.unsplash.loaded,
      pexels_loaded: envCheck.pexels.loaded,
      environment: envCheck.deployment_info.environment
    });

    return NextResponse.json({
      success: true,
      message: 'Environment variables check complete',
      data: envCheck
    });

  } catch (error) {
    console.error('❌ Environment check failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
// Trigger redeploy Wed Sep 24 15:03:20 BST 2025
