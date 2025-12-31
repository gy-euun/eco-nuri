# 🔐 Supabase 환경 변수 설정 가이드

## Vercel에 환경 변수 추가하기

### 1단계: Supabase에서 API 키 확인

Supabase 대시보드에서:
1. **Settings** (왼쪽 사이드바) 클릭
2. **API** 섹션 클릭
3. 다음 정보 확인:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ 서버 사이드용)

### 2단계: Vercel에 환경 변수 추가

Vercel 대시보드에서:
1. 프로젝트 `eco-nuri-sy9g` 선택
2. **Settings** → **Environment Variables** 클릭
3. 다음 3개의 환경 변수를 추가:

#### 환경 변수 1:
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Supabase Project URL (예: `https://xxxxx.supabase.co`)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development 모두 선택
- **Add** 클릭

#### 환경 변수 2:
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Supabase anon public key
- **Environment**: ✅ Production, ✅ Preview, ✅ Development 모두 선택
- **Add** 클릭

#### 환경 변수 3:
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Supabase service_role key
- **Environment**: ✅ Production, ✅ Preview, ✅ Development 모두 선택
- ⚠️ **주의**: 이 키는 서버 사이드에서만 사용됩니다!
- **Add** 클릭

### 3단계: 재배포

환경 변수 추가 후:
1. **Deployments** 탭으로 이동
2. 최신 배포의 **"..."** 메뉴 클릭
3. **"Redeploy"** 선택
4. 재배포 완료 대기 (2-3분)

---

## ✅ 확인 사항

환경 변수 추가 후:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 추가됨
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가됨
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 추가됨
- [ ] 재배포 완료

---

## 🧪 테스트

재배포 완료 후:
1. **메인 페이지**: 정상 작동 확인
2. **문의 폼**: 제출 테스트
3. **관리자 페이지**: 로그인 테스트 (kosecorp / admin123)
4. **Supabase Table Editor**: 데이터 확인
