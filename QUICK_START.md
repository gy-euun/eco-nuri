# ⚡ 빠른 시작 가이드

## 지금 바로 시작하기

### 1. 개발 서버 실행
```bash
npm run dev
```
→ `http://localhost:3000` 접속

### 2. 관리자 페이지 접속
```
URL: http://localhost:3000/admin
아이디: kosecorp
비밀번호: admin123
```

### 3. 테스트
- [ ] 메인 페이지 정상 표시 확인
- [ ] 수익 계산기 작동 확인
- [ ] 문의 폼 제출 테스트
- [ ] 관리자 로그인 테스트
- [ ] 문의 내역 확인 테스트

---

## 🚀 실제 배포하기

### 가장 쉬운 방법: Vercel (5분)

1. **GitHub에 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/econuri00.git
   git push -u origin main
   ```

2. **Vercel 배포**
   - https://vercel.com 접속
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - 환경 변수 추가: `JWT_SECRET` (랜덤 문자열)
   - "Deploy" 클릭

3. **완료!** 
   - 자동으로 HTTPS 도메인 제공
   - 자동 배포 설정 완료

---

## 🔒 보안 설정 (필수!)

### 관리자 비밀번호 변경

1. **새 비밀번호 해시 생성**
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('새비밀번호', 10).then(hash => console.log(hash));"
   ```

2. **data/admin.json 수정**
   ```json
   {
     "username": "admin",
     "password": "생성된_해시값",
     "createdAt": "2024-01-01T00:00:00.000Z"
   }
   ```

### JWT Secret 설정

`.env.local` 파일 생성:
```env
JWT_SECRET=여기에_랜덤_문자열
```

랜덤 문자열 생성:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📱 모바일 테스트

개발자 도구에서 모바일 뷰로 확인:
- Chrome: F12 → 디바이스 모드 (Ctrl+Shift+M)
- Edge: F12 → 디바이스 모드

---

## ❓ 자주 묻는 질문

**Q: 데이터는 어디에 저장되나요?**
A: `data/` 폴더의 JSON 파일에 저장됩니다.

**Q: 나중에 실제 DB로 바꿀 수 있나요?**
A: 네! `lib/db.ts` 파일만 수정하면 됩니다.

**Q: 무료로 배포할 수 있나요?**
A: 네! Vercel 무료 플랜으로 충분합니다.

**Q: 도메인은 어떻게 연결하나요?**
A: Vercel 사용 시 대시보드에서 간단히 연결 가능합니다.

---

## 📚 더 자세한 가이드

자세한 배포 가이드는 `DEPLOYMENT_GUIDE.md` 파일을 참고하세요!
