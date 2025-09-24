# Claude Category Implementation Session - Istanbul Explorer

## Session Overview
**Date:** September 22, 2025
**Project:** Istanbul Explorer
**Main Task:** Implementing category detection and removing hardcoded 'activities' logic
**User:** Haidar
**Claude Code Session ID:** claude-category-implementation

## Initial Problem Statement

User identified that the hybrid scraping system was only working for Blue Mosque because it was hardcoded to handle only 'activities' category. The system needed to be updated to properly handle:
- Hotels
- Restaurants
- Shopping venues
- Activities (existing)

The core issues were:
1. Hardcoded `category: 'activities'` throughout the system
2. No category detection from Google Places API types
3. Single validation logic that didn't work for different content types
4. No category-specific field mapping

## User Request

User asked Claude to implement comprehensive changes:

1. Remove all hardcoded `category: 'activities'` usage
2. Add category detection from Google Places types
3. Implement category-aware content mapping
4. Add category-specific validation logic
5. Enhanced image handling with deduplication and category-specific terms
6. Update admin UI with category dropdown
7. Test all categories with real data

## Implementation Details

### 1. API Route Changes (`/src/app/api/admin/scrape-hybrid/route.ts`)

#### Category Detection Function Added:
```typescript
// Category detection helper
function detectCategory(types: string[], userCategory?: string): string {
  // If user explicitly specified a category, use it
  if (userCategory && userCategory !== 'auto') {
    return userCategory;
  }

  // Auto-detect from Google Places types
  const typeSet = new Set(types.map(t => t.toLowerCase()));

  if (typeSet.has('lodging') || typeSet.has('hotel')) {
    return 'hotels';
  }

  if (typeSet.has('restaurant') || typeSet.has('food') || typeSet.has('cafe') ||
      typeSet.has('meal_takeaway') || typeSet.has('meal_delivery')) {
    return 'restaurants';
  }

  if (typeSet.has('shopping_mall') || typeSet.has('store') || typeSet.has('clothing_store') ||
      typeSet.has('jewelry_store') || typeSet.has('home_goods_store') || typeSet.has('department_store')) {
    return 'shopping';
  }

  // Default to activities for tourist attractions, museums, etc.
  return 'activities';
}
```

#### Category-Aware Content Mapping Function Added:
```typescript
// Category-aware content mapping
function mapToRawContent(placesData: any, category: string): any {
  // Common fields for all categories
  const commonData = {
    title: placesData.name,
    address: placesData.formatted_address || '',
    coordinates: placesData.geometry?.location || { lat: 41.0082, lng: 28.9784 },
    rating: placesData.rating || 0,
    review_count: placesData.user_ratings_total || 0,
    website_url: placesData.website || '',
    phone: placesData.formatted_phone_number || '',
    types: placesData.types || [],
    api_sources: ['google_places_api'],
    location: placesData.formatted_address || 'Istanbul, Turkey'
  };

  // Category-specific enhancements
  switch (category) {
    case 'hotels':
      return {
        ...commonData,
        description: `${placesData.name} in ${placesData.formatted_address}`,
        star_rating: Math.min(5, Math.max(1, Math.round(placesData.rating || 4))), // Approximate star rating
        check_in_time: null,
        check_out_time: null,
        amenities: extractAmenities(placesData),
        room_types: [],
        parking_available: null,
        pet_friendly: null,
        price_range: placesData.price_level ? '$'.repeat(placesData.price_level) : ''
      };

    case 'restaurants':
      return {
        ...commonData,
        description: `${placesData.name} in ${placesData.formatted_address}`,
        cuisine_type: extractCuisineType(placesData),
        reservations_required: null,
        menu_price_range: placesData.price_level ? '$'.repeat(placesData.price_level) : '',
        outdoor_seating: null,
        dietary_options: [],
        opening_hours: placesData.opening_hours?.weekday_text || [],
        price_range: placesData.price_level ? '$'.repeat(placesData.price_level) : ''
      };

    case 'shopping':
      return {
        ...commonData,
        description: `${placesData.name} - Shopping destination in ${placesData.formatted_address}`,
        center_type: extractCenterType(placesData),
        opening_hours: placesData.opening_hours?.weekday_text || [],
        specialties: [],
        accepts_credit_cards: true,
        bargaining_expected: null,
        price_range: placesData.price_level ? '$'.repeat(placesData.price_level) : ''
      };

    case 'activities':
    default:
      return {
        ...commonData,
        description: `Experience ${placesData.name} in Istanbul, Turkey.`,
        duration: null,
        highlights: [],
        opening_hours: placesData.opening_hours?.weekday_text || [],
        best_time_to_visit: null,
        difficulty_level: null,
        price_range: placesData.price_level ? '$'.repeat(placesData.price_level) : ''
      };
  }
}
```

