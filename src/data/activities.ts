export type Activity = {
  slug: string
  title: string
  shortOverview: string
  fullDescription: string
  image: string
  rating?: number
  reviewCount?: number
  priceRange: string
  duration?: string
  openingHours?: string
  location: string
  bookingLink: string
  highlights: string[]
  practicalInfo: {
    duration?: string
    bestTime?: string
    included?: string[]
    meetingPoint?: string
    accessibility?: string
  }
}

export const top10Activities: Activity[] = [
  {
    slug: "hagia-sophia-tour",
    title: "Hagia Sophia Tour",
    shortOverview: "Explore the Byzantine masterpiece with skip-the-line access and learn its layered history.",
    fullDescription: "The Hagia Sophia stands as one of the world's most extraordinary architectural achievements, seamlessly blending Christian and Islamic heritage. Originally built as a cathedral in 537 AD during the Byzantine Empire, it served as the world's largest cathedral for nearly 1,000 years before becoming a mosque during Ottoman rule. Today, this UNESCO World Heritage Site showcases stunning mosaics, massive dome architecture, and centuries of cultural transformation. Your guided tour includes skip-the-line access, expert commentary on its fascinating history, and time to marvel at the intricate details that make this monument truly unique.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
    rating: 4.7,
    reviewCount: 28947,
    priceRange: "From $25",
    duration: "1-2 hours",
    openingHours: "9:00 AM - 6:00 PM (varies by season)",
    location: "Sultanahmet Square, Fatih",
    bookingLink: "https://www.getyourguide.com/hagia-sophia-l2705/",
    highlights: [
      "Skip-the-line entry to avoid crowds",
      "Expert guide with historical insights",
      "Marvel at 1,500-year-old architecture",
      "See Christian mosaics and Islamic calligraphy",
      "UNESCO World Heritage Site"
    ],
    practicalInfo: {
      duration: "1-2 hours",
      bestTime: "Early morning or late afternoon",
      included: ["Skip-the-line tickets", "Professional guide", "Historical commentary"],
      meetingPoint: "Sultanahmet Square (exact location sent with booking)",
      accessibility: "Wheelchair accessible with assistance"
    }
  },
  {
    slug: "blue-mosque-visit",
    title: "Blue Mosque Visit",
    shortOverview: "Visit the stunning Sultan Ahmet Mosque, renowned for its blue tile work and majestic architecture.",
    fullDescription: "The Blue Mosque, officially known as Sultan Ahmet Mosque, represents the pinnacle of Ottoman architecture and Islamic art. Built between 1609-1616, this active mosque features six minarets, a rare architectural feature that initially caused controversy. The interior is adorned with over 20,000 handmade ceramic tiles in various shades of blue, giving the mosque its popular name. The prayer hall is crowned by a massive central dome supported by four 'elephant feet' columns. Visitors can explore the courtyard, admire the intricate tile work, and learn about Islamic culture and prayer traditions in this functioning house of worship.",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.6,
    reviewCount: 34521,
    priceRange: "Free (guided tours from $15)",
    duration: "45 minutes - 1 hour",
    openingHours: "8:30 AM - 6:00 PM (closed during prayer times)",
    location: "Sultanahmet Square, Fatih",
    bookingLink: "https://www.viator.com/Istanbul-attractions/Blue-Mosque-Sultan-Ahmet-Camii/d585-a910",
    highlights: [
      "Six magnificent minarets",
      "20,000+ handmade blue tiles",
      "Active mosque with prayer services",
      "Free entry for self-guided visits",
      "Facing Hagia Sophia across the square"
    ],
    practicalInfo: {
      duration: "45 minutes - 1 hour",
      bestTime: "Between prayer times (check schedule)",
      included: ["Free entry", "Optional guided tour available"],
      meetingPoint: "Main entrance on Sultanahmet Square",
      accessibility: "Ground floor accessible, modest dress required"
    }
  },
  {
    slug: "hagia-sophia-blue-mosque-combo",
    title: "Hagia Sophia & Blue Mosque Combo",
    shortOverview: "Get both iconic landmarks in one tour with guided access and historical insights.",
    fullDescription: "Experience Istanbul's two most iconic landmarks in one comprehensive tour that tells the story of the city's transformation from Byzantine to Ottoman capital. This combo tour provides skip-the-line access to Hagia Sophia and includes a guided visit to the Blue Mosque, offering a complete picture of Istanbul's religious and architectural heritage. Your expert guide will explain the historical rivalry and cultural exchange between these facing monuments, from the Byzantine Empire through the Ottoman period to modern Turkey. The tour includes time for photography, detailed explanations of architectural features, and insights into daily life in historic Istanbul.",
    image: "https://images.unsplash.com/photo-1578915629189-4a7c2e1c9d4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    rating: 4.8,
    reviewCount: 15623,
    priceRange: "From $45",
    duration: "2.5-3 hours",
    openingHours: "Various tour times available",
    location: "Sultanahmet Square area",
    bookingLink: "https://www.hagia-sophia-tickets.com/hagia-sophia-blue-mosque/",
    highlights: [
      "Skip-the-line access to both monuments",
      "Expert guide for historical context",
      "Compare Byzantine and Ottoman architecture",
      "Small group sizes for personalized experience",
      "Photography opportunities at both sites"
    ],
    practicalInfo: {
      duration: "2.5-3 hours",
      bestTime: "Morning tours recommended",
      included: ["Hagia Sophia skip-the-line tickets", "Professional guide", "Blue Mosque visit"],
      meetingPoint: "Sultanahmet Square (exact location provided)",
      accessibility: "Moderate walking required, dress code for mosque"
    }
  },
  {
    slug: "grand-bazaar-walking-tour",
    title: "Grand Bazaar Walking Tour",
    shortOverview: "Wander this massive historic market for sights, scents, and authentic shopping experiences.",
    fullDescription: "Step into one of the world's oldest and largest covered markets, where 4,000 shops sprawl across 61 streets in a labyrinthine maze of commerce and culture. Built in the 15th century, the Grand Bazaar has been the beating heart of Istanbul's trade for over 500 years. Your guided walking tour reveals hidden corners, explains the bazaar's unique guild system, and introduces you to master craftsmen practicing traditional arts. Learn to navigate like a local, discover authentic Turkish carpets, jewelry, ceramics, and spices, and master the art of friendly bargaining. The tour includes visits to historic hans (caravanserais) and insights into Istanbul's role as a crossroads of world trade.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.5,
    reviewCount: 15280,
    priceRange: "Free entry (guided tours from $25)",
    duration: "2-4 hours",
    openingHours: "Monday-Saturday 8:30 AM - 7:00 PM (closed Sundays)",
    location: "Beyazıt-Fatih, Grand Bazaar",
    bookingLink: "https://www.getyourguide.com/grand-bazaar-l3535/",
    highlights: [
      "Navigate 4,000 shops across 61 covered streets",
      "Learn traditional crafts and bargaining techniques",
      "Visit historic caravanserais and hidden courtyards",
      "Meet local artisans and multi-generational merchants",
      "Small group tours limited to 5 people"
    ],
    practicalInfo: {
      duration: "2-4 hours",
      bestTime: "Early morning weekdays for fewer crowds",
      included: ["Professional local guide", "Market navigation tips", "Cultural and historical insights"],
      meetingPoint: "Grand Bazaar main entrance (Beyazıt Gate)",
      accessibility: "Uneven surfaces, comfortable walking shoes essential"
    }
  },
  {
    slug: "spice-bazaar-experience",
    title: "Spice Bazaar Experience",
    shortOverview: "Taste colors and flavors among spice vendors and experience authentic Turkish culinary culture.",
    fullDescription: "The Egyptian Spice Bazaar, dating from 1664, offers a sensory journey through Turkish culinary traditions and the ancient spice trade routes. This L-shaped covered market fills the air with the aromas of cardamom, saffron, sumac, and countless other spices that once made Istanbul wealthy. Your guided experience includes tastings of traditional Turkish delights, explanations of spice uses in Ottoman cuisine, and meetings with vendors whose families have operated here for generations. Learn about the health benefits of various spices, discover ingredients for authentic Turkish cooking, and understand the bazaar's role in the historic Silk Road trade network.",
    image: "https://images.unsplash.com/photo-1551334787-21e6bd773b07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    rating: 4.6,
    reviewCount: 11240,
    priceRange: "Free entry (guided tours from $20)",
    duration: "1.5-2 hours",
    openingHours: "Daily 8:00 AM - 7:30 PM (Sunday 9:30 AM - 6:30 PM)",
    location: "Eminönü, near Golden Horn",
    bookingLink: "https://www.getyourguide.com/spice-bazaar-istanbul-l4996/",
    highlights: [
      "Taste exotic spices, Turkish delights, and local delicacies",
      "Learn about Ottoman culinary traditions and Silk Road history",
      "Meet multi-generational spice vendors and artisans",
      "Discover authentic ingredients for Turkish cooking",
      "Combine with Grand Bazaar tours for full market experience"
    ],
    practicalInfo: {
      duration: "1.5-2 hours",
      bestTime: "Early morning for freshest aromas and fewer crowds",
      included: ["Professional guide", "Spice tastings", "Turkish delight samples", "Historical insights"],
      meetingPoint: "Spice Bazaar main entrance",
      accessibility: "Ground level access, narrow aisles, comfortable shoes recommended"
    }
  },
  {
    slug: "whirling-dervishes-show",
    title: "Whirling Dervishes Show",
    shortOverview: "Attend a Sufi dervish performance, rich with mysticism and spiritual cultural history.",
    fullDescription: "Experience the mesmerizing spiritual dance of the Whirling Dervishes in an authentic Istanbul setting. This centuries-old Sufi ceremony, known as Sema, represents a mystical journey toward spiritual perfection through rhythmic spinning, live music, and chanting. Performed by members of the Mevlevi order founded by the 13th-century poet Rumi, the ceremony takes place in historic venues such as restored Ottoman-era buildings or traditional cultural centers. The hour-long performance includes seven distinct musical and dance phases, each with deep spiritual meaning. Witness this UNESCO-recognized cultural practice that combines meditation, music, and movement in a profound expression of Islamic mysticism.",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d44651?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.3,
    reviewCount: 7234,
    priceRange: "From $35",
    duration: "1 hour",
    openingHours: "Evening performances (times vary)",
    location: "Various historic venues",
    bookingLink: "https://www.viator.com/Istanbul-tours/Cultural-Tours/d585-g6-c26",
    highlights: [
      "UNESCO-recognized cultural performance",
      "Historic Ottoman-era venues",
      "Live traditional music accompaniment",
      "Seven mystical dance phases",
      "Insight into Sufi spiritual practices"
    ],
    practicalInfo: {
      duration: "1 hour",
      bestTime: "Evening performances",
      included: ["Performance tickets", "Cultural program notes", "Historical context"],
      meetingPoint: "Venue entrance (location varies)",
      accessibility: "Seated viewing, quiet contemplation expected"
    }
  },
  {
    slug: "topkapi-palace-harem-tour",
    title: "Topkapi Palace & Harem Tour",
    shortOverview: "Tour the sumptuous seat of Ottoman power, including its private chambers and treasury.",
    fullDescription: "Explore the magnificent Topkapi Palace, home to Ottoman sultans for over 400 years and the administrative center of a vast empire. This sprawling complex overlooks the Bosphorus and Golden Horn from its strategic hilltop position. Your comprehensive tour includes the Imperial Treasury with its famous Topkapi Dagger and 86-carat Spoonmaker's Diamond, the Sacred Relics rooms housing Islamic artifacts, and the fascinating Harem quarters where the sultan's family lived in seclusion. Wander through ornate courtyards, marvel at intricate tilework and calligraphy, and learn about court life, palace intrigue, and the powerful women who influenced Ottoman politics from behind closed doors.",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.7,
    reviewCount: 22340,
    priceRange: "From €45 ($50)",
    duration: "2.5-3 hours",
    openingHours: "9:00 AM - 5:00 PM (closed Tuesdays)",
    location: "Sultanahmet, Sarayburnu",
    bookingLink: "https://www.getyourguide.com/topkapi-palace-l3534/",
    highlights: [
      "Imperial Treasury with Topkapi Dagger and Spoonmaker's Diamond",
      "Harem quarters with guided access and historical insights",
      "Panoramic Bosphorus and Golden Horn views",
      "Sacred Islamic relics collection",
      "Skip-the-line tickets with audio guide included"
    ],
    practicalInfo: {
      duration: "2.5-3 hours",
      bestTime: "9:00 AM - midday to avoid afternoon tour groups",
      included: ["Palace entrance", "Harem access", "Audio guide system", "Skip-the-line tickets"],
      meetingPoint: "Topkapi Palace first gate entrance",
      accessibility: "Steep paths and stairs, comfortable shoes essential"
    }
  },
  {
    slug: "galata-tower-visit",
    title: "Galata Tower Visit",
    shortOverview: "Climb the iconic tower for panoramic views over Istanbul's skyline and Golden Horn.",
    fullDescription: "Ascend the 67-meter Galata Tower, a medieval stone tower that has dominated Istanbul's skyline for over 700 years. Built by the Genoese in 1348, this cylindrical tower served as a lighthouse, fire watchtower, and prison throughout its history. Today, it offers some of the most spectacular 360-degree views in Istanbul. From the observation deck, see the Golden Horn, Bosphorus, Historic Peninsula, and modern city sprawling across seven hills. The tower provides perfect photo opportunities at sunrise or sunset, with the city's minarets, domes, and bridges creating a stunning panoramic backdrop. Learn about the tower's role in Istanbul's maritime history and its significance in the city's Galata district development.",
    image: "https://images.unsplash.com/photo-1580500550469-8e8b930b6f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.3,
    reviewCount: 25670,
    priceRange: "30 Euros ($33)",
    duration: "30 minutes - 1 hour",
    openingHours: "8:30 AM - 11:00 PM (last entry 10:00 PM)",
    location: "Galata, Beyoğlu",
    bookingLink: "https://www.getyourguide.com/galata-tower-l3949/",
    highlights: [
      "360-degree panoramic views of Istanbul's skyline",
      "700-year-old Genoese medieval architecture",
      "Golden Horn, Bosphorus, and Historic Peninsula vistas",
      "Perfect sunset photography opportunities",
      "Skip-the-line tickets available to avoid queues"
    ],
    practicalInfo: {
      duration: "30 minutes - 1 hour",
      bestTime: "Before sunset for best lighting and fewer crowds",
      included: ["Tower entrance", "Express elevator to 7th floor", "Observation deck access"],
      meetingPoint: "Galata Tower main entrance",
      accessibility: "Express elevator available, two flights of stairs to top"
    }
  },
  {
    slug: "turkish-bath-hammam-experience",
    title: "Turkish Bath (Hammam) Experience",
    shortOverview: "Relax in a traditional hammam with steam, scrub, and massage - a timeless Ottoman ritual.",
    fullDescription: "Immerse yourself in the ancient Ottoman tradition of the Turkish bath, a ritual that has remained unchanged for centuries. Your authentic hammam experience takes place in a historic bathhouse with marble interiors, domed ceilings, and traditional star-shaped lighting. The process begins in the warm room (sicaklik) where you'll sweat on heated marble slabs, followed by a vigorous full-body scrub (kese) that removes dead skin and impurities. Enjoy a relaxing foam massage with traditional olive oil soap, then cool down gradually while sipping Turkish tea. This therapeutic ritual promotes circulation, relaxation, and skin health while connecting you to Istanbul's Ottoman heritage and Turkish hospitality traditions.",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.6,
    reviewCount: 8340,
    priceRange: "From $24-60",
    duration: "1.5-2 hours",
    openingHours: "Daily 6:00 AM - 10:00 PM (separate hours for men/women)",
    location: "Historic hammams including Çemberlitaş and Acemoglu",
    bookingLink: "https://www.getyourguide.com/istanbul-l56/thermal-turkish-hammam-spas-tc2060/",
    highlights: [
      "Authentic Ottoman hammam ritual in historic settings",
      "Traditional kese scrub and foam massage treatments",
      "Acemoglu Hammam offers rare mixed-gender option for couples",
      "Çemberlitaş Hammam - centuries-old traditional experience",
      "Clay mask, body scrub, and relaxing foam wash included"
    ],
    practicalInfo: {
      duration: "1.5-2 hours",
      bestTime: "Afternoon or evening, book in advance",
      included: ["Hammam entrance", "Traditional kese scrub", "Foam massage", "Clay mask treatment"],
      meetingPoint: "Hammam reception area",
      accessibility: "Historic buildings with stairs, separate or mixed facilities available"
    }
  },
  {
    slug: "basilica-cistern-visit",
    title: "Basilica Cistern Visit",
    shortOverview: "Explore the magnificent underground Byzantine cistern with ancient columns and mystical atmosphere.",
    fullDescription: "Descend into the largest surviving underground cistern of the Byzantines in Istanbul, a subterranean marvel that has captured imaginations for centuries. Built in 532 AD during the reign of Emperor Justinian I, this cathedral-sized cistern stretches 143 meters long and 65 meters wide, supported by 336 marble columns arranged in 12 rows. The cistern's mystical atmosphere is enhanced by soft lighting that illuminates the forest of columns reflected in the shallow water. Don't miss the famous upside-down Medusa head columns, the Weeping Column with its mysterious tears, and the opportunity to walk on elevated wooden platforms through this underground palace. The cistern has appeared in numerous films including James Bond's 'From Russia with Love' and Dan Brown's 'Inferno'.",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.6,
    reviewCount: 19850,
    priceRange: "From €25 ($28)",
    duration: "1-1.5 hours",
    openingHours: "9:00 AM - 6:30 PM (Night shift 7:30 PM - 10:00 PM)",
    location: "Sultanahmet, near Hagia Sophia",
    bookingLink: "https://www.getyourguide.com/basilica-cistern-l3947/",
    highlights: [
      "336 ancient marble columns in mystical underground setting",
      "Famous upside-down Medusa head columns",
      "Weeping Column with mysterious water drops",
      "Skip-the-line tickets to avoid queues",
      "Featured in James Bond and Dan Brown films"
    ],
    practicalInfo: {
      duration: "1-1.5 hours",
      bestTime: "March-May and September-October for best weather",
      included: ["Cistern entrance", "Audio guide in 7 languages", "Elevated walkway access"],
      meetingPoint: "Basilica Cistern entrance near Hagia Sophia",
      accessibility: "Stairs to enter, closed comfortable shoes essential (slippery floors)"
    }
  },
  {
    slug: "bosphorus-dinner-cruise",
    title: "Bosphorus Dinner Cruise",
    shortOverview: "Evening cruise with views, lights, skyline and dinner on the water between two continents.",
    fullDescription: "Sail between Europe and Asia on a magical Bosphorus dinner cruise that showcases Istanbul's illuminated skyline from the water. This evening journey takes you along the strait that divides two continents, past Ottoman palaces, Byzantine fortresses, and modern mansions lining the shores. As the sun sets, watch the city transform with glittering lights reflecting on the water while enjoying a multi-course Turkish dinner featuring fresh seafood, traditional mezes, and regional specialties. The cruise passes iconic landmarks including Dolmabahçe Palace, Ortaköy Mosque, Bosphorus Bridge, and Maiden's Tower, all beautifully lit against the night sky. Live Turkish folk music and traditional performances often accompany dinner, creating an unforgettable cultural experience.",
    image: "https://images.unsplash.com/photo-1541968618652-3f6c82ba5803?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
    rating: 4.5,
    reviewCount: 14290,
    priceRange: "From $30-55",
    duration: "3 hours",
    openingHours: "Evening departures (sunset timing)",
    location: "Various Bosphorus piers",
    bookingLink: "https://www.getyourguide.com/istanbul-l56/istanbul-bosphorus-dinner-cruise-show-with-private-table-t415437/",
    highlights: [
      "Sail between Europe and Asia continents",
      "3-course Turkish dinner with vegetarian options",
      "Live cultural performances including dervishes, folk dances, and belly dancing",
      "Pass illuminated landmarks: Maiden's Tower, Galata Tower, Bosphorus Bridges",
      "Private tables and VIP options available"
    ],
    practicalInfo: {
      duration: "3 hours",
      bestTime: "Evening departure for sunset views and illuminated city",
      included: ["3-course dinner cruise", "Live entertainment shows", "Soft drinks", "Private table seating"],
      meetingPoint: "Departure pier (location specified with booking confirmation)",
      accessibility: "Boat boarding assistance available, multiple deck viewing areas"
    }
  }
]

export function getActivityBySlug(slug: string): Activity | undefined {
  return top10Activities.find(activity => activity.slug === slug)
}

export function getAllActivitySlugs(): string[] {
  return top10Activities.map(activity => activity.slug)
}