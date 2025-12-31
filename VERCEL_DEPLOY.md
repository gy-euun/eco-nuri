# 🚀 Vercel 배포 가이드

## 방법 1: Vercel CLI로 배포 (추천) ⭐

### 1단계: Vercel CLI 설치
```bash
npm install -g vercel
```

### 2단계: Vercel 로그인
```bash
vercel login
```
브라우저가 열리면 GitHub 계정으로 로그인

### 3단계: 프로젝트 배포
```bash
vercel
```

질문에 답변:
- **Set up and deploy?** → `Y`
- **Which scope?** → 본인 계정 선택
- **Link to existing project?** → `N` (처음 배포)
- **What's your project's name?** → `econuri00` (또는 원하는 이름)
- **In which directory is your code located?** → `./` (현재 디렉토리)

### 4단계: 환경 변수 설정
```bash
vercel env add JWT_SECRET
```
랜덤 문자열 입력 (또는 아래 명령어로 생성):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5단계: 프로덕션 배포
```bash
vercel --prod
```

완료! 배포 URL이 표시됩니다.

---

## 방법 2: GitHub + Vercel 웹사이트 (더 쉬움) 🌐

### 1단계: GitHub 저장소 생성
1. https://github.com 접속
2. "New repository" 클릭
3. 저장소 이름: `econuri00`
4. "Create repository" 클릭

### 2단계: 코드 업로드
```bash
# 원격 저장소 추가 (GitHub에서 제공하는 URL 사용)
git remote add origin https://github.com/your-username/econuri00.git

# 코드 푸시
git branch -M main
git push -u origin main
```

### 3단계: Vercel에 연결
1. https://vercel.com 접속
2. "Add New Project" 클릭
3. GitHub 저장소 선택 (`econuri00`)
4. "Import" 클릭

### 4단계: 환경 변수 설정
- "Environment Variables" 섹션 클릭
- Name: `JWT_SECRET`
- Value: 랜덤 문자열 (아래 명령어로 생성)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- "Add" 클릭

### 5단계: 배포
- "Deploy" 버튼 클릭
- 몇 분 후 배포 완료!

---

## 배포 후 확인 사항 ✅

1. **메인 페이지 확인**
   - 배포된 URL 접속
   - 정상 작동 확인

2. **관리자 페이지 확인**
   - `https://your-domain.vercel.app/admin` 접속
   - 로그인 테스트 (kosecorp / admin123)

3. **문의 폼 테스트**
   - 문의 제출 테스트
   - 관리자 페이지에서 확인

---

## 자동 배포 설정 🔄

GitHub에 연결하면:
- `main` 브랜치에 푸시할 때마다 자동 배포
- Pull Request 생성 시 프리뷰 배포

---

## 커스텀 도메인 연결 🌐

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 도메인 입력 (예: `econuri.co.kr`)
3. DNS 설정 안내 따르기
4. 완료!

---

## 문제 해결 🆘

### 빌드 오류
```bash
# 로컬에서 빌드 테스트
npm run build
```

### 환경 변수 오류
- Vercel 대시보드에서 환경 변수 확인
- `JWT_SECRET`이 설정되어 있는지 확인

### 데이터 저장 문제
- Vercel은 서버리스 환경이므로 파일 시스템 쓰기가 제한적일 수 있습니다
- 프로덕션에서는 데이터베이스 사용 권장
