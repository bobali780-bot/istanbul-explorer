import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, Clock, MapPin, Calendar, Users, ArrowLeft, ExternalLink, Camera, Info } from "lucide-react"
import ActivityGallery from "@/components/ActivityGallery"
import TwoColumnCards from "@/components/TwoColumnCards"
import RelatedContentRows from "@/components/RelatedContentRows"
import ReviewsSection from "@/components/ReviewsSection"
import { getActivityBySlug, getAllActivitySlugs } from "@/lib/api"
import type { Activity } from "@/lib/supabase"

interface ActivityPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const resolvedParams = await params
  const activity = await getActivityBySlug(resolvedParams.slug)

  if (!activity) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Navigation */}
        <div className="relative z-10 p-8">
          <div className="container mx-auto max-w-6xl">
            <Link href="/activities" className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Activities
            </Link>
          </div>
        </div>

        {/* Activity Gallery */}
        <div className="container mx-auto px-8 max-w-6xl mb-8">
          <ActivityGallery images={activity.activity_images} activityName={activity.name} />
        </div>

        {/* Activity Info */}
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2">
                #{activity.id}
              </Badge>
              {activity.rating && (
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-lg">{activity.rating}</span>
                  {activity.review_count && (
                    <span className="text-sm text-gray-600">
                      ({activity.review_count.toLocaleString()} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
              {activity.name}
            </h1>

            {/* SEO Hook */}
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {activity.seo_hook || "Discover one of Istanbul's most captivating destinations"}
            </p>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl">
              {activity.short_overview || activity.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <span>{activity.duration || "Varies"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-lg font-semibold px-4 py-2">
                  {activity.price_range}
                </Badge>
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
                  {activity.full_description && activity.full_description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {!activity.full_description && activity.description && (
                    <p>{activity.description}</p>
                  )}
                </div>
              </div>

              {/* Two Column Cards */}
              <TwoColumnCards 
                whyVisit={activity.why_visit || []}
                accessibility={activity.accessibility || {}}
                facilities={activity.facilities || {}}
                practicalInfo={activity.practical_info || {}}
              />

              {/* Related Content Rows */}
              <RelatedContentRows 
                currentItem={{
                  id: activity.id.toString(),
                  title: activity.name,
                  coordinates: activity.coordinates || { lat: 0, lng: 0 },
                  category: activity.category || 'activities'
                }}
              />

              {/* Reviews Section */}
              {activity.activity_reviews && activity.activity_reviews.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    Traveler Reviews
                  </h3>
                  <div className="space-y-4 mb-6">
                    {activity.activity_reviews.map((review, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {review.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{review.name}</p>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-sm font-semibold text-gray-700">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.text}</p>
                      </div>
                    ))}
                  </div>
                  {activity.trip_advisor_url && (
                    <div className="text-center">
                      <Button asChild variant="outline" size="lg">
                        <a
                          href={activity.trip_advisor_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">T</span>
                          </div>
                          Read more reviews on TripAdvisor
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Reviews Section */}
              <ReviewsSection 
                overallRating={activity.rating || 4.8}
                reviewCount={activity.review_count || 1247}
                reviews={activity.activity_reviews || []}
              />

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
                        {activity.price_range}
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
                        href={activity.booking_url}
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
                      {activity.opening_hours && (
                        <>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Hours</span>
                            <span className="font-semibold text-right">{activity.opening_hours}</span>
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
                          Based on {activity.review_count?.toLocaleString()} reviews
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
              Ready to Experience {activity.name}?
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
                  href={activity.booking_url}
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