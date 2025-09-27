import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Star, Clock, MapPin, Calendar, Users, ArrowLeft, ExternalLink, Camera, 
  Info, Accessibility, Wifi, Coffee, ShoppingBag, Car, Headphones, 
  UserCheck, Baby, Utensils, Gift, Shield, CameraIcon,
  Clock3, Navigation, Heart, Share2, Download
} from "lucide-react"

// DUMMY DATA - This represents the ideal schema structure
const dummyBlueMosque = {
  // Basic Info
  id: 1,
  name: "Blue Mosque (Sultan Ahmed Mosque)",
  slug: "blue-mosque-sultan-ahmed",
  hero_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  
  // Rating & Reviews
  rating: 4.7,
  review_count: 111004,
  booking_price: "€25",
  
  // Rich Description (Firecrawl → GPT → Basic fallback)
  description: {
    enriched: true,
    source: "Firecrawl + GPT Enhancement",
    content: `The Blue Mosque stands as one of the most magnificent examples of classical Ottoman architecture, a masterpiece that has captivated visitors for over four centuries. Commissioned by Sultan Ahmed I in the early 17th century, this architectural marvel represents the pinnacle of Islamic artistry and engineering prowess.

Built between 1609 and 1616, the mosque's construction was an ambitious undertaking that required the finest craftsmen from across the Ottoman Empire. The building's most distinctive feature is its interior adorned with over 20,000 handmade ceramic tiles in various shades of blue, giving it the name by which it's known worldwide.

The mosque's six minarets were unprecedented at the time of construction, causing controversy as they equaled the number at the Great Mosque of Mecca. The interior showcases a perfect harmony of Islamic art with its massive central dome, semi-domes, and intricate calligraphy that tells the story of Ottoman grandeur and spiritual devotion.`
  },
  
  // What to Expect
  highlights: [
    "Six minarets - an architectural first in mosque design",
    "Over 20,000 handmade blue Iznik tiles",
    "Massive central dome with intricate Islamic calligraphy",
    "Active place of worship with daily prayer services",
    "Historic significance as a symbol of Ottoman power"
  ],
  
  duration: "2-3 hours",
  
  // Why Visit
  why_visit: [
    "Architectural masterpiece representing 400+ years of Ottoman heritage",
    "Living place of worship where visitors can experience authentic Islamic culture",
    "UNESCO World Heritage site with unparalleled historical significance",
    "Central location in Istanbul's historic peninsula, easily accessible",
    "Free entry allowing everyone to appreciate this cultural treasure"
  ],
  
  // Accessibility & Facilities
  accessibility: {
    wheelchair_accessible: true,
    stroller_friendly: true,
    kid_friendly: true,
    senior_friendly: true,
    accessibility_notes: "Ramp access available, elevator to upper galleries, accessible restrooms on ground floor"
  },
  
  facilities: {
    toilets: true,
    cafe_restaurant: true,
    gift_shop: true,
    parking: true,
    wifi: false,
    audio_guide: true,
    guided_tours: true
  },
  
  // Practical Information
  practical_info: {
    dress_code: "Modest dress required - women must cover hair, shoulders, and legs. Scarves and wraps available for rent.",
    photography_policy: "Photography allowed in main prayer area. No flash photography during prayer times.",
    entry_requirements: "Free entry for all visitors. No advance booking required.",
    safety_notes: "Secure bag storage available. Visitors must remove shoes before entering prayer areas.",
    etiquette_tips: "Maintain silence during prayer times. Follow the designated visitor route to avoid disrupting worshippers."
  },
  
  // Insider Tips
  insider_tips: [
    "Visit early morning (8:30-9:30 AM) to avoid crowds and experience the mosque in peaceful solitude",
    "The best photo opportunities are from the courtyard at sunset when the minarets are silhouetted against the sky",
    "Combine your visit with Hagia Sophia across the square - both are most magical when visited together"
  ],
  
  // Experience Details
  opening_hours: "Daily: 8:30 AM - 6:30 PM (Closed during prayer times: 12:30-2:00 PM, 3:30-4:00 PM, 5:30-6:00 PM)",
  location: "Sultanahmet, Fatih, Istanbul 34122",
  address: "Sultanahmet, Fatih, Istanbul 34122",
  district: "Sultanahmet",
  type: "Religious Site & Tourist Attraction",
  
  // Reviews Summary
  reviews_summary: "Excellent rating on booking platforms",
  sample_reviews: [
    {
      author: "Sarah M.",
      rating: 5,
      comment: "Absolutely breathtaking! The blue tiles are even more beautiful in person. A must-visit in Istanbul.",
      date: "2024-09-15"
    },
    {
      author: "Ahmed K.",
      rating: 5,
      comment: "Peaceful and magnificent. The architecture is incredible and the atmosphere is very spiritual.",
      date: "2024-09-12"
    }
  ],
  
  // Photo Gallery
  gallery_images: [
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1570939274-30914ee6e44f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514649923863-ceaf75b7ec40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1605553910095-d3ddb6c99ad8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1588392382834-a891154bca4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564622052879-2e7bb6adda0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1599461428079-35a5a1eb9739?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607970579778-d5978b33a9fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1568849676085-51415703900f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  
  // Version History (Admin Only - Hidden from end users)
  version_history: [
    {
      version: "v3.2",
      status: "approved",
      timestamp: "2024-09-25T10:30:00Z",
      changes: "GPT-enhanced description, added accessibility details, updated facilities info",
      source: "AI Enhancement + Manual Review"
    },
    {
      version: "v3.1", 
      status: "approved",
      timestamp: "2024-09-24T15:45:00Z",
      changes: "Firecrawl enrichment added practical information and insider tips",
      source: "Firecrawl + Manual Curation"
    },
    {
      version: "v3.0",
      status: "approved", 
      timestamp: "2024-09-24T09:15:00Z",
      changes: "Initial scrape with 15 high-quality images and basic venue information",
      source: "Google Places + Unsplash + Pexels"
    }
  ]
}

export default function BlueMosqueDummyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <div className="relative h-[70vh] w-full overflow-hidden">
          <img
            src={dummyBlueMosque.hero_image}
            alt={dummyBlueMosque.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Navigation */}
          <div className="absolute top-0 left-0 right-0 z-10 p-8">
            <div className="container mx-auto max-w-6xl">
              <Link href="/activities" className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Activities
              </Link>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
            <div className="container mx-auto max-w-6xl">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2">
                    UNESCO World Heritage
                  </Badge>
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{dummyBlueMosque.rating}</span>
                    <span className="text-sm text-gray-600">
                      ({dummyBlueMosque.review_count.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                  {dummyBlueMosque.name}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-lg">
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="w-5 h-5" />
                    <span>{dummyBlueMosque.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span>{dummyBlueMosque.district}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg font-semibold px-4 py-2 bg-white/90 text-black">
                      Free Entry
                    </Badge>
                  </div>
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
              
              {/* About This Experience */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">About This Experience</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      ✨ {dummyBlueMosque.description.source} - Premium Content
                    </p>
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
                    {dummyBlueMosque.description.content.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-600" />
                  What to Expect
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {dummyBlueMosque.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">{highlight}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Duration: {dummyBlueMosque.duration}</span>
                </div>
              </div>

              {/* Why Visit */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  Why Visit
                </h3>
                <div className="space-y-4">
                  {dummyBlueMosque.why_visit.map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 font-medium">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility & Facilities */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Accessibility className="w-6 h-6 text-green-600" />
                  Accessibility & Facilities
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Accessibility Card */}
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <Accessibility className="w-5 h-5" />
                        Accessibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Accessibility className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Wheelchair Accessible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Baby className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Stroller Friendly</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Kid & Senior Friendly</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        {dummyBlueMosque.accessibility.accessibility_notes}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Facilities Card */}
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Info className="w-5 h-5" />
                        Facilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Café</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Gift Shop</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Parking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Headphones className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Audio Guide</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Guided Tours Available</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Practical Information */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  Practical Information
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Dress Code</h4>
                    <p className="text-gray-700 text-sm">{dummyBlueMosque.practical_info.dress_code}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Photography Policy</h4>
                    <p className="text-gray-700 text-sm">{dummyBlueMosque.practical_info.photography_policy}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Entry Requirements</h4>
                    <p className="text-gray-700 text-sm">{dummyBlueMosque.practical_info.entry_requirements}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Safety & Etiquette</h4>
                    <p className="text-gray-700 text-sm">{dummyBlueMosque.practical_info.safety_notes}</p>
                    <p className="text-gray-700 text-sm mt-2">{dummyBlueMosque.practical_info.etiquette_tips}</p>
                  </div>
                </div>
              </div>

              {/* Insider Tips */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Insider Tips
                </h3>
                <div className="space-y-4">
                  {dummyBlueMosque.insider_tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        💡
                      </div>
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  Traveler Reviews
                </h3>
                <div className="mb-6">
                  <p className="text-gray-600">{dummyBlueMosque.reviews_summary}</p>
                </div>
                <div className="space-y-4">
                  {dummyBlueMosque.sample_reviews.map((review, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {review.author.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.author}</p>
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
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Booking Card */}
                <Card className="shadow-lg border-2">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-gray-900">Experience This Wonder</CardTitle>
                    <CardDescription>
                      Free entry • No booking required
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        Free Entry
                      </div>
                      <p className="text-sm text-gray-600">
                        Open to all visitors • Respectful dress required
                      </p>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    >
                      <Link href="#directions">
                        Get Directions
                        <Navigation className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Best visited early morning or late afternoon
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Experience Details Card */}
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
                        <span className="font-semibold">{dummyBlueMosque.duration}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Type</span>
                        <span className="font-semibold">{dummyBlueMosque.type}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Hours</span>
                        <span className="font-semibold text-right text-sm">{dummyBlueMosque.opening_hours}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Location</span>
                        <span className="font-semibold text-right text-sm">{dummyBlueMosque.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rating Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                        <span className="text-3xl font-bold">{dummyBlueMosque.rating}</span>
                      </div>
                      <p className="text-gray-600">
                        Based on {dummyBlueMosque.review_count.toLocaleString()} reviews
                      </p>
                      <div className="text-sm text-gray-500">
                        {dummyBlueMosque.reviews_summary}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Photo Gallery Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-purple-600" />
                      Photo Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {dummyBlueMosque.gallery_images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${dummyBlueMosque.name} view ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <CameraIcon className="w-4 h-4 mr-2" />
                      View All {dummyBlueMosque.gallery_images.length} Photos
                    </Button>
                  </CardContent>
                </Card>

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
              Ready to Experience {dummyBlueMosque.name}?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join millions of travelers who have been inspired by this architectural masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4"
              >
                <Link href="#directions">
                  Get Directions
                </Link>
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

      {/* Admin-Only Version History (Hidden from end users) */}
      {process.env.NODE_ENV === 'development' && (
        <section className="py-8 bg-gray-100 border-t">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                🔧 Admin-Only: Version History
              </h3>
              <div className="space-y-3">
                {dummyBlueMosque.version_history.map((version, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={version.status === 'approved' ? 'default' : 'secondary'}>
                        {version.version}
                      </Badge>
                      <span className="text-sm text-gray-500">{version.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{version.changes}</p>
                    <p className="text-xs text-gray-500">Source: {version.source}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
