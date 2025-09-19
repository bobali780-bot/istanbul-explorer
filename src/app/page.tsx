"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import AdSenseBanner from "@/components/AdSenseBanner"
import AffiliateButton from "@/components/AffiliateButton"
import InteractiveMap from "@/components/InteractiveMap"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { useFeaturedItems } from "@/hooks/useScrapedData"
import { 
  MapPin, 
  Search, 
  Star, 
  Clock, 
  Users, 
  Shield, 
  RefreshCw, 
  DollarSign, 
  Smartphone,
  ArrowRight,
  Play,
  Mail,
  Download,
  Navigation,
  Utensils,
  ShoppingBag,
  Bed,
  Camera,
  Building,
  Music
} from "lucide-react"

export default function HomePage() {
  // Get random featured items from APIs
  const { featuredItems, loading, error } = useFeaturedItems()

  // Real sample locations for homepage preview
  const sampleLocations = [
    {
      id: "hagia-sophia",
      name: "Hagia Sophia",
      description: "Skip-the-line entry to this architectural masterpiece that has served as both cathedral and mosque. Marvel at the massive dome, stunning mosaics, and rich Byzantine history.",
      coordinates: [28.9802, 41.0086] as [number, number],
      category: "activities" as const,
      price: "$$",
      rating: 4.5,
      ctaText: "Explore Activities",
      ctaLink: "/activities"
    },
    {
      id: "four-seasons-sultanahmet",
      name: "Four Seasons Hotel Istanbul at Sultanahmet",
      description: "Luxury hotel set in a former prison building in the heart of historic Sultanahmet. Features elegant rooms with Hagia Sophia views, spa, and fine dining restaurant.",
      coordinates: [28.9801, 41.0086] as [number, number],
      category: "hotels" as const,
      price: "$$$$",
      rating: 4.7,
      ctaText: "Explore Hotels",
      ctaLink: "/hotels"
    },
    {
      id: "grand-bazaar",
      name: "Grand Bazaar (Kapalı Çarşı)",
      description: "The world's oldest and largest covered market with over 4,000 shops selling jewelry, carpets, ceramics, textiles, and traditional Turkish crafts. A UNESCO World Heritage site.",
      coordinates: [28.9680, 41.0106] as [number, number],
      category: "shopping" as const,
      price: "$$",
      rating: 4.3,
      ctaText: "Explore Shopping",
      ctaLink: "/shopping"
    },
    {
      id: "balikci-sabahattin",
      name: "Balıkçı Sabahattin",
      description: "Renowned seafood restaurant in Sultanahmet serving the freshest fish and traditional Turkish mezes. Famous for its grilled sea bass and authentic Ottoman atmosphere.",
      coordinates: [28.9780, 41.0085] as [number, number],
      category: "food" as const,
      price: "$$$",
      rating: 4.5,
      ctaText: "Explore Food & Drink",
      ctaLink: "/food-drink"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <GoogleAnalytics />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image/Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover the Best of
            <span className="block text-yellow-400">Istanbul</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Handpicked activities, restaurants, hotels, and shopping experiences
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search activities, restaurants, hotels..."
                className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-lg"
              />
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg rounded-full">
              Plan My Trip
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg rounded-full">
              Find Hotels
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access Tiles with Dynamic Featured Items */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Explore Istanbul
          </h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-0 shadow-lg h-80 flex flex-col animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="mt-auto h-10 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Activities */}
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg h-80 flex flex-col group">
                {featuredItems.activities?.media?.[0]?.url ? (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={featuredItems.activities.media[0].url}
                      alt={featuredItems.activities.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-blue-700/80 group-hover:from-blue-500/70 group-hover:to-blue-700/70 transition-all duration-300"></div>
                    <Navigation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white" />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <Navigation className="w-16 h-16 text-white" />
                    </div>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2">Activities</h3>
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                    {featuredItems.activities?.description_short || "Tours, attractions, and experiences"}
                  </p>
                  {featuredItems.activities && (
                    <p className="text-xs text-gray-500 mb-4 font-medium">
                      Featured: {featuredItems.activities.name}
                    </p>
                  )}
                  <div className="mt-auto">
                    <Button
                      asChild
                      className="w-full bg-blue-500 hover:bg-blue-600 group-hover:bg-blue-600 transition-colors"
                    >
                      <a
                        href={featuredItems.activities?.booking_link || "/activities"}
                        target={featuredItems.activities?.booking_link ? "_blank" : "_self"}
                        rel={featuredItems.activities?.booking_link ? "noopener noreferrer" : ""}
                      >
                        {featuredItems.activities?.booking_link ? "Book Now" : "Explore Activities"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Food & Drink */}
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg h-80 flex flex-col group">
                {featuredItems.restaurants?.media?.[0]?.url ? (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={featuredItems.restaurants.media[0].url}
                      alt={featuredItems.restaurants.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 to-red-600/80 group-hover:from-orange-500/70 group-hover:to-red-600/70 transition-all duration-300"></div>
                    <Utensils className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white" />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <Utensils className="w-16 h-16 text-white" />
                    </div>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2">Food & Drink</h3>
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                    {featuredItems.restaurants?.description_short || "Restaurants, cafes, and local cuisine"}
                  </p>
                  {featuredItems.restaurants && (
                    <p className="text-xs text-gray-500 mb-4 font-medium">
                      Featured: {featuredItems.restaurants.name}
                    </p>
                  )}
                  <div className="mt-auto">
                    <Button
                      asChild
                      className="w-full bg-orange-500 hover:bg-orange-600 group-hover:bg-orange-600 transition-colors"
                    >
                      <a
                        href={featuredItems.restaurants?.booking_link || "/food-drink"}
                        target={featuredItems.restaurants?.booking_link ? "_blank" : "_self"}
                        rel={featuredItems.restaurants?.booking_link ? "noopener noreferrer" : ""}
                      >
                        {featuredItems.restaurants?.booking_link ? "Book Now" : "Find Restaurants"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Shopping */}
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg h-80 flex flex-col group">
                {featuredItems.shopping?.media?.[0]?.url ? (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={featuredItems.shopping.media[0].url}
                      alt={featuredItems.shopping.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/80 to-emerald-600/80 group-hover:from-green-500/70 group-hover:to-emerald-600/70 transition-all duration-300"></div>
                    <ShoppingBag className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white" />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16 text-white" />
                    </div>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2">Shopping</h3>
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                    {featuredItems.shopping?.description_short || "Markets, boutiques, and souvenirs"}
                  </p>
                  {featuredItems.shopping && (
                    <p className="text-xs text-gray-500 mb-4 font-medium">
                      Featured: {featuredItems.shopping.name}
                    </p>
                  )}
                  <div className="mt-auto">
                    <Button
                      asChild
                      className="w-full bg-green-500 hover:bg-green-600 group-hover:bg-green-600 transition-colors"
                    >
                      <a
                        href={featuredItems.shopping?.booking_link || "/shopping"}
                        target={featuredItems.shopping?.booking_link ? "_blank" : "_self"}
                        rel={featuredItems.shopping?.booking_link ? "noopener noreferrer" : ""}
                      >
                        {featuredItems.shopping?.booking_link ? "Visit Now" : "Shop Now"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Hotels */}
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg h-80 flex flex-col group">
                {featuredItems.hotels?.media?.[0]?.url ? (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={featuredItems.hotels.media[0].url}
                      alt={featuredItems.hotels.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-indigo-600/80 group-hover:from-purple-500/70 group-hover:to-indigo-600/70 transition-all duration-300"></div>
                    <Bed className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white" />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Bed className="w-16 h-16 text-white" />
                    </div>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2">Hotels</h3>
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                    {featuredItems.hotels?.description_short || "Accommodations and stays"}
                  </p>
                  {featuredItems.hotels && (
                    <p className="text-xs text-gray-500 mb-4 font-medium">
                      Featured: {featuredItems.hotels.name}
                    </p>
                  )}
                  <div className="mt-auto">
                    <Button
                      asChild
                      className="w-full bg-purple-500 hover:bg-purple-600 group-hover:bg-purple-600 transition-colors"
                    >
                      <a
                        href={featuredItems.hotels?.booking_link || "/hotels"}
                        target={featuredItems.hotels?.booking_link ? "_blank" : "_self"}
                        rel={featuredItems.hotels?.booking_link ? "noopener noreferrer" : ""}
                      >
                        {featuredItems.hotels?.booking_link ? "Book Now" : "Book Hotels"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {error && (
            <div className="text-center mt-8">
              <p className="text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
                ⚠️ Using fallback data - some content may not be current
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Curated from Top Sources</h3>
              <p className="text-gray-600 text-sm">Only the best recommendations</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Updated Regularly</h3>
              <p className="text-gray-600 text-sm">Fresh content and new discoveries</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold">Best Deals via Affiliates</h3>
              <p className="text-gray-600 text-sm">Exclusive offers and discounts</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Easy-to-Use Design</h3>
              <p className="text-gray-600 text-sm">Mobile-friendly and intuitive</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Highlights Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Top 5 Must-Do Experiences in Istanbul
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Experience 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-80 flex flex-col">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">#1</Badge>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2">Hagia Sophia Tour</h3>
                <p className="text-gray-600 mb-4">Explore the iconic Byzantine architecture and rich history</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.8 (2,847)</span>
                  </div>
                  <Badge variant="outline">$$$</Badge>
                </div>
                <div className="mt-auto">
                  <AffiliateButton 
                    href="https://www.viator.com/Istanbul-tours/City-Tours/d585-g12-c5330"
                    affiliateType="viator"
                    trackingId="homepage-hagia-sophia"
                    locationName="Hagia Sophia Tour"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Book Now
                  </AffiliateButton>
                </div>
              </CardContent>
            </Card>

            {/* Experience 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-80 flex flex-col">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">#2</Badge>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2">Bosphorus Dinner Cruise</h3>
                <p className="text-gray-600 mb-4">Romantic dinner with stunning city views</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (1,234)</span>
                  </div>
                  <Badge variant="outline">$$$$</Badge>
                </div>
                <div className="mt-auto">
                  <AffiliateButton 
                    href="https://www.viator.com/Istanbul-tours/Day-Trips-and-Excursions/d585-g5"
                    affiliateType="viator"
                    trackingId="homepage-bosphorus-cruise"
                    locationName="Bosphorus Dinner Cruise"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Book Cruise
                  </AffiliateButton>
                </div>
              </CardContent>
            </Card>

            {/* Experience 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-80 flex flex-col">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">#3</Badge>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2">Grand Bazaar Shopping</h3>
                <p className="text-gray-600 mb-4">World&apos;s oldest covered market experience</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.6 (3,456)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="mt-auto">
                  <AffiliateButton 
                    href="https://www.viator.com/Istanbul-tours/City-Tours/d585-g12-c5330"
                    affiliateType="viator"
                    trackingId="homepage-grand-bazaar"
                    locationName="Grand Bazaar Shopping"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Visit Location
                  </AffiliateButton>
                </div>
              </CardContent>
            </Card>

            {/* Experience 4 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-80 flex flex-col">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Building className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">#4</Badge>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2">Topkapi Palace Tour</h3>
                <p className="text-gray-600 mb-4">Explore the opulent residence of Ottoman sultans</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.6 (1,890)</span>
                  </div>
                  <Badge variant="outline">$$$</Badge>
                </div>
                <div className="mt-auto">
                  <AffiliateButton 
                    href="https://www.viator.com/Istanbul-tours/Private-and-Custom-Tours/d585-g26"
                    affiliateType="viator"
                    trackingId="homepage-topkapi-palace"
                    locationName="Topkapi Palace Tour"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Book Tour
                  </AffiliateButton>
                </div>
              </CardContent>
            </Card>

            {/* Experience 5 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-80 flex flex-col">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Music className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">#5</Badge>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2">Whirling Dervishes Show</h3>
                <p className="text-gray-600 mb-4">Traditional Sufi ceremony and cultural experience</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.2 (956)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="mt-auto">
                  <AffiliateButton 
                    href="https://www.viator.com/Istanbul-tours/Full-day-Tours/d585-g12-c94"
                    affiliateType="viator"
                    trackingId="homepage-whirling-dervishes"
                    locationName="Whirling Dervishes Show"
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    Book Show
                  </AffiliateButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Explore Istanbul on the Map
          </h2>
          <div className="max-w-6xl mx-auto">
            {(() => {
              console.log("Category pins:", sampleLocations?.length, sampleLocations?.map(p => p.name))
              return null
            })()}
            <InteractiveMap 
              locations={sampleLocations}
              className="border-2 border-gray-200"
            />
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">Click on pins to explore activities, restaurants, hotels, and shopping</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span>Food & Drink</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Shopping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Hotels</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AdSenseBanner slot="homepage-highlights" format="auto" />
          </div>
        </div>
      </section>

      {/* Newsletter Opt-in */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get a Free Istanbul Travel PDF
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Top 10 Insider Tips from Local Experts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address"
                className="flex-1 bg-white/90 backdrop-blur-sm border-0"
              />
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Get Free PDF
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              Join 10,000+ travelers who trust our recommendations
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
