# Istanbul Explorer - Detail Page Schema Reference

## 🎯 **GOLD STANDARD SCHEMA**

This document defines the complete schema structure for the luxury travel detail pages. This is our **gold standard** that the backend scraping/enrichment pipeline must populate.

---

## 📋 **COMPLETE SCHEMA STRUCTURE**

### **1. Hero Section**
```typescript
{
  name: string                    // "Blue Mosque (Sultan Ahmed Mosque)"
  hero_image: string             // High-quality hero image URL
  rating: number                 // 4.7
  review_count: number           // 111004
  booking_price?: string         // "€25" or "Free Entry"
}
```

### **2. About This Experience**
```typescript
{
  description: {
    enriched: boolean            // true if Firecrawl/GPT enhanced
    source: string              // "Firecrawl + GPT Enhancement"
    content: string             // Rich 2-3 paragraph description
  }
}
```

### **3. What to Expect**
```typescript
{
  highlights: string[]           // 5-7 bullet points
  duration: string              // "2-3 hours"
}
```

### **4. Why Visit**
```typescript
{
  why_visit: string[]           // 3-5 compelling reasons
}
```

### **5. Accessibility & Facilities**
```typescript
{
  accessibility: {
    wheelchair_accessible: boolean
    stroller_friendly: boolean
    kid_friendly: boolean
    senior_friendly: boolean
    accessibility_notes?: string
  },
  facilities: {
    toilets: boolean
    cafe_restaurant: boolean
    gift_shop: boolean
    parking: boolean
    wifi: boolean
    audio_guide: boolean
    guided_tours: boolean
  }
}
```

### **6. Practical Information**
```typescript
{
  practical_info: {
    dress_code: string
    photography_policy: string
    entry_requirements: string
    safety_notes: string
    etiquette_tips: string
  }
}
```

### **7. Insider Tips**
```typescript
{
  insider_tips: string[]        // 2-3 expert/local suggestions
}
```

### **8. Experience Details**
```typescript
{
  opening_hours: string
  location: string
  address: string
  district: string
  type: string                  // "Religious Site & Tourist Attraction"
}
```

### **9. Reviews & Ratings**
```typescript
{
  reviews_summary: string       // "Excellent rating on booking platforms"
  sample_reviews?: {
    author: string
    rating: number
    comment: string
    date: string
  }[]
}
```

### **10. Photo Gallery**
```typescript
{
  gallery_images: string[]      // 10-20 curated image URLs
}
```

### **11. Version History (Admin Only)**
```typescript
{
  version_history: {
    version: string             // "v3.2"
    status: "approved" | "pending" | "rejected"
    timestamp: string
    changes: string
    source: string              // "Firecrawl + GPT Enhancement"
  }[]
}
```

---

## 🔄 **ENRICHMENT PIPELINE REQUIREMENTS**

### **Content Hierarchy (Fallback Chain)**
1. **Firecrawl Enrichment** → Official website scraping
2. **GPT-4 Enhancement** → AI-generated premium content
3. **Basic Scrape** → Google Places + basic APIs
4. **Manual Entry** → Admin curation

### **Image Pipeline Priority**
1. **Google Places Photos** → Official venue photos (maxwidth=1600)
2. **Unsplash** → High-quality stock photos
3. **Pexels** → Additional stock photos
4. **Wikimedia Commons** → Historical/public domain images
5. **Placeholders** → Generated fallback images

### **Validation Requirements**
- **Minimum 15 images** per venue
- **Aspect ratio validation** (1:1 to 3:2 acceptable)
- **Relevance scoring** for image-venue matching
- **Deduplication** across all sources
- **Quality filtering** (resolution, file size)

---

## 🎨 **FRONTEND PRESENTATION ORDER**

1. **Hero Section** (Title, Hero Image, Rating, Quick Booking)
2. **About This Experience** (Rich Description with Source Badge)
3. **What to Expect** (Highlights + Duration)
4. **Why Visit** (Numbered Editorial Reasons)
5. **Accessibility & Facilities** (Side-by-side Cards with Icons)
6. **Practical Information** (Color-coded Information Cards)
7. **Insider Tips** (Expert Suggestions with Lightbulb Icons)
8. **Experience Details** (Sidebar Card)
9. **Reviews & Ratings** (Sample Reviews)
10. **Photo Gallery** (Grid Layout with Lightbox)
11. **Version History** (Admin-Only Section)

---

## 🔧 **BACKEND IMPLEMENTATION NOTES**

### **Database Schema Updates Needed**
- Add `accessibility` (jsonb) to staging_queue
- Add `facilities` (jsonb) to staging_queue  
- Add `practical_info` (jsonb) to staging_queue
- Add `why_visit` (jsonb) to staging_queue
- Add `insider_tips` (jsonb) to staging_queue
- Add `version_history` (jsonb) to staging_queue

### **API Enhancements Required**
- **Firecrawl Integration** → Parse structured data from official websites
- **GPT Enhancement** → Generate premium descriptions and structured content
- **Image Pipeline** → Ensure 15+ images with proper validation
- **Content Parsing** → Extract accessibility, facilities, practical info
- **Version Management** → Track content changes and sources

### **Quality Assurance**
- **Content Validation** → Ensure all fields populated where possible
- **Image Quality** → High-resolution, relevant, properly attributed
- **Source Attribution** → Track content origin (Firecrawl, GPT, Manual)
- **Fallback Handling** → Graceful degradation when enrichment fails

---

## 📱 **RESPONSIVE DESIGN REQUIREMENTS**

- **Mobile-first** approach
- **Sticky sidebar** on desktop
- **Collapsible sections** for mobile
- **Touch-friendly** buttons and interactions
- **Fast loading** with optimized images
- **SEO optimized** with proper meta tags

---

## 🎯 **SUCCESS METRICS**

- **100% field population** where data is available
- **15+ high-quality images** per venue
- **Premium content quality** (Firecrawl/GPT enhanced)
- **Zero placeholder content** in production
- **Fast page load times** (<3 seconds)
- **Mobile responsiveness** across all devices

---

## 📝 **IMPLEMENTATION PRIORITY**

1. **Phase 1**: Lock down frontend schema and presentation ✅
2. **Phase 2**: Enhance Firecrawl integration for structured data
3. **Phase 3**: Implement GPT-4 content enhancement pipeline  
4. **Phase 4**: Improve image validation and deduplication
5. **Phase 5**: Add version history and content tracking
6. **Phase 6**: Performance optimization and SEO enhancement

---

*This schema represents the gold standard for luxury travel content. Every field should be populated through our enrichment pipeline to deliver a premium user experience.*
