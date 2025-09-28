import { Hero } from '@/components/Hero'
import { EditorPicks } from '@/components/EditorPicks'
import { CategoryGrid } from '@/components/CategoryGrid'
import { IstanbulMap } from '@/components/IstanbulMap'
import { GoogleAdsSection } from '@/components/GoogleAdsSection'

export default function HomePage() {
  // Simple mock data for now - we'll make this dynamic later
  const mapItems = [
    {
      id: '1',
      name: 'Hagia Sophia',
      category: 'activities' as const,
      coordinates: { lat: 41.0086, lng: 28.9795 },
      rating: 4.8,
      neighborhood: 'Sultanahmet',
      slug: 'hagia-sophia'
    },
    {
      id: '2', 
      name: 'Blue Mosque',
      category: 'activities' as const,
      coordinates: { lat: 41.0055, lng: 28.9770 },
      rating: 4.7,
      neighborhood: 'Sultanahmet',
      slug: 'blue-mosque'
    },
    {
      id: '3',
      name: 'Grand Bazaar',
      category: 'shopping' as const,
      coordinates: { lat: 41.0106, lng: 28.9683 },
      rating: 4.5,
      neighborhood: 'Beyazıt',
      slug: 'grand-bazaar'
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <div className="pt-[100svh]">
        <EditorPicks />
      <CategoryGrid />
      {/* Map section */}
      <div className="mt-16">
        <IstanbulMap items={mapItems} />
        </div>
        
      {/* Google Ads section */}
      <GoogleAdsSection />
            </div>
    </main>
  )
}
