# How to Replace Activity Images with Real Photos

The current images are generic/unrelated. Here's how to fix them:

## Option 1: Find Real Unsplash URLs

1. **Go to https://unsplash.com**
2. **Search for each activity:**
   - "Hagia Sophia Istanbul"
   - "Blue Mosque Istanbul"
   - "Topkapi Palace Istanbul"
   - "Grand Bazaar Istanbul"
   - "Bosphorus Istanbul"
   - "Galata Tower Istanbul"
   - "Basilica Cistern Istanbul"
   - "Spice Bazaar Istanbul"
   - "Turkish Hammam Istanbul"
   - "Dolmabahce Palace Istanbul"

3. **Right-click on images → "Copy image address"**
4. **Replace URLs in your Supabase database**

## Option 2: Use Local Images

1. **Create folder**: `public/images/activities/`
2. **Add subfolders** for each activity:
   ```
   public/images/activities/hagia-sophia/
   public/images/activities/blue-mosque/
   public/images/activities/topkapi-palace/
   etc.
   ```
3. **Download real photos** and save them there
4. **Update database URLs** to use `/images/activities/...`

## Option 3: Use a Different Free Image Service

Try these alternatives:
- **Pexels**: https://www.pexels.com/search/istanbul/
- **Pixabay**: https://pixabay.com/images/search/istanbul/
- **Wikipedia Commons**: https://commons.wikimedia.org

## Quick Fix SQL (Template)

```sql
-- Update Hagia Sophia images
UPDATE activity_images
SET image_url = 'YOUR_REAL_HAGIA_SOPHIA_URL_HERE'
WHERE activity_id = 1 AND sort_order = 1;

-- Repeat for each activity and image...
```

Would you like me to create a simple admin interface where you can upload and manage these images directly?