#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('📊 Monitoring API usage...');

  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Get today's usage
    const { data: todayUsage } = await supabase
      .from('api_usage_tracking')
      .select('api_name, requests_count, monthly_limit, cost_per_request')
      .eq('date_used', today);

    // Get this month's usage
    const { data: monthlyUsage } = await supabase
      .rpc('get_monthly_api_usage', { month_prefix: thisMonth });

    // API limits (free tiers)
    const limits = {
      'wikipedia': { monthly: 10000, name: 'Wikipedia API' },
      'unsplash': { monthly: 50, name: 'Unsplash API' },
      'firecrawl': { monthly: 500, name: 'Firecrawl API' },
      'github_actions': { monthly: 2000, name: 'GitHub Actions (minutes)' }
    };

    console.log('\n📈 API Usage Report:');
    console.log('==================');

    let warnings = [];
    let totalCost = 0;

    for (const [apiName, limit] of Object.entries(limits)) {
      const monthlyCount = monthlyUsage?.find(u => u.api_name === apiName)?.total_requests || 0;
      const todayCount = todayUsage?.filter(u => u.api_name === apiName)?.reduce((sum, u) => sum + u.requests_count, 0) || 0;

      const percentage = Math.round((monthlyCount / limit.monthly) * 100);
      const status = percentage > 90 ? '🔴' : percentage > 70 ? '🟡' : '🟢';

      console.log(`${status} ${limit.name}:`);
      console.log(`   Today: ${todayCount} requests`);
      console.log(`   Month: ${monthlyCount}/${limit.monthly} (${percentage}%)`);

      if (percentage > 80) {
        warnings.push(`${limit.name} at ${percentage}% of monthly limit`);
      }

      // Calculate costs (most are free, but track for monitoring)
      const avgCost = todayUsage?.find(u => u.api_name === apiName)?.cost_per_request || 0;
      totalCost += monthlyCount * avgCost;

      console.log('');
    }

    // Check GitHub Actions usage
    const actionsUsage = await checkGitHubActionsUsage();
    if (actionsUsage) {
      console.log(`🔧 GitHub Actions: ${actionsUsage.used}/${actionsUsage.included} minutes (${Math.round((actionsUsage.used / actionsUsage.included) * 100)}%)`);
    }

    console.log(`💰 Estimated monthly cost: $${totalCost.toFixed(2)}`);

    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach(warning => console.log(`   • ${warning}`));

      // Log warnings to database
      await supabase
        .from('automation_logs')
        .insert({
          job_type: 'api_monitoring',
          status: 'completed',
          details: {
            warnings,
            total_cost: totalCost,
            usage_summary: monthlyUsage
          }
        });
    } else {
      console.log('\n✅ All APIs within healthy usage limits');
    }

  } catch (error) {
    console.error('❌ API usage monitoring failed:', error);
    process.exit(1);
  }
}

async function checkGitHubActionsUsage() {
  try {
    // This would require GitHub API integration
    // For now, return placeholder data
    return {
      used: 150,
      included: 2000
    };
  } catch (error) {
    console.log('Could not fetch GitHub Actions usage');
    return null;
  }
}

main();