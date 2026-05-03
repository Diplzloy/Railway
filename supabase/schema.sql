-- ============================================================
-- FULL SCHEMA: negorim-v2 premium B2B platform
-- ============================================================

-- Profiles with roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_url TEXT,
  file_size TEXT,
  file_name TEXT,
  is_free BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pages (CMS)
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Media
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  size INTEGER,
  bucket TEXT DEFAULT 'media',
  path TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "profiles_self_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- DOCUMENTS: всем читать, только admin писать
DROP POLICY IF EXISTS "documents_public_select" ON public.documents;
DROP POLICY IF EXISTS "documents_admin_all" ON public.documents;
CREATE POLICY "documents_public_select" ON public.documents FOR SELECT USING (is_active = true);
CREATE POLICY "documents_admin_insert" ON public.documents FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "documents_admin_update" ON public.documents FOR UPDATE USING (public.is_admin());
CREATE POLICY "documents_admin_delete" ON public.documents FOR DELETE USING (public.is_admin());

-- PAGES: всем читать published, только admin писать
DROP POLICY IF EXISTS "pages_public_select" ON public.pages;
DROP POLICY IF EXISTS "pages_admin_all" ON public.pages;
CREATE POLICY "pages_public_select" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "pages_admin_select" ON public.pages FOR SELECT USING (public.is_admin());
CREATE POLICY "pages_admin_insert" ON public.pages FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "pages_admin_update" ON public.pages FOR UPDATE USING (public.is_admin());
CREATE POLICY "pages_admin_delete" ON public.pages FOR DELETE USING (public.is_admin());

-- MEDIA: всем читать, только admin писать
DROP POLICY IF EXISTS "media_public_select" ON public.media;
DROP POLICY IF EXISTS "media_admin_all" ON public.media;
CREATE POLICY "media_public_select" ON public.media FOR SELECT USING (true);
CREATE POLICY "media_admin_insert" ON public.media FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "media_admin_delete" ON public.media FOR DELETE USING (public.is_admin());

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_active ON public.documents(is_active);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================
-- SEED: make first user admin (run after first signup)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ============================================================

SELECT 'Schema created successfully' AS status;
