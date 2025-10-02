'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, Heart } from 'lucide-react';
import Link from 'next/link';

interface NearbyVenue {
  id: number;
  name: string;
  slug: string;
  description?: string;
  rating?: number;
  review_count?: number;
  price_range?: string;
  price_from?: number;
  price_to?: number;
  currency?: string;
  price_unit?: string;
  location?: string;
  image_url?: string;
  distance: number;
  walkingTime: number;
}

interface RelatedContentRowsProps {
  relatedExperiences: NearbyVenue[];
  shoppingNearby: NearbyVenue[];
  foodDrinkNearby: NearbyVenue[];
  currentCategory: 'shopping' | 'hotels' | 'restaurants' | 'activities';
}

export default function RelatedContentRows({
  relatedExperiences,
  shoppingNearby,
  foodDrinkNearby,
  currentCategory
}: RelatedContentRowsProps) {

  const RelatedRow = ({
    title,
    items,
    icon,
    categorySlug
  }: {
    title: string;
    items: NearbyVenue[];
    icon: React.ReactNode;
    categorySlug: string;
  }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    const scroll = (direction: 'left' | 'right') => {
      if (isScrolling) return;
      setIsScrolling(true);

      const container = document.getElementById(`scroll-${title.toLowerCase().replace(/\s+/g, '-')}`);
      if (container) {
        const scrollAmount = 300;
        const newPosition = direction === 'left'
          ? Math.max(0, scrollPosition - scrollAmount)
          : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

        container.scrollTo({ left: newPosition, behavior: 'smooth' });
        setScrollPosition(newPosition);
      }

      setTimeout(() => setIsScrolling(false), 300);
    };

    if (!items || items.length === 0) return null;

    return (
      <div className="mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {icon}
            {title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={scrollPosition === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          id={`scroll-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${categorySlug}/${item.slug}`}
              className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-40">
                {item.image_url ? (
                  <img
                    src={`/api/proxy-image?url=${encodeURIComponent(item.image_url)}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">No image</div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded font-medium">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {item.distance} km • {item.walkingTime} min walk
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {item.name}
                </h4>

                {item.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                    {item.review_count && (
                      <span className="text-xs text-gray-500">({item.review_count})</span>
                    )}
                  </div>
                )}

                {item.location && (
                  <div className="text-xs text-gray-600 mb-2 line-clamp-1">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {item.location}
                  </div>
                )}

                {(item.price_from || item.price_range) && (
                  <div className="text-sm font-semibold text-purple-600">
                    {item.price_from ? `From £${item.price_from.toFixed(0)}` : item.price_range}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Determine category slug for links
  const getCategorySlug = (category: string) => {
    const slugMap: Record<string, string> = {
      'shopping': 'shopping',
      'restaurants': 'food-drink',
      'hotels': 'hotels',
      'activities': 'activities'
    };
    return slugMap[category] || category;
  };

  return (
    <div className="space-y-8 w-full">
      {/* Related Experiences (same category) */}
      {relatedExperiences && relatedExperiences.length > 0 && (
        <RelatedRow
          title="Related Experiences"
          items={relatedExperiences}
          icon={<MapPin className="w-5 h-5 text-purple-600" />}
          categorySlug={getCategorySlug(currentCategory)}
        />
      )}

      {/* Shopping Nearby */}
      {shoppingNearby && shoppingNearby.length > 0 && currentCategory !== 'shopping' && (
        <RelatedRow
          title="Shopping Nearby"
          items={shoppingNearby}
          icon={<MapPin className="w-5 h-5 text-green-600" />}
          categorySlug="shopping"
        />
      )}

      {/* Food & Drink Nearby */}
      {foodDrinkNearby && foodDrinkNearby.length > 0 && (
        <RelatedRow
          title="Food & Drink Nearby"
          items={foodDrinkNearby}
          icon={<MapPin className="w-5 h-5 text-orange-600" />}
          categorySlug="food-drink"
        />
      )}
    </div>
  );
}
