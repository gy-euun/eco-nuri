# 카카오맵 API 설정 가이드

제안서 폼에서 주소 검색 및 항공뷰 지도 기능을 사용하기 위해 카카오맵 API 키가 필요합니다.

## 1. 카카오맵 API 키 발급

1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 접속
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 앱 이름 입력 후 저장
4. 앱 키 > JavaScript 키 복사

## 2. 환경 변수 설정

### 로컬 개발 환경

`.env.local` 파일을 생성하고 다음 내용을 추가:

```
NEXT_PUBLIC_KAKAO_MAP_API_KEY=여기에_JavaScript_키_입력
```

### Vercel 배포 환경

1. Vercel 대시보드 > 프로젝트 선택
2. Settings > Environment Variables
3. 다음 환경 변수 추가:
   - **Key**: `NEXT_PUBLIC_KAKAO_MAP_API_KEY`
   - **Value**: 카카오맵 JavaScript 키
   - **Environment**: Production, Preview, Development 모두 선택

## 3. 카카오맵 플랫폼 설정

카카오 개발자 콘솔에서:

1. 앱 설정 > 플랫폼
2. Web 플랫폼 등록
   - 사이트 도메인: `http://localhost:3000` (개발)
   - 사이트 도메인: `https://your-domain.vercel.app` (프로덕션)

## 4. API 사용량 확인

- 카카오맵 API는 무료로 제공되지만 일일 사용량 제한이 있습니다
- 개발자 콘솔에서 사용량을 확인할 수 있습니다

## 5. 기능 확인

환경 변수 설정 후 다음 기능이 작동합니다:

- ✅ 주소 검색 (카카오 주소 검색 API)
- ✅ 항공뷰 지도 표시 (HYBRID 타입)
- ✅ 주소 선택 시 지도 이동 및 마커 표시
- ✅ 좌표 정보 저장

## 문제 해결

### 지도가 표시되지 않는 경우

1. 환경 변수가 올바르게 설정되었는지 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. 카카오 개발자 콘솔에서 플랫폼 도메인이 등록되었는지 확인

### API 키 오류

- JavaScript 키를 사용해야 합니다 (REST API 키가 아님)
- `NEXT_PUBLIC_` 접두사가 붙어야 클라이언트에서 사용 가능합니다
