-- Fix broken slug for article 11 (Arabic chars stripped by buggy regex)
-- Run this in Supabase SQL Editor
UPDATE articles SET slug = 'a-' || replace(gen_random_uuid()::text, '-', '') WHERE id = 11;

-- To verify:
-- SELECT id, title, author, slug FROM articles WHERE id = 11;
