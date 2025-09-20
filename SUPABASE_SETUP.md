# Istanbul Explorer - Supabase Dynamic Image System Setup

## 🚀 Complete Setup Guide

### 1. Supabase Database Setup

1. **Go to your Supabase dashboard**: https://app.supabase.com/project/YOUR_PROJECT_ID
2. **Navigate to SQL Editor**
3. **Run the schema** by copy-pasting the contents of `supabase-schema.sql`
4. **Run the sample data** by copy-pasting the contents of `sample-data.sql`

### 2. Supabase Storage Setup (Optional - for custom images)

1. **Create Storage Bucket**:
   - Go to Storage > Create Bucket
   - Name: `activities`
   - Make it Public

2. **Upload Images** (10 per activity):
   - Create folders: `hagia-sophia`, `blue-mosque`, `topkapi-palace`
   - Upload high-resolution images to each folder
   - Get public URLs for each image

3. **Update image URLs**:
   - Replace URLs in `sample-data.sql` with your storage URLs
   - Re-run the INSERT statements for activity_images

### 3. Environment Variables

Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test the System

```bash
npm run dev
```

Visit:
- http://localhost:3000/activities (should show dynamic activities)
- http://localhost:3000/activities/hagia-sophia-tour (should show gallery)

## ✅ What's Now Dynamic

### Before (Static):
- ❌ Hardcoded images in `/src/data/activities.ts`
- ❌ Blue question mark icons for broken URLs
- ❌ Manual code changes to update content

### After (Dynamic):
- ✅ **Images stored in Supabase** (hosted + optimized)
- ✅ **Activities loaded from database** (easy to update)
- ✅ **Gallery system** (4+ images per activity)
- ✅ **No more broken images** (reliable hosting)
- ✅ **Admin-friendly** (update via Supabase dashboard)

## 🔧 Managing Content

### Add New Activity:
```sql
INSERT INTO activities (name, slug, description, ...) VALUES (...);
```

### Add Images to Activity:
```sql
INSERT INTO activity_images (activity_id, image_url, is_primary, sort_order) VALUES
(activity_id, 'https://your-image-url.jpg', true, 1);
```

### Add Reviews:
```sql
INSERT INTO activity_reviews (activity_id, author, rating, comment, review_date) VALUES
(activity_id, 'John Doe', 5, 'Amazing experience!', 'January 2025');
```

## 🚨 Troubleshooting

1. **No activities showing**: Check Supabase credentials in `.env.local`
2. **Images not loading**: Verify image URLs are accessible
3. **RLS errors**: Ensure RLS policies are created (in schema file)
4. **Build errors**: Run `npm run build` to check for TypeScript issues

## 🎯 Next Steps

- Upload your own Istanbul images to Supabase Storage
- Add more activities using the SQL templates
- Customize the gallery component styling
- Add image optimization settings in `next.config.js`