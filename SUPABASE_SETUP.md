# 🚀 Supabase 설정 가이드

## 1단계: Supabase 프로젝트 생성

### Supabase 웹사이트에서

1. **https://supabase.com** 접속
2. **"Start your project"** 클릭
3. GitHub로 로그인
4. **"New Project"** 클릭
5. 프로젝트 정보 입력:
   - **Name**: `econuri` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (저장해두세요!)
   - **Region**: 가장 가까운 리전 선택 (예: Northeast Asia (Seoul))
6. **"Create new project"** 클릭

---

## 2단계: 프로젝트 설정 확인

### API 키 확인

Supabase 대시보드에서:
1. **Settings** → **API** 클릭
2. 다음 정보 확인:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (서버 사이드용)

---

## 3단계: 테이블 생성

### SQL Editor에서 실행

⚠️ **중요**: SQL Editor에는 **SQL 쿼리만** 입력하세요. JavaScript/TypeScript 코드는 입력하지 마세요!

1. Supabase 대시보드 → **SQL Editor** → **New query** 클릭
2. `SUPABASE_SQL.sql` 파일의 내용을 **전체 복사**
3. SQL Editor에 **붙여넣기**
4. **"Run"** 버튼 클릭 (또는 Ctrl+Enter)

또는 아래 SQL을 직접 복사:

```sql
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
```

**"Run"** 버튼 클릭하여 실행

---

## 4단계: 환경 변수 설정

### Vercel 대시보드에서

1. 프로젝트 → **Settings** → **Environment Variables**
2. 다음 환경 변수 추가:

**Name**: `NEXT_PUBLIC_SUPABASE_URL  
**Value**: `https://xxxxx.supabase.co` (Supabase Project URL)  
**Environment**: Production, Preview, Development 모두 선택

**Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (anon public key)  
**Environment**: Production, Preview, Development 모두 선택

**Name**: `SUPABASE_SERVICE_ROLE_KEY`  
**Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (service_role key)  
**Environment**: Production, Preview, Development 모두 선택  
⚠️ **주의**: 이 키는 서버 사이드에서만 사용됩니다!

---

## 5단계: 패키지 설치

터미널에서:
```bash
npm install @supabase/supabase-js
```

---

## 6단계: 코드 수정

`lib/db.ts` 파일을 Supabase 버전으로 교체합니다.

---

## 7단계: GitHub에 푸시 및 재배포

```bash
git add .
git commit -m "Migrate to Supabase database"
git push origin main
```

---

## ✅ 완료 확인

1. **Supabase 대시보드** → **Table Editor**에서 테이블 확인
2. **관리자 페이지** 로그인 테스트
3. **문의 폼** 제출 테스트
