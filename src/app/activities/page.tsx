"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function ActivitiesPage() {
  // Real Activities data from GetYourGuide and Viator
  const activitiesLocations = [
    {
      id: "hagia-sophia-skip-line",
      name: "Hagia Sophia: Skip-the-Line Entry Ticket",
      description: "Skip the long queues and explore this architectural masterpiece that has served as both a cathedral and mosque. Marvel at the massive dome, stunning mosaics, and rich Byzantine history.",
      coordinates: [28.9802, 41.0086] as [number, number],
      category: "activities" as const,
      price: "$$",
      rating: 4.5,
      ctaText: "Book Now",
      ctaLink: "https://www.getyourguide.com/istanbul-l56/hagia-sophia-skip-the-line-ticket-t23928/"
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
      ctaLink: "https://www.viator.com/tours/Istanbul/Bosphorus-Dinner-Cruise-with-Turkish-Show/d585-5674DINNER"
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
      ctaLink: "https://www.getyourguide.com/istanbul-l56/topkapi-palace-harem-guided-tour-t23930/"
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
      ctaLink: "https://www.viator.com/tours/Istanbul/Grand-Bazaar-and-Spice-Bazaar-Walking-Tour/d585-5674BAZAAR"
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
      ctaLink: "https://www.getyourguide.com/istanbul-l56/whirling-dervishes-ceremony-t23935/"
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
      ctaLink: "https://www.viator.com/tours/Istanbul/Princes-Islands-Day-Trip-from-Istanbul/d585-5674ISLANDS"
    }
  ]
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
            Discover unforgettable experiences, from historic tours to Bosphorus cruises
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Intro Text */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Unforgettable Experiences Await
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From exploring ancient Byzantine architecture to cruising the Bosphorus at sunset, 
              Istanbul offers a wealth of activities that blend history, culture, and modern excitement. 
              Our curated selection features the most highly-rated experiences, handpicked by local experts 
              and verified by thousands of travelers.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Sorting */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">$ - Budget</SelectItem>
                  <SelectItem value="moderate">$$ - Moderate</SelectItem>
                  <SelectItem value="expensive">$$$ - Expensive</SelectItem>
                  <SelectItem value="luxury">$$$$ - Luxury</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tour">Tours</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="nightlife">Nightlife</SelectItem>
                  <SelectItem value="cruise">Cruises</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="sultanahmet">Sultanahmet</SelectItem>
                  <SelectItem value="beyoglu">Beyoğlu</SelectItem>
                  <SelectItem value="kadikoy">Kadıköy</SelectItem>
                  <SelectItem value="besiktas">Beşiktaş</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Editor's Choice Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Editor&apos;s Choice
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Activity 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-64 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                  <Camera className="w-20 h-20 text-white" />
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
                  <Badge variant="outline">Cultural Tour</Badge>
                  <Badge variant="outline">Sultanahmet</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Hagia Sophia & Blue Mosque Tour</h3>
                <p className="text-gray-600 mb-4">
                  Skip-the-line access to Istanbul&apos;s most iconic landmarks with expert guide. 
                  Includes audio headsets and small group experience.
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
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Book Now
                  </Button>
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
                <h3 className="text-xl font-bold mb-2">Sunset Bosphorus Dinner Cruise</h3>
                <p className="text-gray-600 mb-4">
                  Romantic dinner cruise with live music, traditional Turkish cuisine, 
                  and breathtaking views of Istanbul&apos;s skyline at sunset.
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
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Activity 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-64 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Navigation className="w-20 h-20 text-white" />
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
                  <Badge variant="outline">Walking Tour</Badge>
                  <Badge variant="outline">Beyoğlu</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Istanbul Food & Culture Walking Tour</h3>
                <p className="text-gray-600 mb-4">
                  Explore local markets, taste authentic street food, and discover hidden gems 
                  with a knowledgeable local guide through Istanbul&apos;s vibrant neighborhoods.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (856)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Curated Card Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            All Activities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Activity Card 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
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
                  <Badge variant="outline">Cultural</Badge>
                  <Badge variant="outline">Sultanahmet</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Topkapi Palace Museum Tour</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Explore the former residence of Ottoman sultans with skip-the-line access 
                  and expert commentary on imperial history.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.7 (1,456)</span>
                  </div>
                  <Badge variant="outline">$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Music className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Nightlife</Badge>
                  <Badge variant="outline">Beyoğlu</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Turkish Night Show with Dinner</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Traditional Turkish entertainment with belly dancing, folk music, 
                  and authentic cuisine in a historic venue.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.6 (892)</span>
                  </div>
                  <Badge variant="outline">$$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-pink-600 hover:bg-pink-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Ship className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Cruise</Badge>
                  <Badge variant="outline">Bosphorus</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Bosphorus Strait Boat Tour</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Scenic boat tour along the Bosphorus with audio guide, 
                  passing historic palaces and bridges with photo opportunities.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.5 (2,134)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card 4 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Food Tour</Badge>
                  <Badge variant="outline">Kadıköy</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Asian Side Food Adventure</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Discover authentic Turkish cuisine on the Asian side, 
                  visiting local markets and family-run restaurants.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.8 (567)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card 5 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Photography</Badge>
                  <Badge variant="outline">City Center</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Instagram Photo Tour</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Professional photographer guides you to the most photogenic spots 
                  in Istanbul for perfect social media content.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (234)</span>
                  </div>
                  <Badge variant="outline">$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card 6 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <Navigation className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Adventure</Badge>
                  <Badge variant="outline">Beşiktaş</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Bosphorus Bridge Climb</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Adrenaline-pumping climb to the top of the Bosphorus Bridge 
                  with panoramic views and safety equipment provided.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.7 (89)</span>
                  </div>
                  <Badge variant="outline">$$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Map Placeholder */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore Activities on the Map
          </h2>
          <Card className="border-0 shadow-lg">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
                <p className="text-gray-600">View all activities with pins and detailed information</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Activities on the Map</h3>
            {(() => {
              console.log("Category pins:", activitiesLocations?.length, activitiesLocations?.map(p => p.name))
              return null
            })()}
            <InteractiveMap 
              locations={activitiesLocations}
              className="border-2 border-gray-200"
            />
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">Click on pins to view activity details and book directly</p>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AdSenseBanner slot="activities-page" format="auto" />
          </div>
        </div>
      </section>
    </div>
  )
}
