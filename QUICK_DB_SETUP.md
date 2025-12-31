# ⚡ 빠른 데이터베이스 설정 가이드

Vercel Postgres + Prisma는 SQL Editor 대신 Prisma Migrate를 사용합니다.

## 🚀 가장 빠른 방법

### 1단계: 환경 변수 가져오기

Vercel 대시보드에서:
1. **Storage** → **Prisma** → `econuri-db` 클릭
2. **Quickstart** 섹션에서 환경 변수 확인
3. `.env.local` 파일에 복사

또는 Vercel CLI 사용:
```bash
vercel env pull .env.local
```

### 2단계: 마이그레이션 실행

터미널에서:
```bash
# Prisma Client 생성
npm run db:generate

# 마이그레이션 실행 (테이블 생성)
npm run db:migrate
```

질문이 나오면:
- **"Enter a name for the new migration"**: `init` 입력
- **"Do you want to apply this migration?"**: `y` 입력

### 3단계: 관리자 계정 생성

```bash
# Prisma Studio 실행
npm run db:studio
```

브라우저에서 `http://localhost:5555` 접속:
1. `admin` 테이블 클릭
2. **"Add record"** 클릭
3. 다음 값 입력:
   - **id**: `admin-001`
   - **username**: `kosecorp`
   - **password**: `$2a$10$RefDgZ88MGhYhtofmB1kyOULuPJXJErNkup5.BphEk6qpiDzHajOi`
   - **created_at**: 현재 시간 (자동)
4. **"Save 1 change"** 클릭

또는 스크립트 사용:
```bash
npm run db:seed
```

---

## ✅ 완료 확인

1. **Prisma Studio에서 확인**
   - `admin` 테이블에 관리자 계정이 있는지 확인
   - `inquiries`, `stats` 테이블이 생성되었는지 확인

2. **배포된 사이트 테스트**
   - 관리자 페이지 로그인 테스트
   - 문의 폼 제출 테스트

---

## 🔧 문제 해결

### 마이그레이션 오류

```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 재설정 (주의: 데이터 삭제됨)
npx prisma migrate reset
```

### Prisma Client 오류

```bash
# Prisma Client 재생성
npm run db:generate
```

### 환경 변수 오류

- `.env.local` 파일이 있는지 확인
- Vercel 대시보드에서 환경 변수가 제대로 설정되었는지 확인
