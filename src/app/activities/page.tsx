"use client"

// Force deployment update
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, ArrowRight } from "lucide-react"
import { top10Activities } from "@/data/activities"

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Top 10 Things to Do in <span className="text-yellow-400">Istanbul</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Discover the magic of Istanbul through its iconic landmarks, rich cultural heritage,
            culinary adventures, and unforgettable experiences that bridge Europe and Asia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg">
              Explore Activities
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg">
              View Map
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Experience Istanbul Like Never Before
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              From ancient Byzantine churches to Ottoman palaces, bustling bazaars to serene Bosphorus cruises,
              Istanbul offers a perfect blend of cultural immersion, historical exploration, adventurous discoveries,
              and authentic food experiences. Our carefully curated top 10 list ensures you don&apos;t miss the
              essential experiences that define this magnificent city.
            </p>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold text-xl">🏛️</span>
                </div>
                <h3 className="font-semibold">Cultural Heritage</h3>
                <p className="text-sm text-gray-600">Byzantine & Ottoman treasures</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-orange-600 font-bold text-xl">🕌</span>
                </div>
                <h3 className="font-semibold">Historic Sites</h3>
                <p className="text-sm text-gray-600">Iconic landmarks & monuments</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold text-xl">🍽️</span>
                </div>
                <h3 className="font-semibold">Food Experiences</h3>
                <p className="text-sm text-gray-600">Traditional cuisine & markets</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold text-xl">⛵</span>
                </div>
                <h3 className="font-semibold">Adventure</h3>
                <p className="text-sm text-gray-600">Cruises, tours & unique activities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 Activities Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Top 10 Must-Do Activities in Istanbul
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto place-items-center">
            {top10Activities.map((activity, index) => (
              <Card key={activity.slug} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    width={400}
                    height={256}
                    className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-black font-bold">
                    #{index + 1}
                  </Badge>
                  {activity.rating && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{activity.rating}</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {activity.shortOverview}
                    </CardDescription>
                  </CardHeader>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration || "Varies"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-lg font-semibold min-w-[100px] text-center px-4 py-2">
                        {activity.priceRange}
                      </Badge>
                      {activity.reviewCount && (
                        <span className="text-sm text-gray-500">
                          {activity.reviewCount.toLocaleString()} reviews
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <a
                        href={activity.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/activities/${activity.slug}`}>
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Explore Istanbul?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Plan your perfect Istanbul adventure with our curated experiences and insider recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4">
                Plan My Trip
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4">
                View All Destinations
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}