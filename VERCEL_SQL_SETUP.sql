-- Vercel Postgres 데이터베이스 초기 설정 SQL
-- Vercel 대시보드 → Storage → Data → SQL Editor에서 실행하세요

-- 1. 테이블 생성 (Prisma가 자동으로 생성하지만, 수동으로도 가능)

-- 문의 내역 테이블
CREATE TABLE IF NOT EXISTS "inquiries" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "building_type" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "area" TEXT,
  "area_unit" TEXT NOT NULL DEFAULT 'pyeong',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 통계 테이블
CREATE TABLE IF NOT EXISTS "stats" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "total_inquiries" INTEGER NOT NULL DEFAULT 0,
  "total_calculations" INTEGER NOT NULL DEFAULT 0,
  "inquiries_by_building_type" JSONB,
  "inquiries_by_date" JSONB,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 테이블
CREATE TABLE IF NOT EXISTS "admin" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO "admin" ("id", "username", "password", "created_at")
VALUES (
  'admin-001',
  'kosecorp',
  '$2a$10$RefDgZ88MGhYhtofmB1kyOULuPJXJErNkup5.BphEk6qpiDzHajOi',
  NOW()
)
ON CONFLICT ("username") DO NOTHING;

-- 3. 초기 통계 생성
INSERT INTO "stats" ("id", "total_inquiries", "total_calculations", "inquiries_by_building_type", "inquiries_by_date", "updated_at")
VALUES (
  'stats-001',
  0,
  0,
  '{}'::jsonb,
  '{}'::jsonb,
  NOW()
)
ON CONFLICT ("id") DO NOTHING;
