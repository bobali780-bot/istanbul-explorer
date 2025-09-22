// Firecrawl v2 Integration for Content Scraping
// Documentation: https://docs.firecrawl.dev/introduction

interface FirecrawlResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface ScrapedContent {
  title: string;
  description: string;
  content: string;
  metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  images?: string[];
  links?: string[];
  sourceUrl: string;
}

interface ActivityData {
  name: string;
  description: string;
  short_overview: string;
  full_description: string;
  address?: string;
  district?: string;
  location?: string;
  duration?: string;
  price_range?: string;
  opening_hours?: string;
  rating?: number;
  review_count?: number;
  highlights?: string[];
  images: string[];
  reviews: {
    reviewer_name: string;
    rating: number;
    review_content: string;
    source: string;
  }[];
  scraped_from: string;
  confidence_score: number;
}

class FirecrawlService {
  private apiKey: string;
  private baseUrl = 'https://api.firecrawl.dev/v1';

  constructor() {
    this.apiKey = process.env.FIRECRAWL_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('FIRECRAWL_API_KEY is required');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<FirecrawlResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Firecrawl API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async scrapeUrl(url: string): Promise<ScrapedContent | null> {
    const response = await this.makeRequest('/scrape', {
      method: 'POST',
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        includeTags: ['title', 'meta', 'img', 'p', 'h1', 'h2', 'h3', 'span'],
        excludeTags: ['nav', 'footer', 'header', 'script'],
        waitFor: 2000,
        timeout: 30000
      })
    });

    if (!response.success || !response.data) {
      console.error('Failed to scrape URL:', url, response.error);
      return null;
    }

    const { data } = response;

