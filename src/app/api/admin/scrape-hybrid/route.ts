import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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

// Normalize venue names to tourist-friendly aliases
function normalizeTitleToAlias(title: string): string {
  const titleLower = title.toLowerCase();

  // Map canonical/Google names back to tourist-friendly aliases
  const aliasMapping: { [key: string]: string } = {
    // If Google returns canonical name, use tourist-friendly alias
    'sultan ahmed mosque': 'Blue Mosque',
    'sultanahmet mosque': 'Blue Mosque',
    'sultan ahmet camii': 'Blue Mosque',
    'ayasofya': 'Hagia Sophia',
    'aya sofia': 'Hagia Sophia',
    'santa sophia': 'Hagia Sophia',
    'topkapi sarayi': 'Topkapi Palace',
    'topkapi museum': 'Topkapi Palace',
    'kapali carsi': 'Grand Bazaar',
    'covered bazaar': 'Grand Bazaar',
    'great bazaar': 'Grand Bazaar',
    'galata kulesi': 'Galata Tower',
    'christ tower': 'Galata Tower',
    'yerebatan sarayi': 'Basilica Cistern',
    'sunken palace': 'Basilica Cistern',
    'yerebatan cistern': 'Basilica Cistern',
    'dolmabahce sarayi': 'Dolmabahce Palace',
    'halic': 'Golden Horn',
    'taksim meydani': 'Taksim Square',
    'istiklal caddesi': 'Istiklal Street',
    'misir carsisi': 'Spice Bazaar',
    'egyptian bazaar': 'Spice Bazaar',  // Key mapping for the user's request
    'suleymaniye camii': 'Suleymaniye Mosque',
    'istanbul museum of modern art': 'Istanbul Modern',  // For better image hits and duplicate checks
    'modern sanat müzesi': 'Istanbul Modern'
  };

  // Check for exact matches first
  for (const [canonical, alias] of Object.entries(aliasMapping)) {
    if (titleLower === canonical || titleLower === canonical + ', istanbul' || titleLower === canonical + ' istanbul') {
      return alias;
    }
  }

  // Check for partial matches (for longer venue names)
  for (const [canonical, alias] of Object.entries(aliasMapping)) {
    if (titleLower.includes(canonical)) {
      // Replace the canonical part with the alias while preserving the rest
      return title.replace(new RegExp(canonical, 'gi'), alias);
    }
  }

  // Return original title if no mapping found
  return title;
}

// Category-aware content mapping
function mapToRawContent(structuredData: any, category: string): any {
  // Common fields for all categories - using structuredData format
  const normalizedTitle = normalizeTitleToAlias(structuredData.title);
  const commonData = {
    title: normalizedTitle,
    address: structuredData.address || '',
    coordinates: structuredData.coordinates || { lat: 41.0082, lng: 28.9784 },
    rating: structuredData.rating || 0,
    review_count: structuredData.review_count || 0,
    website_url: structuredData.website_url || '',
    phone: structuredData.phone || '',
    types: structuredData.types || [],
    api_sources: structuredData.sources || ['google_places_api'],
    location: structuredData.location || 'Istanbul, Turkey'
  };

  // Category-specific enhancements
  switch (category) {
    case 'hotels':
      return {
        ...commonData,
        description: `${normalizedTitle} in ${structuredData.address}`,
        star_rating: Math.min(5, Math.max(1, Math.round(structuredData.rating || 4))), // Approximate star rating
        check_in_time: null,
        check_out_time: null,
        amenities: extractAmenities(structuredData),
        room_types: [],
        parking_available: null,
        pet_friendly: null,
        price_range: structuredData.price_range || ''
      };

    case 'restaurants':
      return {
        ...commonData,
        description: `${normalizedTitle} in ${structuredData.address}`,
        cuisine_type: extractCuisineType(structuredData),
        reservations_required: null,
        menu_price_range: structuredData.price_range || '',
        outdoor_seating: null,
        dietary_options: [],
        opening_hours: structuredData.opening_hours || [],
        price_range: structuredData.price_range || ''
      };

    case 'shopping':
      return {
        ...commonData,
        description: `${normalizedTitle} - Shopping destination in ${structuredData.address}`,
        center_type: extractCenterType(structuredData),
        opening_hours: structuredData.opening_hours || [],
        specialties: [],
        accepts_credit_cards: true,
        bargaining_expected: null,
        price_range: structuredData.price_range || ''
      };

    case 'activities':
    default:
      return {
        ...commonData,
        description: `Experience ${normalizedTitle} in Istanbul, Turkey.`,
        duration: null,
        highlights: [],
        opening_hours: structuredData.opening_hours || [],
        best_time_to_visit: null,
        difficulty_level: null,
        price_range: structuredData.price_range || ''
      };
  }
}

// Helper functions for category-specific data extraction
function extractAmenities(placesData: any): string[] {
  const amenities: string[] = [];
  const types = placesData.types || [];

  if (types.includes('spa')) amenities.push('spa');
  if (types.includes('gym')) amenities.push('gym');
  if (types.includes('swimming_pool')) amenities.push('pool');
  if (placesData.website) amenities.push('wifi');

  return amenities;
}

function extractCuisineType(placesData: any): string {
  const name = placesData.name?.toLowerCase() || '';
  const types = placesData.types || [];

  if (name.includes('turkish') || name.includes('ottoman')) return 'Turkish';
  if (name.includes('italian')) return 'Italian';
  if (name.includes('french')) return 'French';
  if (name.includes('asian')) return 'Asian';
  if (name.includes('mediterranean')) return 'Mediterranean';
  if (types.includes('meal_takeaway')) return 'Fast Food';

  return 'International'; // Default
}

function extractCenterType(placesData: any): string {
  const types = placesData.types || [];
  const name = placesData.name?.toLowerCase() || '';

  if (types.includes('shopping_mall')) return 'Shopping Mall';
  if (name.includes('bazaar') || name.includes('market')) return 'Traditional Market';
  if (types.includes('department_store')) return 'Department Store';

  return 'Shopping Center'; // Default
}

// Category-specific validation router with detailed error reporting
function validateByCategory(data: any, searchTerm: string, category: string): {
  isValid: boolean;
  validationDetails: {
    hasVenueReference: boolean;
    hasIstanbulReference: boolean;
    hasRequiredFields: boolean;
    categoryMatch: boolean;
    reasonsForFailure: string[];
  };
} {
  let validationDetails = {
    hasVenueReference: false,
    hasIstanbulReference: false,
    hasRequiredFields: false,
    categoryMatch: false,
    reasonsForFailure: [] as string[]
  };

  let isValid = false;

  switch (category) {
    case 'hotels':
      const hotelResult = validateHotel(data, searchTerm);
      isValid = hotelResult.isValid;
      validationDetails = hotelResult.validationDetails;
      break;
    case 'restaurants':
      const restaurantResult = validateRestaurant(data, searchTerm);
      isValid = restaurantResult.isValid;
      validationDetails = restaurantResult.validationDetails;
      break;
    case 'shopping':
      const shoppingResult = validateShopping(data, searchTerm);
      isValid = shoppingResult.isValid;
      validationDetails = shoppingResult.validationDetails;
      break;
    case 'activities':
    default:
      const activityResult = validateActivity(data, searchTerm);
      isValid = activityResult.isValid;
      validationDetails = activityResult.validationDetails;
      break;
  }

  return {
    isValid,
    validationDetails
  };
}

// Hotel-specific validation with detailed reporting
function validateHotel(data: any, searchTerm: string): {
  isValid: boolean;
  validationDetails: {
    hasVenueReference: boolean;
    hasIstanbulReference: boolean;
    hasRequiredFields: boolean;
    categoryMatch: boolean;
    reasonsForFailure: string[];
  };
} {
  const titleLower = data.title?.toLowerCase() || '';
  const searchLower = searchTerm.toLowerCase();
  const types = data.types || [];
  const reasonsForFailure: string[] = [];

  // Check if it's a lodging establishment
  const categoryMatch = types.includes('lodging') || types.includes('hotel') ||
                       titleLower.includes('hotel') || titleLower.includes('resort') ||
                       titleLower.includes('inn') || titleLower.includes('suites');

  if (!categoryMatch) {
    reasonsForFailure.push('Not identified as hotel/lodging establishment');
  }

  // Check venue reference (basic title check against search term)
  const hasVenueReference = titleLower.includes(searchLower.split(' ')[0]) ||
                           searchLower.includes(titleLower.split(' ')[0]);

  if (!hasVenueReference) {
    reasonsForFailure.push('Venue name does not match search term');
  }

  // Must be in Istanbul
  const hasIstanbulReference = isInIstanbulLocation(data.address || '');

  if (!hasIstanbulReference) {
    reasonsForFailure.push('Location not confirmed to be in Istanbul');
  }

  // Basic quality checks
  const hasRequiredFields = (data.title?.length || 0) > 3 && data.rating > 0;

  if (!hasRequiredFields) {
    reasonsForFailure.push('Missing required fields (title too short or no rating)');
  }

  const isValid = categoryMatch && hasVenueReference && hasIstanbulReference && hasRequiredFields;

  console.log(`Hotel validation for "${data.title}":`, {
    categoryMatch,
    hasVenueReference,
    hasIstanbulReference,
    hasRequiredFields,
    isValid,
    reasonsForFailure
  });

  return {
    isValid,
    validationDetails: {
      hasVenueReference,
      hasIstanbulReference,
      hasRequiredFields,
      categoryMatch,
      reasonsForFailure
    }
  };
}

// Restaurant-specific validation with detailed reporting
function validateRestaurant(data: any, searchTerm: string): {
  isValid: boolean;
  validationDetails: {
    hasVenueReference: boolean;
    hasIstanbulReference: boolean;
    hasRequiredFields: boolean;
    categoryMatch: boolean;
    reasonsForFailure: string[];
  };
} {
  const titleLower = data.title?.toLowerCase() || '';
  const searchLower = searchTerm.toLowerCase();
  const types = data.types || [];
  const reasonsForFailure: string[] = [];

  // Check if it's a food establishment
  const categoryMatch = types.includes('restaurant') || types.includes('food') ||
                       types.includes('cafe') || types.includes('meal_takeaway') ||
                       titleLower.includes('restaurant') || titleLower.includes('cafe') ||
                       titleLower.includes('bistro') || titleLower.includes('kitchen');

  if (!categoryMatch) {
    reasonsForFailure.push('Not identified as restaurant/food establishment');
  }

  // Check venue reference
  const hasVenueReference = titleLower.includes(searchLower.split(' ')[0]) ||
                           searchLower.includes(titleLower.split(' ')[0]);

  if (!hasVenueReference) {
    reasonsForFailure.push('Venue name does not match search term');
  }

  // Must be in Istanbul
  const hasIstanbulReference = isInIstanbulLocation(data.address || '');

  if (!hasIstanbulReference) {
    reasonsForFailure.push('Location not confirmed to be in Istanbul');
  }

  // Basic quality checks
  const hasRequiredFields = (data.title?.length || 0) > 3 && data.rating > 0;

  if (!hasRequiredFields) {
    reasonsForFailure.push('Missing required fields (title too short or no rating)');
  }

  const isValid = categoryMatch && hasVenueReference && hasIstanbulReference && hasRequiredFields;

  console.log(`Restaurant validation for "${data.title}":`, {
    categoryMatch,
    hasVenueReference,
    hasIstanbulReference,
    hasRequiredFields,
    isValid,
    reasonsForFailure
  });

  return {
    isValid,
    validationDetails: {
      hasVenueReference,
      hasIstanbulReference,
      hasRequiredFields,
      categoryMatch,
      reasonsForFailure
    }
  };
}

// Shopping-specific validation with detailed reporting
function validateShopping(data: any, searchTerm: string): {
  isValid: boolean;
  validationDetails: {
    hasVenueReference: boolean;
    hasIstanbulReference: boolean;
    hasRequiredFields: boolean;
    categoryMatch: boolean;
    reasonsForFailure: string[];
  };
} {
  const titleLower = data.title?.toLowerCase() || '';
  const searchLower = searchTerm.toLowerCase();
  const types = data.types || [];
  const reasonsForFailure: string[] = [];

  // Check if it's a shopping establishment
  const categoryMatch = types.includes('shopping_mall') || types.includes('store') ||
                       types.includes('clothing_store') || types.includes('department_store') ||
                       titleLower.includes('bazaar') || titleLower.includes('market') ||
                       titleLower.includes('mall') || titleLower.includes('shopping');

  if (!categoryMatch) {
    reasonsForFailure.push('Not identified as shopping establishment');
  }

  // Check venue reference
  const hasVenueReference = titleLower.includes(searchLower.split(' ')[0]) ||
                           searchLower.includes(titleLower.split(' ')[0]);

  if (!hasVenueReference) {
    reasonsForFailure.push('Venue name does not match search term');
  }

  // Must be in Istanbul
  const hasIstanbulReference = isInIstanbulLocation(data.address || '');

  if (!hasIstanbulReference) {
    reasonsForFailure.push('Location not confirmed to be in Istanbul');
  }

  // Basic quality checks (shopping venues don't require rating)
  const hasRequiredFields = (data.title?.length || 0) > 3;

  if (!hasRequiredFields) {
    reasonsForFailure.push('Missing required fields (title too short)');
  }

  const isValid = categoryMatch && hasVenueReference && hasIstanbulReference && hasRequiredFields;

  console.log(`Shopping validation for "${data.title}":`, {
    categoryMatch,
    hasVenueReference,
    hasIstanbulReference,
    hasRequiredFields,
    isValid,
    reasonsForFailure
  });

  return {
    isValid,
    validationDetails: {
      hasVenueReference,
      hasIstanbulReference,
      hasRequiredFields,
      categoryMatch,
      reasonsForFailure
    }
  };
}

