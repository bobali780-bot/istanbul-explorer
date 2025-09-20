import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, Clock, MapPin, Calendar, Users, ArrowLeft, ExternalLink, Camera, Info } from "lucide-react"
import { getActivityBySlug, getAllActivitySlugs, top10Activities } from "@/data/activities"

interface ActivityPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllActivitySlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params
  const activity = getActivityBySlug(slug)

  if (!activity) {
    notFound()
  }

  const activityIndex = top10Activities.findIndex(a => a.slug === slug)
  const ranking = activityIndex + 1

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full p-8 text-white">
          <div className="container mx-auto max-w-4xl">
            <Link href="/activities" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Activities
            </Link>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2">
                  #{ranking}
                </Badge>
                {activity.rating && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{activity.rating}</span>
                    {activity.reviewCount && (
                      <span className="text-sm text-white/80">
                        ({activity.reviewCount.toLocaleString()} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {activity.title}
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl">
                {activity.shortOverview}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{activity.duration || "Varies"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-semibold bg-white/20 backdrop-blur-sm border-white/30 text-white">
                    {activity.priceRange}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">About This Experience</h2>
                <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
                  {activity.fullDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* What to Expect */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-600" />
                  What to Expect
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {activity.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Information */}
              {activity.practicalInfo.included && activity.practicalInfo.included.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-green-600" />
                    What&apos;s Included
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <ul className="space-y-3">
                      {activity.practicalInfo.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-green-800">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Booking Card */}
                <Card className="shadow-lg border-2">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-gray-900">Book This Experience</CardTitle>
                    <CardDescription>
                      Skip the lines and secure your spot today
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {activity.priceRange}
                      </div>
                      <p className="text-sm text-gray-600">
                        Per person • Instant confirmation
                      </p>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    >
                      <a
                        href={activity.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book Now
                        <ExternalLink className="w-5 h-5 ml-2" />
                      </a>
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Free cancellation available • No hidden fees
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Experience Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-semibold">{activity.duration || "Varies"}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Location</span>
                        <span className="font-semibold text-right">{activity.location}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Type</span>
                        <span className="font-semibold">Cultural Experience</span>
                      </div>
                      {activity.openingHours && (
                        <>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Hours</span>
                            <span className="font-semibold text-right">{activity.openingHours}</span>
                          </div>
                        </>
                      )}
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Group Size</span>
                        <span className="font-semibold">
                          <Users className="w-4 h-4 inline mr-1" />
                          Small groups
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rating Card */}
                {activity.rating && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                          <span className="text-3xl font-bold">{activity.rating}</span>
                        </div>
                        <p className="text-gray-600">
                          Based on {activity.reviewCount?.toLocaleString()} reviews
                        </p>
                        <div className="text-sm text-gray-500">
                          Excellent rating on booking platforms
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience {activity.title}?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of travelers who have made unforgettable memories in Istanbul.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4"
              >
                <a
                  href={activity.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book This Experience
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4"
              >
                <Link href="/activities">
                  Explore More Activities
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}