#### Category-Specific Validation Functions Added:
```typescript
// Category-specific validation router
function validateByCategory(data: any, searchTerm: string, category: string): boolean {
  switch (category) {
    case 'hotels':
      return validateHotel(data, searchTerm);
    case 'restaurants':
      return validateRestaurant(data, searchTerm);
    case 'shopping':
      return validateShopping(data, searchTerm);
    case 'activities':
    default:
      return validateActivity(data, searchTerm);
  }
}

// Hotel-specific validation
function validateHotel(data: any, searchTerm: string): boolean {
  const titleLower = data.name?.toLowerCase() || '';
  const searchLower = searchTerm.toLowerCase();
  const types = data.types || [];

  // Must be a lodging establishment
  const isHotel = types.includes('lodging') || types.includes('hotel') ||
                  titleLower.includes('hotel') || titleLower.includes('resort') ||
                  titleLower.includes('inn') || titleLower.includes('suites');

  // Must be in Istanbul
  const isInIstanbul = isInIstanbulLocation(data.formatted_address || '');

  // Basic quality checks
  const hasRequiredFields = (data.name?.length || 0) > 3 && data.rating > 0;

  console.log(`Hotel validation for "${data.name}":`, { isHotel, isInIstanbul, hasRequiredFields });

  return isHotel && isInIstanbul && hasRequiredFields;
}

// Restaurant-specific validation
function validateRestaurant(data: any, searchTerm: string): boolean {
  const titleLower = data.name?.toLowerCase() || '';
  const searchLower = searchTerm.toLowerCase();
  const types = data.types || [];

  // Must be a food establishment
  const isRestaurant = types.includes('restaurant') || types.includes('food') ||
                       types.includes('cafe') || types.includes('meal_takeaway') ||
                       titleLower.includes('restaurant') || titleLower.includes('cafe') ||
                       titleLower.includes('bistro') || titleLower.includes('kitchen');

  // Must be in Istanbul
  const isInIstanbul = isInIstanbulLocation(data.formatted_address || '');

  // Basic quality checks
  const hasRequiredFields = (data.name?.length || 0) > 3 && data.rating > 0;

  console.log(`Restaurant validation for "${data.name}":`, { isRestaurant, isInIstanbul, hasRequiredFields });

  return isRestaurant && isInIstanbul && hasRequiredFields;
}

// Shopping-specific validation
function validateShopping(data: any, searchTerm: string): boolean {
  const titleLower = data.name?.toLowerCase() || '';
  const searchLower = searchTerm.toLowerCase();
  const types = data.types || [];

  // Must be a shopping establishment
  const isShopping = types.includes('shopping_mall') || types.includes('store') ||
                     types.includes('clothing_store') || types.includes('department_store') ||
                     titleLower.includes('bazaar') || titleLower.includes('market') ||
                     titleLower.includes('mall') || titleLower.includes('shopping');

  // Must be in Istanbul
  const isInIstanbul = isInIstanbulLocation(data.formatted_address || '');

  // Basic quality checks
  const hasRequiredFields = (data.name?.length || 0) > 3;

  console.log(`Shopping validation for "${data.name}":`, { isShopping, isInIstanbul, hasRequiredFields });

  return isShopping && isInIstanbul && hasRequiredFields;
}

// Helper function for Istanbul location validation
function isInIstanbulLocation(address: string): boolean {
  const normalizeText = (text: string) => text.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

  return normalizeText(address).includes('istanbul');
}
```

