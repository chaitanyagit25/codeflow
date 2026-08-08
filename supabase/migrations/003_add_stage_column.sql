-- ============================================================
-- CodeFlow — Add stage column to lessons table
-- Run this in the Supabase SQL Editor AFTER 001_create_tables.sql
-- ============================================================

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS stage integer NOT NULL DEFAULT 1;

-- Composite index for stage-based ordering
CREATE INDEX IF NOT EXISTS idx_lessons_stage_order
ON public.lessons(stage, order_index);
