-- Check if pricing fields exist and have data
SELECT
  id,
  name,
  price_range,
  price_from,
  price_to,
  currency
FROM activities
LIMIT 5;
