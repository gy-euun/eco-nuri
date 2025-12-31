# ⚡ 지금 바로 배포하기

## 🚀 Vercel CLI로 배포 (가장 빠름)

### 1단계: Vercel 로그인
터미널에서 실행:
```bash
vercel login
```
브라우저가 열리면 GitHub 계정으로 로그인하세요.

### 2단계: 환경 변수 생성
아래 명령어로 JWT_SECRET 생성:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
생성된 문자열을 복사해두세요.

### 3단계: 배포 시작
```bash
vercel
```

질문에 답변:
- **Set up and deploy?** → `Y` 입력
- **Which scope?** → 본인 계정 선택
- **Link to existing project?** → `N` 입력 (처음 배포)
- **What's your project's name?** → `econuri00` 입력 (또는 Enter)
- **In which directory is your code located?** → `./` 입력 (Enter)

### 4단계: 환경 변수 추가
```bash
vercel env add JWT_SECRET production
```
위에서 생성한 랜덤 문자열을 붙여넣기

### 5단계: 프로덕션 배포
```bash
vercel --prod
```

완료! 배포 URL이 표시됩니다! 🎉

---

## 📝 배포 후 확인

1. **메인 페이지**: 배포된 URL 접속
2. **관리자 페이지**: `https://your-url.vercel.app/admin`
   - 아이디: `kosecorp`
   - 비밀번호: `admin123`

---

## ⚠️ 중요 참고사항

Vercel은 서버리스 환경이므로:
- **데이터 저장**: JSON 파일 기반 저장이 제한적일 수 있습니다
- **해결책**: 나중에 데이터베이스(MySQL, PostgreSQL 등)로 마이그레이션 권장

현재는 테스트용으로 작동하지만, 실제 운영 시에는 데이터베이스 사용을 권장합니다.
