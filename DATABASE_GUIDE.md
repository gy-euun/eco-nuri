# 🗄️ 데이터베이스 사용 가이드

현재는 JSON 파일 기반으로 데이터를 저장하고 있지만, 실제 운영을 위해서는 데이터베이스를 사용하는 것이 좋습니다.

## 📊 데이터베이스 옵션 비교

### 1. Vercel Postgres (가장 추천) ⭐
- **장점**: Vercel과 완벽 통합, 무료 플랜 제공, 설정 간단
- **비용**: 무료 (512MB 저장공간)
- **타입**: PostgreSQL
- **추천 대상**: Vercel 사용자

### 2. Supabase
- **장점**: 무료 플랜 넉넉, 실시간 기능, 인증 기능 내장
- **비용**: 무료 (500MB 저장공간)
- **타입**: PostgreSQL
- **추천 대상**: 실시간 기능이 필요한 경우

### 3. PlanetScale
- **장점**: MySQL 호환, 무료 플랜, 브랜칭 기능
- **비용**: 무료 (5GB 저장공간)
- **타입**: MySQL
- **추천 대상**: MySQL을 선호하는 경우

### 4. MongoDB Atlas
- **장점**: NoSQL, 유연한 스키마, 무료 플랜
- **비용**: 무료 (512MB 저장공간)
- **타입**: MongoDB
- **추천 대상**: NoSQL을 선호하는 경우

---

## 🚀 방법 1: Vercel Postgres 사용 (가장 쉬움)

### 1단계: Vercel Postgres 생성

1. Vercel 대시보드 → 프로젝트 선택
2. **"Storage"** 탭 클릭
3. **"Create Database"** 클릭
4. **"Postgres"** 선택
5. 데이터베이스 이름 입력 (예: `econuri-db`)
6. **"Create"** 클릭

### 2단계: 연결 정보 확인

Vercel에서 자동으로 환경 변수가 생성됩니다:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### 3단계: 패키지 설치

```bash
npm install @vercel/postgres
# 또는 Prisma 사용 시
npm install prisma @prisma/client
npm install -D prisma
```

### 4단계: 데이터베이스 스키마 생성

`prisma/schema.prisma` 파일 생성:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}

model Inquiry {
  id           String   @id @default(cuid())
  name         String
  phone        String
  buildingType String
  address      String
  area         String?
  areaUnit     String   @default("pyeong")
  status       String   @default("pending")
  notes        String?
  createdAt    DateTime @default(now())
  
  @@map("inquiries")
}

model Stats {
  id                        String   @id @default(cuid())
  totalInquiries            Int      @default(0)
  totalCalculations         Int      @default(0)
  inquiriesByBuildingType  Json?
  inquiriesByDate          Json?
  updatedAt                 DateTime @default(now()) @updatedAt
  
  @@map("stats")
}
```

### 5단계: 마이그레이션 실행

```bash
# Prisma 초기화
npx prisma init

# 마이그레이션 생성
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

### 6단계: 코드 수정

`lib/db.ts` 파일을 데이터베이스 버전으로 교체 (아래 예시 참고)

---

## 🚀 방법 2: Supabase 사용

### 1단계: Supabase 프로젝트 생성

1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub로 로그인
4. "New Project" 클릭
5. 프로젝트 정보 입력
6. 데이터베이스 비밀번호 설정
7. "Create new project" 클릭

### 2단계: 테이블 생성

Supabase 대시보드 → SQL Editor에서 실행:

```sql
-- 문의 내역 테이블
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  building_type VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  area VARCHAR(50),
  area_unit VARCHAR(20) DEFAULT 'pyeong',
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 통계 테이블
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_inquiries INTEGER DEFAULT 0,
  total_calculations INTEGER DEFAULT 0,
  inquiries_by_building_type JSONB,
  inquiries_by_date JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 관리자 테이블
CREATE TABLE admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3단계: 연결 정보 확인

Supabase 대시보드 → Settings → API:
- Project URL
- anon public key
- service_role key

### 4단계: 패키지 설치

```bash
npm install @supabase/supabase-js
```

### 5단계: 환경 변수 설정

Vercel 대시보드 → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key (서버 사이드용)

### 6단계: 코드 수정

`lib/db-supabase.ts` 파일 생성 (아래 예시 참고)

---

## 🚀 방법 3: PlanetScale 사용 (MySQL)

### 1단계: PlanetScale 계정 생성

1. https://planetscale.com 접속
2. GitHub로 로그인
3. "Create database" 클릭
4. 데이터베이스 이름 입력 (예: `econuri`)
5. 리전 선택 (가장 가까운 곳)
6. "Create database" 클릭

### 2단계: 테이블 생성

PlanetScale 대시보드 → Branches → main → Schema에서:

```sql
CREATE TABLE inquiries (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  building_type VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  area VARCHAR(50),
  area_unit VARCHAR(20) DEFAULT 'pyeong',
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stats (
  id VARCHAR(255) PRIMARY KEY,
  total_inquiries INT DEFAULT 0,
  total_calculations INT DEFAULT 0,
  inquiries_by_building_type JSON,
  inquiries_by_date JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE admin (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3단계: 연결 정보 확인

PlanetScale 대시보드 → Connect:
- Host
- Username
- Password
- Database

### 4단계: 패키지 설치

```bash
npm install mysql2
```

### 5단계: 환경 변수 설정

Vercel 대시보드 → Environment Variables:
- `DATABASE_URL`: `mysql://username:password@host:port/database`

### 6단계: 코드 수정

`lib/db-mysql.ts` 파일 생성 (아래 예시 참고)

---

## 📝 코드 마이그레이션 예시

### Vercel Postgres + Prisma 예시

`lib/db-postgres.ts` 파일:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Inquiry {
  id: string
  name: string
  phone: string
  buildingType: string
  address: string
  area: string | null
  areaUnit: string
  createdAt: Date
  status: string
  notes: string | null
}

export const saveInquiry = async (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> => {
  const newInquiry = await prisma.inquiry.create({
    data: {
      name: inquiry.name,
      phone: inquiry.phone,
      buildingType: inquiry.buildingType,
      address: inquiry.address,
      area: inquiry.area,
      areaUnit: inquiry.areaUnit,
      status: 'pending'
    }
  })
  
  // 통계 업데이트
  await updateStats(inquiry.buildingType)
  
  return {
    id: newInquiry.id,
    name: newInquiry.name,
    phone: newInquiry.phone,
    buildingType: newInquiry.buildingType,
    address: newInquiry.address,
    area: newInquiry.area,
    areaUnit: newInquiry.areaUnit,
    createdAt: newInquiry.createdAt,
    status: newInquiry.status,
    notes: newInquiry.notes
  }
}

export const getInquiries = async (): Promise<Inquiry[]> => {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  return inquiries.map(inq => ({
    id: inq.id,
    name: inq.name,
    phone: inq.phone,
    buildingType: inq.buildingType,
    address: inq.address,
    area: inq.area,
    areaUnit: inq.areaUnit,
    createdAt: inq.createdAt,
    status: inq.status,
    notes: inq.notes
  }))
}

// ... 나머지 함수들도 유사하게 구현
```

### Supabase 예시

`lib/db-supabase.ts` 파일:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export const saveInquiry = async (inquiry: any) => {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([inquiry])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getInquiries = async () => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// ... 나머지 함수들
```

---

## 🔄 마이그레이션 순서

1. **데이터베이스 선택 및 생성**
2. **패키지 설치**
3. **테이블 생성**
4. **환경 변수 설정**
5. **코드 수정** (`lib/db.ts` 교체)
6. **API Routes 수정** (필요시)
7. **테스트**
8. **기존 데이터 마이그레이션** (있는 경우)

---

## 💡 추천

**Vercel 사용자라면**: Vercel Postgres가 가장 쉽고 통합이 좋습니다.

**무료 플랜이 중요하다면**: Supabase (500MB) 또는 PlanetScale (5GB)

**MySQL을 선호한다면**: PlanetScale

---

## 🆘 도움이 필요하신가요?

어떤 데이터베이스를 사용하실지 알려주시면, 해당 데이터베이스에 맞는 구체적인 코드를 작성해드리겠습니다!
