-- ============================================================
-- ADMIN PANEL UPGRADE FOR negorim-v2
-- Run this file in Supabase SQL Editor before deploying
-- ============================================================

-- 1) NEWS TABLE
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Нормативная база',
  cover_image_url TEXT,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '5 мин',
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_published ON public.news(is_published);

-- 2) SETTINGS TABLE (used by /admin/settings)
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) SMALL SAFETY ALTERATIONS FOR EXISTING TABLES
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 4) UPDATED_AT HELPER
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_documents_updated_at ON public.documents;
CREATE TRIGGER set_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_pages_updated_at ON public.pages;
CREATE TRIGGER set_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_news_updated_at ON public.news;
CREATE TRIGGER set_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_media_updated_at ON public.media;
CREATE TRIGGER set_media_updated_at
BEFORE UPDATE ON public.media
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5) ENABLE RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 6) TABLE POLICIES
DROP POLICY IF EXISTS "documents_admin_select" ON public.documents;
CREATE POLICY "documents_admin_select" ON public.documents
FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "media_admin_select" ON public.media;
CREATE POLICY "media_admin_select" ON public.media
FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "media_admin_update" ON public.media;
CREATE POLICY "media_admin_update" ON public.media
FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "settings_public_select" ON public.settings;
DROP POLICY IF EXISTS "settings_admin_select" ON public.settings;
DROP POLICY IF EXISTS "settings_admin_insert" ON public.settings;
DROP POLICY IF EXISTS "settings_admin_update" ON public.settings;
DROP POLICY IF EXISTS "settings_admin_delete" ON public.settings;
CREATE POLICY "settings_public_select" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_select" ON public.settings FOR SELECT USING (public.is_admin());
CREATE POLICY "settings_admin_insert" ON public.settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "settings_admin_update" ON public.settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "settings_admin_delete" ON public.settings FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "news_public_select" ON public.news;
DROP POLICY IF EXISTS "news_admin_select" ON public.news;
DROP POLICY IF EXISTS "news_admin_insert" ON public.news;
DROP POLICY IF EXISTS "news_admin_update" ON public.news;
DROP POLICY IF EXISTS "news_admin_delete" ON public.news;
CREATE POLICY "news_public_select" ON public.news
FOR SELECT USING (is_published = true);
CREATE POLICY "news_admin_select" ON public.news
FOR SELECT USING (public.is_admin());
CREATE POLICY "news_admin_insert" ON public.news
FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "news_admin_update" ON public.news
FOR UPDATE USING (public.is_admin());
CREATE POLICY "news_admin_delete" ON public.news
FOR DELETE USING (public.is_admin());

-- 7) STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 8) STORAGE POLICIES: PUBLIC READ, ADMIN WRITE
DROP POLICY IF EXISTS "Public read media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin write media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin write documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete documents bucket" ON storage.objects;

CREATE POLICY "Public read media bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Admin write media bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin update media bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin delete media bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Public read documents bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Admin write documents bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND public.is_admin());

CREATE POLICY "Admin update documents bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents' AND public.is_admin());

CREATE POLICY "Admin delete documents bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND public.is_admin());

-- 9) OPTIONAL: MAKE YOUR USER ADMIN (replace email)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';

SELECT 'admin upgrade applied' AS status;