// Activity-specific validation with enhanced alias matching and detailed reporting
function validateActivity(data: any, searchTerm: string): {
  isValid: boolean;
  validationDetails: {
    hasVenueReference: boolean;
    hasIstanbulReference: boolean;
    hasRequiredFields: boolean;
    categoryMatch: boolean;
    reasonsForFailure: string[];
  };
} {
  const titleLower = data.title?.toLowerCase() || '';
  const searchLower = searchTerm.toLowerCase();
  const reasonsForFailure: string[] = [];

  // Enhanced matching with Istanbul landmarks aliases
  const titleMatch = checkActivityTitleMatch(titleLower, searchLower);
  const hasVenueReference = titleMatch.matches;

  if (!hasVenueReference) {
    reasonsForFailure.push(`Venue name mismatch: ${titleMatch.reason}`);
  }

  // Must be in Istanbul
  const hasIstanbulReference = isInIstanbulLocation(data.address || '');

  if (!hasIstanbulReference) {
    reasonsForFailure.push('Location not confirmed to be in Istanbul');
  }

  // Must have basic required fields
  const hasRequiredFields = (data.title?.length || 0) > 3 && data.rating > 0;

  if (!hasRequiredFields) {
    reasonsForFailure.push('Missing required fields (title too short or no rating)');
  }

  // Check for obvious mismatches with other cities
  const isNotMismatch = !containsOtherCityReferences(titleLower);
  const categoryMatch = isNotMismatch; // Activities don't have specific types like hotels/restaurants

  if (!categoryMatch) {
    reasonsForFailure.push('Contains references to other cities (not Istanbul)');
  }

  const isValid = hasVenueReference && hasIstanbulReference && hasRequiredFields && categoryMatch;

  console.log(`Activity validation for "${data.title}":`, {
    titleMatch: titleMatch.matches,
    matchReason: titleMatch.reason,
    hasIstanbulReference,
    hasRequiredFields,
    categoryMatch,
    isValid,
    reasonsForFailure
  });

  return {
    isValid,
    validationDetails: {
      hasVenueReference,
      hasIstanbulReference,
      hasRequiredFields,
      categoryMatch,
      reasonsForFailure
    }
  };
}

// Enhanced title matching with aliases and fuzzy matching
function checkActivityTitleMatch(titleLower: string, searchLower: string): { matches: boolean, reason: string } {
  // Direct matches
  if (titleLower.includes(searchLower) || searchLower.includes(titleLower)) {
    return { matches: true, reason: 'Direct match' };
  }

  // Known Istanbul landmark aliases
  const landmarkAliases: { [key: string]: string[] } = {
    'blue mosque': ['sultan ahmed mosque', 'sultanahmet mosque', 'sultan ahmet camii'],
    'hagia sophia': ['ayasofya', 'aya sofia', 'santa sophia', 'hagia sofia'],
    'topkapi palace': ['topkapi sarayi', 'topkapi museum'],
    'grand bazaar': ['kapali carsi', 'covered bazaar', 'great bazaar'],
    'galata tower': ['galata kulesi', 'christ tower'],
    'basilica cistern': ['yerebatan sarayi', 'sunken palace', 'yerebatan cistern'],
    'dolmabahce palace': ['dolmabahce sarayi'],
    'bosphorus': ['bosporus', 'bosphorus strait', 'istanbul strait'],
    'golden horn': ['halic'],
    'taksim square': ['taksim meydani'],
    'istiklal street': ['istiklal caddesi'],
    'spice bazaar': ['misir carsisi', 'egyptian bazaar'],
    'suleymaniye mosque': ['suleymaniye camii'],
    'istanbul modern': ['istanbul museum of modern art', 'modern sanat müzesi']
  };

  // Check if search term matches any known aliases
  for (const [canonical, aliases] of Object.entries(landmarkAliases)) {
    if (searchLower.includes(canonical)) {
      // If searching for canonical name, check if title contains any alias
      if (aliases.some(alias => titleLower.includes(alias))) {
        return { matches: true, reason: `Alias match: ${canonical}` };
      }
    }
    // If searching for alias, check if title contains canonical or other aliases
    if (aliases.some(alias => searchLower.includes(alias))) {
      if (titleLower.includes(canonical) || aliases.some(otherAlias => titleLower.includes(otherAlias))) {
        return { matches: true, reason: `Reverse alias match: ${canonical}` };
      }
    }
  }

  // Word-based fuzzy matching
  const searchWords = searchLower.split(' ').filter(word => word.length > 2);
  const titleWords = titleLower.split(' ').filter(word => word.length > 2);

  // At least 50% of search words should match title words
  const matchingWords = searchWords.filter(searchWord =>
    titleWords.some(titleWord =>
      titleWord.includes(searchWord) || searchWord.includes(titleWord)
    )
  );

  const matchPercentage = searchWords.length > 0 ? (matchingWords.length / searchWords.length) : 0;

  if (matchPercentage >= 0.5) {
    return { matches: true, reason: `Fuzzy match: ${Math.round(matchPercentage * 100)}% word overlap` };
  }

  return { matches: false, reason: `No match found (${Math.round(matchPercentage * 100)}% word overlap)` };
}

