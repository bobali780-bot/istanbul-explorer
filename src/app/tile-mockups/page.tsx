'use client';

import { useState } from 'react';
import { Heart, Star, MapPin, Clock, Users, Camera, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample data for mockups
const sampleActivities = [
  {
    id: '1',
    name: 'Hagia Sophia Grand Mosque',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 1247,
    duration: '2-3 hours',
    price: 'Free entry',
    distance: '0.2 km',
    category: 'Historical Sites',
    description: 'A magnificent architectural masterpiece that has served as both a church and mosque throughout history.'
  },
  {
    id: '2',
    name: 'The Blue Mosque',
    image: 'https://images.unsplash.com/photo-1598980916677-fd805b180c3c?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 111022,
    duration: '1 hour',
    price: 'Free entry',
    distance: '0.0 km',
    category: 'Religious Sites',
    description: 'Famous for its stunning blue tiles and six minarets, this mosque is a must-visit in Istanbul.'
  },
  {
    id: '3',
    name: 'Topkapi Palace',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 89234,
    duration: '3-4 hours',
    price: 'From €15',
    distance: '0.5 km',
    category: 'Palaces & Museums',
    description: 'The former residence of Ottoman sultans, now a museum showcasing imperial treasures.'
  },
  {
    id: '4',
    name: 'Grand Bazaar',
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 45678,
    duration: '2-3 hours',
    price: 'Free entry',
    distance: '0.8 km',
    category: 'Shopping',
    description: 'One of the world\'s oldest and largest covered markets with over 4,000 shops.'
  }
];

// Design Variations
const TileDesigns = {
  'design-1': {
    name: 'Minimalist Card',
    description: 'Clean, simple design with subtle shadows and minimal text'
  },
  'design-2': {
    name: 'Gradient Overlay',
    description: 'Dark gradient overlay with white text for better readability'
  },
  'design-3': {
    name: 'Floating Card',
    description: 'Elevated card with rounded corners and hover effects'
  },
  'design-4': {
    name: 'Image-First',
    description: 'Large image with overlay information and floating elements'
  },
  'design-5': {
    name: 'Luxury Travel',
    description: 'Premium design with sophisticated typography and spacing'
  },
  'design-6': {
    name: 'Grid Layout',
    description: 'Compact grid with essential information and clean lines'
  }
};

export default function TileMockupsPage() {
  const [selectedDesign, setSelectedDesign] = useState<string>('design-1');
  const [currentActivity, setCurrentActivity] = useState(0);

  const nextActivity = () => {
    setCurrentActivity((prev) => (prev + 1) % sampleActivities.length);
  };

  const prevActivity = () => {
    setCurrentActivity((prev) => (prev - 1 + sampleActivities.length) % sampleActivities.length);
  };

  const activity = sampleActivities[currentActivity];

  const renderTileDesign = (design: string) => {
    switch (design) {
      case 'design-1':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-48 object-cover"
              />
              <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-600 font-medium">{activity.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{activity.rating}</span>
                  <span className="text-xs text-gray-500">({activity.reviewCount.toLocaleString()})</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{activity.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {activity.distance}
                  </span>
                </div>
                <span className="font-medium text-green-600">{activity.price}</span>
              </div>
            </div>
          </div>
        );

      case 'design-2':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button className="absolute top-3 right-3 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Heart className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs text-white/80 font-medium">{activity.category}</span>
                <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{activity.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-medium">{activity.rating}</span>
                  <span className="text-white/80 text-xs">({activity.reviewCount.toLocaleString()})</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {activity.distance}
                  </span>
                </div>
                <span className="font-medium text-green-600">{activity.price}</span>
              </div>
            </div>
          </div>
        );

      case 'design-3':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative">
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-48 object-cover"
              />
              <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
              <div className="absolute top-3 left-3">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {activity.category}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{activity.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{activity.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    Duration
                  </span>
                  <span className="font-medium">{activity.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    Distance
                  </span>
                  <span className="font-medium">{activity.distance}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">{activity.price}</span>
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'design-4':
        return (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-56">
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs text-white/90 font-medium mb-1 block">{activity.category}</span>
                <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">{activity.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">{activity.rating}</span>
                  </div>
                  <span className="text-white/80 text-sm">({activity.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {activity.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {activity.distance}
                    </span>
                  </div>
                  <span className="text-white font-bold text-lg">{activity.price}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'design-5':
        return (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="relative overflow-hidden">
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <button className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                  {activity.category}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-2xl mb-2 line-clamp-2">{activity.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{activity.rating}</span>
                  </div>
                  <span className="text-white/80 text-sm">({activity.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{activity.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="font-semibold text-sm">{activity.duration}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Distance</div>
                  <div className="font-semibold text-sm">{activity.distance}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">{activity.price}</span>
                <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'design-6':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-40 object-cover"
              />
              <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-3 h-3 text-gray-600" />
              </button>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-blue-600 font-medium">{activity.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium">{activity.rating}</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{activity.name}</h3>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activity.distance}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">{activity.price}</span>
                <span className="text-xs text-gray-400">({activity.reviewCount.toLocaleString()})</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tile Design Mockups</h1>
          <p className="text-lg text-gray-600">Choose your favorite tile design for the live site</p>
        </div>

        {/* Design Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Design:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(TileDesigns).map(([key, design]) => (
              <button
                key={key}
                onClick={() => setSelectedDesign(key)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedDesign === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm mb-1">{design.name}</div>
                <div className="text-xs text-gray-500">{design.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Activity:</h2>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevActivity}
              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="font-medium text-gray-900">{activity.name}</div>
              <div className="text-sm text-gray-500">{activity.category}</div>
            </div>
            <button
              onClick={nextActivity}
              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tile Preview */}
        <div className="flex justify-center">
          <div className="w-80">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {TileDesigns[selectedDesign as keyof typeof TileDesigns].name}
            </h3>
            {renderTileDesign(selectedDesign)}
          </div>
        </div>

        {/* Grid Preview */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Grid Layout Preview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleActivities.map((activity) => (
              <div key={activity.id}>
                {renderTileDesign(selectedDesign)}
              </div>
            ))}
          </div>
        </div>

        {/* Selection Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Design</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="font-medium text-blue-900 mb-2">
              {TileDesigns[selectedDesign as keyof typeof TileDesigns].name}
            </div>
            <div className="text-blue-700 text-sm">
              {TileDesigns[selectedDesign as keyof typeof TileDesigns].description}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            This design will be applied to all activity tiles on your live site.
          </div>
        </div>
      </div>
    </div>
  );
}