#### Enhanced Image Handling with Category-Specific Terms:
```typescript
// Enhanced image handling with category-specific terms and deduplication
async function getImagesForCategory(searchTerm: string, category: string, placesPhotos: string[], targetCount: number): Promise<string[]> {
  let allImages = [...placesPhotos]; // Start with Google Places photos

  // If we need more images, get them from Unsplash with category-specific terms
  if (allImages.length < targetCount) {
    const needed = targetCount - allImages.length;
    const stockImages = await getStockImages(searchTerm, category, needed);
    allImages.push(...stockImages);
  }

  // Deduplicate images
  const deduplicatedImages = dedupeUrls(allImages);

  // Ensure we have at least some images
  if (deduplicatedImages.length === 0) {
    console.log(`No images found for ${searchTerm}, using fallback`);
    const fallbackImages = await getStockImages('Istanbul landmark', category, 3);
    deduplicatedImages.push(...fallbackImages);
  }

  return deduplicatedImages.slice(0, targetCount);
}

// URL deduplication function
function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const deduplicated: string[] = [];

  for (const url of urls) {
    if (!url) continue;

    // Create a normalized version by removing query parameters for comparison
    const normalizedUrl = url.split('?')[0].toLowerCase();

    if (!seen.has(normalizedUrl)) {
      seen.add(normalizedUrl);
      deduplicated.push(url);
    }
  }

  return deduplicated;
}

// Category-specific Unsplash search terms
function getCategorySpecificTerms(category: string): string[] {
  switch (category) {
    case 'activities':
      return ['Istanbul landmark', 'Istanbul attraction', 'Turkish architecture'];

    case 'restaurants':
      return ['restaurant interior', 'turkish cuisine', 'istanbul restaurant', 'turkish food'];

    case 'hotels':
      return ['hotel exterior', 'hotel lobby', 'istanbul luxury hotel', 'boutique hotel'];

    case 'shopping':
      return ['grand bazaar', 'shopping mall istanbul', 'market istanbul', 'turkish bazaar'];

    case 'food_drink':
      return ['turkish food', 'meze', 'baklava', 'turkish tea'];

    default:
      return ['Istanbul landmark', 'Istanbul city'];
  }
}
```

#### Updated Main Processing Logic:
```typescript
// Updated main processing flow
for (const searchTerm of searchTerms) {
  try {
    console.log(`Processing: ${searchTerm} (${processedCount + 1}/${searchTerms.length})`);

    // Step 1: Get structured data from APIs
    const structuredData = await getStructuredData(searchTerm, userCategory);

    if (!structuredData) {
      errors.push(`No structured data found for: ${searchTerm}`);
      processedCount++;
      continue;
    }

    // Step 2: Detect category from Google Places types
    const detectedCategory = detectCategory(structuredData.types, userCategory);
    console.log(`  Detected category: ${detectedCategory} for ${searchTerm}`);

    // Step 3: Validate content based on detected category
    if (!validateByCategory(structuredData, searchTerm, detectedCategory)) {
      errors.push(`Content validation failed for: ${searchTerm} (${detectedCategory})`);
      processedCount++;
      continue;
    }

    // Step 4: Enrich with Firecrawl on official pages
    const enrichedData = await enrichWithFirecrawl(structuredData);
    creditsUsed += enrichedData.creditsUsed || 0;

    // Step 5: Get comprehensive images with category-specific terms
    const allImages = await getImagesForCategory(searchTerm, detectedCategory, structuredData.photos, imagesPerItem);

    // Step 6: Check for duplicates
    const isDuplicate = await checkDuplicate(structuredData.title, detectedCategory);
    if (isDuplicate) {
      errors.push(`Duplicate found for: ${searchTerm}`);
      processedCount++;
      continue;
    }

    // Step 7: Map content for category and insert into staging
    const rawContent = mapToRawContent(structuredData, detectedCategory);
    const stagingItem = await createStagingItem(rawContent, enrichedData, allImages, detectedCategory, job.id);

    if (stagingItem) {
      results.push({
        id: stagingItem.id,
        title: stagingItem.title,
        category: detectedCategory,
        confidence_score: stagingItem.confidence_score,
        images_count: stagingItem.image_count,
        sources_used: rawContent.api_sources.length,
        apis_used: rawContent.api_sources.filter((s: string) => s.includes('api')).length,
        firecrawl_enriched: enrichedData.success || false
      });
      successCount++;
    }

    processedCount++;
    // ... rest of processing
  }
}
```

