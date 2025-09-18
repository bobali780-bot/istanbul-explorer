import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Compass, Camera, Heart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            5 Day Sprint Framework
            <span className="block text-3xl text-blue-600 dark:text-blue-400 mt-2">
              Installed Successfully
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your Istanbul Explorer project is ready for development. 
            Discover the best places to visit in Istanbul with our curated travel guide platform.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Primary CTA - Starter Kit */}
          <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">View Starter Kit</CardTitle>
              <CardDescription className="text-base">
                Explore your Istanbul Explorer demo with intelligent features
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/application">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Launch Demo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Secondary - Component Showcase */}
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Component Showcase</CardTitle>
              <CardDescription className="text-base">
                Browse the complete shadcn/ui ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full">
                  View Components
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tertiary - Login Examples */}
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl">Login Examples</CardTitle>
              <CardDescription className="text-base">
                Authentication patterns and forms
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full">
                  View Examples
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Development Workflow */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Development Workflow</CardTitle>
              <CardDescription className="text-center">
                From project discussion to deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Plan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Define features</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Build</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Implement features</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Test</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Localhost verification</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">4</span>
                  </div>
                  <h3 className="font-semibold">Deploy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Production ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
