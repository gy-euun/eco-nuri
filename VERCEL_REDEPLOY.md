# 🔄 Vercel 재배포 가이드

## 방법 1: Vercel 대시보드에서 재배포 (가장 쉬움) ⭐

### 단계별 가이드

1. **Vercel 대시보드 접속**
   - 프로젝트 페이지로 이동: `eco-nuri-sy9g`

2. **Deployments 탭 클릭**
   - 상단 네비게이션에서 "Deployments" 클릭

3. **재배포 실행**
   - 최신 배포 항목의 오른쪽에 있는 **"..." (점 3개)** 메뉴 클릭
   - **"Redeploy"** 선택
   - 확인 메시지에서 **"Redeploy"** 클릭

또는

4. **Production Deployment 섹션에서**
   - "Production Deployment" 섹션에서
   - **"Redeploy"** 버튼 클릭 (있는 경우)

---

## 방법 2: GitHub에 푸시하여 자동 재배포

### 단계별 가이드

1. **로컬에서 변경사항 커밋**
   ```bash
   git add .
   git commit -m "Update: 재배포"
   ```

2. **GitHub에 푸시**
   ```bash
   git push origin main
   ```

3. **자동 배포**
   - Vercel이 자동으로 감지하여 재배포 시작
   - 대시보드에서 배포 진행 상황 확인 가능

---

## 방법 3: Vercel CLI로 재배포

### 단계별 가이드

1. **터미널에서 실행**
   ```bash
   vercel --prod
   ```

2. **프로젝트 선택**
   - 기존 프로젝트가 있으면 자동으로 연결
   - 없으면 프로젝트 선택

---

## ⚡ 가장 빠른 방법

**환경 변수 추가 후 재배포:**

1. **Settings → Environment Variables**에서 환경 변수 추가
2. **Deployments 탭**으로 이동
3. 최신 배포의 **"..." 메뉴** → **"Redeploy"** 클릭

또는

**GitHub에 빈 커밋 푸시:**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## 🔍 재배포 확인

재배포 후:
1. **Deployments 탭**에서 배포 상태 확인
2. **"Ready"** 상태가 되면 완료
3. 배포된 URL 접속하여 테스트

---

## 💡 팁

- 환경 변수를 추가/수정한 후에는 반드시 재배포해야 적용됩니다
- 재배포는 보통 1-3분 정도 소요됩니다
- 재배포 중에는 이전 버전이 계속 서비스됩니다 (무중단 배포)
