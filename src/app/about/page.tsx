import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Users, Star, Compass, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About Us | Best Istanbul",
  description: "Discover the story behind Best Istanbul - your curated guide to experiencing the magic of Istanbul, crafted by locals who love this city.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-20" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/about-us.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="container mx-auto px-8 max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
            About Best Istanbul
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome, Future Istanbul Explorer!
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
            We're passionate locals who believe Istanbul deserves to be explored authentically, not just ticked off a bucket list.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-8 max-w-4xl">
          {/* Our Story */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            </div>
            <div className="prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed">
              <p>
                Istanbul isn't just a city—it's an experience. With 2,600+ years of history sprawled across two continents,
                planning your perfect trip can feel overwhelming. Should you visit the Blue Mosque or the Süleymaniye Mosque?
                Which Grand Bazaar shops are authentic? Where do locals actually eat?
              </p>
              <p>
                That's where we come in. Best Istanbul was born from a simple frustration: too many travelers were missing
                the city's magic because they were drowning in generic reviews and outdated recommendations.
              </p>
              <p>
                We decided to create something different—a carefully curated guide that combines must-see landmarks with
                hidden gems, backed by real reviews from actual visitors. No sponsored placements. No tourist traps.
                Just honest, locally-vetted recommendations that help you experience Istanbul the way it deserves to be experienced.
              </p>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">What Makes Us Different</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">Locally Curated</h3>
                      <p className="text-gray-600 text-sm">
                        Every recommendation is hand-picked by Istanbul residents who know the city inside out.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Star className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">Real Reviews</h3>
                      <p className="text-gray-600 text-sm">
                        Authentic ratings from verified visitors, not paid promotions or fake reviews.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">Beyond the Tourist Trail</h3>
                      <p className="text-gray-600 text-sm">
                        Yes, visit the Blue Mosque. But we'll also show you where locals grab coffee afterward.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">For Every Traveler</h3>
                      <p className="text-gray-600 text-sm">
                        History buffs, foodies, shopaholics, or sunset chasers—we've got you covered.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Promise */}
          <div className="mb-16">
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Our Promise to You</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <p className="text-gray-700">
                    <strong>Quality Over Quantity:</strong> Every venue is verified for quality, accessibility, and visitor experience
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <p className="text-gray-700">
                    <strong>Always Updated:</strong> We regularly refresh our recommendations to ensure accuracy
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <p className="text-gray-700">
                    <strong>Transparent Booking:</strong> Clear pricing with no hidden fees when you book experiences
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <p className="text-gray-700">
                    <strong>No Sponsored Content:</strong> Our recommendations are based on merit, not money
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Explore Istanbul?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're planning your first trip or your tenth, we're here to help you discover something extraordinary.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/activities">
                  Discover Activities
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/food-drink">
                  Explore Dining
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/shopping">
                  Browse Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-8 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Have Questions or Suggestions?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We're always improving and would love to hear from you. Got a hidden gem we missed? A venue that wowed you? Let us know!
            </p>
            <p className="text-blue-200">
              Istanbul is constantly evolving, and so are we. Check back often for new recommendations and updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
