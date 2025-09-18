"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Camera, 
  Heart,
  Search,
  Filter,
  ArrowRight,
  Compass,
  Building,
  Coffee,
  ShoppingBag
} from "lucide-react"

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Istanbul Explorer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your comprehensive travel guide to the best destinations, activities, and experiences in Istanbul
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Discover Istanbul
            </CardTitle>
            <CardDescription>
              Find the perfect places to visit and activities to experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">What are you looking for?</Label>
                <Input 
                  id="search" 
                  placeholder="e.g., historical sites, local cuisine, shopping..."
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Destinations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Top Destinations
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Hagia Sophia */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <Badge variant="secondary">Historical</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">Hagia Sophia</CardTitle>
                <CardDescription>
                  A masterpiece of Byzantine architecture and a symbol of Istanbul&apos;s rich history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>2-3 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Popular</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.8 (2,847 reviews)</span>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="outline" className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950">
                        <MapPin className="w-4 h-4 mr-2" />
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-96">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://koqqkpitepqwlfjymcje.supabase.co/storage/v1/object/public/brand-assets/5ds-blank.svg" />
                            <AvatarFallback>5DS</AvatarFallback>
                          </Avatar>
                          <h4 className="text-sm font-semibold">Hagia Sophia Experience</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enhance your visit with AI-powered audio guide and personalized recommendations
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md text-xs font-mono">
                          <div className="text-slate-600 dark:text-slate-400 mb-2">Claude Code Prompt (copy & paste):</div>
                          <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                            {`Add AI-powered audio guide to Istanbul Explorer. Create API route at /api/audio-guide using OpenAI API. Add OPENAI_API_KEY=[your-api-key] to .env.local. Implement text-to-speech for Hagia Sophia historical information with personalized recommendations based on user interests. Use existing shadcn/ui components and styling. After completing all tasks from this prompt, provide a 1-line feedback summary to Cursor Chat about what was accomplished.`}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full" 
                          onClick={() => navigator.clipboard.writeText(`Add AI-powered audio guide to Istanbul Explorer. Create API route at /api/audio-guide using OpenAI API. Add OPENAI_API_KEY=[your-api-key] to .env.local. Implement text-to-speech for Hagia Sophia historical information with personalized recommendations based on user interests. Use existing shadcn/ui components and styling. After completing all tasks from this prompt, provide a 1-line feedback summary to Cursor Chat about what was accomplished.`)}
                        >
                          Copy Claude Code Prompt
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardContent>
            </Card>

            {/* Grand Bazaar */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                    <Badge variant="secondary">Shopping</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">Grand Bazaar</CardTitle>
                <CardDescription>
                  One of the world&apos;s oldest and largest covered markets with over 4,000 shops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>3-4 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Must Visit</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.6 (1,923 reviews)</span>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="outline" className="w-full group-hover:bg-green-50 dark:group-hover:bg-green-950">
                        <MapPin className="w-4 h-4 mr-2" />
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-96">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://koqqkpitepqwlfjymcje.supabase.co/storage/v1/object/public/brand-assets/5ds-blank.svg" />
                            <AvatarFallback>5DS</AvatarFallback>
                          </Avatar>
                          <h4 className="text-sm font-semibold">Smart Shopping Assistant</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Get personalized shopping recommendations and price comparisons
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md text-xs font-mono">
                          <div className="text-slate-600 dark:text-slate-400 mb-2">Claude Code Prompt (copy & paste):</div>
                          <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                            {`Add smart shopping assistant to Istanbul Explorer. Create API route at /api/shopping-recommendations using OpenAI API. Add OPENAI_API_KEY=[your-api-key] to .env.local. Implement personalized product recommendations for Grand Bazaar with price comparison and vendor ratings. Use existing shadcn/ui components and styling. After completing all tasks from this prompt, provide a 1-line feedback summary to Cursor Chat about what was accomplished.`}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full" 
                          onClick={() => navigator.clipboard.writeText(`Add smart shopping assistant to Istanbul Explorer. Create API route at /api/shopping-recommendations using OpenAI API. Add OPENAI_API_KEY=[your-api-key] to .env.local. Implement personalized product recommendations for Grand Bazaar with price comparison and vendor ratings. Use existing shadcn/ui components and styling. After completing all tasks from this prompt, provide a 1-line feedback summary to Cursor Chat about what was accomplished.`)}
                        >
                          Copy Claude Code Prompt
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardContent>
            </Card>

            {/* Blue Mosque */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    <Badge variant="secondary">Religious</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">Blue Mosque</CardTitle>
                <CardDescription>
                  An iconic mosque known for its stunning blue tiles and magnificent architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>1-2 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Iconic</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.7 (1,654 reviews)</span>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="outline" className="w-full group-hover:bg-purple-50 dark:group-hover:bg-purple-950">
                        <MapPin className="w-4 h-4 mr-2" />
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-96">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://koqqkpitepqwlfjymcje.supabase.co/storage/v1/object/public/brand-assets/5ds-blank.svg" />
                            <AvatarFallback>5DS</AvatarFallback>
                          </Avatar>
                          <h4 className="text-sm font-semibold">Cultural Experience</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Learn about Islamic architecture and cultural significance with interactive guides
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md text-xs font-mono">
                          <div className="text-slate-600 dark:text-slate-400 mb-2">Claude Code Prompt (copy & paste):</div>
                          <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                            {`Add cultural experience feature to Istanbul Explorer. Create API route at /api/cultural-guide using OpenAI API. Add OPENAI_API_KEY=[your-api-key] to .env.local. Implement interactive cultural guides for Blue Mosque with architectural details and historical context. Use existing shadcn/ui components and styling. After completing all tasks from this prompt, provide a 1-line feedback summary to Cursor Chat about what was accomplished.`}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full" 
                          onClick={() => navigator.clipboard.writeText(`Add cultural experience feature to Istanbul Explorer. Create API route at /api/cultural-guide using OpenAI API. Add OPENAI_API_KEY=[your-api-key] to .env.local. Implement interactive cultural guides for Blue Mosque with architectural details and historical context. Use existing shadcn/ui components and styling. After completing all tasks from this prompt, provide a 1-line feedback summary to Cursor Chat about what was accomplished.`)}
                        >
                          Copy Claude Code Prompt
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activities Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Activities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Food Tour */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  <Badge variant="secondary">Food & Drink</Badge>
                </div>
                <CardTitle>Turkish Cuisine Tour</CardTitle>
                <CardDescription>
                  Experience authentic Turkish flavors with local food experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>4 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Small Group</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.9 (892 reviews)</span>
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-orange-50 dark:group-hover:bg-orange-950">
                    <Compass className="w-4 h-4 mr-2" />
                    Book Experience
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Photo Tour */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-pink-600" />
                  <Badge variant="secondary">Photography</Badge>
                </div>
                <CardTitle>Instagram Photo Tour</CardTitle>
                <CardDescription>
                  Capture the most photogenic spots in Istanbul with a professional photographer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>3 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Private</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.8 (456 reviews)</span>
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-pink-50 dark:group-hover:bg-pink-950">
                    <Camera className="w-4 h-4 mr-2" />
                    Book Experience
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>
              Help other travelers by sharing your Istanbul discoveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="experience">Tell us about your favorite place in Istanbul</Label>
                <Textarea 
                  id="experience" 
                  placeholder="Share your experience, tips, or recommendations..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g., Sultanahmet, Kadıköy..."
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                    ))}
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                Share Experience
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                View Components
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
