# 에코누리 - 지붕 임대 수익 서비스

토스 스타일의 디자인 시스템을 적용한 Next.js 모바일 랜딩페이지 및 관리자 페이지 프로젝트입니다.

## 🎨 디자인 시스템

### 폰트
- **Pretendard**: 토스에서 사용하는 한글 최적화 폰트
- 모바일: 14px 기본 크기
- 데스크톱: 16px 기본 크기

### 컬러 팔레트
- **Primary Blue**: `var(--toss-blue-600)` (#4f46e5)
- **Gray Scale**: 50~900 단계별 그레이 스케일
- **White/Black**: 기본 색상

### 로고 및 아이콘
- 로고 크기: 32px × 32px
- 아이콘 크기: 24px × 24px (헤더), 32px × 32px (기능)
- 둥근 모서리: 12px ~ 16px

### 타이포그래피
- 제목: 28px (모바일) / 32px (데스크톱), font-weight: 700
- 부제목: 16px, font-weight: 400
- 본문: 14px ~ 16px, font-weight: 400
- 버튼: 18px, font-weight: 600

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
econuri00/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # 인증 API
│   │   ├── inquiries/         # 문의 API
│   │   └── stats/             # 통계 API
│   ├── admin/                 # 관리자 페이지
│   │   ├── page.tsx           # 로그인 페이지
│   │   └── dashboard/        # 대시보드
│   ├── layout.tsx             # 루트 레이아웃
│   ├── page.tsx               # 메인 페이지
│   └── globals.css            # 글로벌 스타일
├── components/
│   ├── DetailPage.tsx         # 상세 페이지 컴포넌트
│   ├── DetailPage.module.css  # 상세 페이지 스타일
│   └── AnimatedNumber.tsx     # 숫자 애니메이션 컴포넌트
├── lib/
│   ├── db.ts                  # 데이터베이스 유틸리티
│   └── auth.ts                # 인증 유틸리티
├── data/                      # JSON 데이터 파일 (자동 생성)
│   ├── inquiries.json         # 문의 내역
│   ├── stats.json             # 통계 데이터
│   └── admin.json             # 관리자 계정
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🎯 주요 기능

### 사용자 페이지
- ✅ 토스 스타일 디자인 시스템 적용
- ✅ 모바일 우선 반응형 디자인
- ✅ Pretendard 폰트 적용
- ✅ 부드러운 애니메이션 효과
- ✅ 접근성 고려한 UI/UX
- ✅ 수익 계산기
- ✅ ✅ 빠른 문의하기 폼
- ✅ 클레이모피즘 디자인 아이콘
- ✅ 고객 후기 슬라이더
- ✅ 시공 사례 섹션

### 관리자 페이지
- ✅ 관리자 로그인 시스템
- ✅ 문의 내역 관리 (조회, 수정, 삭제)
- ✅ 통계 대시보드
- ✅ 상태 관리 (대기, 연락 완료, 완료, 거절)
- ✅ 메모 기능

## 🔐 관리자 계정

기본 관리자 계정:
- **아이디**: `kosecorp`
- **비밀번호**: `admin123`

⚠️ **중요**: 운영 환경에서는 반드시 비밀번호를 변경하세요!

관리자 페이지 접속: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📊 데이터 저장

현재는 JSON 파일 기반으로 데이터를 저장합니다:
- `data/inquiries.json`: 문의 내역
- `data/stats.json`: 통계 데이터
- `data/admin.json`: 관리자 계정 정보

나중에 실제 데이터베이스(MySQL, PostgreSQL 등)로 마이그레이션할 수 있습니다.

## 🔧 API 엔드포인트

### 인증
- `POST /api/auth/login` - 관리자 로그인
- `POST /api/auth/logout` - 로그아웃

### 문의
- `POST /api/inquiries` - 문의 제출 (공개)
- `GET /api/inquiries` - 문의 목록 조회 (관리자)
- `GET /api/inquiries/[id]` - 문의 상세 조회 (관리자)
- `PATCH /api/inquiries/[id]` - 문의 수정 (관리자)
- `DELETE /api/inquiries/[id]` - 문의 삭제 (관리자)

### 통계
- `GET /api/stats` - 통계 조회 (관리자)
- `POST /api/stats` - 계산 통계 증가 (공개)

## 📱 모바일 최적화

- 뷰포트 메타 태그 설정
- 터치 친화적 버튼 크기 (최소 44px)
- 모바일에서 폰트 크기 자동 조정
- 스크롤 최적화

## 🔒 보안 고려사항

1. **JWT Secret**: 운영 환경에서는 `.env.local`에 `JWT_SECRET` 환경 변수를 설정하세요.
2. **비밀번호**: 기본 비밀번호를 반드시 변경하세요.
3. **HTTPS**: 운영 환경에서는 HTTPS를 사용하세요.
4. **데이터베이스**: 프로덕션에서는 실제 데이터베이스를 사용하세요.

## 🚀 배포

### Vercel 배포
```bash
vercel
```

### 환경 변수 설정
- `JWT_SECRET`: JWT 토큰 암호화 키 (랜덤 문자열)

## 📝 라이선스

이 프로젝트는 비공개 프로젝트입니다.
