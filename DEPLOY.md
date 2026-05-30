-- 1. جدول المقالات
CREATE TABLE articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL DEFAULT 'نادي الدندر',
  author_avatar TEXT DEFAULT 'https://i.pravatar.cc/100?img=1',
  category TEXT NOT NULL CHECK (category IN ('opinion', 'literature', 'history', 'society', 'culture')),
  cover_image TEXT DEFAULT 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  read_time INT DEFAULT 5,
  is_published BOOLEAN DEFAULT true,
  slug TEXT UNIQUE,
  views INT DEFAULT 0
);

-- 2. جدول الملفات الشخصية
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'publisher' CHECK (role IN ('admin', 'publisher')),
  is_approved BOOLEAN DEFAULT false,
  avatar_url TEXT DEFAULT 'https://i.pravatar.cc/100?img=1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول المشتركين
CREATE TABLE subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول طلبات العضوية
CREATE TABLE membership_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  birth_year INT,
  qualification TEXT,
  interests TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. جدول الفعاليات
CREATE TABLE events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('culture', 'literature', 'social', 'workshop')),
  event_date DATE NOT NULL,
  event_time TEXT DEFAULT '8:00 م',
  location TEXT,
  cover_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
CREATE POLICY "articles_read_all" ON articles FOR SELECT USING (true);
CREATE POLICY "articles_write_auth" ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "articles_update_auth" ON articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "articles_delete_auth" ON articles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "profiles_read_own" ON profiles FOR SELECT USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "subscribers_insert_all" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "subscribers_read_admin" ON subscribers FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "membership_insert_all" ON membership_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "membership_read_admin" ON membership_requests FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "membership_update_admin" ON membership_requests FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "events_read_all" ON events FOR SELECT USING (true);
CREATE POLICY "events_write_admin" ON events FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "events_update_admin" ON events FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');