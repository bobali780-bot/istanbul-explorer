# Vercel Environment Variables Setup

## 🚀 Step-by-Step Instructions

### 1. Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Navigate to your Istanbul Explorer project
3. Click on **Settings** tab
4. Select **Environment Variables** from the sidebar

### 2. Add Environment Variables

Add these **two environment variables**:

#### Variable 1: Supabase URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://jtyspsbaismmjwwqynns.supabase.co`
- **Environment**: All (Production, Preview, Development)

#### Variable 2: Supabase Anon Key
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0eXNwc2JhaXNtbWp3d3F5bm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzIyNTEsImV4cCI6MjA3MzcwODI1MX0.Qa2PzUxxH_2bWAwY4JjOROPNhbzeZMzPV7yk6W8k2zw`
- **Environment**: All (Production, Preview, Development)

### 3. Redeploy Your Project

After adding the variables:

1. Click **Deployments** tab
2. Find the latest deployment
3. Click the three dots (...) menu
4. Select **Redeploy**
5. Confirm the redeployment

### 4. Verification

Once deployed, test your live site:
- Visit: https://love-istanbul.com/activities
- The page should load activities from Supabase (no more loading spinner)
- Images should display properly from the database
- No more broken blue question marks

## ✅ Expected Results

After setup:
- ✅ Local development: `npm run dev` works with Supabase
- ✅ Production: https://love-istanbul.com/activities shows dynamic data
- ✅ Dynamic images: All activity images load from Supabase
- ✅ No build errors: Clean deployment process

## 🔧 Troubleshooting

If issues persist:
1. **Check variable names**: Must be exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Verify values**: Copy-paste the exact values provided
3. **Environment scope**: Ensure variables are set for "All Environments"
4. **Clear cache**: Try a hard refresh (Ctrl+F5) on the live site
5. **Redeploy**: Trigger a new deployment after adding variables