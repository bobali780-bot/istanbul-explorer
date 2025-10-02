# Booking Links Setup Guide

## What's Been Created

1. **Database Column**: `booking_url` field added to all venue tables (activities, hotels, restaurants, shopping)
2. **Admin Management Page**: `/admin/booking-links` - Interface to manage and auto-generate booking URLs
3. **Auto-Generation System**: Automatically creates search URLs for all venues instantly
4. **Smart Book Now Buttons**: Use custom URLs if available, otherwise generate search URLs automatically

## How to Use

### Step 1: Run the SQL File (IMPORTANT - Do this first!)

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Open the file: `add-booking-url-column.sql`
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click **Run** to add the booking_url column to all tables

### Step 2: Auto-Generate Booking URLs (RECOMMENDED)

1. Navigate to: `http://localhost:3000/admin/booking-links`
2. Click the big purple **"Auto-Generate All URLs"** button at the top
3. This will instantly create search URLs for ALL venues across all categories
4. Done! All your "Book Now" buttons now work immediately

**OR** generate per category:
- Go to any tab (Activities, Hotels, Restaurants, Shopping)
- If venues are missing URLs, you'll see a blue banner
- Click **"Generate for [Category]"** to auto-generate just for that category

### Step 3: Add Custom URLs (Optional)

Want to replace auto-generated search URLs with specific booking pages?

For each venue:
1. Find a specific booking link (examples below)
2. Paste the URL into the input field
3. Click the **Save** button (disk icon)
4. The custom URL overrides the auto-generated one

## Example Booking URLs

### Activities (Expedia, Viator, GetYourGuide)
- Blue Mosque: `https://www.expedia.co.uk/Blue-Mosque-Sultanahmet.d501291.Attraction`
- Hagia Sophia: `https://www.viator.com/tours/Istanbul/Skip-the-Line-Hagia-Sophia`
- Topkapi Palace: `https://www.getyourguide.com/topkapi-palace-l2627/`

### Hotels (Booking.com, Expedia, Hotels.com)
- Four Seasons Sultanahmet: `https://www.booking.com/hotel/tr/four-seasons-sultanahmet.html`
- Ciragan Palace: `https://www.expedia.co.uk/Istanbul-Hotels-Ciragan-Palace.h123456.Hotel-Information`

### Food & Drink (OpenTable, TheFork, Resy)
- Mikla Restaurant: `https://www.opentable.com/r/mikla-istanbul`
- Nusr-Et: `https://resy.com/cities/ist/venues/nusr-et`

### Shopping (Official websites or marketplace links)
- Grand Bazaar: `https://www.grandbazaaristanbul.org/`
- Istinye Park: `https://www.istinyepark.com/`

## How It Works on the Frontend

### Auto-Generated URLs (Default)
- System automatically creates search URLs like:
  - **Activities**: `viator.com/searchResults/all?text=Blue+Mosque+Istanbul`
  - **Hotels**: `booking.com/searchresults.html?ss=Four+Seasons+Istanbul`
  - **Restaurants**: `tripadvisor.com/Search?q=Mikla+Restaurant+Istanbul`
  - **Shopping**: `tripadvisor.com/Search?q=Grand+Bazaar+Istanbul`
- Takes users to search results pages on the appropriate platform
- Works immediately for all venues, no manual work required

### Custom URLs (When You Add Them)
- If you paste a specific URL in the admin, it overrides the auto-generated one
- Example: Blue Mosque custom URL → Opens specific Expedia booking page
- Use this when you find better direct booking links or set up affiliate tracking

## Finding Booking Links

### Method 1: Manual Search
1. Search Google for: `[venue name] book tickets expedia`
2. Find the specific venue page (not just search results)
3. Copy the URL

### Method 2: Platform Direct Search
- Expedia: Search on expedia.co.uk → Find venue → Copy URL
- Viator: Search on viator.com → Find tour/activity → Copy URL
- Booking.com: Search hotel → Copy URL

## Tips

1. **Start with auto-generation**: Get all venues working immediately with search URLs
2. **Upgrade to specific URLs over time**: Replace auto-generated URLs with direct booking pages as you find them
3. **Test the links**: Click the external link icon to verify URLs work correctly
4. **Mix platforms**: Use different platforms for different venues - whatever works best
5. **Update anytime**: You can change URLs whenever you get better links or set up affiliate codes
6. **Re-run auto-generation**: If you add new venues, just hit the generate button again for missing URLs

## Future: Adding Affiliate Links

When you're ready to add affiliate tracking:

1. Sign up for affiliate programs (Expedia, Viator, etc.)
2. They'll give you a way to add tracking codes to URLs
3. Just update the URLs in the admin page with your affiliate versions
4. Example: `https://www.expedia.co.uk/blue-mosque?affid=YOUR_AFFILIATE_ID`

## Questions?

- **Q: Do I need to manually add URLs for all venues?**
  - A: No! Just click "Auto-Generate All URLs" and every venue gets a working booking link instantly

- **Q: What's the difference between auto-generated and custom URLs?**
  - A: Auto-generated take users to search results pages (quick setup). Custom URLs are specific booking pages (better user experience)

- **Q: Can I use different booking platforms for different venues?**
  - A: Yes! The auto-generation already does this (Viator for activities, Booking.com for hotels, etc.). You can also manually choose platforms

- **Q: Will these URLs work for affiliate tracking?**
  - A: The auto-generated URLs don't have affiliate codes. When you're ready for affiliates, just update the URLs with your tracking parameters
