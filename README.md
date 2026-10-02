# 여의도 파크골프 출석 — Vercel 버전

Google Sheets 없이 Vercel + Neon Postgres로 동작합니다.

## 배포
1. 이 폴더를 GitHub 저장소에 올립니다.
2. Vercel에서 `Add New → Project`로 GitHub 저장소를 연결합니다.
3. Vercel Marketplace의 Neon Postgres를 프로젝트에 연결합니다.
4. `DATABASE_URL` 환경변수가 연결되었는지 확인합니다.
5. Deploy.
6. 생성된 `*.vercel.app` 주소를 카카오톡 단체방에 공유합니다.
7. 휴대폰에서 홈 화면에 추가하면 아이콘처럼 사용할 수 있습니다.

앱은 첫 출석 저장 시 `attendance` 테이블을 자동 생성합니다.

## 데이터
12명의 이름은 코드에 고정되어 있습니다.
주말과 대한민국 공휴일은 날짜 API를 통해 향후 180일을 표시합니다.
출석 데이터는 Neon Postgres에 저장되므로 12명이 같은 데이터를 봅니다.
