# 📊 Google Sheets 자동 연동 설정 가이드

문의 데이터가 자동으로 Google Sheets에 추가되도록 설정하는 방법입니다.

## 1단계: Google Cloud Console 설정

### 1. 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단 프로젝트 선택 → **새 프로젝트** 클릭
3. 프로젝트 이름 입력 (예: `eco-nuri-sheets`)
4. **만들기** 클릭

### 2. Google Sheets API 활성화

1. 왼쪽 메뉴 → **API 및 서비스** → **라이브러리**
2. 검색창에 "Google Sheets API" 입력
3. **Google Sheets API** 선택
4. **사용 설정** 클릭

### 3. 서비스 계정 생성

1. 왼쪽 메뉴 → **API 및 서비스** → **사용자 인증 정보**
2. 상단 **+ 사용자 인증 정보 만들기** → **서비스 계정** 선택
3. 서비스 계정 정보 입력:
   - **서비스 계정 이름**: `eco-nuri-sheets` (또는 원하는 이름)
   - **서비스 계정 ID**: 자동 생성됨
   - **설명**: (선택사항) "에코누리 Google Sheets 연동"
4. **만들기** 클릭
5. 역할은 건너뛰고 **완료** 클릭

### 4. 서비스 계정 키 생성

1. 생성된 서비스 계정 클릭
2. **키** 탭 클릭
3. **키 추가** → **새 키 만들기** 선택
4. 키 유형: **JSON** 선택
5. **만들기** 클릭
6. JSON 파일이 자동으로 다운로드됩니다 (이 파일을 안전하게 보관하세요!)

## 2단계: Google Sheets 공유 설정

### 1. 스프레드시트 열기

[Google Sheets 링크](https://docs.google.com/spreadsheets/d/1ib2vyaMGRv1PSFD_nWxdGPOizZZPjpZx8SVyKbXBgsc/edit?usp=sharing) 열기

### 2. 서비스 계정 이메일 확인

다운로드한 JSON 파일을 열어서 `client_email` 값을 확인합니다.
예: `eco-nuri-sheets@your-project.iam.gserviceaccount.com`

### 3. 스프레드시트 공유

1. Google Sheets에서 **공유** 버튼 클릭
2. 서비스 계정 이메일 주소 입력
3. 권한: **편집자** 선택
4. **알림 보내기** 체크 해제 (선택사항)
5. **공유** 클릭

## 3단계: 환경 변수 설정

### Vercel에 환경 변수 추가

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables** 클릭
3. 다음 3개의 환경 변수를 추가:

#### 환경 변수 1: `GOOGLE_SHEET_ID`
- **Value**: 스프레드시트 URL에서 ID 추출
  - URL: `https://docs.google.com/spreadsheets/d/1ib2vyaMGRv1PSFD_nWxdGPOizZZPjpZx8SVyKbXBgsc/edit`
  - ID: `1ib2vyaMGRv1PSFD_nWxdGPOizZZPjpZx8SVyKbXBgsc`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development 모두 선택

#### 환경 변수 2: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value**: 다운로드한 JSON 파일의 `client_email` 값
- **Environment**: ✅ Production, ✅ Preview, ✅ Development 모두 선택

#### 환경 변수 3: `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- **Value**: 다운로드한 JSON 파일의 `private_key` 값 (전체 값 복사)
- ⚠️ **주의**: 
  - `-----BEGIN PRIVATE KEY-----` 부터 `-----END PRIVATE KEY-----` 까지 전체 복사
  - 줄바꿈 문자(`\n`)는 그대로 유지
  - Vercel에서는 자동으로 처리되지만, 로컬에서는 `\n`을 `\\n`으로 변환해야 할 수 있음
- **Environment**: ✅ Production, ✅ Preview, ✅ Development 모두 선택
- **민감함** 토글: ✅ ON (보안을 위해)

### 로컬 개발 환경 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
GOOGLE_SHEET_ID=1ib2vyaMGRv1PSFD_nWxdGPOizZZPjpZx8SVyKbXBgsc
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

⚠️ **중요**: 
- `.env.local` 파일은 절대 Git에 커밋하지 마세요!
- `.gitignore`에 이미 포함되어 있는지 확인하세요.

## 4단계: 재배포

환경 변수 추가 후:

1. Vercel 대시보드 → **Deployments** 탭
2. 최신 배포의 **"..."** 메뉴 클릭
3. **"Redeploy"** 선택
4. 재배포 완료 대기 (2-3분)

## ✅ 확인 사항

환경 변수 추가 후:
- [ ] `GOOGLE_SHEET_ID` 추가됨
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` 추가됨
- [ ] `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` 추가됨 (민감함 토글 ON)
- [ ] Google Sheets에 서비스 계정 이메일 공유됨 (편집자 권한)
- [ ] 재배포 완료

## 🧪 테스트

재배포 완료 후:

1. **메인 페이지**에서 문의 폼 제출
2. **Google Sheets**에서 데이터가 자동으로 추가되었는지 확인
3. 다음 정보가 올바르게 입력되었는지 확인:
   - 수집일시
   - 이름
   - 연락처
   - 건물주소
   - 건물유형
   - 지붕면적(평)
   - 예상수익금

## 🔧 문제 해결

### 데이터가 추가되지 않는 경우

1. **환경 변수 확인**
   - Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
   - 특히 `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`의 줄바꿈 문자 확인

2. **서비스 계정 권한 확인**
   - Google Sheets에서 서비스 계정 이메일이 편집자 권한으로 공유되었는지 확인

3. **시트 이름 확인**
   - 코드에서 기본값은 `시트1`입니다
   - Google Sheets의 시트 이름이 다르면 `lib/google-sheets.ts`의 `range` 값을 수정하세요

4. **로그 확인**
   - Vercel 대시보드 → **Logs** 탭에서 오류 메시지 확인
   - Google Sheets 관련 오류는 콘솔에 기록됩니다

### 시트 이름 변경

Google Sheets의 시트 이름이 `시트1`이 아닌 경우:

`lib/google-sheets.ts` 파일에서 다음 부분을 수정:

```typescript
range: '시트1!A:G', // 여기를 실제 시트 이름으로 변경
```

예: `range: 'Sheet1!A:G'` 또는 `range: '데이터!A:G'`

## 📝 참고사항

- Google Sheets 추가는 비동기로 처리되며, 실패해도 문의 저장은 정상적으로 완료됩니다
- Google Sheets 환경 변수가 설정되지 않은 경우, 경고만 출력하고 계속 진행됩니다
- 면적이 없거나 0인 경우, 지붕면적과 예상수익금은 빈 값으로 추가됩니다
