'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Calendar, TrendingUp, MapPin, Send } from 'lucide-react'
import { AIChatbot } from '@/components/AIChatbot'
import NewsletterSignup from '@/components/NewsletterSignup'

export default function InsiderWeeklyPage() {

  // Placeholder articles - you'll add real ones later
  const articles = [
    {
      id: 1,
      slug: "hidden-coffee-spots-only-locals-know",
      title: "Hidden Coffee Spots Only Locals Know",
      excerpt: "Discover 5 cozy cafes in Karaköy that tourists walk right past. From rooftop views to vintage interiors, these spots are Istanbul's best-kept secrets.",
      date: "October 1, 2025",
      category: "Food & Drink",
      image: "/Coffee.jpg"
    },
    {
      id: 2,
      slug: "best-bosphorus-sunset-viewing-points",
      title: "Best Bosphorus Sunset Viewing Points",
      excerpt: "Where to catch the most stunning sunsets over the Bosphorus. Free locations, hidden terraces, and the perfect timing for golden hour photography.",
      date: "September 24, 2025",
      category: "Activities",
      image: "/Camlica-Hill.jpg"
    },
    {
      id: 3,
      slug: "authentic-shopping-beyond-the-grand-bazaar",
      title: "Authentic Shopping Beyond the Grand Bazaar",
      excerpt: "Skip the tourist crowds and explore local markets where Istanbulites actually shop. Fresh produce, handmade crafts, and unbeatable prices.",
      date: "September 17, 2025",
      category: "Shopping",
      image: "/Kadıköy.jpg"
    }
  ]

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Newsletter Signup */}
        <section
          className="relative text-white py-24 pt-32 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/Insider.jpg)'
          }}
        >
          <div className="container mx-auto px-8 max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full mb-6">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Weekly Insider Tips</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Istanbul Insider Weekly
            </h1>

            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Get exclusive local tips, hidden gems, and insider recommendations delivered to your inbox every two weeks.
            </p>

            {/* Newsletter Form */}
            <NewsletterSignup variant="hero" />
          </div>
        </section>

        {/* What You'll Get Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-8 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <MapPin className="w-10 h-10 text-purple-600 mb-4" />
                  <CardTitle>Hidden Gems</CardTitle>
                  <CardDescription>
                    Discover places only locals know about - cafes, shops, and viewpoints tourists miss.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
                  <CardTitle>What's Trending</CardTitle>
                  <CardDescription>
                    Stay updated on the hottest new restaurants, events, and seasonal activities in Istanbul.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Calendar className="w-10 h-10 text-purple-600 mb-4" />
                  <CardTitle>Seasonal Tips</CardTitle>
                  <CardDescription>
                    Get timely advice on when to visit attractions, avoid crowds, and catch special events.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-8 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Recent Insider Posts</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.id} href={`/insider-weekly/${article.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      <CardTitle className="text-xl mb-2 hover:text-purple-600 transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-block bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Coming Soon Message */}
            <div className="mt-12 text-center bg-white rounded-lg p-8 border-2 border-dashed border-gray-300">
              <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">More Articles Coming Soon</h3>
              <p className="text-gray-600 mb-4">
                We publish new insider tips every two weeks. Subscribe to never miss a post!
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </section>
      </div>

      <AIChatbot />
    </>
  )
}
