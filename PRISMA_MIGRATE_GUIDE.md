# 🔄 Prisma Migrate로 데이터베이스 설정하기

Vercel Postgres + Prisma는 SQL Editor 대신 Prisma Migrate를 사용합니다.

## 방법 1: Prisma Migrate 사용 (권장) ⭐

### 1단계: 로컬에서 환경 변수 설정

터미널에서 실행:

```bash
# Vercel CLI로 환경 변수 가져오기
vercel env pull .env.local
```

또는 수동으로 `.env.local` 파일 생성:

```env
POSTGRES_URL="your-postgres-url-from-vercel"
POSTGRES_PRISMA_URL="your-prisma-url-from-vercel"
POSTGRES_URL_NON_POOLING="your-non-pooling-url-from-vercel"
```

환경 변수는 Vercel 대시보드 → Storage → Prisma → Quickstart 섹션에서 확인할 수 있습니다.

### 2단계: Prisma Client 생성

```bash
npx prisma generate
```

### 3단계: 마이그레이션 실행

```bash
npx prisma migrate dev --name init
```

이 명령어는:
- `prisma/migrations` 폴더에 마이그레이션 파일 생성
- 데이터베이스에 테이블 생성
- Prisma Client 재생성

### 4단계: 관리자 계정 생성

마이그레이션 후 관리자 계정을 생성해야 합니다.

**방법 A: Prisma Studio 사용**

```bash
npx prisma studio
```

브라우저가 열리면:
1. `admin` 테이블 클릭
2. "Add record" 클릭
3. 다음 값 입력:
   - id: `admin-001`
   - username: `kosecorp`
   - password: `$2a$10$RefDgZ88MGhYhtofmB1kyOULuPJXJErNkup5.BphEk6qpiDzHajOi`
   - created_at: 현재 시간

**방법 B: Node.js 스크립트 사용**

`scripts/seed-admin.ts` 파일 생성 후 실행

---

## 방법 2: Vercel에서 직접 실행 (프로덕션)

### Vercel 대시보드에서

1. **Storage** → **Prisma** → 생성한 데이터베이스 클릭
2. **"Open in Prisma"** 버튼 클릭
3. Prisma Data Platform에서 SQL 실행 가능

또는

### Vercel CLI 사용

```bash
# 환경 변수 확인
vercel env ls

# 마이그레이션 실행 (프로덕션)
vercel env pull .env.local
npx prisma migrate deploy
```

---

## 방법 3: Prisma Studio로 데이터 관리

Prisma Studio는 데이터베이스를 시각적으로 관리할 수 있는 도구입니다.

```bash
npx prisma studio
```

브라우저에서 `http://localhost:5555` 접속하여:
- 테이블 확인
- 데이터 추가/수정/삭제
- 관리자 계정 생성

---

## 빠른 설정 스크립트

`scripts/setup-db.ts` 파일을 만들어서 한 번에 실행할 수도 있습니다.
