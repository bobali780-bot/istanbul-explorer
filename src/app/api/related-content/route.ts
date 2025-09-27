import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentCategory = searchParams.get('category') || 'activities';
    const limit = parseInt(searchParams.get('limit') || '20');
    const excludeId = searchParams.get('excludeId');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    // For now, return sample data since we're testing the UI
    const sampleActivities = [
      {
        id: '1',
        title: 'Hagia Sophia Grand Mosque',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&h=200&fit=crop',
        rating: 4.8,
        reviewCount: 1247,
        duration: '2-3 hours',
        price: 'Free entry',
        distance: '0.2 km'
      },
      {
        id: '2',
        title: 'The Blue Mosque',
        image: 'https://images.unsplash.com/photo-1598980916677-fd805b180c3c?w=300&h=200&fit=crop',
        rating: 4.7,
        reviewCount: 111022,
        duration: '1 hour',
        price: 'Free entry',
        distance: '0.0 km'
      }
    ];

    // Distribute sample activities across categories
    const relatedData = {
      activities: sampleActivities,
      shopping: sampleActivities,
      restaurants: sampleActivities,
      hotels: sampleActivities
    };

    return NextResponse.json({
      success: true,
      data: relatedData
    });

  } catch (error) {
    console.error('Error fetching related content:', error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch related content: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Simple distance calculation (you might want to use a more sophisticated method)
function calculateDistance(coordinates: any): string {
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    return 'Distance unknown';
  }
  
  // This is a placeholder - you'd implement proper distance calculation
  // based on the current item's coordinates vs this item's coordinates
  const distances = ['0.1 km', '0.3 km', '0.5 km', '0.8 km', '1.2 km', '1.5 km', '2.1 km', '3.2 km'];
  return distances[Math.floor(Math.random() * distances.length)];
}
