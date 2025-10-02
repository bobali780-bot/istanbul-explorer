// Comprehensive analysis of coordinates across all categories
// This script will help you understand the current state of your coordinates

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeCoordinates() {
  console.log('🔍 ANALYZING COORDINATES ACROSS ALL CATEGORIES\n');
  
  const categories = [
    { name: 'activities', table: 'activities' },
    { name: 'hotels', table: 'hotels' },
    { name: 'shopping', table: 'shopping' },
    { name: 'restaurants', table: 'restaurants' }
  ];
  
  let totalPlaces = 0;
  let totalWithCoordinates = 0;
  let totalMissingCoordinates = 0;
  
  for (const category of categories) {
    try {
      console.log(`📊 ${category.name.toUpperCase()}:`);
      
      // Get total count
      const { count: totalCount } = await supabase
        .from(category.table)
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      // Get count with valid coordinates
      const { count: withCoordinates } = await supabase
        .from(category.table)
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .not('coordinates', 'is', null);
      
      // Get sample data to check coordinate quality
      const { data: sampleData } = await supabase
        .from(category.table)
        .select('name, coordinates')
        .eq('is_active', true)
        .not('coordinates', 'is', null)
        .limit(3);
      
      const missing = totalCount - withCoordinates;
      
      console.log(`   Total places: ${totalCount}`);
      console.log(`   With coordinates: ${withCoordinates}`);
      console.log(`   Missing coordinates: ${missing}`);
      console.log(`   Coverage: ${totalCount > 0 ? Math.round((withCoordinates / totalCount) * 100) : 0}%`);
      
      if (sampleData && sampleData.length > 0) {
        console.log(`   Sample coordinates:`);
        sampleData.forEach(item => {
          const coords = item.coordinates;
          if (coords && coords.lat && coords.lng) {
            console.log(`     ${item.name}: ${coords.lat}, ${coords.lng}`);
          }
        });
      }
      
      totalPlaces += totalCount;
      totalWithCoordinates += withCoordinates;
      totalMissingCoordinates += missing;
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error analyzing ${category.name}:`, error.message);
    }
  }
  
  console.log('📈 SUMMARY:');
  console.log(`   Total places across all categories: ${totalPlaces}`);
  console.log(`   Total with coordinates: ${totalWithCoordinates}`);
  console.log(`   Total missing coordinates: ${totalMissingCoordinates}`);
  console.log(`   Overall coverage: ${totalPlaces > 0 ? Math.round((totalWithCoordinates / totalPlaces) * 100) : 0}%`);
  
  console.log('\n🗺️ MAP INTEGRATION ANALYSIS:');
  console.log('✅ Your IstanbulMap component expects:');
  console.log('   - items array with coordinates: { lat: number, lng: number }');
  console.log('   - category field for styling');
  console.log('   - name, rating, neighborhood, slug fields');
  
  console.log('\n🔧 NEXT STEPS:');
  if (totalMissingCoordinates > 0) {
    console.log(`   1. ${totalMissingCoordinates} places need coordinates`);
    console.log('   2. You can get coordinates from Google Maps API');
    console.log('   3. Or manually add them via Supabase dashboard');
    console.log('   4. Then update your homepage to use real data instead of mock data');
  } else {
    console.log('   ✅ All places have coordinates!');
    console.log('   ✅ You can now connect your database to the homepage map');
  }
}

analyzeCoordinates().catch(console.error);
