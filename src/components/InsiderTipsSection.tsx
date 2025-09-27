import React, { useState, useEffect } from 'react';
import { Lightbulb, Clock, MapPin, Users, Camera, Star, Loader2, RefreshCw, Check, Info } from 'lucide-react';

interface InsiderTip {
  id: string;
  title: string;
  description: string;
  icon: 'lightbulb' | 'clock' | 'map' | 'users' | 'camera' | 'star';
  category: 'timing' | 'photography' | 'crowds' | 'local' | 'safety' | 'experience';
}

interface InsiderTipsSectionProps {
  venueName: string;
  venueType: string;
  location?: string;
  tips?: InsiderTip[];
}

const iconMap = {
  lightbulb: Lightbulb,
  clock: Clock,
  map: MapPin,
  users: Users,
  camera: Camera,
  star: Star,
};

const categoryColors = {
  timing: 'bg-blue-100 text-blue-600',
  photography: 'bg-purple-100 text-purple-600',
  crowds: 'bg-orange-100 text-orange-600',
  local: 'bg-green-100 text-green-600',
  safety: 'bg-red-100 text-red-600',
  experience: 'bg-yellow-100 text-yellow-600',
};

export default function InsiderTipsSection({ 
  venueName, 
  venueType, 
  location, 
  tips = [] 
}: InsiderTipsSectionProps) {
  const [aiTips, setAiTips] = useState<InsiderTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useAiTips, setUseAiTips] = useState(false);

  // Default tips if none provided
  const defaultTips: InsiderTip[] = [
    {
      id: '1',
      title: 'Best Time to Visit',
      description: `Visit early in the morning (8-10 AM) to avoid crowds and get the best lighting for photos.`,
      icon: 'clock',
      category: 'timing'
    },
    {
      id: '2',
      title: 'Photography Tips',
      description: `The best photo spots are from the main courtyard. Avoid taking photos during prayer times.`,
      icon: 'camera',
      category: 'photography'
    },
    {
      id: '3',
      title: 'Local Insight',
      description: `Dress modestly and remove shoes before entering. Women should cover their heads with a scarf.`,
      icon: 'lightbulb',
      category: 'local'
    },
    {
      id: '4',
      title: 'Avoid Crowds',
      description: `Weekdays are much quieter than weekends. Avoid visiting during prayer times (12-1 PM, 3-4 PM).`,
      icon: 'users',
      category: 'crowds'
    }
  ];

  // Generate AI tips when component mounts
  useEffect(() => {
    if (venueName && !useAiTips) {
      generateAiTips();
    }
  }, [venueName]);

  const generateAiTips = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate-insider-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueName,
          venueType,
          location,
          category: venueType
        }),
      });

      const data = await response.json();
      
      if (data.success && data.tips) {
        setAiTips(data.tips);
        setUseAiTips(true);
      }
    } catch (error) {
      console.error('Failed to generate AI tips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTips = () => {
    setUseAiTips(false);
    setAiTips([]);
    generateAiTips();
  };

  const displayTips = useAiTips && aiTips.length > 0 ? aiTips : defaultTips;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900">Insider Tips</h3>
        </div>
        <button
          onClick={refreshTips}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" />
              Refresh Tips
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {displayTips.map((tip) => {
          const IconComponent = iconMap[tip.icon];
          const colorClass = categoryColors[tip.category];
          
          return (
            <div key={tip.id} className="flex items-start gap-3">
              <div className={`p-1 rounded-full ${colorClass} mt-0.5`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-full bg-blue-100">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{tip.title}:</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5" />
          <div>
            <p className="text-xs text-amber-800">
              <strong>Pro Tip:</strong> {useAiTips ? 'These AI-generated tips are personalized for this venue. ' : 'These tips are based on local knowledge and visitor experiences. '}
              Always check current conditions before visiting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}