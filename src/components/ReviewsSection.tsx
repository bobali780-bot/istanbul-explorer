'use client';

import { Star, Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
}

interface ReviewsSectionProps {
  overallRating: number;
  reviewCount: number;
  reviews: Review[];
}

export default function ReviewsSection({ overallRating, reviewCount, reviews }: ReviewsSectionProps) {
  // Sample data for now
  const sampleReviews: Review[] = [
    {
      id: '1',
      name: 'Sarah M.',
      rating: 5,
      text: 'Absolutely breathtaking! The blue tiles are even more stunning in person. Make sure to visit during prayer times to experience the spiritual atmosphere.',
      date: '2 days ago',
      verified: true
    },
    {
      id: '2',
      name: 'Ahmed K.',
      rating: 5,
      text: 'One of the most beautiful mosques I\'ve ever visited. The architecture is incredible and the history is fascinating. Highly recommend a guided tour.',
      date: '1 week ago',
      verified: true
    },
    {
      id: '3',
      name: 'Maria L.',
      rating: 4,
      text: 'Beautiful mosque with amazing architecture. Gets quite crowded during peak hours, so try to visit early in the morning for a more peaceful experience.',
      date: '2 weeks ago',
      verified: false
    },
    {
      id: '4',
      name: 'James R.',
      rating: 5,
      text: 'The Blue Mosque is a must-visit in Istanbul. The intricate tile work and massive dome are awe-inspiring. Don\'t forget to dress modestly!',
      date: '3 weeks ago',
      verified: true
    },
    {
      id: '5',
      name: 'Fatima A.',
      rating: 5,
      text: 'Stunning mosque with incredible attention to detail. The blue tiles create such a peaceful atmosphere. Perfect for reflection and prayer.',
      date: '1 month ago',
      verified: true
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : sampleReviews;
  const displayRating = overallRating || 4.8;
  const displayCount = reviewCount || 1247;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-8">Reviews & Testimonials</h3>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            {renderStars(Math.floor(displayRating))}
          </div>
          <span className="text-2xl font-bold text-gray-900">{displayRating}</span>
          <span className="text-lg text-gray-600">Excellent</span>
        </div>
        <p className="text-sm text-gray-600">
          Based on {displayCount.toLocaleString()} reviews
        </p>
      </div>

      <div className="space-y-6">
        {displayReviews.slice(0, 8).map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{review.name}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed pl-10">
              {review.text}
            </p>
          </div>
        ))}
      </div>

      {displayReviews.length > 8 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all {displayCount} reviews
          </button>
        </div>
      )}
    </div>
  );
}
