# React + TypeScript + Vite

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
