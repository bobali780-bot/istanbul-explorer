import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, MapPin, Wifi, Car, Coffee, Dumbbell, Waves, Shield, Heart } from "lucide-react"
import InteractiveMap from "@/components/InteractiveMap"
import AffiliateButton from "@/components/AffiliateButton"
import AdSenseBanner from "@/components/AdSenseBanner"

export default function HotelsPage() {
  // Real Hotels data from Booking.com
  const hotelsLocations = [
    {
      id: "four-seasons-sultanahmet",
      name: "Four Seasons Hotel Istanbul at Sultanahmet",
      description: "Luxury hotel set in a former prison building in the heart of historic Sultanahmet. Features elegant rooms with Hagia Sophia views, a spa, and fine dining restaurant. Perfect for exploring Istanbul's most famous attractions.",
      coordinates: [28.9801, 41.0086] as [number, number],
      category: "hotels" as const,
      price: "$$$$",
      rating: 4.7,
      ctaText: "Book Now",
      ctaLink: "https://www.booking.com/hotel/tr/four-seasons-istanbul-at-sultanahmet.html"
    },
    {
      id: "pera-palace-hotel",
      name: "Pera Palace Hotel",
      description: "Historic Belle Époque hotel in Pera district, famous for hosting Agatha Christie and other notable guests. Features elegant rooms, a spa, and the iconic Orient Bar. A perfect blend of history and luxury.",
      coordinates: [28.9846, 41.0340] as [number, number],
      category: "hotels" as const,
      price: "$$$",
      rating: 4.5,
      ctaText: "Book Now",
      ctaLink: "https://www.booking.com/hotel/tr/pera-palace.html"
    },
    {
      id: "ciragan-palace-kempinski",
      name: "Çırağan Palace Kempinski",
      description: "Luxury hotel in a restored Ottoman palace on the Bosphorus shore. Features opulent suites, world-class spa, multiple restaurants, and stunning waterfront views. The ultimate in Istanbul luxury.",
      coordinates: [29.0006, 41.0390] as [number, number],
      category: "hotels" as const,
      price: "$$$$",
      rating: 4.6,
      ctaText: "Book Now",
      ctaLink: "https://www.booking.com/hotel/tr/ciragan-palace-kempinski.html"
    },
    {
      id: "conrad-istanbul-bosphorus",
      name: "Conrad Istanbul Bosphorus",
      description: "Modern luxury hotel in Beşiktaş with panoramic Bosphorus views. Features contemporary rooms, multiple dining options, fitness center, and excellent business facilities. Ideal for both leisure and business travelers.",
      coordinates: [29.0006, 41.0390] as [number, number],
      category: "hotels" as const,
      price: "$$$",
      rating: 4.4,
      ctaText: "Book Now",
      ctaLink: "https://www.booking.com/hotel/tr/conrad-istanbul-bosphorus.html"
    },
    {
      id: "swissotel-bosphorus",
      name: "Swissotel The Bosphorus",
      description: "Family-friendly luxury resort in Beşiktaş with extensive gardens and Bosphorus views. Features multiple pools, kids' club, spa, and various dining options. Perfect for families seeking comfort and convenience.",
      coordinates: [29.0006, 41.0390] as [number, number],
      category: "hotels" as const,
      price: "$$$",
      rating: 4.3,
      ctaText: "Book Now",
      ctaLink: "https://www.booking.com/hotel/tr/swissotel-the-bosphorus.html"
    },
    {
      id: "ritz-carlton-istanbul",
      name: "The Ritz-Carlton Istanbul",
      description: "Ultimate luxury hotel in Beşiktaş with panoramic Bosphorus and city views. Features elegant rooms, Michelin-starred dining, world-class spa, and impeccable service. The pinnacle of Istanbul hospitality.",
      coordinates: [29.0006, 41.0390] as [number, number],
      category: "hotels" as const,
      price: "$$$$",
      rating: 4.8,
      ctaText: "Book Now",
      ctaLink: "https://www.booking.com/hotel/tr/ritz-carlton-istanbul.html"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Best Hotels in
            <span className="block text-yellow-400">Istanbul</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            From luxury palaces to boutique gems, find your perfect stay
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Discover Istanbul&apos;s Finest Accommodations
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you seek the grandeur of historic palaces, the charm of boutique hotels, 
              or the comfort of modern accommodations, Istanbul offers an unparalleled range of 
              stays. From luxury resorts with Bosphorus views to budget-friendly options in 
              vibrant neighborhoods, find your perfect home away from home.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Sorting */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Find Your Perfect Stay</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

              {/* Hotel Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Hotel Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="boutique">Boutique</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amenities</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Amenities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pool">Pool</SelectItem>
                    <SelectItem value="spa">Spa</SelectItem>
                    <SelectItem value="breakfast">Free Breakfast</SelectItem>
                    <SelectItem value="attractions">Near Attractions</SelectItem>
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
                    <SelectItem value="taksim">Taksim</SelectItem>
                    <SelectItem value="bosphorus">Bosphorus</SelectItem>
                    <SelectItem value="kadikoy">Kadıköy</SelectItem>
                    <SelectItem value="besiktas">Beşiktaş</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sorting */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Most Popular</Button>
                  <Button variant="outline" size="sm">Highest Rated</Button>
                  <Button variant="outline" size="sm">Best Value</Button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Showing 24 hotels in Istanbul
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Hotel Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Curated Hotel Collection</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Hotel 1 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">Luxury</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Four Seasons Hotel Istanbul</h4>
                  <p className="text-gray-600 mb-4">Historic luxury in Sultanahmet with stunning Hagia Sophia views</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.9 (1,247)</span>
                    </div>
                    <Badge variant="outline">$$$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Wifi className="w-4 h-4" />
                    <Car className="w-4 h-4" />
                    <Coffee className="w-4 h-4" />
                    <span>Free WiFi • Parking • Breakfast</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              {/* Hotel 2 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-pink-500 text-white">Boutique</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Pera Palace Hotel</h4>
                  <p className="text-gray-600 mb-4">Iconic Belle Époque hotel with Agatha Christie connections</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.8 (892)</span>
                    </div>
                    <Badge variant="outline">$$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Waves className="w-4 h-4" />
                    <Coffee className="w-4 h-4" />
                    <span>Spa • Breakfast • Historic</span>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              {/* Hotel 3 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white">Budget</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Cheers Hostel</h4>
                  <p className="text-gray-600 mb-4">Vibrant hostel in Taksim with rooftop views and social atmosphere</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">4.2 (567)</span>
                    </div>
                    <Badge variant="outline">$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Wifi className="w-4 h-4" />
                    <Coffee className="w-4 h-4" />
                    <span>Free WiFi • Breakfast • Social</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              {/* Hotel 4 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                    <Waves className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-orange-500 text-white">Luxury</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Çırağan Palace Kempinski</h4>
                  <p className="text-gray-600 mb-4">Ottoman palace on the Bosphorus with world-class spa facilities</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.9 (1,156)</span>
                    </div>
                    <Badge variant="outline">$$$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Waves className="w-4 h-4" />
                    <Car className="w-4 h-4" />
                    <Coffee className="w-4 h-4" />
                    <span>Spa • Parking • Breakfast</span>
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              {/* Hotel 5 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                    <Dumbbell className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-indigo-500 text-white">Business</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Conrad Istanbul Bosphorus</h4>
                  <p className="text-gray-600 mb-4">Modern business hotel with fitness center and meeting facilities</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.7 (743)</span>
                    </div>
                    <Badge variant="outline">$$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Wifi className="w-4 h-4" />
                    <Dumbbell className="w-4 h-4" />
                    <Coffee className="w-4 h-4" />
                    <span>Free WiFi • Gym • Breakfast</span>
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              {/* Hotel 6 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-48 bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-teal-500 text-white">Family</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Swissotel The Bosphorus</h4>
                  <p className="text-gray-600 mb-4">Family-friendly resort with pools and kids&apos; activities</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.6 (1,089)</span>
                    </div>
                    <Badge variant="outline">$$$</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Waves className="w-4 h-4" />
                    <Car className="w-4 h-4" />
                    <Coffee className="w-4 h-4" />
                    <span>Pool • Parking • Breakfast</span>
                  </div>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Book Now
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
              {/* Featured Hotel 1 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-56 bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center">
                    <Shield className="w-20 h-20 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">Editor&apos;s Pick</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">The Ritz-Carlton Istanbul</h4>
                  <p className="text-gray-600 mb-4">Ultimate luxury with panoramic Bosphorus views and Michelin-starred dining</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.9 (1,456)</span>
                    </div>
                    <Badge variant="outline">$$$$</Badge>
                  </div>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              {/* Featured Hotel 2 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-56 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Heart className="w-20 h-20 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-purple-500 text-white">Hidden Gem</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Georges Hotel Galata</h4>
                  <p className="text-gray-600 mb-4">Boutique hotel in historic Galata with rooftop terrace and local charm</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.8 (623)</span>
                    </div>
                    <Badge variant="outline">$$$</Badge>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              {/* Featured Hotel 3 */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="h-56 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <Waves className="w-20 h-20 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-blue-500 text-white">Best Value</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">DoubleTree by Hilton</h4>
                  <p className="text-gray-600 mb-4">Modern comfort in Taksim with excellent location and great amenities</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">4.5 (892)</span>
                    </div>
                    <Badge variant="outline">$$</Badge>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Book Now
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
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Hotels on the Map</h3>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h4>
                <p className="text-gray-500">Click on hotel pins to view details and book directly</p>
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
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Hotels on the Map</h3>
            {(() => {
              console.log("Category pins:", hotelsLocations?.length, hotelsLocations?.map(p => p.name))
              return null
            })()}
            <InteractiveMap 
              locations={hotelsLocations}
              className="border-2 border-gray-200"
            />
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">Click on pins to view hotel details and book directly</p>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AdSenseBanner slot="hotels-page" format="auto" />
          </div>
        </div>
      </section>
    </div>
  )
}