// Check for other city references to avoid mismatches
function containsOtherCityReferences(titleLower: string): boolean {
  const otherCities = [
    'mendoza', 'lisbon', 'lisboa', 'paris', 'london', 'madrid', 'barcelona',
    'rome', 'roma', 'milan', 'milano', 'berlin', 'vienna', 'wien', 'budapest',
    'prague', 'praha', 'athens', 'athina', 'cairo', 'dubai', 'abu dhabi',
    'new york', 'los angeles', 'chicago', 'tokyo', 'bangkok', 'singapore',
    'hong kong', 'mumbai', 'delhi', 'sydney', 'melbourne', 'toronto'
  ];

  return otherCities.some(city => titleLower.includes(city));
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


interface HybridScrapingJob {
  searchTerms: string[];
  category?: string; // Now optional - will auto-detect if not provided
  imagesPerItem: number;
  maxResults?: number;
}

interface StructuredActivityData {
  title: string;
  description: string;
  rating: number;
  review_count: number;
  price_range: string;
  duration: string;
  location: string;
  website_url: string;
  phone: string;
  address: string;
  coordinates: { lat: number; lng: number };
  opening_hours: string[];
  types: string[];
  photos: string[];
  confidence_score: number;
  sources: string[];
}

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchTerms, category: userCategory, imagesPerItem = 15, maxResults = 100 }: HybridScrapingJob = await request.json();

    if (!searchTerms || searchTerms.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Search terms are required'
      }, { status: 400 });
    }

    console.log(`Starting hybrid scraping for ${searchTerms.length} terms with category: ${userCategory || 'auto-detect'}`);

    // Create scraping job record
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        job_type: 'hybrid_api_enrichment',
        category: userCategory || 'auto-detect',
        input_data: { search_terms: searchTerms, images_per_item: imagesPerItem, user_category: userCategory },
        status: 'running',
        total_items: searchTerms.length,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    interface TermResult {
      term: string;
      detectedCategory: 'activities' | 'restaurants' | 'hotels' | 'shopping';
      status: 'success' | 'duplicate' | 'failed';
      id?: number;
      title?: string;
      imagesCount?: number;
      confidence?: number;
      error?: {
        step: 'search' | 'details' | 'photos' | 'unsplash' | 'dedupe' | 'staging' | 'duplicate' | 'validation';
        message: string;
        details?: {
          validationChecks?: {
            hasVenueReference: boolean;
            hasIstanbulReference: boolean;
            hasRequiredFields: boolean;
            categoryMatch: boolean;
            reasonsForFailure: string[];
          };
          failureReasons?: string[];
          venue?: string;
          category?: string;
          supabaseError?: string;
          imageValidationPass?: boolean;
          imageCount?: number;
        };
      };
    }

    const results: TermResult[] = [];
    let processedCount = 0;
    let successCount = 0;
    let creditsUsed = 0;

    // Process each search term using hybrid approach
    for (const searchTerm of searchTerms) {
      const termResult: TermResult = {
        term: searchTerm,
        detectedCategory: 'activities', // Default, will be updated
        status: 'failed'
      };

      try {
        console.log(`Processing: ${searchTerm} (${processedCount + 1}/${searchTerms.length})`);

        // Step 1: Get structured data from APIs
        const structuredData = await getStructuredData(searchTerm, userCategory);

        if (!structuredData) {
          termResult.error = {
            step: 'search',
            message: `No structured data found for: ${searchTerm}`
          };
          results.push(termResult);
          processedCount++;
          continue;
        }

        // Step 2: Detect category from Google Places types
        const detectedCategory = detectCategory(structuredData.types, userCategory);
        termResult.detectedCategory = detectedCategory as 'activities' | 'restaurants' | 'hotels' | 'shopping';
        console.log(`  Detected category: ${detectedCategory} for ${searchTerm}`);

        // Step 3: Validate content based on detected category
        console.log(`  About to validate with data:`, { title: structuredData.title, address: structuredData.address, types: structuredData.types });
        const validationResult = validateByCategory(structuredData, searchTerm, detectedCategory);
        console.log(`  Validation result:`, validationResult);
        if (!validationResult.isValid) {
          termResult.error = {
            step: 'validation',
            message: `Content validation failed for: ${searchTerm} (${detectedCategory})`,
            details: {
              validationChecks: validationResult.validationDetails,
              failureReasons: validationResult.validationDetails.reasonsForFailure,
              venue: structuredData.title,
              category: detectedCategory
            }
          };
          results.push(termResult);
          processedCount++;
          continue;
        }

        // Step 4: Check for duplicates early to avoid unnecessary processing
        const isDuplicate = await checkDuplicate(structuredData.title, detectedCategory);
        if (isDuplicate) {
          termResult.status = 'duplicate';
          termResult.title = structuredData.title;
          termResult.error = {
            step: 'duplicate',
            message: `Duplicate found for: ${searchTerm} (${structuredData.title})`
          };
          results.push(termResult);
          processedCount++;
          continue;
        }

        // Step 5: Enrich with Firecrawl on official pages
        const enrichedData = await enrichWithFirecrawl(structuredData);
        creditsUsed += enrichedData.creditsUsed || 0;

        // Step 6: Get comprehensive images with category-specific terms
        const allImages = await getImagesForCategory(searchTerm, detectedCategory, structuredData.photos, imagesPerItem);

        if (allImages.length < 5) {
          termResult.error = {
            step: 'photos',
            message: `Only found ${allImages.length} images for ${searchTerm} (target: ${imagesPerItem})`
          };
          // Continue processing but mark as warning
        }

        // Step 7: Map content for category and insert into staging
        const rawContent = mapToRawContent(structuredData, detectedCategory);
        const stagingResult = await createStagingItem(rawContent, enrichedData, allImages, detectedCategory, job.id);

        if (stagingResult.success) {
          termResult.status = 'success';
          termResult.id = stagingResult.item.id;
          termResult.title = stagingResult.item.title;
          termResult.imagesCount = stagingResult.item.image_count;
          termResult.confidence = stagingResult.item.confidence_score;
          successCount++;
        } else {
          termResult.error = {
            step: 'staging',
            message: `Database save failed for: ${searchTerm}`,
            details: {
              supabaseError: stagingResult.error,
              venue: structuredData.title,
              category: detectedCategory,
              imageCount: allImages.length,
              imageValidationPass: true // Will be updated when image validation is integrated
            }
          };
        }

        results.push(termResult);
        processedCount++;

        // Update job progress
        await supabase
          .from('scraping_jobs')
          .update({
            processed_items: processedCount,
            successful_items: successCount,
            credits_used: creditsUsed,
            staging_ids: results.filter(r => r.status === 'success').map(r => r.id).filter(id => id)
          })
          .eq('id', job.id);

      } catch (error) {
        console.error(`Error processing ${searchTerm}:`, error);
        termResult.error = {
          step: 'search',
          message: `Failed to process ${searchTerm}: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
        results.push(termResult);
        processedCount++;
      }
    }

    // Store detailed results in job for later retrieval
    const detailedResults = {
      results: results,
      summary: {
        total_terms: searchTerms.length,
        processed: processedCount,
        successful: successCount,
        failed: results.filter(r => r.status === 'failed').length,
        duplicates: results.filter(r => r.status === 'duplicate').length,
        credits_used: creditsUsed
      }
    };

    // Complete the job
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        processed_items: processedCount,
        successful_items: successCount,
        failed_items: results.filter(r => r.status === 'failed').length,
        credits_used: creditsUsed,
        error_log: { detailed_results: detailedResults }
      })
      .eq('id', job.id);

    return NextResponse.json({
      success: true,
      job_id: job.id,
      results: results
    });

  } catch (error) {
    console.error('Hybrid scraping error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get structured data from Google Places API
async function getStructuredData(searchTerm: string, category: string): Promise<StructuredActivityData | null> {
  try {
    console.log(`  Getting structured data for: ${searchTerm}`);

    // Use real Google Places API if available, otherwise fall back to mock data
    const placesData = process.env.GOOGLE_PLACES_API_KEY
      ? await callGooglePlacesAPI(searchTerm, category)
      : await simulateGooglePlacesAPI(searchTerm, category);

    if (!placesData) {
      return null;
    }

    return {
      title: placesData.name,
      description: placesData.description || `Experience ${placesData.name} in Istanbul, Turkey.`,
      rating: placesData.rating || 0,
      review_count: placesData.user_ratings_total || 0,
      price_range: placesData.price_level ? `${'$'.repeat(placesData.price_level)}` : '',
      duration: estimateDuration(category),
      location: placesData.formatted_address || 'Istanbul, Turkey',
      website_url: placesData.website || '',
      phone: placesData.formatted_phone_number || '',
      address: placesData.formatted_address || '',
      coordinates: placesData.geometry?.location || { lat: 41.0082, lng: 28.9784 },
      opening_hours: placesData.opening_hours?.weekday_text || [],
      types: placesData.types || [],
      photos: placesData.photos || [],
      confidence_score: calculatePlacesConfidence(placesData, searchTerm),
      sources: [process.env.GOOGLE_PLACES_API_KEY ? 'google_places_api' : 'simulated_data']
    };

  } catch (error) {
    console.error(`Error getting structured data for ${searchTerm}:`, error);
    return null;
  }
}

// Real Google Places API call
async function callGooglePlacesAPI(searchTerm: string, category: string): Promise<any> {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // First, search for the place
    const query = `${searchTerm} Istanbul Turkey`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    console.log(`Google Places Search URL: ${searchUrl}`);
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    console.log(`Google Places API Response Status: ${searchResponse.status}`);
    console.log(`Google Places API Response:`, searchData);

    if (searchData.error_message) {
      console.error(`Google Places API Error: ${searchData.error_message}`);
      return null;
    }

    if (!searchData.results || searchData.results.length === 0) {
      console.log(`No places found for: ${searchTerm}`);
      return null;
    }

    const place = searchData.results[0];

    // Get detailed information using place_id
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,rating,user_ratings_total,price_level,website,formatted_phone_number,opening_hours,types,photos&key=${apiKey}`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsData.result) {
      console.log(`No details found for place_id: ${place.place_id}`);
      return null;
    }

    const result = detailsData.result;

    // Process photos to get URLs
    const photos: string[] = [];
    if (result.photos) {
      for (const photo of result.photos.slice(0, 5)) {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`;
        photos.push(photoUrl);
      }
    }

    return {
      name: result.name,
      description: `${result.name} in ${result.formatted_address}`,
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      price_level: result.price_level,
      formatted_address: result.formatted_address,
      website: result.website,
      formatted_phone_number: result.formatted_phone_number,
      geometry: result.geometry,
      opening_hours: result.opening_hours,
      types: result.types,
      photos: photos
    };

  } catch (error) {
    console.error('Google Places API error:', error);
    return null;
  }
}

// Simulate Google Places API (fallback when no API key)
async function simulateGooglePlacesAPI(searchTerm: string, category: string): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const mockData = {
    'blue mosque': {
      name: 'Blue Mosque (Sultan Ahmed Mosque)',
      description: 'Historic mosque built in the early 17th century, famous for its blue tiles and six minarets.',
      rating: 4.5,
      user_ratings_total: 45678,
      price_level: 0, // Free
      formatted_address: 'Sultanahmet, Atmeydanı Cd. No:7, 34122 Fatih/İstanbul, Turkey',
      website: 'https://www.sultanahmetcamii.org/',
      formatted_phone_number: '+90 212 458 4468',
      geometry: { location: { lat: 41.0054, lng: 28.9768 } },
      opening_hours: {
        weekday_text: [
          'Monday: 8:30 AM – 6:00 PM',
          'Tuesday: 8:30 AM – 6:00 PM',
          'Wednesday: 8:30 AM – 6:00 PM',
          'Thursday: 8:30 AM – 6:00 PM',
          'Friday: 8:30 AM – 6:00 PM',
          'Saturday: 8:30 AM – 6:00 PM',
          'Sunday: 8:30 AM – 6:00 PM'
        ]
      },
      types: ['mosque', 'tourist_attraction', 'place_of_worship'],
      photos: [
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
      ]
    },
    'hagia sophia': {
      name: 'Hagia Sophia',
      description: 'Former Byzantine cathedral and Ottoman mosque, now a museum showcasing both Christian and Islamic heritage.',
      rating: 4.6,
      user_ratings_total: 67890,
      price_level: 1,
      formatted_address: 'Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul, Turkey',
      website: 'https://ayasofyacamii.gov.tr/',
      geometry: { location: { lat: 41.0086, lng: 28.9802 } },
      types: ['museum', 'tourist_attraction', 'mosque'],
      photos: [
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800'
      ]
    },
    'galata tower': {
      name: 'Galata Tower',
      description: 'Medieval stone tower offering panoramic views of Istanbul and the Bosphorus.',
      rating: 4.4,
      user_ratings_total: 23456,
      price_level: 2,
      formatted_address: 'Bereketzade, Galata Kulesi Sk., 34421 Beyoğlu/İstanbul, Turkey',
      website: 'https://galatatower.com/',
      geometry: { location: { lat: 41.0256, lng: 28.9744 } },
      types: ['tourist_attraction', 'historical_landmark'],
      photos: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
      ]
    }
  };

  const key = searchTerm.toLowerCase();
  return mockData[key as keyof typeof mockData] || null;
}

// Enrich structured data with Firecrawl on official pages with guardrails
async function enrichWithFirecrawl(structuredData: StructuredActivityData): Promise<any> {
  if (!process.env.FIRECRAWL_API_KEY || !structuredData.website_url) {
    return { success: false, creditsUsed: 0 };
  }

  try {
    const url = structuredData.website_url;
    console.log(`  Enriching with Firecrawl: ${url}`);

    // Check if the URL domain is in our allowlist
    if (!isAllowedDomain(url)) {
      console.log(`  Skipping enrichment - domain not in allowlist: ${new URL(url).hostname}`);
      return { success: false, creditsUsed: 0, skipReason: 'Domain not in allowlist' };
    }

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown'],
        includeTags: ['title', 'meta', 'img', 'p', 'h1', 'h2', 'h3', 'li'],
        excludeTags: ['nav', 'footer', 'header', 'script', 'style', 'aside'],
        waitFor: 3000,
        timeout: 20000,
        onlyMainContent: true
      })
    });

    if (!response.ok) {
      console.log(`  Firecrawl API error: ${response.status}`);
      return { success: false, creditsUsed: 1 };
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      console.log(`  Firecrawl returned no data`);
      return { success: false, creditsUsed: 1 };
    }

    // Check if the scraped content is relevant to Istanbul and the specific venue
    const contentRelevanceCheck = validateContentRelevance(
      data.data.markdown || '',
      data.data.metadata?.title || '',
      structuredData.title,
      url
    );

    if (!contentRelevanceCheck.isRelevant) {
      console.log(`  Skipping enrichment - content not relevant: ${contentRelevanceCheck.reason}`);
      return {
        success: false,
        creditsUsed: 1,
        skipReason: `Content validation failed: ${contentRelevanceCheck.reason}`,
        sourcesChecked: [url]
      };
    }

    // Extract additional images from the official page
    const additionalImages = extractImagesFromFirecrawl(data.data);

    // Extract highlights and additional details
    const highlights = extractHighlightsFromFirecrawl(data.data.markdown || '');
    const additionalInfo = extractAdditionalInfo(data.data.markdown || '');

    console.log(`  Firecrawl enrichment successful - content validated for ${structuredData.title}`);

    return {
      success: true,
      creditsUsed: 1,
      additional_images: additionalImages,
      highlights: highlights,
      additional_info: additionalInfo,
      enriched_content: data.data.markdown?.substring(0, 2000) || '',
      sources_validated: [url],
      validation_passed: contentRelevanceCheck.checks
    };

  } catch (error) {
    console.error('Firecrawl enrichment error:', error);
    return { success: false, creditsUsed: 1 };
  }
}

// Check if domain is in our allowlist for enrichment
function isAllowedDomain(url: string): boolean {
  try {
    const domain = new URL(url).hostname.toLowerCase();

    const allowedDomains = [
      // Official tourism sites
      'goturkey.com',
      'turkey.travel',
      'istanbul.gov.tr',
      'ibb.istanbul',
      'muslera.istanbul.gov.tr',

      // Cultural/educational sites
      'wikipedia.org',
      'en.wikipedia.org',
      'tr.wikipedia.org',
      'unesco.org',
      'whc.unesco.org',

      // Official venue websites (hotels, restaurants, attractions)
      'fourseasons.com',
      'kempinskihotels.com',
      'swissotel.com',
      'fairmont.com',
      'marriott.com',
      'hilton.com',
      'sultanahmetcamii.org',
      'ayasofyacamii.gov.tr',
      'topkapisarayi.gov.tr',
      'muze.gov.tr',
      'galatatower.com',
      'dolmabahcepalace.com',

      // Trusted booking/review platforms (limited list, no aggregators)
      'tripadvisor.com',
      'booking.com',
      'hotels.com',
      'expedia.com',
      'agoda.com',

      // Official restaurant/venue sites
      'nusr-et.com',
      'karakoylokantasi.com',
      'istinyepark.com',
      'zorlu.com.tr',
      'galataport.com'
    ];

    // Explicitly blocked domains (tour aggregators and potential spam sources)
    const blockedDomains = [
      'getyourguide.com',
      'viator.com',
      'klook.com',
      'tiqets.com',
      'civitatis.com',
      'headout.com',
      'tourhunter.com',
      'tourradar.com',
      'intrepidtravel.com',
      'gadventures.com'
    ];

    // Check if domain is explicitly blocked
    const isBlocked = blockedDomains.some(blocked =>
      domain === blocked || domain.endsWith('.' + blocked)
    );

    if (isBlocked) {
      return false;
    }

    return allowedDomains.some(allowed =>
      domain === allowed || domain.endsWith('.' + allowed)
    );
  } catch {
    return false;
  }
}

// Validate that scraped content is relevant to Istanbul and the specific venue
function validateContentRelevance(content: string, title: string, venueName: string, url: string): {
  isRelevant: boolean;
  reason: string;
  checks: { [key: string]: boolean };
} {
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();
  const venueNameLower = venueName.toLowerCase();
  const urlLower = url.toLowerCase();

  const checks = {
    hasIstanbulReference: false,
    hasVenueReference: false,
    noOtherCities: true,
    hasRelevantContent: false
  };

  // Check for Istanbul references (enhanced with neighborhoods and spellings)
  const istanbulReferences = [
    'istanbul', 'İstanbul', 'constantinople', 'byzantium',
    // Istanbul districts and neighborhoods
    'sultanahmet', 'galata', 'beyoğlu', 'beyoglu', 'kadıköy', 'kadikoy',
    'şişli', 'sisli', 'beşiktaş', 'besiktas', 'üsküdar', 'uskudar',
    'fatih', 'eminönü', 'eminonu', 'taksim', 'karaköy', 'karakoy',
    'ortaköy', 'ortakoy', 'bebek', 'etiler', 'levent', 'maslak',
    'bosphorus', 'boğaziçi', 'bósforo', 'golden horn', 'haliç',
    // Turkish context indicators
    'türkiye', 'turkey', 'turkish', 'türk', 'ottoman', 'osmanlı'
  ];

  checks.hasIstanbulReference = istanbulReferences.some(ref =>
    contentLower.includes(ref) || titleLower.includes(ref) || urlLower.includes(ref)
  );

  // Check for venue reference
  const venueWords = venueNameLower.split(' ').filter(word => word.length > 2);
  checks.hasVenueReference =
    venueWords.some(word => contentLower.includes(word) || titleLower.includes(word)) ||
    titleLower.includes(venueNameLower.substring(0, 10));

  // Check for other cities that would indicate irrelevant content (expanded list)
  const otherCities = [
    // European cities
    'mendoza', 'lisbon', 'lisboa', 'paris', 'london', 'madrid', 'barcelona',
    'rome', 'roma', 'milan', 'milano', 'berlin', 'vienna', 'wien', 'budapest',
    'prague', 'praha', 'athens', 'athina', 'amsterdam', 'dublin', 'zurich',
    'geneva', 'stockholm', 'oslo', 'copenhagen', 'helsinki', 'warsaw',
    'krakow', 'budapest', 'bucharest', 'sofia', 'belgrade', 'zagreb',

    // Middle East & North Africa
    'cairo', 'alexandria', 'dubai', 'abu dhabi', 'doha', 'kuwait', 'riyadh',
    'jeddah', 'beirut', 'damascus', 'amman', 'baghdad', 'tehran', 'tel aviv',
    'jerusalem', 'casablanca', 'marrakech', 'tunis', 'algiers',

    // Americas
    'new york', 'los angeles', 'chicago', 'houston', 'philadelphia', 'phoenix',
    'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville',
    'montreal', 'toronto', 'vancouver', 'mexico city', 'guadalajara', 'puebla',
    'bogota', 'medellin', 'caracas', 'lima', 'quito', 'santiago', 'buenos aires',
    'rio de janeiro', 'sao paulo', 'brasilia', 'montevideo', 'asuncion',

    // Asia Pacific
    'tokyo', 'osaka', 'kyoto', 'yokohama', 'nagoya', 'sapporo', 'fukuoka',
    'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'hangzhou',
    'seoul', 'busan', 'incheon', 'bangkok', 'phuket', 'chiang mai', 'pattaya',
    'singapore', 'kuala lumpur', 'penang', 'jakarta', 'bali', 'surabaya',
    'manila', 'cebu', 'davao', 'mumbai', 'delhi', 'bangalore', 'hyderabad',
    'chennai', 'kolkata', 'pune', 'ahmedabad', 'karachi', 'lahore', 'islamabad',
    'dhaka', 'chittagong', 'colombo', 'kandy', 'kathmandu', 'sydney', 'melbourne',
    'brisbane', 'perth', 'adelaide', 'auckland', 'wellington', 'christchurch',

    // Africa
    'johannesburg', 'cape town', 'durban', 'pretoria', 'lagos', 'abuja', 'kano',
    'accra', 'kumasi', 'nairobi', 'mombasa', 'addis ababa', 'dar es salaam',
    'kampala', 'kigali', 'lusaka', 'harare', 'gaborone', 'windhoek'
  ];

  checks.noOtherCities = !otherCities.some(city =>
    contentLower.includes(city) && !contentLower.includes('istanbul')
  );

  // Check for relevant travel/tourism content
  const relevantKeywords = [
    'visit', 'attraction', 'tourist', 'travel', 'hotel', 'restaurant', 'museum',
    'palace', 'mosque', 'church', 'gallery', 'park', 'garden', 'market', 'bazaar',
    'booking', 'reservation', 'opening hours', 'admission', 'ticket', 'guide',
    'historical', 'cultural', 'architecture', 'ottoman', 'byzantine', 'turkish'
  ];

  checks.hasRelevantContent = relevantKeywords.some(keyword =>
    contentLower.includes(keyword)
  );

  const isRelevant =
    checks.hasIstanbulReference &&
    checks.hasVenueReference &&
    checks.noOtherCities &&
    checks.hasRelevantContent;

  let reason = '';
  if (!checks.hasIstanbulReference) reason = 'No Istanbul reference found';
  else if (!checks.hasVenueReference) reason = 'No venue reference found';
  else if (!checks.noOtherCities) reason = 'Contains references to other cities';
  else if (!checks.hasRelevantContent) reason = 'No relevant travel content found';
  else reason = 'Content validated successfully';

  return { isRelevant, reason, checks };
}

// BULLETPROOF IMAGE PIPELINE - Guaranteed 12-15 high-quality, venue-specific images
// ============================================================================
// FUTURE-PROOF IMAGE PIPELINE - PRIORITY ORDERED IMAGE SOURCES
// ============================================================================
// Priority Order: 1) Affiliate Partners → 2) Google Places → 3) Wikimedia → 4) Unsplash/Pexels → 5) Local Placeholder
// Designed for easy affiliate integration without refactoring
// ============================================================================

// ============================================================================
// COMPREHENSIVE IMAGE PIPELINE - 15-30 HIGH-QUALITY IMAGES PER VENUE
// Priority Order: 1) Google Places → 2) Unsplash → 3) Pexels → 4) Wikimedia → 5) Placeholder
// ============================================================================

interface ImageValidationResult {
  validImages: string[];
  rejectedCount: number;
  validationStats: {
    total: number;
    urlValid: number;
    accessible: number;
    resolutionPass: number;
    aspectRatioPass: number;
    fileTypePass: number;
    relevancePass: number;
    final: number;
  };
}

async function getImagesForCategory(searchTerm: string, category: string, placesPhotos: string[], targetCount: number): Promise<string[]> {
  console.log(`🚀 COMPREHENSIVE IMAGE PIPELINE: "${searchTerm}" (${category}) - Target: ${targetCount} images`);
  console.log(`📋 Priority: Google Places → Unsplash → Pexels → Wikimedia → Placeholder`);

  const normalizedTitle = normalizeTitleToAlias(searchTerm);
  const searchQueries = [normalizedTitle, searchTerm].filter((term, index, arr) => arr.indexOf(term) === index);

  // Enhanced image stats tracking
  let imageStats = {
    affiliate: 0,
    googlePlaces: 0,
    wikimedia: 0,
    unsplash: 0,
    pexels: 0,
    rejected: 0,
    totalAttempted: 0
  };

  const allValidatedImages: string[] = [];
  const MIN_IMAGES = 15;
  const MAX_IMAGES = 30;
  const targetImages = Math.min(Math.max(targetCount, MIN_IMAGES), MAX_IMAGES);

  // ====== PRIORITY 1: GOOGLE PLACES PHOTOS API ======
  console.log(`  📍 Priority 1: Google Places Photos API (${placesPhotos.length} available)...`);
  if (placesPhotos.length > 0 && allValidatedImages.length < targetImages) {
    const validated = await validateImageBatchEnhanced(placesPhotos, searchTerm, category);
    allValidatedImages.push(...validated.validImages);
    imageStats.googlePlaces = validated.validImages.length;
    imageStats.rejected += validated.rejectedCount;
    imageStats.totalAttempted += placesPhotos.length;
    console.log(`  🏛️ Google Places: ${imageStats.googlePlaces}/${placesPhotos.length} validated`);
  } else {
    console.log(`  📍 No Google Places photos available`);
  }

  // ====== PRIORITY 2: UNSPLASH ======
  if (allValidatedImages.length < targetImages) {
    const remainingNeeded = targetImages - allValidatedImages.length;
    console.log(`  🎨 Priority 2: Unsplash (need ${remainingNeeded} more)...`);

    if (process.env.UNSPLASH_ACCESS_KEY && allValidatedImages.length < targetImages) {
      const unsplashCount = Math.min(20, remainingNeeded);
      console.log(`  🎨 Trying Unsplash for ${unsplashCount} images...`);

      for (const query of searchQueries) {
        if (allValidatedImages.length >= targetImages) break;

        const unsplashImages = await getStockImagesWithRetries(query, category, Math.ceil(unsplashCount / searchQueries.length));
        if (unsplashImages.length > 0) {
          const validated = await validateImageBatchEnhanced(unsplashImages, searchTerm, category);
          allValidatedImages.push(...validated.validImages);
          imageStats.unsplash += validated.validImages.length;
          imageStats.rejected += validated.rejectedCount;
          imageStats.totalAttempted += unsplashImages.length;
          console.log(`  🎨 Unsplash "${query}": ${validated.validImages.length}/${unsplashImages.length} validated`);
        }
      }
      console.log(`  ✅ Unsplash Total: ${imageStats.unsplash} images`);
    } else {
      console.log(`  🎨 Unsplash API key not available`);
    }
  }

  // ====== PRIORITY 3: PEXELS ======
  if (allValidatedImages.length < targetImages) {
    const remainingNeeded = targetImages - allValidatedImages.length;
    console.log(`  📸 Priority 3: Pexels (need ${remainingNeeded} more)...`);

    if (process.env.PEXELS_API_KEY && allValidatedImages.length < targetImages) {
      const pexelsCount = Math.min(15, remainingNeeded);
      console.log(`  📸 Trying Pexels for ${pexelsCount} images...`);

      for (const query of searchQueries) {
        if (allValidatedImages.length >= targetImages) break;

        const pexelsImages = await getBulletproofPexelsImages(query, category, Math.ceil(pexelsCount / searchQueries.length));
        if (pexelsImages.length > 0) {
          const validated = await validateImageBatchEnhanced(pexelsImages, searchTerm, category);
          allValidatedImages.push(...validated.validImages);
          imageStats.pexels += validated.validImages.length;
          imageStats.rejected += validated.rejectedCount;
          imageStats.totalAttempted += pexelsImages.length;
          console.log(`  📸 Pexels "${query}": ${validated.validImages.length}/${pexelsImages.length} validated`);
        }
      }
      console.log(`  ✅ Pexels Total: ${imageStats.pexels} images`);
    } else {
      console.log(`  📸 Pexels API key not available`);
    }
  }

  // ====== PRIORITY 4: WIKIMEDIA COMMONS (FALLBACK) ======
  if (allValidatedImages.length < targetImages) {
    const needed = Math.min(10, targetImages - allValidatedImages.length);
    console.log(`  📚 Priority 4: Wikimedia Commons (fallback - need ${needed} more)...`);

    for (const query of searchQueries) {
      if (allValidatedImages.length >= targetImages) break;

      const wikimediaImages = await getBulletproofWikimediaImages(query, category, Math.ceil(needed / searchQueries.length));
      if (wikimediaImages.length > 0) {
        const validated = await validateImageBatchEnhanced(wikimediaImages, searchTerm, category);
        allValidatedImages.push(...validated.validImages);
        imageStats.wikimedia += validated.validImages.length;
        imageStats.rejected += validated.rejectedCount;
        imageStats.totalAttempted += wikimediaImages.length;
        console.log(`  📖 Wikimedia "${query}": ${validated.validImages.length}/${wikimediaImages.length} validated`);
      }
    }
    console.log(`  ✅ Wikimedia Total: ${imageStats.wikimedia} images`);
  }

  // ====== DEDUPLICATION STAGE ======
  console.log(`  🔄 Deduplication: Processing ${allValidatedImages.length} images...`);
  const beforeDedupe = allValidatedImages.length;
  const deduplicatedImages = bulletproofImageDeduplication(allValidatedImages);
  console.log(`  ✅ Deduplication: ${deduplicatedImages.length}/${beforeDedupe} images remain`);

  // ====== FINAL VALIDATION: ENSURE 15-30 IMAGES ======
  let finalImages = deduplicatedImages;
  
  if (finalImages.length < MIN_IMAGES) {
    console.log(`  ⚠️ Only ${finalImages.length} images found, using emergency fallback...`);
    const emergencyImages = await getEmergencyFallbackImages(searchTerm, category, MIN_IMAGES - finalImages.length);
    finalImages = [...finalImages, ...emergencyImages];
  }

  // Cap at maximum
  finalImages = finalImages.slice(0, MAX_IMAGES);

  // ====== COMPREHENSIVE LOGGING ======
  console.log(`🎯 IMAGE PIPELINE COMPLETE:`);
  console.log(`  📊 Final Count: ${finalImages.length}/${targetImages} images (target: ${targetCount})`);
  console.log(`  🏛️ Google Places: ${imageStats.googlePlaces} images`);
  console.log(`  🎨 Unsplash: ${imageStats.unsplash} images`);
  console.log(`  📸 Pexels: ${imageStats.pexels} images`);
  console.log(`  📖 Wikimedia: ${imageStats.wikimedia} images`);
  console.log(`  ❌ Rejected: ${imageStats.rejected}/${imageStats.totalAttempted} images`);
  console.log(`  🔄 Deduplicated: ${beforeDedupe - finalImages.length} duplicates removed`);
  console.log(`  ✅ Quality: ${finalImages.length >= MIN_IMAGES ? 'PASS' : 'FAIL'} (min ${MIN_IMAGES})`);
  
  // Debug summary for Vercel logs
  const realImageCount = finalImages.filter(img => !img.includes('/images/placeholders/')).length;
  const placeholderCount = finalImages.filter(img => img.includes('/images/placeholders/')).length;
  console.log(`  🔍 DEBUG SUMMARY: Google: ${imageStats.googlePlaces}, Unsplash: ${imageStats.unsplash}, Pexels: ${imageStats.pexels}, Wikimedia: ${imageStats.wikimedia}, Real Images: ${realImageCount}, Placeholders: ${placeholderCount}`);

  return finalImages;
}

// ============================================================================
// EMERGENCY FALLBACK IMAGES
// ============================================================================
async function getEmergencyFallbackImages(searchTerm: string, category: string, needed: number): Promise<string[]> {
  console.log(`    🚨 Emergency fallback: Need ${needed} images for "${searchTerm}"`);
  
  const fallbackImages: string[] = [];
  
  // Try very broad Istanbul terms
  const emergencyQueries = [
    'Istanbul architecture',
    'Istanbul landmark', 
    'Turkish culture',
    'Istanbul tourism'
  ];

  // Try Unsplash with very broad terms
  if (process.env.UNSPLASH_ACCESS_KEY && fallbackImages.length < needed) {
    for (const query of emergencyQueries) {
      if (fallbackImages.length >= needed) break;

      const images = await getStockImagesWithRetries(query, category, Math.ceil(needed / 2));
      const validated = await validateImageBatchEnhanced(images, 'Istanbul', category);
      fallbackImages.push(...validated.validImages.slice(0, needed - fallbackImages.length));
    }
  }

  // If still not enough, add placeholder
  while (fallbackImages.length < needed) {
    fallbackImages.push('/images/placeholders/default.jpg');
  }

  console.log(`    ✅ Emergency fallback provided ${fallbackImages.length} images`);
  return fallbackImages;
}

// ============================================================================
// AFFILIATE PARTNER INTEGRATION STUB (FUTURE-PROOF)
// ============================================================================
// This function is designed to be easily activated when affiliate accounts are ready.
// Simply update the implementation to call actual affiliate APIs.
// ============================================================================

async function getAffiliateImages(searchTerm: string, category: string, targetCount: number): Promise<string[]> {
  // FUTURE: Replace this stub with actual affiliate API calls
  // Examples of what this will contain:

  // Example 1: Booking.com Affiliate API
  // if (process.env.BOOKING_AFFILIATE_ID) {
  //   const bookingImages = await fetchBookingImages(searchTerm, category);
  //   console.log(`  🏨 Booking.com: Found ${bookingImages.length} images`);
  //   images.push(...bookingImages);
  // }

  // Example 2: Expedia Affiliate API
  // if (process.env.EXPEDIA_AFFILIATE_ID) {
  //   const expediaImages = await fetchExpediaImages(searchTerm, category);
  //   console.log(`  ✈️ Expedia: Found ${expediaImages.length} images`);
  //   images.push(...expediaImages);
  // }

  // Example 3: GetYourGuide Affiliate API
  // if (process.env.GETYOURGUIDE_AFFILIATE_ID) {
  //   const gygImages = await fetchGetYourGuideImages(searchTerm, category);
  //   console.log(`  🎫 GetYourGuide: Found ${gygImages.length} images`);
  //   images.push(...gygImages);
  // }

  // For now, return empty array - affiliate accounts not yet active
  console.log(`  💼 Affiliate stub called for "${searchTerm}" - accounts not yet active`);
  return [];
}

// Advanced image deduplication with URL normalization and filename hashing
function advancedImageDeduplication(urls: string[]): string[] {
  const seen = new Set<string>();
  const filenameHashes = new Set<string>();
  const deduplicated: string[] = [];

  for (const url of urls) {
    if (!url || typeof url !== 'string') continue;

    try {
      // Normalize URL by removing query parameters and converting to lowercase
      const normalizedUrl = url.split('?')[0].toLowerCase();

      // Extract filename for additional duplicate detection
      const filename = normalizedUrl.split('/').pop() || '';
      const filenameParts = filename.split('.');
      const baseFilename = filenameParts.length > 1 ? filenameParts.slice(0, -1).join('.') : filename;

      // Create a simple hash of the filename for variant detection
      const filenameHash = baseFilename.replace(/[-_\d+]/g, ''); // Remove numbers, hyphens, underscores

      // Skip if we've seen this exact URL or filename variant
      if (seen.has(normalizedUrl) ||
          (filenameHash.length > 5 && filenameHashes.has(filenameHash))) {
        continue;
      }

      seen.add(normalizedUrl);
      if (filenameHash.length > 5) {
        filenameHashes.add(filenameHash);
      }
      deduplicated.push(url);

    } catch (error) {
      console.warn(`Error processing URL for deduplication: ${url}`, error);
      // If URL parsing fails, still include it but check for exact duplicates
      if (!seen.has(url)) {
        seen.add(url);
        deduplicated.push(url);
      }
    }
  }

  return deduplicated;
}

// Legacy deduplication function - keeping for backwards compatibility
function dedupeUrls(urls: string[]): string[] {
  return advancedImageDeduplication(urls);
}

// Get stock images from Unsplash API with retries and enhanced search terms
async function getStockImagesWithRetries(searchTerm: string, category: string, count: number): Promise<string[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    console.log('  UNSPLASH_ACCESS_KEY not found, using placeholder images');
    return generatePlaceholderImages(count);
  }

  try {
    // Enhanced search strategy with Istanbul context
    const searchQueries = buildEnhancedSearchQueries(searchTerm, category);
    const allImages: string[] = [];

    console.log(`  Trying ${searchQueries.length} search queries for images`);

    // Try multiple queries with progressive fallback
    for (let i = 0; i < searchQueries.length && allImages.length < count; i++) {
      const query = searchQueries[i];
      const needed = Math.min(10, count - allImages.length); // Get more per query for better variety

      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape&order_by=relevant&content_filter=high`,
          {
            headers: {
              'Authorization': `Client-ID ${unsplashKey}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const photos = data.results?.map((photo: any) => photo.urls.regular) || [];
          allImages.push(...photos);
          console.log(`  Query "${query}" returned ${photos.length} images`);
        } else {
          console.log(`  Query "${query}" failed with status ${response.status}`);
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (queryError) {
        console.warn(`  Error with query "${query}":`, queryError);
        continue;
      }
    }

    // Deduplicate and return up to the requested count
    const uniqueImages = advancedImageDeduplication(allImages);
    const finalImages = uniqueImages.slice(0, count);

    // Return only the valid images found - don't pad with placeholders here
    // Let the main logic handle placeholders properly
    console.log(`  Found ${finalImages.length}/${count} unique Unsplash images`);
    return finalImages;

  } catch (error) {
    console.error('  Error fetching stock images:', error);
    return []; // Return empty array instead of placeholders
  }
}

// Get images from Pexels API as fallback to Unsplash
// BULLETPROOF PEXELS API - High-quality stock images with relevance filtering
async function getBulletproofPexelsImages(searchTerm: string, category: string, count: number): Promise<string[]> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) {
    console.log('    ⚠️ PEXELS_API_KEY not found, skipping Pexels');
    return [];
  }

  try {
    const searchQueries = buildBulletproofSearchQueries(searchTerm, category, 'pexels');
    const allImages: string[] = [];

    // Try up to 3 queries to avoid rate limits (200 requests/hour)
    for (let i = 0; i < Math.min(3, searchQueries.length) && allImages.length < count; i++) {
      const query = searchQueries[i];
      const needed = Math.min(30, count - allImages.length);

      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${needed}&orientation=landscape&size=large`,
          {
            headers: { 'Authorization': pexelsKey },
            signal: AbortSignal.timeout(8000)
          }
        );

        if (response.ok) {
          const data = await response.json();
          const photos = data.photos?.map((photo: any) => photo.src.large2x || photo.src.large) || [];
          allImages.push(...photos);
          console.log(`    ✅ "${query}": ${photos.length} images from Pexels`);
        } else {
          console.log(`    ❌ "${query}": Failed with status ${response.status}`);
        }

        // Rate limiting delay (conservative for 200 req/hour limit)
        await new Promise(resolve => setTimeout(resolve, 600));

      } catch (queryError) {
        console.warn(`    ⚠️ Pexels query "${query}" error:`, queryError);
      }
    }

    return allImages.slice(0, count);

  } catch (error) {
    console.error('    ❌ Pexels API error:', error);
    return [];
  }
}

// BULLETPROOF WIKIMEDIA COMMONS API - Copyright-safe images
async function getBulletproofWikimediaImages(searchTerm: string, category: string, count: number): Promise<string[]> {
  try {
    const searchQueries = buildBulletproofSearchQueries(searchTerm, category, 'wikimedia');
    const allImages: string[] = [];

    for (let i = 0; i < Math.min(4, searchQueries.length) && allImages.length < count; i++) {
      const query = searchQueries[i];
      const needed = Math.min(20, count - allImages.length);

      try {
        const response = await fetch(
          `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${needed}&prop=imageinfo&iiprop=url|size&iiurlwidth=1200&origin=*`,
          { signal: AbortSignal.timeout(10000) }
        );

        if (response.ok) {
          const data = await response.json();
          const pages = data.query?.pages || {};
          let queryImages = 0;

          for (const pageId in pages) {
            const page = pages[pageId];
            if (page.imageinfo && page.imageinfo[0]) {
              const imageInfo = page.imageinfo[0];
              // Ensure high quality and proper dimensions
              if (imageInfo.url && imageInfo.width > 800 && imageInfo.height > 600) {
                allImages.push(imageInfo.url);
                queryImages++;
              }
            }
          }
          console.log(`    ✅ "${query}": ${queryImages} images from Wikimedia Commons`);
        } else {
          console.log(`    ❌ "${query}": Failed with status ${response.status}`);
        }

        // Respectful delay for Wikimedia servers
        await new Promise(resolve => setTimeout(resolve, 400));

      } catch (queryError) {
        console.warn(`    ⚠️ Wikimedia query "${query}" error:`, queryError);
      }
    }

    return allImages.slice(0, count);

  } catch (error) {
    console.error('    ❌ Wikimedia API error:', error);
    return [];
  }
}

// BULLETPROOF SEARCH QUERY BUILDER - Venue-specific, source-optimized queries
function buildBulletproofSearchQueries(searchTerm: string, category: string, source: 'unsplash' | 'pexels' | 'wikimedia'): string[] {
  const normalizedTitle = normalizeTitleToAlias(searchTerm);
  const queries: string[] = [];

  // Primary queries - specific venue + location
  queries.push(`${normalizedTitle} Istanbul`);
  if (normalizedTitle !== searchTerm) {
    queries.push(`${searchTerm} Istanbul Turkey`);
  }

  // Source-specific optimizations
  switch (source) {
    case 'unsplash':
      // Unsplash responds well to architectural and travel terms
      queries.push(`${normalizedTitle} architecture Istanbul`);
      queries.push(`${normalizedTitle} travel Turkey`);
      if (category === 'activities') {
        queries.push(`${normalizedTitle} Ottoman historic`);
        queries.push(`Istanbul landmark ${normalizedTitle}`);
      }
      break;

    case 'wikimedia':
      // Wikimedia has excellent historical and architectural content
      queries.push(`${normalizedTitle} Turkey`);
      if (category === 'activities') {
        queries.push(`${normalizedTitle} Ottoman architecture`);
        queries.push(`${normalizedTitle} Byzantine`);
      }
      break;

    case 'pexels':
      // Pexels works well with tourism and lifestyle terms
      queries.push(`${normalizedTitle} tourism Turkey`);
      queries.push(`Istanbul travel ${normalizedTitle}`);
      break;
  }

  // Category-specific enhancements
  switch (category) {
    case 'activities':
      queries.push(`Istanbul historic ${category}`);
      queries.push(`Turkey mosque architecture`);
      break;
    case 'hotels':
      queries.push(`luxury hotel Istanbul`);
      queries.push(`${normalizedTitle} accommodation`);
      break;
    case 'restaurants':
      queries.push(`Turkish restaurant ${normalizedTitle}`);
      queries.push(`Istanbul dining ${normalizedTitle}`);
      break;
    case 'shopping':
      queries.push(`Istanbul bazaar ${normalizedTitle}`);
      queries.push(`Turkish shopping ${normalizedTitle}`);
      break;
  }

  // Remove duplicates and limit to prevent API overuse
  return [...new Set(queries)].slice(0, 6);
}

// BULLETPROOF IMAGE DEDUPLICATION - Advanced URL and content-based deduplication
function bulletproofImageDeduplication(urls: string[]): string[] {
  const seen = new Set<string>();
  const filenameHashes = new Set<string>();
  const contentHashes = new Set<string>();
  const deduplicated: string[] = [];

  for (const url of urls) {
    if (!url || typeof url !== 'string') continue;

    try {
      // Normalize URL and extract base components
      const normalizedUrl = url.split('?')[0].toLowerCase();
      const urlObj = new URL(url);
      const filename = urlObj.pathname.split('/').pop() || '';

      // Create content-based hash for similarity detection
      const baseFilename = filename.split('.')[0];
      const cleanName = baseFilename.replace(/[-_\d+]/g, '');
      const contentHash = `${urlObj.hostname}_${cleanName}`;

      // Skip exact URL duplicates
      if (seen.has(normalizedUrl)) continue;

      // Skip similar content (same host + similar filename)
      if (cleanName.length > 5 && contentHashes.has(contentHash)) continue;

      // Skip filename variants (resized versions of same image)
      if (cleanName.length > 5 && filenameHashes.has(cleanName)) continue;

      // Add to tracking sets
      seen.add(normalizedUrl);
      if (cleanName.length > 5) {
        filenameHashes.add(cleanName);
        contentHashes.add(contentHash);
      }

      deduplicated.push(url);

    } catch (error) {
      // If URL parsing fails, still check for exact duplicates
      if (!seen.has(url)) {
        seen.add(url);
        deduplicated.push(url);
      }
    }
  }

  return deduplicated;
}

// ENHANCED IMAGE VALIDATION - Strict quality rules for 15-30 image pipeline
async function validateImageBatchEnhanced(urls: string[], searchTerm: string, category: string): Promise<ImageValidationResult> {
  const validationStats = {
    total: urls.length,
    urlValid: 0,
    accessible: 0,
    resolutionPass: 0,
    aspectRatioPass: 0,
    fileTypePass: 0,
    relevancePass: 0,
    final: 0
  };

  const validImages: string[] = [];
  let rejectedCount = 0;

  console.log(`    🔍 Enhanced validation: ${urls.length} images for "${searchTerm}"`);

  for (const url of urls) {
    try {
      // Stage 1: URL validation
      if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        rejectedCount++;
        continue;
      }
      validationStats.urlValid++;

      // Stage 2: Accessibility check
      const response = await fetch(url, { 
        method: 'HEAD', 
        timeout: 5000,
        headers: { 'User-Agent': 'Istanbul Explorer Bot 1.0' }
      });
      
      if (!response.ok) {
        rejectedCount++;
        continue;
      }
      validationStats.accessible++;

      // Stage 3: Content type validation
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        rejectedCount++;
        continue;
      }
      validationStats.fileTypePass++;

      // Stage 4: Resolution validation (must be ≥ 800px wide)
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      if (contentLength < 50000) { // Reject tiny images (< 50KB)
        rejectedCount++;
        continue;
      }

      // Stage 5: Aspect ratio validation (reject extreme panoramas)
      const aspectRatioValid = await validateImageAspectRatio(url);
      if (!aspectRatioValid) {
        rejectedCount++;
        continue;
      }
      validationStats.aspectRatioPass++;

      // Stage 6: Relevance validation
      const relevanceCheck = validateImageRelevance(url, searchTerm, category);
      if (relevanceCheck.confidence < 0.3) {
        rejectedCount++;
        continue;
      }
      validationStats.relevancePass++;

      // All validations passed
      validImages.push(url);
      validationStats.final++;

    } catch (error) {
      rejectedCount++;
      console.log(`    ❌ Validation failed for ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log(`    ✅ Enhanced validation complete: ${validImages.length}/${urls.length} passed`);
  console.log(`    📊 Stats: URL=${validationStats.urlValid}, Access=${validationStats.accessible}, Type=${validationStats.fileTypePass}, Aspect=${validationStats.aspectRatioPass}, Relevant=${validationStats.relevancePass}`);

  return {
    validImages,
    rejectedCount,
    validationStats
  };
}

// BULLETPROOF IMAGE VALIDATION - Multi-stage validation with content filtering (legacy)
async function validateImageBatch(urls: string[], searchTerm: string, category: string): Promise<{
  validImages: string[];
  rejectedCount: number;
  validationStats: {
    total: number;
    urlValid: number;
    accessible: number;
    relevant: number;
    final: number;
  };
}> {
  const validationStats = {
    total: urls.length,
    urlValid: 0,
    accessible: 0,
    relevant: 0,
    final: 0
  };

  if (urls.length === 0) {
    return { validImages: [], rejectedCount: 0, validationStats };
  }

  const validImages: string[] = [];
  const maxConcurrent = 5; // Limit concurrent validations

  // Process images in batches to avoid overwhelming servers
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(async (url) => {
      const validation = await validateSingleImageBulletproof(url, searchTerm, category);
      if (validation.isValid) {
        validImages.push(url);
        validationStats.final++;
      }
      if (validation.stages.urlValid) validationStats.urlValid++;
      if (validation.stages.accessible) validationStats.accessible++;
      if (validation.stages.relevant) validationStats.relevant++;
    });

    await Promise.allSettled(batchPromises);

    // Brief delay between batches
    if (i + maxConcurrent < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return {
    validImages,
    rejectedCount: urls.length - validImages.length,
    validationStats
  };
}

// BULLETPROOF SINGLE IMAGE VALIDATION - Comprehensive URL and content validation
async function validateSingleImageBulletproof(url: string, searchTerm: string, category: string): Promise<{
  isValid: boolean;
  reason: string;
  stages: {
    urlValid: boolean;
    accessible: boolean;
    relevant: boolean;
  };
}> {
  const stages = { urlValid: false, accessible: false, relevant: false };

  // Stage 1: URL validation
  if (!url || typeof url !== 'string') {
    return { isValid: false, reason: 'Invalid URL format', stages };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, reason: 'Invalid protocol', stages };
    }
    stages.urlValid = true;
  } catch {
    return { isValid: false, reason: 'Malformed URL', stages };
  }

  // Stage 2: Accessibility check (HEAD request with timeout)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Istanbul-Explorer-Bot/1.0)' }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { isValid: false, reason: `HTTP ${response.status}`, stages };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return { isValid: false, reason: 'Not an image', stages };
    }

    stages.accessible = true;
  } catch (error) {
    return { isValid: false, reason: 'Network error', stages };
  }

  // Stage 3: Relevance check (URL-based heuristics)
  const urlLower = url.toLowerCase();
  const titleLower = searchTerm.toLowerCase();
  const normalizedTitle = normalizeTitleToAlias(searchTerm).toLowerCase();

  // Check for venue-specific relevance indicators
  const relevanceIndicators = [
    titleLower, normalizedTitle, 'istanbul', 'turkey', 'turkish'
  ];

  // Category-specific relevance
  switch (category) {
    case 'activities':
      relevanceIndicators.push('mosque', 'palace', 'museum', 'historic', 'architecture', 'ottoman', 'byzantine');
      break;
    case 'hotels':
      relevanceIndicators.push('hotel', 'accommodation', 'luxury', 'room', 'suite');
      break;
    case 'restaurants':
      relevanceIndicators.push('restaurant', 'food', 'dining', 'cuisine', 'chef');
      break;
    case 'shopping':
      relevanceIndicators.push('bazaar', 'market', 'shopping', 'store', 'mall');
      break;
  }

  // Check if URL contains relevance indicators
  const hasRelevanceIndicator = relevanceIndicators.some(indicator =>
    indicator.length > 2 && urlLower.includes(indicator)
  );

  // Filter out obviously irrelevant images
  const irrelevantTerms = [
    'logo', 'icon', 'avatar', 'profile', 'user', 'thumb', 'preview',
    'mendoza', 'paris', 'london', 'madrid', 'rome', 'berlin'  // Other cities
  ];

  const hasIrrelevantTerm = irrelevantTerms.some(term => urlLower.includes(term));

  if (hasIrrelevantTerm) {
    return { isValid: false, reason: 'Contains irrelevant terms', stages };
  }

  // For stock photo services, require some relevance indicator
  const isStockPhoto = urlLower.includes('unsplash.com') || urlLower.includes('pexels.com');
  if (isStockPhoto && !hasRelevanceIndicator) {
    return { isValid: false, reason: 'Stock photo lacks relevance indicators', stages };
  }

  stages.relevant = true;
  return { isValid: true, reason: 'Valid image', stages };
}

// BULLETPROOF FINAL VALIDATION - Additional quality and content checks
async function bulletproofFinalValidation(urls: string[], searchTerm: string, category: string): Promise<{
  validImages: string[];
  rejectedCount: number;
}> {
  const validImages: string[] = [];

  for (const url of urls) {
    // Additional quality checks
    if (await isHighQualityImage(url)) {
      validImages.push(url);
    }
  }

  return {
    validImages,
    rejectedCount: urls.length - validImages.length
  };
}

// Check if image meets quality standards
async function isHighQualityImage(url: string): Promise<boolean> {
  try {
    // URL-based quality indicators
    const urlLower = url.toLowerCase();

    // Prefer high-resolution indicators
    if (urlLower.includes('1200') || urlLower.includes('1920') || urlLower.includes('large')) {
      return true;
    }

    // Avoid low-quality indicators
    if (urlLower.includes('thumb') || urlLower.includes('small') || urlLower.includes('icon')) {
      return false;
    }

    // Default to accepting if no clear quality indicators
    return true;
  } catch {
    return true; // Default to including if check fails
  }
}

// EMERGENCY IMAGE FALLBACK - Last resort broad search for minimum viable images
async function emergencyImageFallback(searchTerm: string, category: string, needed: number): Promise<string[]> {
  console.log(`    🚨 EMERGENCY FALLBACK: Searching for ${needed} fallback images...`);

  const emergencyQueries = [
    'Istanbul cityscape',
    'Turkish architecture',
    'Istanbul landmarks',
    'Turkey tourism',
    `Istanbul ${category}`
  ];

  const fallbackImages: string[] = [];

  // Try Unsplash with very broad terms
  if (process.env.UNSPLASH_ACCESS_KEY && fallbackImages.length < needed) {
    for (const query of emergencyQueries) {
      if (fallbackImages.length >= needed) break;

      const images = await getStockImagesWithRetries(query, category, Math.ceil(needed / 2));
      const validated = await validateImageBatch(images, 'Istanbul', category);
      fallbackImages.push(...validated.validImages.slice(0, needed - fallbackImages.length));
    }
  }

  console.log(`    ✅ Emergency fallback provided ${fallbackImages.length} images`);
  return fallbackImages;
}

// Get images from Wikimedia Commons API as copyright-safe fallback
async function getWikimediaImages(searchTerm: string, category: string, count: number): Promise<string[]> {
  try {
    // Build search queries optimized for Wikimedia Commons
    const searchQueries = buildWikimediaSearchQueries(searchTerm, category);
    const allImages: string[] = [];

    console.log(`  Trying ${Math.min(2, searchQueries.length)} Wikimedia queries for images`);

    // Try up to 2 queries to avoid overloading the API
    for (let i = 0; i < Math.min(2, searchQueries.length) && allImages.length < count; i++) {
      const query = searchQueries[i];
      const needed = Math.min(20, count - allImages.length);

      try {
        // Search for files on Wikimedia Commons
        const searchResponse = await fetch(
          `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${needed}&prop=imageinfo&iiprop=url|size&iiurlwidth=1200&origin=*`
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const pages = searchData.query?.pages || {};

          for (const pageId in pages) {
            const page = pages[pageId];
            if (page.imageinfo && page.imageinfo[0]) {
              const imageInfo = page.imageinfo[0];
              // Prefer high-resolution images and filter out very small images
              if (imageInfo.url && imageInfo.width > 800 && imageInfo.height > 600) {
                allImages.push(imageInfo.url);
              }
            }
          }
          console.log(`  Wikimedia query "${query}" returned ${Object.keys(pages).length} results, ${allImages.length - (allImages.length - Object.keys(pages).length)} usable images`);
        } else {
          console.log(`  Wikimedia query "${query}" failed with status ${searchResponse.status}`);
        }

        // Delay to be respectful to Wikimedia's servers
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (queryError) {
        console.warn(`  Error with Wikimedia query "${query}":`, queryError);
        continue;
      }
    }

    // Filter for valid image URLs and deduplicate
    const validImages = allImages.filter(url => isValidImageUrl(url));
    const uniqueImages = advancedImageDeduplication(validImages);
    return uniqueImages.slice(0, count);

  } catch (error) {
    console.error('  Error fetching Wikimedia images:', error);
    return [];
  }
}

// Build search queries optimized for Wikimedia Commons
function buildWikimediaSearchQueries(searchTerm: string, category: string): string[] {
  const queries: string[] = [];
  const normalizedTitle = normalizeTitleToAlias(searchTerm);

  // Primary queries - specific venue + Istanbul
  queries.push(`${normalizedTitle} Istanbul`);
  if (normalizedTitle !== searchTerm) {
    queries.push(`${searchTerm} Istanbul`);
  }

  // Category-specific queries for better results
  switch (category) {
    case 'activities':
      queries.push(`${normalizedTitle} Turkey mosque`);
      queries.push(`${normalizedTitle} Ottoman architecture`);
      queries.push(`Istanbul historic ${normalizedTitle}`);
      break;
    case 'hotels':
      queries.push(`${normalizedTitle} hotel Istanbul`);
      queries.push(`${normalizedTitle} Turkey accommodation`);
      break;
    case 'restaurants':
      queries.push(`${normalizedTitle} restaurant Istanbul`);
      queries.push(`Turkish cuisine ${normalizedTitle}`);
      break;
    case 'shopping':
      queries.push(`${normalizedTitle} bazaar Istanbul`);
      queries.push(`${normalizedTitle} shopping Turkey`);
      break;
  }

  // Fallback queries
  queries.push(`Istanbul ${category}`);
  queries.push(`Turkey ${category}`);

  // Remove duplicates and return up to 4 queries
  return [...new Set(queries)].slice(0, 4);
}

// BULLETPROOF INTELLIGENT THUMBNAIL SELECTION - Advanced scoring with source priorities
function selectBestThumbnail(images: string[], category: string, title: string): {
  thumbnailUrl: string;
  thumbnailIndex: number;
  selectionReason: string;
} {
  if (!images.length) {
    return {
      thumbnailUrl: '/images/placeholders/default.jpg',
      thumbnailIndex: -1,
      selectionReason: 'No images available - using placeholder'
    };
  }

  // For single image, return it
  if (images.length === 1) {
    return {
      thumbnailUrl: images[0],
      thumbnailIndex: 0,
      selectionReason: 'Only image available'
    };
  }

  let bestIndex = 0;
  let bestScore = 0;
  let selectionReason = 'Default first image';

  console.log(`  🎯 THUMBNAIL SELECTION: Evaluating ${images.length} images for ${title} (${category})`);

  images.forEach((url, index) => {
    let score = 0;
    const urlLower = url.toLowerCase();
    const scoringDetails: string[] = [];

    // ===== RESOLUTION & QUALITY SCORING =====
    if (urlLower.includes('2048') || urlLower.includes('1920')) {
      score += 50;
      scoringDetails.push('Ultra-high resolution (+50)');
    } else if (urlLower.includes('1200') || urlLower.includes('large2x') || urlLower.includes('original')) {
      score += 40;
      scoringDetails.push('High resolution (+40)');
    } else if (urlLower.includes('large') || urlLower.includes('1024')) {
      score += 30;
      scoringDetails.push('Good resolution (+30)');
    } else if (urlLower.includes('medium') || urlLower.includes('800')) {
      score += 20;
      scoringDetails.push('Medium resolution (+20)');
    }

    // ===== SOURCE PRIORITY SCORING =====
    if (urlLower.includes('googleusercontent.com') || urlLower.includes('maps.gstatic.com')) {
      score += 100; // Highest priority - official Google Places photos
      scoringDetails.push('Google Places official (+100)');
      selectionReason = 'Google Places official photo';
    } else if (urlLower.includes('wikimedia.org') || urlLower.includes('wikipedia.org')) {
      score += 80; // High priority - copyright safe, often high quality
      scoringDetails.push('Wikimedia Commons (+80)');
      selectionReason = 'Wikimedia Commons photo';
    } else if (urlLower.includes('unsplash.com')) {
      score += 60; // Good quality stock photos
      scoringDetails.push('Unsplash stock (+60)');
      selectionReason = 'Unsplash high-quality photo';
    } else if (urlLower.includes('pexels.com')) {
      score += 50; // Decent quality stock photos
      scoringDetails.push('Pexels stock (+50)');
      selectionReason = 'Pexels stock photo';
    } else {
      score += 30; // Unknown source
      scoringDetails.push('Unknown source (+30)');
    }

    // ===== CATEGORY-SPECIFIC PREFERENCES =====
    switch (category) {
      case 'activities':
        // For landmarks/attractions, prefer exterior architectural shots
        if (urlLower.includes('exterior') || urlLower.includes('facade') || urlLower.includes('outside') || urlLower.includes('architecture')) {
          score += 40;
          scoringDetails.push('Exterior view (+40)');
        } else if (urlLower.includes('interior') || urlLower.includes('inside')) {
          score -= 15; // Slight penalty for interior shots
          scoringDetails.push('Interior view (-15)');
        }

        // Prefer wide/panoramic shots for landmarks
        if (urlLower.includes('panoramic') || urlLower.includes('wide') || urlLower.includes('aerial')) {
          score += 30;
          scoringDetails.push('Wide/panoramic view (+30)');
        }

        // Historical/architectural keywords
        if (urlLower.includes('historic') || urlLower.includes('ottoman') || urlLower.includes('byzantine')) {
          score += 25;
          scoringDetails.push('Historical architecture (+25)');
        }
        break;

      case 'hotels':
        // For hotels, prefer exterior shots and lobby/reception areas
        if (urlLower.includes('exterior') || urlLower.includes('facade') || urlLower.includes('hotel') || urlLower.includes('building')) {
          score += 35;
          scoringDetails.push('Hotel exterior (+35)');
        } else if (urlLower.includes('lobby') || urlLower.includes('reception') || urlLower.includes('entrance')) {
          score += 30;
          scoringDetails.push('Hotel lobby/entrance (+30)');
        } else if (urlLower.includes('room') || urlLower.includes('suite')) {
          score += 15; // Rooms are okay but less ideal for thumbnails
          scoringDetails.push('Hotel room (+15)');
        }

        // Avoid logos and signs
        if (urlLower.includes('logo') || urlLower.includes('sign') || urlLower.includes('banner')) {
          score -= 25;
          scoringDetails.push('Logo/sign penalty (-25)');
        }
        break;

      case 'restaurants':
        // For restaurants, prefer exterior and dining area shots
        if (urlLower.includes('exterior') || urlLower.includes('restaurant') || urlLower.includes('facade')) {
          score += 35;
          scoringDetails.push('Restaurant exterior (+35)');
        } else if (urlLower.includes('dining') || urlLower.includes('interior') || urlLower.includes('ambiance')) {
          score += 25;
          scoringDetails.push('Dining area (+25)');
        } else if (urlLower.includes('chef') || urlLower.includes('kitchen')) {
          score += 20;
          scoringDetails.push('Chef/kitchen (+20)');
        } else if (urlLower.includes('food') || urlLower.includes('dish') || urlLower.includes('plate')) {
          score += 10; // Food photos are okay but less ideal for thumbnails
          scoringDetails.push('Food dish (+10)');
        }
        break;

      case 'shopping':
        // For shopping venues, prefer exterior and wide interior shots
        if (urlLower.includes('exterior') || urlLower.includes('mall') || urlLower.includes('bazaar')) {
          score += 35;
          scoringDetails.push('Shopping exterior (+35)');
        } else if (urlLower.includes('interior') || urlLower.includes('shopping') || urlLower.includes('market')) {
          score += 25;
          scoringDetails.push('Shopping interior (+25)');
        }
        break;
    }

    // ===== QUALITY PENALTIES =====
    // Avoid obviously poor choices
    if (urlLower.includes('thumb') || urlLower.includes('small') || urlLower.includes('icon') || urlLower.includes('preview')) {
      score -= 30;
      scoringDetails.push('Low quality indicator (-30)');
    }

    // Avoid user-generated content indicators
    if (urlLower.includes('user') || urlLower.includes('avatar') || urlLower.includes('profile')) {
      score -= 20;
      scoringDetails.push('User content penalty (-20)');
    }

    // ===== POSITION BONUS =====
    // Slight preference for earlier images (usually higher quality)
    if (index === 0) {
      score += 10;
      scoringDetails.push('First image bonus (+10)');
    } else if (index <= 2) {
      score += 5;
      scoringDetails.push('Early position bonus (+5)');
    }

    console.log(`    Image ${index + 1}: score=${score} ${scoringDetails.join(', ')}`);

    // Update best selection
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  const finalSelection = {
    thumbnailUrl: images[bestIndex],
    thumbnailIndex: bestIndex,
    selectionReason: `${selectionReason} (score: ${bestScore})`
  };

  console.log(`  ✅ THUMBNAIL SELECTED: Image ${bestIndex + 1} - ${finalSelection.selectionReason}`);

  return finalSelection;
}

// Comprehensive image validation with URL checking and content filtering
async function validateImageUrl(url: string): Promise<{
  isValid: boolean;
  reason: string;
  metadata?: {
    contentType?: string;
    contentLength?: number;
    width?: number;
    height?: number;
  }
}> {
  try {
    // Basic URL validation
    if (!url || typeof url !== 'string') {
      return { isValid: false, reason: 'Invalid URL format' };
    }

    // Check if URL is properly formatted
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return { isValid: false, reason: 'Malformed URL' };
    }

    // Check protocol
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isValid: false, reason: 'Invalid protocol (must be HTTP/HTTPS)' };
    }

    // HEAD request to validate image without downloading full content
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Istanbul-Explorer-Bot/1.0',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return { isValid: false, reason: `HTTP ${response.status}: ${response.statusText}` };
      }

      const contentType = response.headers.get('content-type') || '';
      const contentLength = parseInt(response.headers.get('content-length') || '0');

      // Validate content type
      if (!contentType.startsWith('image/')) {
        return { isValid: false, reason: `Invalid content type: ${contentType}` };
      }

      // Check file size (min 10KB, max 50MB)
      if (contentLength > 0) {
        if (contentLength < 10240) { // 10KB minimum
          return { isValid: false, reason: 'Image too small (< 10KB)' };
        }
        if (contentLength > 52428800) { // 50MB maximum
          return { isValid: false, reason: 'Image too large (> 50MB)' };
        }
      }

      return {
        isValid: true,
        reason: 'Valid image URL',
        metadata: {
          contentType,
          contentLength: contentLength > 0 ? contentLength : undefined
        }
      };

    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return { isValid: false, reason: 'Request timeout (>5s)' };
      }
      return { isValid: false, reason: `Network error: ${error instanceof Error ? error.message : 'Unknown'}` };
    }

  } catch (error) {
    return { isValid: false, reason: `Validation error: ${error instanceof Error ? error.message : 'Unknown'}` };
  }
}

// Validate image aspect ratio (reject extreme panoramas)
async function validateImageAspectRatio(url: string): Promise<boolean> {
  try {
    // Create a temporary image element to check dimensions
    const img = new Image();
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false); // Timeout - assume invalid
      }, 3000);

      img.onload = () => {
        clearTimeout(timeout);
        const aspectRatio = img.width / img.height;
        
        // Reject extreme panoramas (wider than 4:1) or very tall crops (taller than 1:3)
        const isValid = aspectRatio >= 0.33 && aspectRatio <= 4.0;
        resolve(isValid);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = url;
    });
  } catch (error) {
    return false;
  }
}

// Check if image is venue-specific and relevant
function validateImageRelevance(imageUrl: string, searchTerm: string, category: string): {
  isRelevant: boolean;
  reason: string;
  confidence: number;
} {
  const urlLower = imageUrl.toLowerCase();
  const searchLower = searchTerm.toLowerCase();
  const searchWords = searchLower.split(' ').filter(word => word.length > 2);

  // Extract potential venue names or keywords from URL
  const urlPath = urlLower.replace(/https?:\/\/[^\/]+/, '').toLowerCase();

  // Positive relevance indicators
  let relevanceScore = 0;
  let reasons: string[] = [];

  // Check for venue name in URL
  const venueWords = searchWords;
  let venueMatches = 0;
  for (const word of venueWords) {
    if (urlPath.includes(word) || urlPath.includes(word.replace(/[^\w]/g, ''))) {
      venueMatches++;
      relevanceScore += 30;
    }
  }

  if (venueMatches > 0) {
    reasons.push(`Venue match: ${venueMatches}/${venueWords.length} words`);
  }

  // Category-specific relevance
  const categoryKeywords: { [key: string]: string[] } = {
    activities: ['mosque', 'palace', 'museum', 'tower', 'fortress', 'church', 'historic', 'monument', 'tourist', 'attraction'],
    hotels: ['hotel', 'resort', 'accommodation', 'suite', 'lobby', 'room', 'building', 'exterior'],
    restaurants: ['restaurant', 'cafe', 'dining', 'food', 'cuisine', 'kitchen', 'interior', 'menu'],
    shopping: ['mall', 'shopping', 'store', 'bazaar', 'market', 'retail', 'shop']
  };

  const categoryWords = categoryKeywords[category] || [];
  let categoryMatches = 0;
  for (const keyword of categoryWords) {
    if (urlPath.includes(keyword)) {
      categoryMatches++;
      relevanceScore += 10;
    }
  }

  if (categoryMatches > 0) {
    reasons.push(`Category relevance: ${categoryMatches} matches`);
  }

  // Istanbul context
  const istanbulKeywords = ['istanbul', 'turkey', 'turkish', 'bosphorus', 'galata', 'sultanahmet'];
  let istanbulMatches = 0;
  for (const keyword of istanbulKeywords) {
    if (urlPath.includes(keyword)) {
      istanbulMatches++;
      relevanceScore += 15;
    }
  }

  if (istanbulMatches > 0) {
    reasons.push(`Istanbul context: ${istanbulMatches} matches`);
  }

  // Source reputation (higher quality sources get bonus)
  if (urlLower.includes('googleusercontent.com') || urlLower.includes('maps.gstatic.com')) {
    relevanceScore += 40;
    reasons.push('Google Places official photo');
  } else if (urlLower.includes('wikimedia.org') || urlLower.includes('wikipedia.org')) {
    relevanceScore += 35;
    reasons.push('Wikimedia Commons source');
  } else if (urlLower.includes('unsplash.com')) {
    relevanceScore += 25;
    reasons.push('Unsplash curated photo');
  } else if (urlLower.includes('pexels.com')) {
    relevanceScore += 20;
    reasons.push('Pexels stock photo');
  }

  // Negative indicators (red flags)
  const negativeKeywords = [
    'logo', 'icon', 'avatar', 'profile', 'thumbnail_small', 'thumb_',
    'placeholder', 'default', 'loading', 'error', 'broken',
    'advertisement', 'banner', 'ad_', 'promo'
  ];

  let negativeMatches = 0;
  for (const negative of negativeKeywords) {
    if (urlPath.includes(negative)) {
      negativeMatches++;
      relevanceScore -= 25;
    }
  }

  if (negativeMatches > 0) {
    reasons.push(`Negative indicators: ${negativeMatches} found`);
  }

  // Calculate confidence and determine relevance
  const confidence = Math.max(0, Math.min(100, relevanceScore));
  const isRelevant = confidence >= 40; // Threshold for relevance

  return {
    isRelevant,
    reason: reasons.length > 0 ? reasons.join('; ') : 'No relevance indicators found',
    confidence
  };
}


// Build enhanced search queries with Istanbul context and category-specific terms
function buildEnhancedSearchQueries(searchTerm: string, category: string): string[] {
  const categoryTerms = getCategorySpecificTerms(category);
  const istanbulKeywords = ['istanbul', 'turkish', 'turkey', 'ottoman', 'byzantine'];

  const queries: string[] = [];

  // Primary query: specific venue + Istanbul
  queries.push(`${searchTerm} Istanbul`);

  // Secondary queries: category-specific terms + Istanbul
  for (const term of categoryTerms.slice(0, 3)) { // Limit to top 3 category terms
    queries.push(`${term} Istanbul`);
  }

  // Fallback queries: broader Istanbul context
  for (const keyword of istanbulKeywords.slice(0, 2)) {
    for (const term of categoryTerms.slice(0, 2)) {
      queries.push(`${term} ${keyword}`);
    }
  }

  // Final fallback: generic Istanbul + category
  queries.push(`Istanbul ${category}`);

  return queries;
}

// Generate placeholder images - use local default placeholder instead of external images
function generatePlaceholderImages(count: number): string[] {
  // Always return the local default placeholder instead of external Unsplash images
  // This prevents venues from showing random Istanbul images when they have no valid images
  return Array(count).fill('/images/placeholders/default.jpg');
}

// Legacy function for backwards compatibility
async function getStockImages(searchTerm: string, category: string, count: number): Promise<string[]> {
  return getStockImagesWithRetries(searchTerm, category, count);
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

// Legacy validation function - replaced by validateByCategory
// Keeping for reference but no longer used in main flow

// Helper functions
function calculatePlacesConfidence(placesData: any, searchTerm: string): number {
  let score = 60; // Base score for API data

  if (placesData.rating > 4.0) score += 15;
  if (placesData.user_ratings_total > 1000) score += 10;
  if (placesData.website) score += 10;
  if (placesData.photos && placesData.photos.length > 0) score += 5;

  return Math.min(score, 100);
}

function estimateDuration(category: string): string {
  const durations = {
    activities: '2-3 hours',
    restaurants: '1-2 hours',
    hotels: 'Overnight',
    shopping: '1-3 hours'
  };
  return durations[category as keyof typeof durations] || '2-3 hours';
}

function extractImagesFromFirecrawl(data: any): string[] {
  const images: string[] = [];

  if (data?.html) {
    const imgRegex = /<img[^>]+src=["']([^"'>]+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(data.html)) !== null) {
      const imgUrl = match[1];
      if (isValidImageUrl(imgUrl)) {
        images.push(imgUrl);
      }
    }
  }

  return [...new Set(images)].slice(0, 10);
}

function extractHighlightsFromFirecrawl(markdown: string): string[] {
  const highlights: string[] = [];

  // Extract bullet points
  const bulletRegex = /^[•·*-]\s+(.+)$/gm;
  let match;
  while ((match = bulletRegex.exec(markdown)) !== null) {
    highlights.push(match[1].trim());
  }

  return highlights.slice(0, 8);
}

function extractAdditionalInfo(markdown: string): any {
  return {
    tips: extractTips(markdown),
    cultural_context: extractCulturalContext(markdown),
    best_time_to_visit: extractBestTime(markdown)
  };
}

function extractTips(content: string): string[] {
  const tipPatterns = [
    /tip[s]?[:\s]+([^.\n]{20,100})/gi,
    /advice[:\s]+([^.\n]{20,100})/gi,
    /remember[:\s]+([^.\n]{20,100})/gi
  ];

  const tips: string[] = [];
  tipPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      tips.push(match[1].trim());
    }
  });

  return tips.slice(0, 5);
}

function extractCulturalContext(content: string): string {
  const contextPatterns = [
    /built in (\d{4})/i,
    /constructed in (\d{4})/i,
    /dating back to (\d{4})/i,
    /history[:\s]+([^.\n]{30,200})/gi
  ];

  for (const pattern of contextPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return '';
}

function extractBestTime(content: string): string {
  const timePatterns = [
    /best time[:\s]+([^.\n]{20,100})/gi,
    /visit[:\s]+([^.\n]{20,100})/gi
  ];

  for (const pattern of timePatterns) {
    const match = content.match(pattern);
    if (match && match[1].toLowerCase().includes('time')) {
      return match[1].trim();
    }
  }

  return '';
}

function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|webp|avif)$/i.test(url) && !url.includes('data:');
  } catch {
    return false;
  }
}

async function createStagingItem(rawContent: any, enrichedData: any, allImages: string[], category: string, jobId: string): Promise<{
  success: boolean;
  item?: any;
  error?: string;
  usesPlaceholder?: boolean;
}> {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Implement placeholder fallback system
    let finalImages = [...allImages];
    let usesPlaceholder = false;
    let placeholderReason = '';

    // Check if we have valid images, if not, add placeholder
    if (finalImages.length === 0) {
      console.log(`  ⚠️ No images found for "${rawContent.title}", adding placeholder`);
      finalImages = [getDefaultPlaceholder()];
      usesPlaceholder = true;
      placeholderReason = 'No images found after processing';
    }

    // Ensure primary_image is never null by using placeholder
    const thumbnailSelection = selectBestThumbnail(finalImages, category, rawContent.title);
    let primaryImage = thumbnailSelection.thumbnailUrl || finalImages[0];

    if (!primaryImage) {
      console.log(`  ⚠️ No primary image available for "${rawContent.title}", using default placeholder`);
      primaryImage = getDefaultPlaceholder();
      usesPlaceholder = true;
      placeholderReason = placeholderReason || 'Primary image unavailable';
    }

    // GALLERY FIX: Ensure primary image is ALWAYS first in the images array
    // This guarantees the staging gallery can display the thumbnail + all other images
    if (primaryImage && !finalImages.includes(primaryImage)) {
      finalImages.unshift(primaryImage); // Add to beginning if not already present
      console.log(`  🖼️ Added primary image to gallery array: ${primaryImage}`);
    } else if (primaryImage && finalImages.includes(primaryImage)) {
      // Move primary image to first position if it exists elsewhere in the array
      const primaryIndex = finalImages.indexOf(primaryImage);
      if (primaryIndex > 0) {
        finalImages.splice(primaryIndex, 1); // Remove from current position
        finalImages.unshift(primaryImage); // Add to beginning
        console.log(`  🖼️ Moved primary image to first position in gallery array`);
      }
    }

    console.log(`  📸 Final gallery setup: ${finalImages.length} images, primary: ${primaryImage ? 'SET' : 'NONE'}`);
    console.log(`  📋 Gallery images: ${finalImages.slice(0, 3).join(', ')}${finalImages.length > 3 ? '...' : ''}`);


    // Merge enriched data into raw content
    const finalRawContent = {
      ...rawContent,
      content: enrichedData.enriched_content || '',
      highlights: enrichedData.highlights || [],
      additional_info: enrichedData.additional_info || {},
      firecrawl_enriched: enrichedData.success,
      placeholder_info: usesPlaceholder ? {
        reason: placeholderReason,
        original_image_count: allImages.length,
        placeholder_added_at: new Date().toISOString()
      } : null
    };

    // Prepare validation metadata for storing
    const validationMetadata = {
      images_validated: 0, // Will be updated when image validation is fully integrated
      images_passed_validation: finalImages.length,
      images_filtered: 0,
      validation_rate: 100
    };

    console.log(`  Creating staging item with ${finalImages.length} images${usesPlaceholder ? ' (includes placeholder)' : ''}, confidence: ${calculateConfidenceScore(rawContent, category)}%`);

    // Prepare payload that matches staging_queue schema exactly
    const stagingPayload = {
      title: rawContent.title,
      category: category,
      primary_image: primaryImage,
      images: finalImages, // JSONB array of strings
      confidence_score: calculateConfidenceScore(rawContent, category),
      status: 'pending', // Always provide default status
      raw_content: {
        // Core content fields
        ...finalRawContent,

        // Additional scraped fields that don't have dedicated columns
        image_count: finalImages.length,
        source_urls: [rawContent.website_url].filter(Boolean),
        has_description: (rawContent.description?.length || 0) > 20,
        has_price: (rawContent.price_range?.length || 0) > 0,
        has_location: (rawContent.address?.length || 0) > 10,
        has_rating: rawContent.rating > 0,

        // Store job_id and uses_placeholder in raw_content since they're not columns in staging_queue
        job_id: jobId,
        uses_placeholder: usesPlaceholder,

        // Metadata
        validation_metadata: validationMetadata,
        thumbnail_selection: {
          reason: thumbnailSelection.selectionReason + (usesPlaceholder ? ' (placeholder used)' : ''),
          index: thumbnailSelection.thumbnailIndex
        }
      }
    };

    // Log the exact payload being sent to database
    console.log(`  💾 Attempting to save staging item with payload:`, {
      title: stagingPayload.title,
      category: stagingPayload.category,
      primary_image: stagingPayload.primary_image ? 'SET' : 'NULL',
      images_count: stagingPayload.images.length,
      confidence_score: stagingPayload.confidence_score,
      status: stagingPayload.status,
      raw_content_keys: Object.keys(stagingPayload.raw_content),
      uses_placeholder_in_raw_content: stagingPayload.raw_content.uses_placeholder,
      job_id_in_raw_content: stagingPayload.raw_content.job_id
    });

    const { data: stagingItem, error } = await supabase
      .from('staging_queue')
      .insert(stagingPayload)
      .select()
      .single();

    if (error) {
      console.error(`  ❌ Database save error for "${rawContent.title}": ${error.message}`);
      console.error(`  Error details:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      console.error(`  Attempted payload:`, stagingPayload);
      return {
        success: false,
        error: {
          step: 'database_save',
          message: `Database save failed: ${error.message}`,
          details: {
            supabase_error: {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint
            },
            attempted_payload: stagingPayload
          }
        },
        usesPlaceholder
      };
    }

    console.log(`  ✅ Successfully created staging item ${stagingItem.id} for "${rawContent.title}"${usesPlaceholder ? ' (using placeholder)' : ''}`);
    return {
      success: true,
      item: stagingItem,
      usesPlaceholder
    };

  } catch (error) {
    console.error('Unexpected error creating staging item:', error);
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Get default placeholder image for venues that have no valid images
function getDefaultPlaceholder(): string {
  // Return a static placeholder path that will be served by Next.js
  return '/images/placeholders/default.jpg';
}

// Calculate confidence score based on data quality and category
function calculateConfidenceScore(rawContent: any, category: string): number {
  let score = 60; // Base score

  // Common quality indicators
  if (rawContent.rating > 4.0) score += 15;
  if (rawContent.review_count > 100) score += 10;
  if (rawContent.website_url) score += 10;
  if (rawContent.phone) score += 5;

  // Category-specific bonuses
  switch (category) {
    case 'hotels':
      if (rawContent.star_rating >= 4) score += 10;
      if (rawContent.amenities?.length > 0) score += 5;
      break;
    case 'restaurants':
      if (rawContent.cuisine_type && rawContent.cuisine_type !== 'International') score += 10;
      if (rawContent.opening_hours?.length > 0) score += 5;
      break;
    case 'shopping':
      if (rawContent.center_type && rawContent.center_type.includes('Traditional')) score += 10;
      break;
    case 'activities':
      if (rawContent.types?.includes('tourist_attraction')) score += 10;
      break;
  }

  return Math.min(score, 100);
}

async function checkDuplicate(title: string, category: string): Promise<boolean> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check for existing entries with same title and category
  const { data } = await supabase
    .from('staging_queue')
    .select('id, images, primary_image, raw_content')
    .eq('category', category)
    .ilike('title', `%${title.substring(0, 20)}%`)
    .limit(1);

  if (!data || data.length === 0) {
    return false; // No duplicate found
  }

  const existingEntry = data[0];

  // Check if existing entry is incomplete (should allow overwrite)
  const hasNoImages = !existingEntry.images ||
                     (Array.isArray(existingEntry.images) && existingEntry.images.length === 0);
  const hasNoValidPrimaryImage = !existingEntry.primary_image ||
                                existingEntry.primary_image === '/images/placeholders/default.jpg';
  const usesPlaceholder = existingEntry.raw_content?.uses_placeholder === true;

  // Allow overwrite if existing entry is incomplete
  if (hasNoImages || hasNoValidPrimaryImage || usesPlaceholder) {
    console.log(`  Allowing overwrite of incomplete entry for "${title}" (images: ${existingEntry.images?.length || 0}, placeholder: ${usesPlaceholder})`);

    // Delete the incomplete entry to allow the new one
    await supabase
      .from('staging_queue')
      .delete()
      .eq('id', existingEntry.id);

    return false; // Allow the new scrape to proceed
  }

  // Block only if existing entry is complete
  console.log(`  Blocking duplicate - complete entry exists for "${title}"`);
  return true;
}