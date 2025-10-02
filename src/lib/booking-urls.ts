/**
 * Generate booking search URLs for different platforms
 * These take users to search results pages for the venue
 */

export function generateBookingUrls(venueName: string, location: string = 'Istanbul') {
  // Clean and encode the venue name for URLs
  const searchQuery = encodeURIComponent(`${venueName} ${location}`)

  return {
    expedia: `https://www.expedia.co.uk/things-to-do/search?q=${searchQuery}`,
    viator: `https://www.viator.com/searchResults/all?text=${searchQuery}`,
    getyourguide: `https://www.getyourguide.com/s/?q=${searchQuery}`,
    tripadvisor: `https://www.tripadvisor.com/Search?q=${searchQuery}`,
    bookingcom: `https://www.booking.com/searchresults.html?ss=${searchQuery}`,
  }
}

/**
 * Get default booking URL based on category
 * Returns the most appropriate platform for each category
 */
export function getDefaultBookingUrl(
  venueName: string,
  category: 'activities' | 'hotels' | 'restaurants' | 'shopping',
  location: string = 'Istanbul'
): string {
  const urls = generateBookingUrls(venueName, location)

  switch (category) {
    case 'activities':
      // Viator is best for activities/tours
      return urls.viator

    case 'hotels':
      // Booking.com is best for hotels
      return urls.bookingcom

    case 'restaurants':
      // TripAdvisor is good for restaurants
      return urls.tripadvisor

    case 'shopping':
      // TripAdvisor for shopping venues
      return urls.tripadvisor

    default:
      return urls.expedia
  }
}

/**
 * Generate a booking URL for a venue
 * If custom URL exists, use it. Otherwise generate search URL.
 */
export function getBookingUrl(
  venueName: string,
  category: 'activities' | 'hotels' | 'restaurants' | 'shopping',
  customUrl?: string | null,
  location: string = 'Istanbul'
): string {
  // If custom URL provided, use it
  if (customUrl) {
    return customUrl
  }

  // Otherwise generate default search URL
  return getDefaultBookingUrl(venueName, category, location)
}
