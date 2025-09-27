import { Hero } from '@/components/Hero'
import { EditorPicks } from '@/components/EditorPicks'
import { CategoryGrid } from '@/components/CategoryGrid'
import { IstanbulMap } from '@/components/IstanbulMap'

async function getMapData() {
  try {
    // Fetch data from all categories
    const [activitiesRes, hotelsRes, shoppingRes, foodRes] = await Promise.all([
      fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/activities?category=activities&limit=50`, { 
        cache: 'no-store' 
      }),
      fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/activities?category=hotels&limit=50`, { 
        cache: 'no-store' 
      }),
      fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/activities?category=shopping&limit=50`, { 
        cache: 'no-store' 
      }),
      fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/activities?category=food-drink&limit=50`, { 
        cache: 'no-store' 
      })
    ])

    const [activities, hotels, shopping, food] = await Promise.all([
      activitiesRes.json().catch(() => ({ data: [] })),
      hotelsRes.json().catch(() => ({ data: [] })),
      shoppingRes.json().catch(() => ({ data: [] })),
      foodRes.json().catch(() => ({ data: [] }))
    ])

    // Combine and format data for the map
    const mapItems = [
      ...(activities.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: 'activities' as const,
        coordinates: item.coordinates || { lat: 41.0082, lng: 28.9784 },
        rating: item.rating,
        neighborhood: item.neighborhood || item.district,
        slug: item.slug
      })),
      ...(hotels.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: 'hotels' as const,
        coordinates: item.coordinates || { lat: 41.0082, lng: 28.9784 },
        rating: item.rating,
        neighborhood: item.neighborhood || item.district,
        slug: item.slug
      })),
      ...(shopping.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: 'shopping' as const,
        coordinates: item.coordinates || { lat: 41.0082, lng: 28.9784 },
        rating: item.rating,
        neighborhood: item.neighborhood || item.district,
        slug: item.slug
      })),
      ...(food.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: 'food-drink' as const,
        coordinates: item.coordinates || { lat: 41.0082, lng: 28.9784 },
        rating: item.rating,
        neighborhood: item.neighborhood || item.district,
        slug: item.slug
      }))
    ]

    return mapItems
  } catch (error) {
    console.error('Error fetching map data:', error)
    return []
  }
}

export default async function HomePage() {
  const mapItems = await getMapData()

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <EditorPicks />
      {/* The new section must be directly below Editor's Picks */}
      <CategoryGrid />
      {/* Map section with proper spacing */}
      <div className="mt-16">
        <IstanbulMap items={mapItems} />
      </div>
    </main>
  )
}
