-- Sample data for testing
-- Run this in Supabase SQL Editor after running prisma migrate

-- 1) Add a MOVIE title that is PUBLISHED
INSERT INTO "Title" ("id", "title", "type", "overview", "posterUrl", "status", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Contoh Film',
  'MOVIE'::"TitleType",
  'Sinopsis singkat film.',
  'https://via.placeholder.com/300x450',
  'PUBLISHED'::"PubStatus",
  NOW(),
  NOW()
)
RETURNING id;

-- Note: Copy the returned ID and replace <TITLE_ID> below

-- 2) Add a source for the movie (HLS)
-- Replace <TITLE_ID> with the actual ID from step 1
INSERT INTO "Source" ("id", "titleId", "provider", "url", "quality", "lang", "priority", "isActive", "createdAt")
VALUES (
  gen_random_uuid(),
  '<TITLE_ID>',  -- Replace this with actual Title ID
  'HLS'::"Provider",
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  '1080',
  'ID',
  1,
  true,
  NOW()
);

-- Alternative: Single query with CTE to avoid manual ID replacement
WITH new_title AS (
  INSERT INTO "Title" ("id", "title", "type", "overview", "posterUrl", "status", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    'Contoh Film Auto',
    'MOVIE'::"TitleType",
    'Sinopsis singkat film dengan auto ID.',
    'https://via.placeholder.com/300x450',
    'PUBLISHED'::"PubStatus",
    NOW(),
    NOW()
  )
  RETURNING id
)
INSERT INTO "Source" ("id", "titleId", "provider", "url", "quality", "lang", "priority", "isActive", "createdAt")
SELECT 
  gen_random_uuid(),
  new_title.id,
  'HLS'::"Provider",
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  '1080',
  'ID',
  1,
  true,
  NOW()
FROM new_title;
