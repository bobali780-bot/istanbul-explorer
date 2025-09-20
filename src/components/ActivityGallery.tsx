import Image from "next/image"
import type { ActivityImage } from "@/lib/supabase"

interface ActivityGalleryProps {
  images: ActivityImage[]
  activityName: string
}

export default function ActivityGallery({ images, activityName }: ActivityGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No images available</span>
      </div>
    )
  }

  // Show main image and up to 3 additional images in grid
  const mainImage = images[0]
  const additionalImages = images.slice(1, 4)

  return (
    <div className="space-y-4">
      {/* Main Hero Image */}
      <div className="relative h-96 w-full overflow-hidden rounded-lg">
        <Image
          src={mainImage.image_url}
          alt={mainImage.alt_text || `${activityName} main image`}
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>

      {/* Additional Images Grid */}
      {additionalImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {additionalImages.map((image, index) => (
            <div key={image.id} className="relative h-32 overflow-hidden rounded-lg">
              <Image
                src={image.image_url}
                alt={image.alt_text || `${activityName} image ${index + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {/* Show count if more images available */}
      {images.length > 4 && (
        <div className="text-center text-sm text-gray-600">
          +{images.length - 4} more images available
        </div>
      )}
    </div>
  )
}