'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, Star, Heart } from 'lucide-react';

interface RelatedItem {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  duration?: string;
  price: string;
  category: string;
  distance?: string;
}

interface RelatedContentRowsProps {
  currentItem: {
    id: string;
    title: string;
    coordinates: { lat: number; lng: number };
    category: string;
  };
}

export default function RelatedContentRows({ currentItem }: RelatedContentRowsProps) {
  const [relatedData, setRelatedData] = useState<{
    experiences: RelatedItem[];
    shopping: RelatedItem[];
    food: RelatedItem[];
    hotels: RelatedItem[];
  }>({
    experiences: [],
    shopping: [],
    food: [],
    hotels: []
  });

  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        const response = await fetch(`/api/related-content?category=${currentItem.category}&excludeId=${currentItem.id}&limit=20`);
        const result = await response.json();
        
        if (result.success) {
          // Map API response to expected format
          setRelatedData({
            experiences: result.data.activities || [],
            shopping: result.data.shopping || [],
            food: result.data.restaurants || [],
            hotels: result.data.hotels || []
          });
        } else {
          console.error('Failed to fetch related content:', result.error);
          // Fallback to empty arrays if API fails
          setRelatedData({
            experiences: [],
            shopping: [],
            food: [],
            hotels: []
          });
        }
      } catch (error) {
        console.error('Error fetching related content:', error);
        // Fallback to empty arrays if API fails
        setRelatedData({
          experiences: [],
          shopping: [],
          food: [],
          hotels: []
        });
      }
    };

    fetchRelatedContent();
  }, [currentItem]);

  const RelatedRow = ({ title, items, icon }: { title: string; items: RelatedItem[]; icon: React.ReactNode }) => {
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
            <div key={item.id} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                {item.distance && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {item.distance}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {item.title}
                </h4>
                
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                  <span className="text-xs text-gray-500">({item.reviewCount})</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  {item.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.duration}
                    </div>
                  )}
                </div>
                
                <div className="text-sm font-semibold text-blue-600">
                  {item.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 w-full">
      <RelatedRow 
        title="Related Experiences" 
        items={relatedData.experiences}
        icon={<MapPin className="w-5 h-5 text-blue-600" />}
      />
      
      <RelatedRow 
        title="Shopping Nearby" 
        items={relatedData.shopping}
        icon={<MapPin className="w-5 h-5 text-green-600" />}
      />
      
      <RelatedRow 
        title="Food & Drink Nearby" 
        items={relatedData.food}
        icon={<MapPin className="w-5 h-5 text-orange-600" />}
      />
      
      <RelatedRow 
        title="Hotels Nearby" 
        items={relatedData.hotels}
        icon={<MapPin className="w-5 h-5 text-purple-600" />}
      />
    </div>
  );
}
