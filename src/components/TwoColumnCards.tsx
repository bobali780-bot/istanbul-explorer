'use client';

import { Check, X, Clock, MapPin, Wifi, Car, Utensils, Gift, Headphones, Users, Accessibility, Baby, Heart, Camera, Shield, Info } from 'lucide-react';

interface TwoColumnCardsProps {
  whyVisit: string[] | { [key: string]: string };
  accessibility: {
    wheelchair?: boolean;
    stroller?: boolean;
    kid_friendly?: boolean;
    senior_friendly?: boolean;
    notes?: string;
  };
  facilities: {
    toilets?: boolean;
    cafe?: boolean;
    gift_shop?: boolean;
    parking?: boolean;
    wifi?: boolean;
    tours?: boolean;
    audio_guides?: boolean;
  };
  practicalInfo: {
    dress_code?: string;
    photography?: string;
    entry_requirements?: string;
    safety?: string;
    etiquette?: string;
  };
}

export default function TwoColumnCards({ whyVisit, accessibility, facilities, practicalInfo }: TwoColumnCardsProps) {
  const InfoCard = ({ title, icon, children, className = "" }: { 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoItem = ({ icon, text, available = true }: { 
    icon: React.ReactNode; 
    text: string; 
    available?: boolean;
  }) => (
    <div className="flex items-center gap-3 py-2">
      <div className={`p-1 rounded-full ${available ? 'bg-green-100' : 'bg-red-100'}`}>
        {available ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <X className="w-4 h-4 text-red-600" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-gray-700">{text}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Why Visit */}
      <InfoCard 
        title="Why Visit" 
        icon={<Heart className="w-5 h-5 text-red-600" />}
      >
        <div className="space-y-3">
          {(() => {
            let reasons: string[] = [];
            
            if (Array.isArray(whyVisit)) {
              reasons = whyVisit;
            } else if (typeof whyVisit === 'object' && whyVisit !== null) {
              // Handle object format with numbered keys
              reasons = Object.values(whyVisit).filter(value => typeof value === 'string');
            }
            
            return reasons.length > 0 ? reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-100 mt-0.5">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700 leading-relaxed">{reason}</span>
              </div>
            )) : (
              <div className="text-sm text-gray-500 italic">No information available</div>
            );
          })()}
        </div>
      </InfoCard>

      {/* Accessibility */}
      <InfoCard 
        title="Accessibility" 
        icon={<Accessibility className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-2">
          {accessibility.wheelchair && (
            <InfoItem 
              icon={<Accessibility className="w-4 h-4 text-blue-600" />}
              text="Wheelchair Accessible"
              available={accessibility.wheelchair}
            />
          )}
          {accessibility.stroller && (
            <InfoItem 
              icon={<Baby className="w-4 h-4 text-green-600" />}
              text="Stroller Friendly"
              available={accessibility.stroller}
            />
          )}
          {accessibility.kid_friendly && (
            <InfoItem 
              icon={<Users className="w-4 h-4 text-purple-600" />}
              text="Kid Friendly"
              available={accessibility.kid_friendly}
            />
          )}
          {accessibility.senior_friendly && (
            <InfoItem 
              icon={<Heart className="w-4 h-4 text-pink-600" />}
              text="Senior Friendly"
              available={accessibility.senior_friendly}
            />
          )}
          {accessibility.notes && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <span className="text-sm text-blue-800">{accessibility.notes}</span>
              </div>
            </div>
          )}
        </div>
      </InfoCard>

      {/* Facilities */}
      <InfoCard 
        title="Facilities" 
        icon={<Gift className="w-5 h-5 text-green-600" />}
      >
        <div className="space-y-2">
          {facilities.toilets && (
            <InfoItem 
              icon={<MapPin className="w-4 h-4 text-gray-600" />}
              text="Public Toilets Available"
              available={facilities.toilets}
            />
          )}
          {facilities.cafe && (
            <InfoItem 
              icon={<Utensils className="w-4 h-4 text-orange-600" />}
              text="Cafe/Restaurant"
              available={facilities.cafe}
            />
          )}
          {facilities.gift_shop && (
            <InfoItem 
              icon={<Gift className="w-4 h-4 text-purple-600" />}
              text="Gift Shop"
              available={facilities.gift_shop}
            />
          )}
          {facilities.parking && (
            <InfoItem 
              icon={<Car className="w-4 h-4 text-blue-600" />}
              text="Parking Available"
              available={facilities.parking}
            />
          )}
          {facilities.wifi && (
            <InfoItem 
              icon={<Wifi className="w-4 h-4 text-green-600" />}
              text="Free WiFi"
              available={facilities.wifi}
            />
          )}
          {facilities.tours && (
            <InfoItem 
              icon={<Users className="w-4 h-4 text-indigo-600" />}
              text="Guided Tours"
              available={facilities.tours}
            />
          )}
          {facilities.audio_guides && (
            <InfoItem 
              icon={<Headphones className="w-4 h-4 text-pink-600" />}
              text="Audio Guides"
              available={facilities.audio_guides}
            />
          )}
        </div>
      </InfoCard>

      {/* Practical Information */}
      <InfoCard 
        title="Practical Information" 
        icon={<Shield className="w-5 h-5 text-orange-600" />}
      >
        <div className="space-y-3">
          {practicalInfo.dress_code && (
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-orange-100 mt-0.5">
                <Info className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">Dress Code:</span>
                <p className="text-sm text-gray-700">{practicalInfo.dress_code}</p>
              </div>
            </div>
          )}
          
          {practicalInfo.photography && (
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-blue-100 mt-0.5">
                <Camera className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">Photography:</span>
                <p className="text-sm text-gray-700">{practicalInfo.photography}</p>
              </div>
            </div>
          )}
          
          {practicalInfo.entry_requirements && (
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-green-100 mt-0.5">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">Entry Requirements:</span>
                <p className="text-sm text-gray-700">{practicalInfo.entry_requirements}</p>
              </div>
            </div>
          )}
          
          {practicalInfo.safety && (
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-red-100 mt-0.5">
                <Shield className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">Safety Notes:</span>
                <p className="text-sm text-gray-700">{practicalInfo.safety}</p>
              </div>
            </div>
          )}
          
          {practicalInfo.etiquette && (
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-purple-100 mt-0.5">
                <Info className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">Etiquette Tips:</span>
                <p className="text-sm text-gray-700">{practicalInfo.etiquette}</p>
              </div>
            </div>
          )}
        </div>
      </InfoCard>
    </div>
  );
}
