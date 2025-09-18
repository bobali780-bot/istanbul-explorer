import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, MapPin, ShoppingBag, Store, Crown, Gift, Sparkles, Heart, Star as StarIcon } from "lucide-react"
import InteractiveMap from "@/components/InteractiveMap"
import AffiliateButton from "@/components/AffiliateButton"

export default function ShoppingPage() {
  // Shopping map data
  const shoppingLocations = [
    {
      id: "grand-bazaar",
      name: "Grand Bazaar",
      description: "World's oldest covered market with 4,000 shops and authentic Turkish crafts",
      coordinates: [28.9708, 41.0106] as [number, number],
      category: "shopping" as const,
      price: "$$",
      rating: 5,
      ctaText: "Visit Location",
      ctaLink: "https://www.amazon.com/grand-bazaar-guide"
    },
    {
      id: "nisantasi-shopping",
      name: "Nişantaşı Shopping District",
      description: "Upscale boutiques and designer stores in Istanbul's fashion capital",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "shopping" as const,
      price: "$$$$",
      rating: 5,
      ctaText: "Shop Now",
      ctaLink: "https://www.amazon.com/nisantasi-shopping"
    },
    {
      id: "istinye-park",
      name: "İstinye Park",
      description: "Modern shopping mall with international brands and entertainment",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "shopping" as const,
      price: "$$$",
      rating: 4,
      ctaText: "Visit Location",
      ctaLink: "https://www.amazon.com/istinye-park-guide"
    },
    {
      id: "spice-bazaar",
      name: "Spice Bazaar",
      description: "Historic market for spices, teas, and traditional Turkish souvenirs",
      coordinates: [28.9708, 41.0106] as [number, number],
      category: "shopping" as const,
      price: "$",
      rating: 5,
      ctaText: "Shop Now",
      ctaLink: "https://www.amazon.com/spice-bazaar-products"
    },
    {
      id: "cukurcuma-antiques",
      name: "Çukurcuma Antiques",
      description: "Charming neighborhood with vintage shops and unique finds",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "shopping" as const,
      price: "$$",
      rating: 4,
      ctaText: "Visit Location",
      ctaLink: "https://www.amazon.com/cukurcuma-antiques"
    },
    {
      id: "kadikoy-moda",
      name: "Kadıköy Moda",
      description: "Trendy district with local designers and hip boutiques",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "shopping" as const,
      price: "$$",
      rating: 4,
      ctaText: "Shop Now",
      ctaLink: "https://www.amazon.com/kadikoy-moda"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-900/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555529902-0b7b0b4b0b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Best Shopping in
            <span className="block text-yellow-400">Istanbul</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            From ancient bazaars to modern malls, discover Istanbul&apos;s shopping treasures
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Discover Istanbul&apos;s Shopping Paradise
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Step into a world where ancient traditions meet modern luxury. From the legendary 
              Grand Bazaar with its 4,000 shops to chic boutiques in Nişantaşı, Istanbul offers 
              an unparalleled shopping experience. Discover handcrafted treasures, designer 
              fashion, authentic souvenirs, and everything in between.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Sorting */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Find Your Perfect Shopping Experience</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Shopping Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="boutique">Boutique</SelectItem>
                    <SelectItem value="mall">Mall</SelectItem>
                    <SelectItem value="souvenir">Souvenir</SelectItem>
                    <SelectItem value="luxury">Luxury Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">$ - Budget</SelectItem>
                    <SelectItem value="moderate">$$ - Moderate</SelectItem>
                    <SelectItem value="upscale">$$$ - Upscale</SelectItem>
                    <SelectItem value="luxury">$$$$ - Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Neighborhood */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Neighborhood</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sultanahmet">Sultanahmet</SelectItem>
                    <SelectItem value="nisantasi">Nişantaşı</SelectItem>
                    <SelectItem value="taksim">Taksim</SelectItem>
                    <SelectItem value="kadikoy">Kadıköy</SelectItem>
                    <SelectItem value="besiktas">Beşiktaş</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search shops..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Sorting */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Most Popular</Button>
                  <Button variant="outline" size="sm">Highest Rated</Button>
                  <Button variant="outline" size="sm">Hidden Gems</Button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Showing 18 shopping spots in Istanbul
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Shopping Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Curated Shopping Collection</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Shopping Spot 1 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                    <Store className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">Market</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Grand Bazaar</h4>
                  <p className="text-gray-600 mb-4">World&apos;s oldest covered market with 4,000 shops and authentic Turkish crafts</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.7 (15,234)</span>
                    </div>
                    <Badge variant="outline">$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Sultanahmet • Historic • Authentic</span>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Visit Location
                  </Button>
                </CardContent>
              </Card>

              {/* Shopping Spot 2 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
                    <Crown className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-pink-500 text-white">Luxury</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Nişantaşı Shopping District</h4>
                  <p className="text-gray-600 mb-4">Upscale boutiques and designer stores in Istanbul&apos;s fashion capital</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.8 (3,456)</span>
                    </div>
                    <Badge variant="outline">$$$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Nişantaşı • Designer • Fashion</span>
                  </div>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>

              {/* Shopping Spot 3 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-blue-500 text-white">Mall</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">İstinye Park</h4>
                  <p className="text-gray-600 mb-4">Modern shopping mall with international brands and entertainment</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">4.3 (2,789)</span>
                    </div>
                    <Badge variant="outline">$$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>İstinye • Modern • International</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Visit Location
                  </Button>
                </CardContent>
              </Card>

              {/* Shopping Spot 4 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                    <Gift className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white">Souvenir</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Spice Bazaar</h4>
                  <p className="text-gray-600 mb-4">Historic market for spices, teas, and traditional Turkish souvenirs</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.6 (8,123)</span>
                    </div>
                    <Badge variant="outline">$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Eminönü • Spices • Traditional</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>

              {/* Shopping Spot 5 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-purple-500 text-white">Boutique</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Çukurcuma Antiques</h4>
                  <p className="text-gray-600 mb-4">Charming neighborhood with vintage shops and unique finds</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">4.4 (1,567)</span>
                    </div>
                    <Badge variant="outline">$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Çukurcuma • Vintage • Unique</span>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Visit Location
                  </Button>
                </CardContent>
              </Card>

              {/* Shopping Spot 6 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-teal-500 text-white">Boutique</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Kadıköy Moda</h4>
                  <p className="text-gray-600 mb-4">Trendy district with local designers and hip boutiques</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.5 (2,345)</span>
                    </div>
                    <Badge variant="outline">$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Kadıköy • Trendy • Local Designers</span>
                  </div>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Editor's Choice Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Editor&apos;s Choice</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Featured Shopping Spot 1 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-56 bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center">
                    <Store className="w-20 h-20 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">Must Visit</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Grand Bazaar</h4>
                  <p className="text-gray-600 mb-4">The world&apos;s oldest covered market with 4,000 shops, authentic Turkish crafts, and unforgettable shopping experience</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.7 (15,234)</span>
                    </div>
                    <Badge variant="outline">$$</Badge>
                  </div>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    Visit Location
                  </Button>
                </CardContent>
              </Card>

              {/* Featured Shopping Spot 2 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-56 bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center">
                    <Crown className="w-20 h-20 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-rose-500 text-white">Luxury Experience</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Zorlu Center</h4>
                  <p className="text-gray-600 mb-4">Ultimate luxury shopping destination with high-end brands, fine dining, and entertainment</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.8 (4,567)</span>
                    </div>
                    <Badge variant="outline">$$$$</Badge>
                  </div>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>

              {/* Featured Shopping Spot 3 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-56 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                    <Gift className="w-20 h-20 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-emerald-500 text-white">Hidden Gem</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Arasta Bazaar</h4>
                  <p className="text-gray-600 mb-4">Quaint bazaar behind Blue Mosque with authentic Turkish crafts and fewer crowds</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">4.3 (1,234)</span>
                    </div>
                    <Badge variant="outline">$$</Badge>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Visit Location
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Placeholder */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Shopping Spots on the Map</h3>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h4>
                <p className="text-gray-500">Click on shopping pins to view details and get directions</p>
                <p className="text-sm text-gray-400 mt-2">Map integration coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Shopping Spots on the Map</h3>
            {(() => {
              console.log("Category pins:", shoppingLocations?.length, shoppingLocations?.map(p => p.name))
              return null
            })()}
            <InteractiveMap 
              locations={shoppingLocations}
              className="border-2 border-gray-200"
            />
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">Click on pins to view shopping details and get directions</p>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner Placeholder */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 font-medium">Advertisement Space</p>
                <p className="text-sm text-gray-400">Google AdSense integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
