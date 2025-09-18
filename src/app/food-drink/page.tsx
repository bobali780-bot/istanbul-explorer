"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MapPin, 
  Star, 
  Filter, 
  Search,
  Utensils,
  Coffee,
  Wine,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  Bookmark,
  Phone,
  Globe,
  Navigation
} from "lucide-react"
import InteractiveMap from "@/components/InteractiveMap"
import AffiliateButton from "@/components/AffiliateButton"

export default function FoodDrinkPage() {
  // Food & Drink map data
  const foodLocations = [
    {
      id: "four-seasons-restaurant",
      name: "Four Seasons Hotel Restaurant",
      description: "Historic luxury dining with stunning Hagia Sophia views",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "food" as const,
      price: "$$$$",
      rating: 5,
      ctaText: "Reserve Table",
      ctaLink: "https://www.tripadvisor.com/four-seasons-restaurant"
    },
    {
      id: "pera-palace-restaurant",
      name: "Pera Palace Hotel Restaurant",
      description: "Iconic Belle Époque dining with Agatha Christie connections",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "food" as const,
      price: "$$$",
      rating: 5,
      ctaText: "Reserve Table",
      ctaLink: "https://www.tripadvisor.com/pera-palace-restaurant"
    },
    {
      id: "ciragan-palace-restaurant",
      name: "Çırağan Palace Restaurant",
      description: "Ottoman palace dining on the Bosphorus",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "food" as const,
      price: "$$$$",
      rating: 5,
      ctaText: "Reserve Table",
      ctaLink: "https://www.tripadvisor.com/ciragan-palace-restaurant"
    },
    {
      id: "grand-bazaar-cafe",
      name: "Grand Bazaar Traditional Café",
      description: "Authentic Turkish coffee and traditional sweets",
      coordinates: [28.9708, 41.0106] as [number, number],
      category: "food" as const,
      price: "$",
      rating: 4,
      ctaText: "Order Now",
      ctaLink: "https://www.tripadvisor.com/grand-bazaar-cafe"
    },
    {
      id: "spice-bazaar-tea",
      name: "Spice Bazaar Tea House",
      description: "Traditional Turkish tea and spice tasting",
      coordinates: [28.9708, 41.0106] as [number, number],
      category: "food" as const,
      price: "$",
      rating: 4,
      ctaText: "Visit Location",
      ctaLink: "https://www.tripadvisor.com/spice-bazaar-tea"
    },
    {
      id: "taksim-street-food",
      name: "Taksim Street Food Tour",
      description: "Authentic street food experience in vibrant Taksim",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "food" as const,
      price: "$$",
      rating: 4,
      ctaText: "Book Tour",
      ctaLink: "https://www.tripadvisor.com/taksim-street-food"
    }
  ]
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-red-900/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Best Places to Eat in Istanbul
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Discover Istanbul&apos;s rich food culture from street vendors to fine dining
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
              A Culinary Journey Through Istanbul
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From sizzling kebabs in historic markets to innovative fusion cuisine in trendy neighborhoods, 
              Istanbul&apos;s dining scene is as diverse as its culture. Experience authentic Turkish flavors, 
              fresh Mediterranean ingredients, and world-class hospitality in settings that range from 
              centuries-old caravanserais to modern rooftop terraces with Bosphorus views.
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
                  <SelectValue placeholder="Cuisine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  <SelectItem value="turkish">Turkish</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="street-food">Street Food</SelectItem>
                  <SelectItem value="fine-dining">Fine Dining</SelectItem>
                  <SelectItem value="cafe">Café</SelectItem>
                  <SelectItem value="seafood">Seafood</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                </SelectContent>
              </Select>
              
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
                  <SelectValue placeholder="Neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="sultanahmet">Sultanahmet</SelectItem>
                  <SelectItem value="taksim">Taksim</SelectItem>
                  <SelectItem value="kadikoy">Kadıköy</SelectItem>
                  <SelectItem value="beyoglu">Beyoğlu</SelectItem>
                  <SelectItem value="besiktas">Beşiktaş</SelectItem>
                  <SelectItem value="karakoy">Karaköy</SelectItem>
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
                  <SelectItem value="hidden-gems">Hidden Gems</SelectItem>
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
            {/* Featured Restaurant 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-64 bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center">
                  <Utensils className="w-20 h-20 text-white" />
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
                  <Badge variant="outline">Fine Dining</Badge>
                  <Badge variant="outline">Sultanahmet</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Asitane Restaurant</h3>
                <p className="text-gray-600 mb-4">
                  Historic Ottoman cuisine in a 15th-century caravanserai. 
                  Experience authentic recipes from the palace kitchens with modern presentation.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (1,234)</span>
                  </div>
                  <Badge variant="outline">$$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                    Reserve Table
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Restaurant 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-64 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Coffee className="w-20 h-20 text-white" />
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
                  <Badge variant="outline">Café</Badge>
                  <Badge variant="outline">Karaköy</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Karabatak Coffee</h3>
                <p className="text-gray-600 mb-4">
                  Artisanal coffee roastery in a converted warehouse. 
                  Single-origin beans, expert baristas, and the perfect Turkish coffee experience.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.8 (856)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                    Order Takeout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Restaurant 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-64 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Wine className="w-20 h-20 text-white" />
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
                  <Badge variant="outline">Mediterranean</Badge>
                  <Badge variant="outline">Beyoğlu</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">360 Istanbul</h3>
                <p className="text-gray-600 mb-4">
                  Rooftop dining with panoramic Bosphorus views. 
                  Modern Mediterranean cuisine, extensive wine list, and unforgettable sunsets.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.7 (2,134)</span>
                  </div>
                  <Badge variant="outline">$$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    Reserve Table
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Curated Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            All Restaurants & Cafés
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Restaurant Card 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
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
                  <Badge variant="outline">Turkish</Badge>
                  <Badge variant="outline">Taksim</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Çiya Sofrası</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Authentic Anatolian cuisine with recipes from different regions. 
                  Fresh ingredients and traditional cooking methods in a cozy setting.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.8 (1,456)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                    Reserve Table
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Card 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
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
                  <Badge variant="outline">Street Food</Badge>
                  <Badge variant="outline">Kadıköy</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Kadıköy Fish Market</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Fresh seafood and traditional fish restaurants. 
                  Choose your fish and have it cooked to perfection with local spices.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.6 (892)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Order Takeout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Card 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Coffee className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Café</Badge>
                  <Badge variant="outline">Beşiktaş</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Mandabatmaz</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Historic coffee house serving traditional Turkish coffee since 1967. 
                  Authentic atmosphere and the perfect cup of coffee experience.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (567)</span>
                  </div>
                  <Badge variant="outline">$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Order Takeout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Card 4 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Wine className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Fine Dining</Badge>
                  <Badge variant="outline">Beyoğlu</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Mikla</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Contemporary Turkish cuisine with Scandinavian influences. 
                  Rooftop location with stunning city views and innovative dishes.
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700">
                    Reserve Table
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Card 5 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
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
                  <Badge variant="outline">Turkish</Badge>
                  <Badge variant="outline">Sultanahmet</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Deraliye Ottoman Cuisine</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Traditional Ottoman recipes in a historic setting. 
                  Authentic flavors with modern presentation and excellent service.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.7 (789)</span>
                  </div>
                  <Badge variant="outline">$$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                    Reserve Table
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Card 6 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Coffee className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Café</Badge>
                  <Badge variant="outline">Karaköy</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Federal Coffee Company</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Modern coffee culture meets traditional Turkish hospitality. 
                  Specialty drinks, light meals, and a trendy atmosphere.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.5 (1,123)</span>
                  </div>
                  <Badge variant="outline">$$</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                  <Button size="sm" className="flex-1 bg-pink-600 hover:bg-pink-700">
                    Order Takeout
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
            Explore Restaurants on the Map
          </h2>
          <Card className="border-0 shadow-lg">
            <div className="h-96 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
                <p className="text-gray-600">View all restaurants with pins and detailed information</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Restaurants & Cafés on the Map</h3>
            <InteractiveMap 
              locations={foodLocations}
              center={[28.9784, 41.0082]}
              zoom={11}
              className="border-2 border-gray-200"
            />
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">Click on pins to view restaurant details and make reservations</p>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner Placeholder */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="h-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">Google AdSense Banner Placeholder</p>
          </div>
        </div>
      </section>
    </div>
  )
}
