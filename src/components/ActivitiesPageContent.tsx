"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MapPin, 
  Star, 
  Filter, 
  Search,
  Navigation,
  Camera,
  Utensils,
  Music,
  Ship,
  Building,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  Bookmark
} from "lucide-react"
import InteractiveMap from "@/components/InteractiveMap"
import AffiliateButton from "@/components/AffiliateButton"
import AdSenseBanner from "@/components/AdSenseBanner"
import { useActivities } from "@/hooks/useScrapedData"

export default function ActivitiesPageContent() {
  // Use scraped data from Firecrawl (client-side only)
  const { activities: scrapedActivities, loading, error } = useActivities()
  
  // Fallback data if scraping fails
  const fallbackActivitiesLocations = [
    {
      id: "hagia-sophia-skip-line",
      name: "Hagia Sophia: Skip-the-Line Entry Ticket",
      description: "Skip the long queues and explore this architectural masterpiece that has served as both a cathedral and mosque. Marvel at the massive dome, stunning mosaics, and rich Byzantine history.",
      coordinates: [28.9802, 41.0086] as [number, number],
      category: "activities" as const,
      price: "$$",
      rating: 4.5,
      ctaText: "Book Now",
      ctaLink: "https://www.viator.com/Istanbul-tours/City-Tours/d585-g12-c5330"
    },
    {
      id: "bosphorus-dinner-cruise",
      name: "Bosphorus Dinner Cruise with Turkish Show",
      description: "Enjoy a romantic evening cruise along the Bosphorus Strait with live Turkish entertainment, traditional music, and a delicious dinner while taking in panoramic views of Istanbul's skyline.",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "activities" as const,
      price: "$$$$",
      rating: 4.3,
      ctaText: "Book Cruise",
      ctaLink: "https://www.viator.com/Istanbul-tours/Day-Trips-and-Excursions/d585-g5"
    },
    {
      id: "topkapi-palace-tour",
      name: "Topkapi Palace & Harem Guided Tour",
      description: "Explore the opulent residence of Ottoman sultans with a knowledgeable guide. Discover the Harem quarters, imperial treasures, and stunning courtyards while learning about Ottoman history.",
      coordinates: [28.9834, 41.0115] as [number, number],
      category: "activities" as const,
      price: "$$$",
      rating: 4.6,
      ctaText: "Book Tour",
      ctaLink: "https://www.viator.com/Istanbul-tours/Private-and-Custom-Tours/d585-g26"
    },
    {
      id: "grand-bazaar-walking-tour",
      name: "Grand Bazaar & Spice Bazaar Walking Tour",
      description: "Navigate the world's oldest covered market with a local guide. Learn bargaining techniques, discover hidden gems, and taste authentic Turkish delights in this 4,000-shop labyrinth.",
      coordinates: [28.9680, 41.0106] as [number, number],
      category: "activities" as const,
      price: "$$",
      rating: 4.4,
      ctaText: "Book Tour",
      ctaLink: "https://www.viator.com/Istanbul-tours/Full-day-Tours/d585-g12-c94"
    },
    {
      id: "whirling-dervishes-ceremony",
      name: "Whirling Dervishes Ceremony at Hodjapasha",
      description: "Witness the mystical Sufi ceremony in a 15th-century Turkish bath. Experience the spiritual dance performance that represents the soul's journey to divine love and enlightenment.",
      coordinates: [28.9744, 41.0256] as [number, number],
      category: "activities" as const,
      price: "$$",
      rating: 4.2,
      ctaText: "Book Show",
      ctaLink: "https://www.viator.com/Istanbul/d585"
    },
    {
      id: "princes-islands-day-trip",
      name: "Princes' Islands Day Trip from Istanbul",
      description: "Escape the city bustle and explore Büyükada, the largest of the Princes' Islands. Enjoy a peaceful day with horse-drawn carriages, historic mansions, and beautiful beaches.",
      coordinates: [29.1000, 40.9000] as [number, number],
      category: "activities" as const,
      price: "$$",
      rating: 4.1,
      ctaText: "Book Trip",
      ctaLink: "https://www.viator.com/Istanbul/d585-ttd"
    }
  ]

  // Convert scraped data to the format expected by the page
  const activitiesLocations = scrapedActivities.length > 0 ? scrapedActivities.map((item, index) => ({
    id: `activity-${index}`,
    name: item.name,
    description: item.description,
    coordinates: item.coordinates || [28.9784, 41.0082] as [number, number],
    category: "activities" as const,
    price: item.price || "$$",
    rating: item.rating || 4.0,
    ctaText: "Book Now",
    ctaLink: item.url
  })) : fallbackActivitiesLocations

  // Log scraping results
  if (scrapedActivities.length > 0) {
    console.log(`✅ Scraped ${scrapedActivities.length} activities from Viator`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading activities data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('❌ Error loading activities data:', error)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Best Activities in Istanbul
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Discover unforgettable experiences and tours in the heart of Turkey
          </p>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Unforgettable Istanbul Experiences
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            From ancient wonders to modern adventures, Istanbul offers a wealth of activities 
            that will create lasting memories. Whether you&apos;re interested in history, culture, 
            food, or unique experiences, our curated selection of tours and activities will 
            help you discover the best of this magnificent city.
          </p>
        </div>
      </section>

      {/* Filters & Sorting */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">$ - Budget</SelectItem>
                  <SelectItem value="mid">$$ - Mid Range</SelectItem>
                  <SelectItem value="luxury">$$$ - Luxury</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tours">Tours</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="nightlife">Nightlife</SelectItem>
                  <SelectItem value="cruise">Cruise</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="sultanahmet">Sultanahmet</SelectItem>
                  <SelectItem value="taksim">Taksim</SelectItem>
                  <SelectItem value="bosphorus">Bosphorus</SelectItem>
                  <SelectItem value="kadikoy">Kadıköy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Select defaultValue="popular">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="hidden">Hidden Gems</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Editor&apos;s Choice
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Activity 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-64 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Building className="w-20 h-20 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">Editor&apos;s Pick</Badge>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Tour</Badge>
                  <Badge variant="outline">Cultural</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">{activitiesLocations[0]?.name}</h3>
                <p className="text-gray-600 mb-4">
                  {activitiesLocations[0]?.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (2,847)</span>
                  </div>
                  <Badge variant="outline">$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <AffiliateButton 
                    href={activitiesLocations[0]?.ctaLink || '#'}
                    affiliateType="viator"
                    trackingId="activities-featured-1"
                    locationName={activitiesLocations[0]?.name || 'Activity'}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {activitiesLocations[0]?.ctaText || 'Book Now'}
                  </AffiliateButton>
                </div>
              </CardContent>
            </Card>

            {/* Featured Activity 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-64 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Ship className="w-20 h-20 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">Editor&apos;s Pick</Badge>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Cruise</Badge>
                  <Badge variant="outline">Bosphorus</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">{activitiesLocations[1]?.name}</h3>
                <p className="text-gray-600 mb-4">
                  {activitiesLocations[1]?.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.8 (1,234)</span>
                  </div>
                  <Badge variant="outline">$$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <AffiliateButton 
                    href={activitiesLocations[1]?.ctaLink || '#'}
                    affiliateType="viator"
                    trackingId="activities-featured-2"
                    locationName={activitiesLocations[1]?.name || 'Activity'}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {activitiesLocations[1]?.ctaText || 'Book Now'}
                  </AffiliateButton>
                </div>
              </CardContent>
            </Card>

            {/* Featured Activity 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-64 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Building className="w-20 h-20 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">Editor&apos;s Pick</Badge>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Tour</Badge>
                  <Badge variant="outline">Historical</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">{activitiesLocations[2]?.name}</h3>
                <p className="text-gray-600 mb-4">
                  {activitiesLocations[2]?.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.7 (1,890)</span>
                  </div>
                  <Badge variant="outline">$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <AffiliateButton 
                    href={activitiesLocations[2]?.ctaLink || '#'}
                    affiliateType="viator"
                    trackingId="activities-featured-3"
                    locationName={activitiesLocations[2]?.name || 'Activity'}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {activitiesLocations[2]?.ctaText || 'Book Now'}
                  </AffiliateButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* All Activities Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            All Activities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activitiesLocations.slice(3).map((activity, index) => (
              <Card key={activity.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Building className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Tour</Badge>
                    <Badge variant="outline">Cultural</Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{activity.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.5 (1,123)</span>
                    </div>
                    <Badge variant="outline">{activity.price}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      Map
                    </Button>
                    <AffiliateButton 
                      href={activity.ctaLink}
                      affiliateType="viator"
                      trackingId={`activities-grid-${index + 4}`}
                      locationName={activity.name}
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {activity.ctaText}
                    </AffiliateButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Activities Map
          </h2>
          
          <div className="bg-gray-100 rounded-lg p-8">
            <InteractiveMap 
              locations={activitiesLocations}
              className="border-2 border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <AdSenseBanner slot="activities-page" format="auto" />
        </div>
      </section>
    </div>
  )
}
