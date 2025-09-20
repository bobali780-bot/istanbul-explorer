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
  tripAdvisorUrl?: string
  reviews?: {
    author: string
    rating: number
    comment: string
    date: string
  }[]
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
    priceRange: "$25",
    duration: "1-2 hours",
    openingHours: "9:00 AM - 6:00 PM (varies by season)",
    location: "Sultanahmet Square, Fatih",
    bookingLink: "https://www.getyourguide.com/hagia-sophia-l2705/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d293976-Reviews-Hagia_Sophia-Istanbul.html",
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
    },
    reviews: [
      {
        author: "Sarah M.",
        rating: 5,
        comment: "Absolutely breathtaking! The history and architecture are incredible. Our guide was very knowledgeable and the skip-the-line access saved us hours.",
        date: "December 2024"
      },
      {
        author: "David K.",
        rating: 5,
        comment: "A must-see in Istanbul. The combination of Christian and Islamic art is fascinating. Highly recommend getting a guide.",
        date: "November 2024"
      },
      {
        author: "Maria L.",
        rating: 4,
        comment: "Beautiful mosque with incredible history. Can get crowded but worth the visit. The mosaics are stunning.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "blue-mosque-visit",
    title: "Blue Mosque Visit",
    shortOverview: "Visit the stunning Sultan Ahmet Mosque, renowned for its blue tile work and majestic architecture.",
    fullDescription: "The Blue Mosque, officially known as Sultan Ahmet Mosque, represents the pinnacle of Ottoman architecture and Islamic art. Built between 1609-1616, this active mosque features six minarets, a rare architectural feature that initially caused controversy. The interior is adorned with over 20,000 handmade ceramic tiles in various shades of blue, giving the mosque its popular name. The prayer hall is crowned by a massive central dome supported by four 'elephant feet' columns. Visitors can explore the courtyard, admire the intricate tile work, and learn about Islamic culture and prayer traditions in this functioning house of worship.",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.6,
    reviewCount: 34521,
    priceRange: "Free",
    duration: "45 minutes - 1 hour",
    openingHours: "8:30 AM - 6:00 PM (closed during prayer times)",
    location: "Sultanahmet Square, Fatih",
    bookingLink: "https://www.viator.com/Istanbul-attractions/Blue-Mosque-Sultan-Ahmet-Camii/d585-a910",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d293978-Reviews-Blue_Mosque-Istanbul.html",
    highlights: [
      "Six magnificent minarets",
      "20,000+ handmade blue tiles",
      "Active mosque with prayer services",
      "Free entry for self-guided visits",
      "Facing Hagia Sophia across the square"
    ],
    practicalInfo: {
      duration: "45 minutes - 1 hour",
      bestTime: "Early morning before crowds",
      included: ["Free entry", "Audio guide available"],
      meetingPoint: "Main entrance on Sultanahmet Square",
      accessibility: "Wheelchair accessible"
    },
    reviews: [
      {
        author: "Jennifer R.",
        rating: 5,
        comment: "Stunning architecture and the blue tiles are absolutely gorgeous. Remember to dress modestly and bring shoe covers.",
        date: "December 2024"
      },
      {
        author: "Ahmed H.",
        rating: 4,
        comment: "Beautiful mosque, very peaceful inside. Best visited early in the morning to avoid crowds.",
        date: "November 2024"
      },
      {
        author: "Elena P.",
        rating: 5,
        comment: "The six minarets are spectacular! Free entry makes this a must-visit. The interior is breathtaking.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "topkapi-palace-tour",
    title: "Topkapi Palace & Harem Tour",
    shortOverview: "Explore the opulent Ottoman palace with its treasures, courtyards, and famous Harem quarters.",
    fullDescription: "Topkapi Palace served as the primary residence of Ottoman sultans for over 400 years, from 1465 to 1856. This sprawling palace complex offers visitors a glimpse into the lavish lifestyle of Ottoman royalty. The palace features four main courtyards, each with distinct functions and stunning architecture. Highlights include the Imperial Treasury with its precious jewels and artifacts, the Sacred Relics collection, and the famous Harem quarters where the sultan's family lived. The palace also offers spectacular views of the Bosphorus and Golden Horn, making it both historically significant and visually stunning.",
    image: "https://images.unsplash.com/photo-1578915629189-4a7c2e1c9d4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    rating: 4.5,
    reviewCount: 22340,
    priceRange: "$50",
    duration: "2-3 hours",
    openingHours: "9:00 AM - 5:00 PM (closed Tuesdays)",
    location: "Sultanahmet, Fatih",
    bookingLink: "https://www.getyourguide.com/topkapi-palace-l3534/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d293977-Reviews-Topkapi_Palace-Istanbul.html",
    highlights: [
      "Four historic courtyards to explore",
      "Imperial Treasury with precious jewels",
      "Harem quarters with intricate decorations",
      "Panoramic views of Bosphorus",
      "Sacred Relics collection"
    ],
    practicalInfo: {
      duration: "2-3 hours",
      bestTime: "Early morning to avoid crowds",
      included: ["Palace entry", "Harem access", "Audio guide"],
      meetingPoint: "Palace main entrance",
      accessibility: "Limited wheelchair access due to historic structure"
    },
    reviews: [
      {
        author: "Robert T.",
        rating: 5,
        comment: "Incredible palace with so much history. The Harem tour is definitely worth the extra cost. Amazing views!",
        date: "December 2024"
      },
      {
        author: "Lisa M.",
        rating: 4,
        comment: "Beautiful palace grounds and fascinating exhibits. Can be crowded but the audio guide helps navigate efficiently.",
        date: "November 2024"
      },
      {
        author: "Carlos S.",
        rating: 5,
        comment: "The treasury room is absolutely stunning. Don't miss the Harem - it's beautifully preserved.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "grand-bazaar-shopping-tour",
    title: "Grand Bazaar Shopping Tour",
    shortOverview: "Navigate the world's oldest covered market with 4,000 shops selling carpets, jewelry, and souvenirs.",
    fullDescription: "The Grand Bazaar is one of the oldest and largest covered markets in the world, dating back to 1461. With over 4,000 shops spread across 61 covered streets, this labyrinthine marketplace offers an authentic Turkish shopping experience. Vendors sell everything from handwoven carpets and Turkish ceramics to gold jewelry and traditional textiles. Beyond shopping, the bazaar is an architectural marvel with its painted ceilings, ornate doorways, and historic ambiance. A guided tour helps navigate the maze-like structure while learning about Turkish craftsmanship, haggling techniques, and the bazaar's 500-year history.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.3,
    reviewCount: 15280,
    priceRange: "Free",
    duration: "2-3 hours",
    openingHours: "Monday-Saturday 8:30 AM - 7:00 PM (closed Sundays)",
    location: "Beyazıt-Fatih, Grand Bazaar",
    bookingLink: "https://www.getyourguide.com/grand-bazaar-l3535/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d293981-Reviews-Grand_Bazaar-Istanbul.html",
    highlights: [
      "4,000 shops in historic covered market",
      "Authentic Turkish carpets and ceramics",
      "Traditional haggling experience",
      "Historic Ottoman architecture",
      "Famous Turkish coffee shops"
    ],
    practicalInfo: {
      duration: "2-3 hours",
      bestTime: "Weekday mornings for fewer crowds",
      included: ["Free entry", "Shopping guidance available"],
      meetingPoint: "Main entrance (Beyazıt Gate)",
      accessibility: "Some areas wheelchair accessible"
    },
    reviews: [
      {
        author: "Anna K.",
        rating: 4,
        comment: "Amazing shopping experience! The variety is incredible. Don't forget to haggle - it's expected and fun!",
        date: "December 2024"
      },
      {
        author: "Michael B.",
        rating: 4,
        comment: "Historic atmosphere is wonderful. Can be overwhelming with so many options, but that's part of the charm.",
        date: "November 2024"
      },
      {
        author: "Sophie L.",
        rating: 5,
        comment: "Found beautiful handmade carpets and jewelry. The vendors are friendly and the coffee shops are great for breaks.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "bosphorus-cruise",
    title: "Bosphorus Dinner Cruise",
    shortOverview: "Sail between Europe and Asia while enjoying Turkish cuisine and live entertainment.",
    fullDescription: "A Bosphorus cruise offers the perfect way to see Istanbul from the water, sailing along the strait that divides Europe and Asia. The dinner cruise includes a traditional Turkish meal with live folk performances, belly dancing, and sometimes whirling dervishes. As you sail, you'll pass magnificent Ottoman palaces, historic fortresses, and charming waterfront neighborhoods. The cruise provides unique perspectives of landmarks like Dolmabahçe Palace, Bosphorus Bridge, and the Asian shoreline. Evening cruises are particularly magical as the city lights reflect on the water and the call to prayer echoes across the water.",
    image: "https://images.unsplash.com/photo-1541968618652-3f6c82ba5803?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
    rating: 4.4,
    reviewCount: 14290,
    priceRange: "$45",
    duration: "3-4 hours",
    openingHours: "Evening cruises: 7:00 PM - 11:00 PM",
    location: "Eminönü Pier or Kabataş",
    bookingLink: "https://www.getyourguide.com/istanbul-l56/istanbul-bosphorus-dinner-cruise-show-with-private-table-t415437/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d12455662-Reviews-Bosphorus_Dinner_Cruise-Istanbul.html",
    highlights: [
      "Sail between Europe and Asia",
      "Traditional Turkish dinner included",
      "Live folk performances and belly dancing",
      "Views of Ottoman palaces and bridges",
      "Romantic evening atmosphere"
    ],
    practicalInfo: {
      duration: "3-4 hours",
      bestTime: "Evening for romantic ambiance",
      included: ["3-course dinner", "Live entertainment", "Hotel pickup available"],
      meetingPoint: "Eminönü Pier (location sent with booking)",
      accessibility: "Most boats wheelchair accessible"
    },
    reviews: [
      {
        author: "Catherine W.",
        rating: 5,
        comment: "Magical evening! The food was delicious and the entertainment was fantastic. Amazing views of the city from the water.",
        date: "December 2024"
      },
      {
        author: "James D.",
        rating: 4,
        comment: "Great way to see Istanbul from a different perspective. The belly dancing show was entertaining and dinner was good.",
        date: "November 2024"
      },
      {
        author: "Isabella F.",
        rating: 5,
        comment: "Perfect romantic evening! The sunset views were incredible and the live music added to the atmosphere.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "galata-tower-visit",
    title: "Galata Tower & Panoramic Views",
    shortOverview: "Climb the medieval tower for 360-degree panoramic views of Istanbul's historic skyline.",
    fullDescription: "The Galata Tower, built by the Genoese in 1348, stands as one of Istanbul's most recognizable landmarks. This medieval stone tower offers breathtaking 360-degree panoramic views of the city, including the Golden Horn, Bosphorus, and the historic peninsula. The tower has served various purposes throughout history - as a watchtower, prison, and observatory. Today, visitors can take an elevator to the observation deck to enjoy spectacular views, especially during sunset. The surrounding Galata district is also worth exploring, with its narrow cobblestone streets, trendy cafes, and art galleries creating a bohemian atmosphere.",
    image: "https://images.unsplash.com/photo-1551334787-21e6bd773b07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    rating: 4.2,
    reviewCount: 25670,
    priceRange: "$33",
    duration: "1-2 hours",
    openingHours: "8:30 AM - 11:00 PM (last entry 10:00 PM)",
    location: "Galata, Beyoğlu",
    bookingLink: "https://www.getyourguide.com/galata-tower-l3949/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d293993-Reviews-Galata_Tower-Istanbul.html",
    highlights: [
      "360-degree panoramic city views",
      "Historic medieval architecture",
      "Sunset views over the Golden Horn",
      "Express elevator to observation deck",
      "Trendy Galata neighborhood to explore"
    ],
    practicalInfo: {
      duration: "1-2 hours",
      bestTime: "1 hour before sunset for golden hour",
      included: ["Tower entry", "Elevator access", "Observation deck"],
      meetingPoint: "Tower entrance on Galata Square",
      accessibility: "Elevator access available"
    },
    reviews: [
      {
        author: "Oliver G.",
        rating: 4,
        comment: "Fantastic views of the entire city! Can get crowded at sunset but worth the wait. The neighborhood is charming too.",
        date: "December 2024"
      },
      {
        author: "Emma J.",
        rating: 5,
        comment: "Best views in Istanbul! The 360-degree panorama is incredible. Go at sunset for the most beautiful photos.",
        date: "November 2024"
      },
      {
        author: "Marco R.",
        rating: 4,
        comment: "Great historical tower with amazing views. The area around it has nice cafes and shops to explore after.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "basilica-cistern-visit",
    title: "Basilica Cistern Underground Tour",
    shortOverview: "Explore the mysterious underground cistern with its 336 columns and Medusa head sculptures.",
    fullDescription: "The Basilica Cistern, built in the 6th century during the reign of Byzantine Emperor Justinian I, is the largest of several hundred ancient cisterns beneath Istanbul. This underground marvel features 336 marble columns in 12 rows, each 9 meters high, creating a cathedral-like atmosphere enhanced by atmospheric lighting and classical music. The cistern's most famous features are the two Medusa head sculptures used as column bases, their origins and positioning remaining mysterious. Recent renovations have added walkways and improved lighting, making this subterranean wonder more accessible while preserving its otherworldly ambiance.",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.3,
    reviewCount: 19850,
    priceRange: "$28",
    duration: "45 minutes - 1 hour",
    openingHours: "9:00 AM - 6:30 PM (Night shift 7:30 PM - 10:00 PM)",
    location: "Sultanahmet, Fatih",
    bookingLink: "https://www.getyourguide.com/basilica-cistern-l3947/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d293979-Reviews-Basilica_Cistern-Istanbul.html",
    highlights: [
      "336 ancient marble columns",
      "Mysterious Medusa head sculptures",
      "Atmospheric lighting and music",
      "1,500-year-old Byzantine engineering",
      "Featured in James Bond film"
    ],
    practicalInfo: {
      duration: "45 minutes - 1 hour",
      bestTime: "Early morning or evening sessions",
      included: ["Skip-the-line entry", "Audio guide", "Atmospheric lighting"],
      meetingPoint: "Cistern entrance on Yerebatan Street",
      accessibility: "Wheelchair accessible with ramps"
    },
    reviews: [
      {
        author: "Rachel N.",
        rating: 5,
        comment: "Absolutely magical underground experience! The Medusa heads are fascinating and the atmosphere is otherworldly.",
        date: "December 2024"
      },
      {
        author: "Thomas A.",
        rating: 4,
        comment: "Impressive ancient engineering! The lighting creates a mystical atmosphere. Don't miss the Medusa sculptures.",
        date: "November 2024"
      },
      {
        author: "Priya S.",
        rating: 4,
        comment: "Cool escape from the heat above ground. The columns are impressive and the history is fascinating.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "spice-bazaar-food-tour",
    title: "Spice Bazaar & Food Tasting Tour",
    shortOverview: "Taste exotic spices, Turkish delights, and traditional foods in the aromatic Egyptian Bazaar.",
    fullDescription: "The Spice Bazaar, also known as the Egyptian Bazaar, is a sensory explosion of colors, aromas, and flavors that has been the heart of Istanbul's spice trade for over 350 years. This L-shaped covered market features 88 shops selling everything from Turkish delight and baklava to exotic spices, herbal teas, and Turkish coffee. A guided food tour takes you through the best vendors, offering tastings of lokum (Turkish delight), different varieties of honey, dried fruits, nuts, and aromatic spices like saffron and sumac. The bazaar also features traditional Turkish breakfast items and fresh Turkish coffee roasted on-site.",
    image: "https://images.unsplash.com/photo-1580500550469-8e8b930b6f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.4,
    reviewCount: 11240,
    priceRange: "$35",
    duration: "2 hours",
    openingHours: "Daily 8:00 AM - 7:30 PM (Sunday 9:30 AM - 6:30 PM)",
    location: "Eminönü, near Golden Horn",
    bookingLink: "https://www.getyourguide.com/spice-bazaar-istanbul-l4996/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d293982-Reviews-Spice_Bazaar-Istanbul.html",
    highlights: [
      "Exotic spices from around the world",
      "Turkish delight and baklava tastings",
      "Traditional Turkish coffee and tea",
      "Historic 350-year-old covered market",
      "Aromatic herbs and natural remedies"
    ],
    practicalInfo: {
      duration: "2 hours",
      bestTime: "Morning for freshest selections",
      included: ["Food tastings", "Spice explanations", "Shopping guidance"],
      meetingPoint: "Main entrance facing New Mosque",
      accessibility: "Wheelchair accessible main areas"
    },
    reviews: [
      {
        author: "Helen C.",
        rating: 5,
        comment: "Incredible variety of spices and the tastings were delicious! Great way to learn about Turkish cuisine and culture.",
        date: "December 2024"
      },
      {
        author: "Giuseppe M.",
        rating: 4,
        comment: "Wonderful sensory experience! The Turkish delight was amazing and I bought lots of spices to take home.",
        date: "November 2024"
      },
      {
        author: "Amy Z.",
        rating: 5,
        comment: "The aromas are incredible! Our guide was very knowledgeable about the different spices and their uses.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "turkish-hammam-experience",
    title: "Authentic Turkish Bath (Hammam)",
    shortOverview: "Relax in a traditional hammam with steam, scrub, and massage in historic Ottoman baths.",
    fullDescription: "The Turkish bath, or hammam, is a centuries-old tradition that combines cleansing, relaxation, and social interaction. These historic bathhouses feature marble platforms heated from below, creating a steamy environment perfect for deep cleansing and relaxation. The traditional hammam experience includes time in the steam room, followed by an exfoliating scrub (kese) performed by an attendant, and finally a soap massage with olive oil soap bubbles. Many Istanbul hammams date back to Ottoman times and feature beautiful architecture with domed ceilings, marble details, and traditional tilework. This authentic experience offers insight into Turkish culture while providing ultimate relaxation.",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.3,
    reviewCount: 8340,
    priceRange: "$45",
    duration: "1.5-2 hours",
    openingHours: "Daily 8:00 AM - 11:00 PM (separate hours for men/women)",
    location: "Çemberlitaş or Beyoğlu",
    bookingLink: "https://www.getyourguide.com/istanbul-l56/thermal-turkish-hammam-spas-tc2060/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d12633198-Reviews-Turkish_Bath_Hammam-Istanbul.html",
    highlights: [
      "Traditional Ottoman-era bathhouses",
      "Full body exfoliating scrub (kese)",
      "Relaxing soap bubble massage",
      "Historic marble and tile architecture",
      "Authentic Turkish cultural experience"
    ],
    practicalInfo: {
      duration: "1.5-2 hours",
      bestTime: "Afternoon for most relaxing experience",
      included: ["Steam session", "Body scrub", "Soap massage", "Tea/refreshments"],
      meetingPoint: "Hammam reception (varies by location)",
      accessibility: "Some locations have accessibility features"
    },
    reviews: [
      {
        author: "Jessica Y.",
        rating: 5,
        comment: "Incredibly relaxing and authentic experience! The scrub was intense but left my skin feeling amazing. Beautiful historic setting.",
        date: "December 2024"
      },
      {
        author: "Paul H.",
        rating: 4,
        comment: "Traditional Turkish experience that's both cultural and relaxing. The marble heated floors are amazing.",
        date: "November 2024"
      },
      {
        author: "Natasha V.",
        rating: 4,
        comment: "Unique cultural experience! The staff was professional and the historic bathhouse is beautiful.",
        date: "October 2024"
      }
    ]
  },
  {
    slug: "dolmabahce-palace-tour",
    title: "Dolmabahçe Palace Tour",
    shortOverview: "Visit the lavish 19th-century palace where Ottoman sultans lived in European-style luxury.",
    fullDescription: "Dolmabahçe Palace represents the final period of the Ottoman Empire, built in the mid-19th century as sultans sought to modernize and adopt European architectural styles. This opulent palace stretches 600 meters along the Bosphorus and features 285 rooms, 46 halls, and 6 baths, all decorated with a stunning mix of Baroque, Rococo, and Neoclassical styles. The palace is famous for its crystal chandeliers, including a 4.5-ton Bohemian crystal chandelier, gold leaf decorations, and priceless artworks. Atatürk, the founder of modern Turkey, spent his final years here, and visitors can see his preserved quarters and the exact time of his death marked on all palace clocks.",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d44651?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating: 4.4,
    reviewCount: 16750,
    priceRange: "$42",
    duration: "1.5-2 hours",
    openingHours: "9:00 AM - 4:00 PM (closed Mondays and Thursdays)",
    location: "Beşiktaş, along the Bosphorus",
    bookingLink: "https://www.getyourguide.com/dolmabahce-palace-l2706/",
    tripAdvisorUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d293988-Reviews-Dolmabahce_Palace-Istanbul.html",
    highlights: [
      "285 rooms of European-style luxury",
      "4.5-ton Bohemian crystal chandelier",
      "Atatürk's preserved living quarters",
      "Stunning Bosphorus waterfront location",
      "Mix of Baroque and Ottoman architecture"
    ],
    practicalInfo: {
      duration: "1.5-2 hours",
      bestTime: "Morning for cooler temperatures",
      included: ["Palace tour", "Audio guide", "Gardens access"],
      meetingPoint: "Palace main entrance on Dolmabahçe Street",
      accessibility: "Limited wheelchair access due to historic structure"
    },
    reviews: [
      {
        author: "Victoria B.",
        rating: 5,
        comment: "Absolutely stunning palace! The crystal chandeliers are incredible and the Bosphorus views are amazing. Rich history throughout.",
        date: "December 2024"
      },
      {
        author: "Andrew L.",
        rating: 4,
        comment: "Impressive European-style palace with fascinating history. The Atatürk exhibits are particularly moving.",
        date: "November 2024"
      },
      {
        author: "Sophia K.",
        rating: 4,
        comment: "Beautiful palace with incredible luxury and detail. The gardens and waterfront setting are gorgeous.",
        date: "October 2024"
      }
    ]
  }
]

export function getActivityBySlug(slug: string): Activity | undefined {
  return top10Activities.find(activity => activity.slug === slug)
}

export function getAllActivitySlugs(): string[] {
  return top10Activities.map(activity => activity.slug)
}