#### Updated Interface and Request Handling:
```typescript
interface HybridScrapingJob {
  searchTerms: string[];
  category?: string; // Now optional - will auto-detect if not provided
  imagesPerItem: number;
  maxResults?: number;
}

// Updated request handling
const { searchTerms, category: userCategory, imagesPerItem = 12, maxResults = 100 }: HybridScrapingJob = await request.json();
```

### 2. Admin UI Changes (`/src/app/admin/hybrid-scraping/page.tsx`)

#### Updated Interface:
```typescript
interface ScrapingResult {
  id: string
  title: string
  category: string // Added category field
  confidence_score: number
  images_count: number
  sources_used: number
  apis_used: number
  firecrawl_enriched: boolean
}
```

#### Added Category Dropdown:
```tsx
<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full p-2 border rounded-md"
>
  <option value="auto">Auto (detect from content)</option>
  <option value="activities">Activities & Attractions</option>
  <option value="restaurants">Restaurants & Dining</option>
  <option value="hotels">Hotels & Accommodation</option>
  <option value="shopping">Shopping & Markets</option>
</select>
```

#### Added Category Display Helper Functions:
```typescript
function getCategoryLabel(category: string): string {
  switch (category) {
    case 'activities': return 'Activity'
    case 'restaurants': return 'Restaurant'
    case 'hotels': return 'Hotel'
    case 'shopping': return 'Shopping'
    default: return category
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'activities': return 'border-blue-500 text-blue-700'
    case 'restaurants': return 'border-green-500 text-green-700'
    case 'hotels': return 'border-purple-500 text-purple-700'
    case 'shopping': return 'border-orange-500 text-orange-700'
    default: return 'border-gray-500 text-gray-700'
  }
}
```

#### Enhanced Results Display:
```tsx
<div className="flex items-center gap-2">
  <h3 className="font-semibold">{result.title}</h3>
  <Badge
    variant="outline"
    className={`text-xs ${getCategoryColor(result.category)}`}
  >
    {getCategoryLabel(result.category)}
  </Badge>
</div>
<div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
  <span className="flex items-center gap-1">
    <Star className="h-3 w-3" />
    {result.confidence_score}% confidence
  </span>
  <span className="flex items-center gap-1">
    <Image className="h-3 w-3" />
    {result.images_count} images
    {result.images_count < imagesPerItem && (
      <span className="text-orange-600">
        (needs {imagesPerItem - result.images_count} more)
      </span>
    )}
  </span>
  <span className="flex items-center gap-1">
    <Database className="h-3 w-3" />
    {result.apis_used} APIs
  </span>
  {result.firecrawl_enriched && (
    <Badge variant="secondary" className="text-xs">
      <Sparkles className="h-3 w-3 mr-1" />
      Enriched
    </Badge>
  )}
</div>
```

## Testing Results

### Current Status at End of Session

