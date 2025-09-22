#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🔗 Updating nearby recommendations...');

  try {
    // Clear old recommendations (older than 30 days)
    await supabase
      .from('universal_nearby_recommendations')
      .delete()
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Generate recommendations for each entity type
    const entityTypes = ['activity', 'restaurant', 'hotel', 'shopping_venue'];

    for (const entityType of entityTypes) {
      await generateRecommendationsForType(entityType);
      console.log(`✅ Updated recommendations for ${entityType}s`);
    }

    console.log('🎉 All recommendations updated successfully');

  } catch (error) {
    console.error('❌ Recommendations update failed:', error);
    process.exit(1);
  }
}

async function generateRecommendationsForType(entityType) {
  const tableName = `${entityType}s`;

  // Get all active entities
  const { data: entities } = await supabase
    .from(tableName)
    .select('id, name, district, is_featured, popularity_score')
    .eq('is_active', true);

  if (!entities || entities.length === 0) {
    return;
  }

  console.log(`Processing ${entities.length} ${entityType}s...`);

  for (const entity of entities) {
    await generateRecommendationsForEntity(entityType, entity);

    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function generateRecommendationsForEntity(sourceType, sourceEntity) {
  // Get existing recommendations to avoid duplicates
  const { data: existingRecs } = await supabase
    .from('universal_nearby_recommendations')
    .select('target_entity_type, target_entity_id')
    .eq('source_entity_type', sourceType)
    .eq('source_entity_id', sourceEntity.id);

  const existingTargets = new Set(
    existingRecs?.map(rec => `${rec.target_entity_type}:${rec.target_entity_id}`) || []
  );

  const recommendations = [];

  // 1. Same district recommendations
  await addSameDistrictRecommendations(
    sourceType,
    sourceEntity,
    recommendations,
    existingTargets
  );

  // 2. Popular/featured recommendations regardless of district
  await addPopularRecommendations(
    sourceType,
    sourceEntity,
    recommendations,
    existingTargets
  );

  // 3. Complementary recommendations (e.g., restaurant near hotel)
  await addComplementaryRecommendations(
    sourceType,
    sourceEntity,
    recommendations,
    existingTargets
  );

  // Insert new recommendations
  if (recommendations.length > 0) {
    await supabase
      .from('universal_nearby_recommendations')
      .insert(recommendations);
  }
}

async function addSameDistrictRecommendations(sourceType, sourceEntity, recommendations, existingTargets) {
  if (!sourceEntity.district) return;

  const targetTypes = ['activity', 'restaurant', 'hotel', 'shopping_venue']
    .filter(type => type !== sourceType);

  for (const targetType of targetTypes) {
    const { data: nearbyEntities } = await supabase
      .from(`${targetType}s`)
      .select('id, name, popularity_score, is_featured')
      .eq('district', sourceEntity.district)
      .eq('is_active', true)
      .order('popularity_score', { ascending: false })
      .limit(3);

    for (const target of nearbyEntities || []) {
      const key = `${targetType}:${target.id}`;
      if (existingTargets.has(key)) continue;

      recommendations.push({
        source_entity_type: sourceType,
        source_entity_id: sourceEntity.id,
        target_entity_type: targetType,
        target_entity_id: target.id,
        distance_meters: getEstimatedDistance(),
        walking_time_minutes: getEstimatedWalkingTime(),
        recommendation_score: calculateRecommendationScore(sourceEntity, target, 'same_district'),
        recommendation_reason: `Popular ${targetType} in ${sourceEntity.district}`,
        is_active: true
      });

      existingTargets.add(key);
    }
  }
}

async function addPopularRecommendations(sourceType, sourceEntity, recommendations, existingTargets) {
  const targetTypes = ['activity', 'restaurant', 'hotel', 'shopping_venue']
    .filter(type => type !== sourceType);

  for (const targetType of targetTypes) {
    const { data: popularEntities } = await supabase
      .from(`${targetType}s`)
      .select('id, name, popularity_score, is_featured, district')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('popularity_score', { ascending: false })
      .limit(2);

    for (const target of popularEntities || []) {
      const key = `${targetType}:${target.id}`;
      if (existingTargets.has(key)) continue;

      const isSameDistrict = target.district === sourceEntity.district;

      recommendations.push({
        source_entity_type: sourceType,
        source_entity_id: sourceEntity.id,
        target_entity_type: targetType,
        target_entity_id: target.id,
        distance_meters: isSameDistrict ? getEstimatedDistance() : getEstimatedDistance() * 2,
        walking_time_minutes: isSameDistrict ? getEstimatedWalkingTime() : getEstimatedWalkingTime() * 2,
        recommendation_score: calculateRecommendationScore(sourceEntity, target, 'popular'),
        recommendation_reason: `Featured ${targetType} in Istanbul`,
        is_active: true
      });

      existingTargets.add(key);
    }
  }
}

async function addComplementaryRecommendations(sourceType, sourceEntity, recommendations, existingTargets) {
  // Define complementary relationships
  const complementaryPairs = {
    'hotel': ['restaurant', 'activity'],
    'restaurant': ['activity', 'shopping_venue'],
    'activity': ['restaurant', 'shopping_venue'],
    'shopping_venue': ['restaurant', 'activity']
  };

  const targetTypes = complementaryPairs[sourceType] || [];

  for (const targetType of targetTypes) {
    const { data: complementaryEntities } = await supabase
      .from(`${targetType}s`)
      .select('id, name, popularity_score, district')
      .eq('is_active', true)
      .order('popularity_score', { ascending: false })
      .limit(1);

    for (const target of complementaryEntities || []) {
      const key = `${targetType}:${target.id}`;
      if (existingTargets.has(key)) continue;

      recommendations.push({
        source_entity_type: sourceType,
        source_entity_id: sourceEntity.id,
        target_entity_type: targetType,
        target_entity_id: target.id,
        distance_meters: getEstimatedDistance(),
        walking_time_minutes: getEstimatedWalkingTime(),
        recommendation_score: calculateRecommendationScore(sourceEntity, target, 'complementary'),
        recommendation_reason: `Great ${targetType} experience nearby`,
        is_active: true
      });

      existingTargets.add(key);
    }
  }
}

function calculateRecommendationScore(source, target, type) {
  let score = 50; // Base score

  // Add points for target popularity
  if (target.popularity_score) {
    score += Math.min(target.popularity_score * 0.3, 30);
  }

  // Add points for source popularity (popular sources give better recommendations)
  if (source.popularity_score) {
    score += Math.min(source.popularity_score * 0.2, 20);
  }

  // Type-specific bonuses
  switch (type) {
    case 'same_district':
      score += 15;
      break;
    case 'popular':
      score += 10;
      break;
    case 'complementary':
      score += 20;
      break;
  }

  // Featured entity bonus
  if (target.is_featured) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
}

function getEstimatedDistance() {
  // Return random distance between 100m and 2km
  return Math.floor(Math.random() * 1900) + 100;
}

function getEstimatedWalkingTime() {
  // Return random walking time between 2 and 25 minutes
  return Math.floor(Math.random() * 23) + 2;
}

main();