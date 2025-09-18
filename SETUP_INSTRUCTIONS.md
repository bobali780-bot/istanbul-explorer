# Istanbul Explorer - Setup Instructions

## Environment Variables Setup

To get the interactive maps working, you need to add a Mapbox API token to your environment variables.

### 1. Get a Mapbox Token

1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sign up for a free account (includes 50,000 free map loads per month)
3. Go to your account page and copy your default public token
4. It will look like: `pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV4YW1wbGUifQ.example`

### 2. Add to Vercel Environment Variables

1. Go to your Vercel dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your Istanbul Explorer project
3. Go to Settings → Environment Variables
4. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_MAPBOX_TOKEN`
   - **Value**: Your Mapbox token (starts with `pk.`)
   - **Environment**: Production, Preview, Development (select all)
5. Click "Save"
6. Redeploy your project

### 3. Add to Local Development

Create a `.env.local` file in your project root and add:

```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV4YW1wbGUifQ.example
```

### 4. Verify Setup

After adding the token:
- The interactive maps will load properly
- You'll see clickable pins on the homepage map
- Category page maps will show location pins
- No more "Mapbox Token Missing" message

## Affiliate Integration

The site is ready for affiliate integration. All CTA buttons now:
- Open affiliate links in new tabs
- Include click tracking (console logs)
- Are ready for real affiliate codes

### Affiliate Programs Ready:
- **Hotels**: Booking.com integration ready
- **Activities**: Viator/GetYourGuide integration ready
- **Food & Drink**: Tripadvisor integration ready
- **Shopping**: Amazon/shop integration ready

## Google Analytics

To enable Google Analytics:
1. Create a GA4 property
2. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` to environment variables
3. The tracking is already integrated

## AdSense Integration

AdSense placeholders are ready. To enable:
1. Apply for Google AdSense
2. Replace placeholder components with real AdSense code
3. Add your AdSense publisher ID to environment variables

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The site auto-deploys to Vercel when you push to the main branch.

Your live site: https://istanbul-explorer-9tlh.vercel.app/