The implementation was completed but testing revealed an issue with the hotel validation. When testing with "Four Seasons Hotel Istanbul at Sultanahmet":

**Test Command:**
```bash
curl -X POST http://localhost:3003/api/admin/scrape-hybrid \
  -H "Content-Type: application/json" \
  -d '{"searchTerms": ["Four Seasons Hotel Istanbul at Sultanahmet"], "imagesPerItem": 12}'
```

**Result:**
```json
{
  "success": true,
  "job_id": 26,
  "results": [],
  "summary": {
    "total_terms": 1,
    "processed": 1,
    "successful": 0,
    "failed": 1,
    "credits_used": 0,
    "errors": ["Content validation failed for: Four Seasons Hotel Istanbul at Sultanahmet (hotels)"]
  }
}
```

**Issue Identified from Logs:**
```
Google Places API Response Status: 200
Google Places API Response: {
  // ... successful response with hotel data
  name: 'Four Seasons Hotel Istanbul At Sultanahmet',
  types: [Array], // Contains 'lodging' type
  // ... other hotel data
}
Detected category: hotels for Four Seasons Hotel Istanbul at Sultanahmet
Hotel validation for "undefined": { isHotel: true, isInIstanbul: false, hasRequiredFields: false }
```

**Root Cause:** The validation function is receiving `data.name` as undefined, which suggests there's a mismatch between how the structured data is passed to the validation function.

## Files Modified

### 1. `/src/app/api/admin/scrape-hybrid/route.ts`
- **Lines changed:** Multiple sections throughout the file
- **Key changes:**
  - Added category detection function
  - Added category-aware content mapping
  - Added category-specific validation functions
  - Enhanced image handling with deduplication
  - Updated main processing flow
  - Updated interfaces and request handling

### 2. `/src/app/admin/hybrid-scraping/page.tsx`
- **Lines changed:** Multiple sections
- **Key changes:**
  - Added category field to ScrapingResult interface
  - Updated default category to 'auto'
  - Added category dropdown with auto-detect option
  - Added category display helper functions
  - Enhanced results display with category badges
  - Added image count warnings

## Current Issues to Resolve

1. **Hotel Validation Bug:** The `validateHotel` function is receiving `data.name` as undefined, causing validation to fail even when the hotel data is correctly retrieved from Google Places API.

2. **Data Structure Mismatch:** There appears to be a mismatch between the data structure expected by the validation functions and what's being passed to them.

3. **Testing Incomplete:** Only tested hotel category which failed due to the validation bug. Still need to test:
   - Restaurants: "Karaköy Lokantası", "Nusr-Et Steakhouse Etiler"
   - Shopping: "Grand Bazaar", "IstinyePark"
   - Activities: "Blue Mosque", "Hagia Sophia", "Galata Tower" (should still work)

## Next Steps Required

1. **Fix Validation Data Structure:** Debug and fix the data structure being passed to validation functions
2. **Complete Testing:** Test all categories with the provided test terms
3. **Verify Image Enhancement:** Ensure category-specific image searches are working
4. **Database Schema:** Confirm staging_queue can handle all category types
5. **Search and Replace:** Remove any remaining hardcoded 'activities' references

## Environment State

- **Server Status:** Running on localhost:3003
- **Database:** Supabase connected
- **APIs:** Google Places, Unsplash, Firecrawl all configured
- **Build Status:** Successful compilation
- **Current Branch:** main

## Todo List Final State

1. ✅ Implement category detection and remove hardcoded 'activities'
2. ✅ Add category-aware content mapping for hotels, restaurants, shopping
3. ✅ Implement category-specific validation logic
4. ✅ Add enhanced image handling with deduplication and category-specific terms
5. ✅ Update admin UI with category dropdown and staging improvements
6. 🔄 Test all categories with real data (IN PROGRESS - validation bug discovered)

The implementation is complete but requires debugging the validation data structure issue before full testing can proceed.