# ✅ 프로젝트 점검 체크리스트

## 🔍 발견된 문제점 및 해결 방안

### 1. Prisma 관련 파일들 (해결 필요)

**문제:**
- `lib/db-prisma-backup.ts` - Prisma 사용
- `lib/db-postgres.ts` - Prisma 사용
- `lib/db-postgres-example.ts` - Prisma 사용
- `prisma/schema.prisma` - Prisma 스키마
- `package.json`에 `prisma` 패키지가 devDependencies에 있음

**해결 방안:**
- `tsconfig.json`에서 이미 제외했지만, 완전히 제거하는 것이 좋음
- 또는 `.gitignore`에 추가하여 배포 시 제외

### 2. 불필요한 패키지

**문제:**
- `prisma` - Supabase 사용하므로 불필요
- `tsx` - Prisma 스크립트용이었는데 스크립트 삭제됨

**해결 방안:**
- `package.json`에서 제거

### 3. 환경 변수 확인

**필수 환경 변수:**
- ✅ `JWT_SECRET` - 인증용
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Supabase 연결
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 공개 키
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Supabase 서비스 키

**확인 필요:**
- Vercel 대시보드에서 모든 환경 변수가 설정되어 있는지 확인

### 4. 데이터 폴더

**문제:**
- `data/` 폴더가 존재 (JSON 파일 기반 저장소)
- Supabase 사용하므로 불필요

**해결 방안:**
- `.gitignore`에 이미 추가되어 있음
- 로컬에서는 유지해도 되지만, 배포 시에는 사용되지 않음

### 5. 백업 파일들

**현재 상태:**
- `lib/db-json-backup.ts` - JSON 버전 백업
- `lib/db-prisma-backup.ts` - Prisma 버전 백업
- `lib/db-postgres.ts` - Prisma Postgres 버전
- `lib/db-postgres-example.ts` - 예시 파일
- `lib/db-supabase.ts` - Supabase 버전 (현재 사용 중)

**권장 사항:**
- 백업 파일들은 유지해도 되지만, 빌드에서 제외되어 있음
- 필요시 나중에 참고용으로 사용 가능

---

## ✅ 확인 완료 사항

1. ✅ `lib/db.ts` - Supabase 버전으로 정상 작동
2. ✅ API Routes - async/await 정상 사용
3. ✅ 타입 정의 - 정상
4. ✅ 환경 변수 사용 - 정상
5. ✅ 빌드 제외 설정 - `tsconfig.json`에 설정됨

---

## 🔧 권장 수정 사항

### 즉시 수정 (빌드 오류 방지)

1. **package.json에서 불필요한 패키지 제거**
   ```json
   // 제거: "prisma": "^7.2.0"
   // 제거: "tsx": "^4.21.0"
   ```

### 선택적 수정 (정리)

1. **Prisma 관련 파일 정리**
   - 백업 파일들은 유지해도 되지만, 필요 없으면 삭제 가능

2. **data 폴더 정리**
   - 이미 `.gitignore`에 포함되어 있음
   - 로컬에서만 사용되므로 문제 없음

---

## 🎯 최종 확인

### 빌드 전 확인
- [x] Prisma 관련 파일 빌드 제외 확인
- [x] 환경 변수 설정 확인 필요
- [ ] 불필요한 패키지 제거 (선택사항)

### 배포 후 확인
- [ ] 메인 페이지 정상 작동
- [ ] 문의 폼 제출 테스트
- [ ] 관리자 페이지 로그인 테스트
- [ ] Supabase 데이터 확인