    return {
      title: data.metadata?.title || data.title || '',
      description: data.metadata?.description || '',
      content: data.markdown || data.html || '',
      metadata: data.metadata || {},
      images: this.extractImages(data),
      links: data.links || [],
      sourceUrl: url
    };
  }

  async searchActivity(searchTerm: string): Promise<ActivityData[]> {
    // Search multiple sources for the activity
    const searchUrls = await this.getSearchUrls(searchTerm);
    const scrapedResults: ScrapedContent[] = [];

    for (const url of searchUrls) {
      const result = await this.scrapeUrl(url);
      if (result) {
        scrapedResults.push(result);
      }
    }

    // Process and combine results into structured activity data
    return this.processScrapedResults(scrapedResults, searchTerm);
  }

  private async getSearchUrls(searchTerm: string): Promise<string[]> {
    const urls: string[] = [];

    // TripAdvisor search
    const tripAdvisorQuery = encodeURIComponent(`${searchTerm} istanbul`);
    urls.push(`https://www.tripadvisor.com/Search?q=${tripAdvisorQuery}`);

    // Lonely Planet
    urls.push(`https://www.lonelyplanet.com/search?q=${tripAdvisorQuery}`);

    // GetYourGuide
    urls.push(`https://www.getyourguide.com/s/?q=${tripAdvisorQuery}`);

    // Viator
    urls.push(`https://www.viator.com/searchResults/all?text=${tripAdvisorQuery}`);

    // Official tourism sites
    urls.push(`https://www.go-turkey.com/search?q=${tripAdvisorQuery}`);

    return urls.slice(0, 3); // Limit to prevent rate limiting
  }

  private extractImages(data: any): string[] {
    const images: string[] = [];

    // Extract from metadata
    if (data.metadata?.ogImage) {
      images.push(data.metadata.ogImage);
    }

    // Extract from HTML content if available
    if (data.html) {
      const imgRegex = /<img[^>]+src="([^">]+)"/gi;
      let match;
      while ((match = imgRegex.exec(data.html)) !== null) {
        const imgUrl = match[1];
        if (this.isValidImageUrl(imgUrl)) {
          images.push(imgUrl);
        }
      }
    }

    // Return unique, high-quality images
    return [...new Set(images)]
      .filter(img => this.isHighQualityImage(img))
      .slice(0, 15); // Limit to 15 images as requested
  }

  private isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|webp|avif)$/i.test(url);
    } catch {
      return false;
    }
  }

  private isHighQualityImage(url: string): boolean {
    // Filter out small icons, ads, and low-quality images
    const lowQualityPatterns = [
      'icon', 'logo', 'avatar', 'thumb', 'small', 'tiny',
      'ad', 'banner', 'widget', 'button', 'sprite'
    ];

    const urlLower = url.toLowerCase();
    return !lowQualityPatterns.some(pattern => urlLower.includes(pattern));
  }

  private processScrapedResults(results: ScrapedContent[], searchTerm: string): ActivityData[] {
    if (results.length === 0) return [];

    // Combine results from multiple sources
    const combinedData = this.combineResults(results);

    // Extract structured data
    const activityData: ActivityData = {
      name: this.extractName(combinedData, searchTerm),
      description: this.extractDescription(combinedData),
      short_overview: this.extractShortOverview(combinedData),
      full_description: this.extractFullDescription(combinedData),
      address: this.extractAddress(combinedData),
      district: this.extractDistrict(combinedData),
      location: this.extractLocation(combinedData),
      duration: this.extractDuration(combinedData),
      price_range: this.extractPriceRange(combinedData),
      opening_hours: this.extractOpeningHours(combinedData),
      rating: this.extractRating(combinedData),
      review_count: this.extractReviewCount(combinedData),
      highlights: this.extractHighlights(combinedData),
      images: this.consolidateImages(results),
      reviews: this.extractReviews(combinedData),
      scraped_from: searchTerm,
      confidence_score: this.calculateConfidenceScore(combinedData)
    };

    return [activityData];
  }

  private combineResults(results: ScrapedContent[]): any {
    // Combine content from all sources
    const combined = {
      titles: results.map(r => r.title).filter(Boolean),
      descriptions: results.map(r => r.description).filter(Boolean),
      content: results.map(r => r.content).join('\n\n'),
      metadata: results.map(r => r.metadata),
      sources: results.map(r => r.sourceUrl)
    };

    return combined;
  }

  private extractName(data: any, searchTerm: string): string {
    // Use the most common title or fallback to search term
    const titles = data.titles;
    if (titles.length > 0) {
      return titles[0].replace(/\s*-\s*TripAdvisor.*$/i, '').trim();
    }
    return searchTerm;
  }

  private extractDescription(data: any): string {
    const descriptions = data.descriptions;
    if (descriptions.length > 0) {
      return descriptions[0].substring(0, 500) + '...';
    }
    return '';
  }

  private extractShortOverview(data: any): string {
    const content = data.content;
    // Extract first meaningful paragraph
    const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 50);
    return sentences[0]?.trim().substring(0, 200) + '...' || '';
  }

  private extractFullDescription(data: any): string {
    const content = data.content;
    // Extract and clean the main content
    return content.substring(0, 2000) + '...';
  }

  private extractAddress(data: any): string {
    const content = data.content;
    // Look for address patterns
    const addressMatch = content.match(/(?:Address|Location)[:\s]+([^.]+)/i);
    return addressMatch?.[1]?.trim() || '';
  }

  private extractDistrict(data: any): string {
    const content = data.content;
    // Look for Istanbul district names
    const districts = ['Sultanahmet', 'Beyoglu', 'Galata', 'Besiktas', 'Eminonu', 'Fatih'];
    for (const district of districts) {
      if (content.toLowerCase().includes(district.toLowerCase())) {
        return district;
      }
    }
    return '';
  }

  private extractLocation(data: any): string {
    return 'Istanbul, Turkey'; // Default for now
  }

  private extractDuration(data: any): string {
    const content = data.content;
    const durationMatch = content.match(/(\d+(?:[-–]\d+)?)\s*(?:hours?|hrs?|minutes?|mins?)/i);
    return durationMatch?.[0] || '';
  }

  private extractPriceRange(data: any): string {
    const content = data.content;
    const priceMatch = content.match(/(?:€|₺|TL|USD?)\s*\d+(?:[-–]\d+)?/i);
    return priceMatch?.[0] || '';
  }

  private extractOpeningHours(data: any): string {
    const content = data.content;
    const hoursMatch = content.match(/(?:Hours?|Open)[:\s]+([^.]+)/i);
    return hoursMatch?.[1]?.trim() || '';
  }

  private extractRating(data: any): number {
    const content = data.content;
    const ratingMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*5|stars?|rating)/i);
    return ratingMatch ? parseFloat(ratingMatch[1]) : 0;
  }

  private extractReviewCount(data: any): number {
    const content = data.content;
    const reviewMatch = content.match(/(\d+(?:,\d+)*)\s*reviews?/i);
    return reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 0;
  }

  private extractHighlights(data: any): string[] {
    const content = data.content;
    // Extract bullet points or highlighted features
    const highlights = content.match(/[•·*-]\s*([^.\n]+)/g);
    return highlights?.map((h: string) => h.replace(/^[•·*-]\s*/, '').trim()).slice(0, 6) || [];
  }

  private consolidateImages(results: ScrapedContent[]): string[] {
    const allImages = results.flatMap(r => r.images || []);
    return [...new Set(allImages)].slice(0, 15);
  }

  private extractReviews(data: any): any[] {
    // For now, return empty array - would need more sophisticated extraction
    return [];
  }

  private calculateConfidenceScore(data: any): number {
    let score = 0;
    if (data.titles.length > 0) score += 20;
    if (data.descriptions.length > 0) score += 20;
    if (data.content.length > 500) score += 20;
    if (data.sources.length >= 2) score += 20;
    if (data.content.includes('Istanbul')) score += 20;
    return Math.min(score, 100);
  }
}

export default FirecrawlService;