"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Camera
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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

      {/* Quick Access Tiles */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Explore Istanbul
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Activities */}
            <Link href="/activities" className="block group">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <Navigation className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Activities</h3>
                  <p className="text-gray-600 mb-4">Tours, attractions, and experiences</p>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 group-hover:bg-blue-600 transition-colors">
                    Explore Activities
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Food & Drink */}
            <Link href="/food-drink" className="block group">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Utensils className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Food & Drink</h3>
                  <p className="text-gray-600 mb-4">Restaurants, cafes, and local cuisine</p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 group-hover:bg-orange-600 transition-colors">
                    Find Restaurants
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Shopping */}
            <Link href="/shopping" className="block group">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Shopping</h3>
                  <p className="text-gray-600 mb-4">Markets, boutiques, and souvenirs</p>
                  <Button className="w-full bg-green-500 hover:bg-green-600 group-hover:bg-green-600 transition-colors">
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Hotels */}
            <Link href="/hotels" className="block group">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Bed className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Hotels</h3>
                  <p className="text-gray-600 mb-4">Accommodations and stays</p>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 group-hover:bg-purple-600 transition-colors">
                    Book Hotels
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
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
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">#1</Badge>
              </div>
              <CardContent className="p-6">
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Experience 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">#2</Badge>
              </div>
              <CardContent className="p-6">
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
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Reserve Table
                </Button>
              </CardContent>
            </Card>

            {/* Experience 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">#3</Badge>
              </div>
              <CardContent className="p-6">
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
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Shop Now
                </Button>
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
          <Card className="border-0 shadow-lg">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
                <p className="text-gray-600">Explore all attractions, restaurants, and hotels</p>
              </div>
            </div>
          </Card>
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
