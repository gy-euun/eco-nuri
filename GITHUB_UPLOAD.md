# 📤 GitHub 업로드 가이드

## 방법 1: GitHub 웹사이트에서 저장소 생성 후 업로드

### 1단계: GitHub 저장소 생성

1. https://github.com 접속
2. 우측 상단 **"+"** 버튼 클릭 → **"New repository"** 선택
3. 저장소 정보 입력:
   - **Repository name**: `econuri00` (또는 원하는 이름)
   - **Description**: `에코누리 지붕 임대 수익 서비스`
   - **Visibility**: Public 또는 Private 선택
   - **Initialize this repository with**: 체크하지 않기 (이미 로컬에 코드가 있으므로)
4. **"Create repository"** 클릭

### 2단계: 저장소 URL 복사

생성된 저장소 페이지에서:
- **HTTPS** URL 복사 (예: `https://github.com/your-username/econuri00.git`)
- 또는 **SSH** URL 사용 가능

### 3단계: 로컬에서 원격 저장소 연결

터미널에서 실행:
```bash
# 원격 저장소 추가 (your-username을 본인 GitHub 사용자명으로 변경)
git remote add origin https://github.com/your-username/econuri00.git

# 또는 SSH 사용 시
git remote add origin git@github.com:your-username/econuri00.git
```

### 4단계: 코드 푸시

```bash
# 브랜치 이름을 main으로 변경
git branch -M main

# 코드 업로드
git push -u origin main
```

완료! 🎉

---

## 방법 2: GitHub CLI 사용 (더 빠름)

### 1단계: GitHub CLI 설치 (없는 경우)

```bash
# Windows (Chocolatey)
choco install gh

# 또는 공식 사이트에서 다운로드
# https://cli.github.com/
```

### 2단계: GitHub 로그인

```bash
gh auth login
```

### 3단계: 저장소 생성 및 푸시

```bash
# 저장소 생성 및 푸시 (한 번에!)
gh repo create econuri00 --public --source=. --remote=origin --push
```

완료! 🎉

---

## 🔍 현재 상태 확인

이미 Git이 초기화되어 있고 커밋도 되어 있는 상태입니다.

다음 명령어로 확인:
```bash
git log --oneline -5
```

---

## 📝 업로드 전 체크리스트

- [x] Git 저장소 초기화 완료
- [x] 초기 커밋 완료
- [ ] GitHub 저장소 생성
- [ ] 원격 저장소 연결
- [ ] 코드 푸시

---

## ⚠️ 주의사항

### .gitignore 확인

다음 파일들은 업로드되지 않습니다 (보안상 좋습니다):
- `node_modules/` - 의존성 패키지
- `.env*.local` - 환경 변수 파일
- `data/` - 데이터 파일 (로컬 데이터)
- `.next/` - 빌드 파일

### 민감한 정보

다음은 GitHub에 업로드하지 마세요:
- 실제 관리자 비밀번호
- API 키
- 데이터베이스 비밀번호

이런 정보는 환경 변수로 관리하세요.

---

## 🚀 다음 단계

GitHub에 업로드한 후:
1. Vercel에서 GitHub 저장소 연결
2. 자동 배포 설정
3. 환경 변수 설정

자세한 내용은 `VERCEL_WEB_DEPLOY.md` 참고!
