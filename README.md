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
- `src/App.jsx` : 전체 화면/상태 로직 (여기만 수정하면 됨)
- `src/main.jsx` : React 진입점
- `index.html` : HTML 엔트리

## 배포
Vercel 또는 Netlify에 GitHub 저장소를 연결하면 자동으로
`npm install && npm run build`를 실행하고 `dist` 폴더를 배포합니다.
