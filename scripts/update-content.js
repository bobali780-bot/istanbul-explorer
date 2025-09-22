#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const entityType = process.argv[2] || 'activity';

async function main() {
  console.log(`🚀 Starting content update for ${entityType}s...`);

  try {
    // Get all entities of the specified type that need updates
    const tableName = `${entityType}s`;
    const { data: entities, error } = await supabase
      .from(tableName)
      .select('id, name, last_updated')
      .eq('is_active', true)
      .or(`last_updated.is.null,last_updated.lt.${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`) // Older than 7 days
      .limit(10); // Process 10 per run to stay within free limits

    if (error) {
      throw error;
    }

    if (!entities || entities.length === 0) {
      console.log(`✅ No ${entityType}s need content updates.`);
      return;
    }

    console.log(`📋 Found ${entities.length} ${entityType}s to update`);

    // Process each entity
    for (const entity of entities) {
      console.log(`🔄 Updating ${entity.name}...`);

      try {
        // Call our API endpoint for content generation
        const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/automation/content-generation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entityType,
            entityId: entity.id,
            targetEntity: entity.name
          })
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          console.log(`✅ Updated ${entity.name} successfully`);
        } else {
          console.error(`❌ Failed to update ${entity.name}:`, result.error);
        }

        // Wait 2 seconds between requests to be respectful to APIs
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ Error updating ${entity.name}:`, error.message);

        // Log the error to database
        await supabase
          .from('automation_logs')
          .insert({
            job_type: 'content_update',
            entity_type: entityType,
            entity_id: entity.id,
            status: 'failed',
            error_message: error.message
          });
      }
    }

    console.log(`🎉 Completed content update for ${entityType}s`);

  } catch (error) {
    console.error('❌ Content update failed:', error);
    process.exit(1);
  }
}

// Helper function to check API usage
async function checkApiUsage() {
  const today = new Date().toISOString().split('T')[0];

  const { data: usage } = await supabase
    .from('api_usage_tracking')
    .select('api_name, requests_count, monthly_limit')
    .eq('date_used', today);

  for (const api of usage || []) {
    if (api.monthly_limit && api.requests_count >= api.monthly_limit * 0.9) {
      console.warn(`⚠️  ${api.api_name} approaching limit: ${api.requests_count}/${api.monthly_limit}`);
    }
  }
}

main();