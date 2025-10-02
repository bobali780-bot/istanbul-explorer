'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AIChatbot } from '@/components/AIChatbot'
import NewsletterSignup from '@/components/NewsletterSignup'

const articles = {
  'hidden-coffee-spots-only-locals-know': {
    title: "Hidden Coffee Spots Only Locals Know",
    date: "October 1, 2025",
    category: "Food & Drink",
    image: "/Coffee.jpg",
    excerpt: "Discover 5 cozy cafes in Karaköy that tourists walk right past. From rooftop views to vintage interiors, these spots are Istanbul's best-kept secrets.",
    content: `
<p class="text-lg text-gray-700 mb-6">Istanbul's coffee culture runs deep, but most tourists never venture beyond the obvious spots. Today, I'm sharing my favorite hidden cafes in Karaköy—places where locals actually go for their daily brew.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">1. Karabatak</h2>
<p class="text-gray-700 mb-4">Tucked away on a quiet side street, Karabatak serves some of the best specialty coffee in the neighborhood. The baristas here are serious about their craft, and the vintage industrial interior makes it the perfect spot to escape the tourist crowds.</p>
<p class="text-gray-700 mb-6"><strong>What to order:</strong> Their single-origin pour-over changes weekly—ask what they're featuring.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">2. Mut Karaköy</h2>
<p class="text-gray-700 mb-4">This rooftop gem offers stunning Bosphorus views that rival any fancy restaurant, but at coffee shop prices. The outdoor terrace is perfect for watching ferries pass by while sipping expertly crafted flat whites.</p>
<p class="text-gray-700 mb-6"><strong>Local tip:</strong> Come around 4 PM to catch the golden hour light—it's magical for photos.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">3. Kronotrop</h2>
<p class="text-gray-700 mb-4">While they have multiple locations, the Karaköy branch remains a local favorite. They roast their own beans and the quality is consistently excellent. The minimalist Scandinavian interior is Instagram-worthy without trying too hard.</p>
<p class="text-gray-700 mb-6"><strong>Don't miss:</strong> Their house blend as a cortado—perfectly balanced.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">4. Fazıl Bey Turkish Coffee</h2>
<p class="text-gray-700 mb-4">For traditional Turkish coffee done right, this is where locals come. No frills, no fuss—just perfectly brewed Turkish coffee using beans roasted on-site for over 130 years. The owner will often greet you personally.</p>
<p class="text-gray-700 mb-6"><strong>Pro tip:</strong> Order it "orta şekerli" (medium sugar) to get the authentic balance.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">5. Geyik Coffee Roastery</h2>
<p class="text-gray-700 mb-4">This micro-roastery is where serious coffee geeks congregate. The space is tiny—just a few stools at a bar—but the quality of coffee is exceptional. They often have experimental brewing methods going on.</p>
<p class="text-gray-700 mb-6"><strong>Insider knowledge:</strong> Chat with the baristas about their latest roast—they love talking coffee and might give you samples.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">Getting There</h2>
<p class="text-gray-700 mb-4">All these cafes are within a 10-minute walk of each other in Karaköy. The easiest way is to take the tram to Karaköy station and wander the side streets. Half the fun is discovering them tucked between historic buildings.</p>

<p class="text-gray-700 mt-8 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600"><strong>Final tip:</strong> Most of these places get busy around 11 AM-2 PM. Visit early morning (8-9 AM) or mid-afternoon (3-4 PM) for the best experience and easiest seating.</p>
    `
  },
  'best-bosphorus-sunset-viewing-points': {
    title: "Best Bosphorus Sunset Viewing Points",
    date: "September 24, 2025",
    category: "Activities",
    image: "/Camlica-Hill.jpg",
    excerpt: "Where to catch the most stunning sunsets over the Bosphorus. Free locations, hidden terraces, and the perfect timing for golden hour photography.",
    content: `
<p class="text-lg text-gray-700 mb-6">There's something magical about watching the sun set over the Bosphorus, painting the water in shades of orange and pink while the minarets are silhouetted against the sky. Here are my favorite spots—from free public spaces to hidden gems.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">1. Çamlıca Hill (Asian Side)</h2>
<p class="text-gray-700 mb-4">This is Istanbul's highest point and offers 360-degree views of the entire city. While it's become more popular, arriving 45 minutes before sunset still gives you plenty of space. The view of the sun setting behind the European side while the entire city lights up below is unforgettable.</p>
<p class="text-gray-700 mb-6"><strong>Best time:</strong> October through March for clearer skies and fewer crowds.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">2. Bebek Park Waterfront</h2>
<p class="text-gray-700 mb-4">A local favorite that tourists rarely discover. This small waterfront park in the upscale Bebek neighborhood offers unobstructed Bosphorus views. Grab a simit from a nearby vendor and find a bench—the sunset reflects beautifully off the water here.</p>
<p class="text-gray-700 mb-6"><strong>Photography tip:</strong> The old fishing boats in the foreground make for perfect compositional elements.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">3. Maiden's Tower Viewpoint (Salacak)</h2>
<p class="text-gray-700 mb-4">While everyone focuses on the Maiden's Tower itself, the Salacak waterfront across from it is where locals gather for sunset. You'll get the iconic tower silhouetted against the setting sun, with the European side as a backdrop.</p>
<p class="text-gray-700 mb-6"><strong>Local secret:</strong> The tea gardens here serve fresh tea for just a few lira—much cheaper than tourist spots.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">4. Yıldız Park Upper Terraces</h2>
<p class="text-gray-700 mb-4">This massive Ottoman-era park has several elevated terraces that overlook the Bosphorus. It's peaceful, surrounded by trees, and offers a unique perspective. The walk up is worth it for the tranquility alone.</p>
<p class="text-gray-700 mb-6"><strong>Combo idea:</strong> Visit the Yıldız Palace Museum beforehand, then catch sunset in the park.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">5. Galata Bridge Upper Level</h2>
<p class="text-gray-700 mb-4">Yes, it's touristy, but the view of the sun setting behind Süleymaniye Mosque from the bridge is iconic for a reason. The key is positioning yourself on the Karaköy end, facing the Golden Horn and Old City.</p>
<p class="text-gray-700 mb-6"><strong>Timing:</strong> Arrive 20 minutes early to secure a good spot on the railing.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">Golden Hour Timing</h2>
<p class="text-gray-700 mb-4">Istanbul sunset times vary dramatically by season:</p>
<ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
  <li><strong>Summer (June-August):</strong> Around 8:00-8:30 PM</li>
  <li><strong>Fall (September-November):</strong> 6:00-7:00 PM</li>
  <li><strong>Winter (December-February):</strong> 5:00-5:30 PM</li>
  <li><strong>Spring (March-May):</strong> 6:30-7:30 PM</li>
</ul>

<p class="text-gray-700 mt-8 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600"><strong>Pro photographer tip:</strong> The best light isn't at sunset itself, but 20-30 minutes after. This "blue hour" gives you that dreamy purple-pink sky that makes Istanbul photos go viral.</p>
    `
  },
  'authentic-shopping-beyond-the-grand-bazaar': {
    title: "Authentic Shopping Beyond the Grand Bazaar",
    date: "September 17, 2025",
    category: "Shopping",
    image: "/Kadıköy.jpg",
    excerpt: "Skip the tourist crowds and explore local markets where Istanbulites actually shop. Fresh produce, handmade crafts, and unbeatable prices.",
    content: `
<p class="text-lg text-gray-700 mb-6">The Grand Bazaar is impressive, but it's not where locals shop. If you want authentic Istanbul shopping experiences with real prices and actual neighbors haggling over tomatoes, these are the markets you need to know about.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">1. Kadıköy Tuesday Market (Salı Pazarı)</h2>
<p class="text-gray-700 mb-4">Every Tuesday, Kadıköy's streets transform into Istanbul's largest street market. This is where Istanbulites from both sides of the Bosphorus come for fresh produce, spices, textiles, and everything in between. The energy is electric and prices are a fraction of tourist areas.</p>
<p class="text-gray-700 mb-6"><strong>What to buy:</strong> Fresh Turkish cheeses, olives, dried fruits, and handmade ceramics. Bring cash and a reusable bag.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">2. Çukurcuma Antique District</h2>
<p class="text-gray-700 mb-4">Wandering these steep streets in Beyoğlu feels like stepping into an antique treasure hunt. Family-run shops sell everything from Ottoman-era furniture to vintage Turkish movie posters. Unlike the Grand Bazaar, shopkeepers here are passionate collectors, not aggressive sellers.</p>
<p class="text-gray-700 mb-6"><strong>Hidden gem:</strong> Look for copper coffee pots and vintage Turkish textiles—much more authentic than tourist shops.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">3. Beşiktaş Saturday Market</h2>
<p class="text-gray-700 mb-4">This Saturday market sprawls through several streets near the Beşiktaş ferry terminal. It's where working-class Istanbul shops for the week. You'll find incredibly fresh fish, seasonal produce, cheap clothing, and the most flavorful street food.</p>
<p class="text-gray-700 mb-6"><strong>Don't miss:</strong> The pickle vendors and the gözleme (Turkish crepes) stands—get one filled with spinach and cheese.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">4. Arasta Bazaar</h2>
<p class="text-gray-700 mb-4">Behind the Blue Mosque, this small covered bazaar is what the Grand Bazaar was like 50 years ago. Smaller, calmer, with shopkeepers who actually craft what they sell. Look for hand-painted ceramics, quality carpets, and traditional Turkish lamps.</p>
<p class="text-gray-700 mb-6"><strong>Bargaining tip:</strong> Prices here are more fair to begin with, so don't haggle too aggressively—offer 15-20% less and meet in the middle.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">5. Çiçek Pasajı Side Streets</h2>
<p class="text-gray-700 mb-4">While tourists photograph the famous flower passage, locals shop in the surrounding streets for artisanal foods. Find authentic Turkish delight makers, specialty tea shops, and old-school spice merchants who've been there for generations.</p>
<p class="text-gray-700 mb-6"><strong>Insider buy:</strong> Visit Kurukahveci Mehmet Efendi for the freshest Turkish coffee beans—locals line up here daily.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">Shopping Etiquette</h2>
<p class="text-gray-700 mb-4">A few tips for shopping like a local:</p>
<ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
  <li>Learn basic Turkish numbers for negotiating</li>
  <li>Always carry small bills—vendors often claim they have no change</li>
  <li>Visit in the morning when produce is freshest and crowds are smaller</li>
  <li>Don't be shy about tasting before buying at food stalls</li>
  <li>Bring your own bag—it's better for the environment and marks you as a local</li>
</ul>

<h2 class="text-2xl font-bold mt-8 mb-4">Best Times to Visit</h2>
<p class="text-gray-700 mb-4">Most neighborhood markets run 8 AM - 6 PM, but the sweet spot is 9-11 AM when everything is fresh and vendors are energetic. By afternoon, produce gets picked over and vendors start packing up.</p>

<p class="text-gray-700 mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600"><strong>Money-saving tip:</strong> Visit markets an hour before closing (around 5 PM). Vendors often discount perishables they don't want to pack up. I've gotten organic produce for half price this way!</p>
    `
  }
}

export default function InsiderPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = articles[slug as keyof typeof articles]

  if (!article) {
    notFound()
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Image */}
        <div
          className="h-[60vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${article.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-4xl">
              <Link href="/insider-weekly">
                <Button variant="ghost" className="text-white mb-4 hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Insider Weekly
                </Button>
              </Link>
              <span className="inline-block bg-purple-600 text-white text-sm px-3 py-1 rounded-full mb-4">
                {article.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="container mx-auto max-w-4xl px-8 py-16">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Newsletter CTA */}
          <div className="mt-16">
            <NewsletterSignup 
              variant="default" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0"
            />
          </div>
        </article>
      </div>

      <AIChatbot />
    </>
  )
}
