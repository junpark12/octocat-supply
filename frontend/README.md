# React + TypeScript + Vite

## 제품 별점

제품 페이지의 각 카드에서 빨간색 별 버튼으로 1–5점을 선택하거나 변경할 수 있습니다.
각 버튼은 키보드의 Tab으로 이동하고 Enter 또는 Space로 선택할 수 있습니다.
개인 평점은 제품별로 현재 브라우저의 localStorage에 저장되어 검색·새로고침 후에도 유지됩니다.
서버에 제출되거나 다른 사용자와 공유되는 리뷰는 아니며, 브라우저 데이터를 지우면 삭제됩니다.
저장소를 사용할 수 없으면 임시 평점이라는 안내가 표시됩니다.

회귀 테스트: `tests/e2e/product-rating.spec.ts` (기존 Playwright E2E 설정 사용).

이 template은 HMR과 일부 ESLint 규칙을 사용하여 Vite에서 React를 실행하는 최소 설정을 제공합니다.

현재 두 가지 공식 plugin을 사용할 수 있습니다.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)는 Fast Refresh에 [Babel](https://babeljs.io/)을 사용합니다.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)는 Fast Refresh에 [SWC](https://swc.rs/)를 사용합니다.

<a id="expanding-the-eslint-configuration"></a>
## ESLint 설정 확장

production 애플리케이션을 개발한다면 type-aware lint 규칙을 활성화하도록 설정을 업데이트하는 것을 권장합니다.

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

React 전용 lint 규칙을 위해 [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)와 [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)도 설치할 수 있습니다.

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
