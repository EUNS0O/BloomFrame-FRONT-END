# BloomFrame+ (프론트엔드 프로토타입)

## 로컬 실행
```bash
npm install
npm run dev
```
브라우저에서 http://localhost:5173 접속

## 빌드
```bash
npm run build
npm run preview   # 빌드 결과 미리보기
```

## 구조
```
src/
├── pages/        화면 단위 컴포넌트 (라우트와 1:1 매칭)
├── components/
│   ├── common/    Layout, BackHeader, Controls(Btn/Field/Card), BottomNav
│   └── widgets/   TimePicker, ImageGrid 등 재사용 위젯
├── context/       AppContext — 전역 상태(회원정보, 카테고리, 기기 목록 등)
├── api/           서버 통신 함수 (client.js가 fetch 기본 설정 담당)
├── constants/      CATEGORY_META 등 정적 데이터
├── styles/tokens.js 색상 팔레트
├── utils/format.js  nextId, fmtTime 등 헬퍼
├── App.jsx        라우터 정의 (react-router-dom)
└── main.jsx        진입점 (BrowserRouter + AppProvider로 감쌈)
```

새 화면을 추가하려면: `src/pages/`에 컴포넌트 만들고 → `src/App.jsx`의 `<Routes>`에 `<Route>` 한 줄 추가하면 끝.

서버 연동 시: `.env` 파일에 `VITE_API_URL=https://your-backend.com` 추가하고, `src/api/` 안의 함수들을 각 페이지에서 호출하도록 연결하면 됩니다 (지금은 mock 데이터로 동작).

## 배포
Vercel 또는 Netlify에 GitHub 저장소를 연결하면 자동으로
`npm install && npm run build`를 실행하고 `dist` 폴더를 배포합니다.
