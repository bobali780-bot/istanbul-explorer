#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🧹 Cleaning up old logs...');

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Delete old automation logs (keep last 30 days)
    const { data: deletedLogs } = await supabase
      .from('automation_logs')
      .delete()
      .lt('created_at', thirtyDaysAgo)
      .select('id');

    console.log(`🗑️  Deleted ${deletedLogs?.length || 0} old automation logs`);

    // Delete old API usage tracking (keep last 7 days for daily, 30 days for others)
    const { data: deletedApiLogs } = await supabase
      .from('api_usage_tracking')
      .delete()
      .lt('created_at', sevenDaysAgo)
      .select('id');

    console.log(`🗑️  Deleted ${deletedApiLogs?.length || 0} old API usage records`);

    // Clean up old universal_insights (keep last 30 days)
    const { data: deletedInsights } = await supabase
      .from('universal_insights')
      .delete()
      .lt('recorded_date', thirtyDaysAgo.split('T')[0])
      .select('id');

    console.log(`🗑️  Deleted ${deletedInsights?.length || 0} old insights records`);

    // Archive old media that's no longer being used
    const { data: unusedMedia } = await supabase
      .from('universal_media')
      .select('id, entity_type, entity_id')
      .lt('created_at', thirtyDaysAgo)
      .eq('is_primary', false)
      .limit(100); // Process in batches

    if (unusedMedia && unusedMedia.length > 0) {
      // Check if entities still exist
      let mediaToDelete = [];

      for (const media of unusedMedia) {
        const tableName = `${media.entity_type}s`;
        const { data: entity } = await supabase
          .from(tableName)
          .select('id')
          .eq('id', media.entity_id)
          .single();

        if (!entity) {
          mediaToDelete.push(media.id);
        }
      }

      if (mediaToDelete.length > 0) {
        await supabase
          .from('universal_media')
          .delete()
          .in('id', mediaToDelete);

        console.log(`🗑️  Cleaned up ${mediaToDelete.length} orphaned media records`);
      }
    }

    // Update statistics
    await updateCleanupStats();

    console.log('✅ Cleanup completed successfully');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

async function updateCleanupStats() {
  const stats = {
    last_cleanup: new Date().toISOString(),
    total_records: 0,
    storage_used: 0
  };

  // Count total records across main tables
  const tables = ['activities', 'restaurants', 'hotels', 'shopping_venues', 'universal_media', 'universal_reviews'];

  for (const table of tables) {
    try {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      stats.total_records += count || 0;
    } catch (error) {
      console.log(`Could not count records in ${table}`);
    }
  }

  // Log cleanup stats
  await supabase
    .from('automation_logs')
    .insert({
      job_type: 'cleanup',
      status: 'completed',
      details: stats
    });

  console.log(`📊 Database contains ${stats.total_records} total records`);
}

main();