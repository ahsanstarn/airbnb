-- KAYA.GE - Page Views Table for Live Visitor Tracking
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for efficient live-viewer queries
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_time ON public.page_views(visited_at);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON public.page_views(visitor_id);

-- RLS: allow inserts from anon, reads only for authenticated (admin)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views" ON public.page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read page views" ON public.page_views
    FOR SELECT USING (auth.role() = 'authenticated');
