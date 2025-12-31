# 🌐 Vercel 웹 대시보드에서 배포하기

## 방법 1: GitHub 저장소 연결 (추천) ⭐

### 1단계: GitHub에 코드 업로드

터미널에서 실행:
```bash
# GitHub 저장소가 없다면 먼저 생성하세요
# https://github.com/new 에서 저장소 생성

# 원격 저장소 추가
git remote add origin https://github.com/your-username/econuri00.git

# 코드 푸시
git branch -M main
git push -u origin main
```

### 2단계: Vercel에서 프로젝트 추가

1. Vercel 대시보드에서 **"Add New..."** 버튼 클릭
2. **"Project"** 선택
3. **"Import Git Repository"** 클릭
4. GitHub 저장소 선택 (`econuri00`)
5. **"Import"** 클릭

### 3단계: 프로젝트 설정

**프로젝트 설정 화면에서:**

1. **Project Name**: `econuri00` (또는 원하는 이름)
2. **Framework Preset**: Next.js (자동 감지됨)
3. **Root Directory**: `./` (기본값)
4. **Build Command**: `npm run build` (기본값)
5. **Output Directory**: `.next` (기본값)
6. **Install Command**: `npm install` (기본값)

### 4단계: 환경 변수 추가

**"Environment Variables"** 섹션에서:

1. **Name**: `JWT_SECRET`
2. **Value**: 아래 명령어로 생성한 값 입력
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   또는 이미 생성된 값: `7b05ac0bcca7745a73ba2b43f3ba8cfbb95d7390f1057ff31502b5ac75851be8`
3. **Environment**: `Production`, `Preview`, `Development` 모두 선택
4. **"Add"** 클릭

### 5단계: 배포

**"Deploy"** 버튼 클릭!

몇 분 후 배포가 완료됩니다. 🎉

---

## 방법 2: CLI로 빠르게 배포

터미널에서 실행:

```bash
# 1. 로그인 (이미 로그인되어 있다면 생략)
vercel login

# 2. 배포
vercel

# 질문에 답변:
# - Set up and deploy? → Y
# - Link to existing project? → N
# - Project name? → econuri00

# 3. 환경 변수 추가
vercel env add JWT_SECRET production
# 값 입력: 7b05ac0bcca7745a73ba2b43f3ba8cfbb95d7390f1057ff31502b5ac75851be8

# 4. 프로덕션 배포
vercel --prod
```

---

## 배포 후 확인 ✅

1. **배포 완료 후 URL 확인**
   - 예: `https://econuri00.vercel.app`

2. **메인 페이지 테스트**
   - 배포된 URL 접속
   - 정상 작동 확인

3. **관리자 페이지 테스트**
   - `https://econuri00.vercel.app/admin` 접속
   - 아이디: `kosecorp`
   - 비밀번호: `admin123`
   - 로그인 테스트

4. **문의 폼 테스트**
   - 문의 제출 테스트
   - 관리자 페이지에서 확인

---

## ⚠️ 중요 참고사항

### Vercel 서버리스 환경 제한사항

Vercel은 서버리스 환경이므로:

1. **파일 시스템 쓰기 제한**
   - JSON 파일 기반 저장이 제한적일 수 있습니다
   - 읽기는 가능하지만, 쓰기는 일시적일 수 있습니다

2. **해결 방법**
   - **개발/테스트**: 현재 구조로 작동 가능
   - **실제 운영**: 데이터베이스(MySQL, PostgreSQL, MongoDB 등) 사용 권장

### 데이터베이스 마이그레이션 (나중에)

실제 운영 시에는:
- Vercel Postgres (Vercel 제공)
- PlanetScale (MySQL)
- MongoDB Atlas
- Supabase

등의 데이터베이스로 마이그레이션 권장

---

## 🔄 자동 배포 설정

GitHub에 연결하면:
- `main` 브랜치에 푸시할 때마다 자동 배포
- Pull Request 생성 시 프리뷰 배포

---

## 🌐 커스텀 도메인 연결

1. Vercel 대시보드 → 프로젝트 선택
2. **"Settings"** → **"Domains"** 클릭
3. 도메인 입력 (예: `econuri.co.kr`)
4. DNS 설정 안내 따르기
5. 완료!

---

## 🆘 문제 해결

### 빌드 오류
- Vercel 대시보드 → Deployments → 실패한 배포 클릭
- 로그 확인

### 환경 변수 오류
- Settings → Environment Variables 확인
- `JWT_SECRET`이 모든 환경에 설정되어 있는지 확인

### 데이터 저장 문제
- 현재는 테스트용으로 작동
- 실제 운영 시 데이터베이스 사용 권장
