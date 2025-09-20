import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, ArrowRight } from "lucide-react"
import type { Activity } from "@/lib/supabase"

interface ActivityCardProps {
  activity: Activity
  index: number
}

export default function ActivityCard({ activity, index }: ActivityCardProps) {
  const firstImage = activity.activity_images?.[0]

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
      <div className="relative overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage.image_url}
            alt={firstImage.alt_text || activity.name}
            width={400}
            height={256}
            className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="h-64 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
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
            {activity.name}
          </CardTitle>
          <CardDescription className="text-gray-600 line-clamp-2">
            {activity.short_overview || activity.description}
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
              {activity.price_range}
            </Badge>
            {activity.review_count && (
              <span className="text-sm text-gray-500">
                {activity.review_count.toLocaleString()} reviews
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
            <a
              href={activity.booking_url}
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
  )
}