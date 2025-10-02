import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { id, category, coordinates } = await request.json();

    if (!id || !category || !coordinates) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id, category, coordinates' },
        { status: 400 }
      );
    }

    if (!coordinates.lat || !coordinates.lng) {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates format' },
        { status: 400 }
      );
    }

    // Determine the correct table based on category
    let tableName = '';
    switch (category) {
      case 'activities':
        tableName = 'activities';
        break;
      case 'shopping':
        tableName = 'shopping';
        break;
      case 'hotels':
        tableName = 'hotels';
        break;
      case 'food-drink':
        tableName = 'restaurants';
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid category' },
          { status: 400 }
        );
    }

    // Update the coordinates in the database
    const { data, error } = await supabase
      .from(tableName)
      .update({ 
        coordinates: {
          lat: parseFloat(coordinates.lat),
          lng: parseFloat(coordinates.lng)
        }
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update coordinates in database' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coordinates updated successfully',
      coordinates: {
        lat: coordinates.lat,
        lng: coordinates.lng
      }
    });

  } catch (error) {
    console.error('Coordinate update error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating coordinates' },
      { status: 500 }
    );
  }
}
