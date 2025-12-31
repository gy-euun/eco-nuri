-- Supabase SQL Editor에서 실행할 SQL 쿼리
-- 이 파일의 내용만 복사해서 SQL Editor에 붙여넣으세요

-- 문의 내역 테이블
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  building_type TEXT NOT NULL,
  address TEXT NOT NULL,
  area TEXT,
  area_unit TEXT DEFAULT 'pyeong',
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 통계 테이블
CREATE TABLE IF NOT EXISTS stats (
  id TEXT PRIMARY KEY DEFAULT 'stats-001',
  total_inquiries INTEGER DEFAULT 0,
  total_calculations INTEGER DEFAULT 0,
  inquiries_by_building_type JSONB DEFAULT '{}'::jsonb,
  inquiries_by_date JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 관리자 테이블
CREATE TABLE IF NOT EXISTS admin (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO admin (id, username, password)
VALUES (
  'admin-001',
  'kosecorp',
  '$2a$10$RefDgZ88MGhYhtofmB1kyOULuPJXJErNkup5.BphEk6qpiDzHajOi'
)
ON CONFLICT (username) DO NOTHING;

-- 초기 통계 생성
INSERT INTO stats (id, total_inquiries, total_calculations)
VALUES ('stats-001', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security) 정책 설정
-- 서비스 역할은 모든 데이터 접근 가능 (서버 사이드)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- 서비스 역할 정책 (서버 사이드에서 사용)
CREATE POLICY "Service role full access" ON inquiries
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON stats
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON admin
  FOR ALL USING (true);
