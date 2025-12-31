# 🗄️ Vercel Postgres 데이터베이스 설정 가이드

## 1단계: Vercel Postgres 생성

### Vercel 대시보드에서

1. **프로젝트 페이지 접속**
   - `eco-nuri-sy9g` 프로젝트로 이동

2. **Storage 탭 클릭**
   - 상단 네비게이션에서 **"Storage"** 클릭

3. **데이터베이스 생성**
   - **"Create Database"** 버튼 클릭
   - **"Postgres"** 선택
   - 데이터베이스 이름 입력 (예: `econuri-db`)
   - **"Create"** 클릭

4. **환경 변수 자동 생성 확인**
   - Vercel이 자동으로 다음 환경 변수를 생성합니다:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`

---

## 2단계: Prisma 설정

### 패키지 설치

터미널에서 실행:
```bash
npm install prisma @prisma/client
npm install -D prisma
```

### Prisma 초기화

```bash
npx prisma init
```

이 명령어는 `prisma/schema.prisma` 파일을 생성합니다.

---

## 3단계: Prisma 스키마 작성

`prisma/schema.prisma` 파일을 다음과 같이 수정:

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
  buildingType String   @map("building_type")
  address      String
  area         String?
  areaUnit     String   @default("pyeong") @map("area_unit")
  status       String   @default("pending")
  notes        String?
  createdAt    DateTime @default(now()) @map("created_at")
  
  @@map("inquiries")
}

model Stats {
  id                        String   @id @default(cuid())
  totalInquiries            Int      @default(0) @map("total_inquiries")
  totalCalculations         Int      @default(0) @map("total_calculations")
  inquiriesByBuildingType   Json?    @map("inquiries_by_building_type")
  inquiriesByDate            Json?    @map("inquiries_by_date")
  updatedAt                 DateTime @default(now()) @updatedAt @map("updated_at")
  
  @@map("stats")
}

model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now()) @map("created_at")
  
  @@map("admin")
}
```

---

## 4단계: 마이그레이션 실행

### 로컬에서 마이그레이션 (개발용)

```bash
# 마이그레이션 생성
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

### Vercel에서 마이그레이션 (프로덕션)

Vercel은 빌드 시 자동으로 마이그레이션을 실행하지 않으므로, 수동으로 실행해야 합니다.

**방법 1: Vercel 대시보드에서 실행**

1. Vercel 대시보드 → 프로젝트 → **"Storage"** → **"Data"** 탭
2. SQL Editor에서 직접 실행

**방법 2: Vercel CLI 사용**

```bash
# Vercel CLI로 환경 변수 가져오기
vercel env pull .env.local

# 마이그레이션 실행
npx prisma migrate deploy
```

**방법 3: 빌드 스크립트에 추가 (권장)**

`package.json`에 빌드 후 스크립트 추가:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

---

## 5단계: 코드 수정

### lib/db.ts 파일 교체

기존 `lib/db.ts` 파일을 데이터베이스 버전으로 교체합니다.

`lib/db-postgres.ts` 파일을 참고하여 작성하거나, 아래 코드를 사용하세요.

---

## 6단계: 초기 데이터 설정

### 관리자 계정 생성

마이그레이션 후 관리자 계정을 생성해야 합니다.

**방법 1: SQL로 직접 생성**

Vercel 대시보드 → Storage → Data → SQL Editor:

```sql
-- 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO admin (id, username, password, created_at)
VALUES (
  'admin-001',
  'kosecorp',
  '$2a$10$RefDgZ88MGhYhtofmB1kyOULuPJXJErNkup5.BphEk6qpiDzHajOi',
  NOW()
);
```

**방법 2: API로 생성**

나중에 관리자 등록 API를 만들 수도 있습니다.

---

## 7단계: GitHub에 푸시 및 재배포

```bash
git add .
git commit -m "Add Prisma and database setup"
git push origin main
```

Vercel이 자동으로 재배포합니다.

---

## 8단계: 테스트

1. **메인 페이지**: 정상 작동 확인
2. **문의 폼**: 제출 테스트
3. **관리자 페이지**: 로그인 테스트
4. **데이터 확인**: Vercel Storage → Data에서 확인

---

## 🔧 문제 해결

### Prisma Client 생성 오류

```bash
# Prisma Client 재생성
npx prisma generate
```

### 마이그레이션 오류

```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 재실행
npx prisma migrate deploy
```

### 연결 오류

- 환경 변수가 제대로 설정되었는지 확인
- Vercel 대시보드 → Settings → Environment Variables 확인

---

## 📝 다음 단계

데이터베이스 설정이 완료되면:
1. 기존 JSON 데이터 마이그레이션 (있는 경우)
2. 데이터베이스 백업 설정
3. 모니터링 설정
