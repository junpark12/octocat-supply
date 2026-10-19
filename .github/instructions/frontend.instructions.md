---
description: "React + Vite + Tailwind 스택의 프런트엔드 코드 변경을 편집하고 검토하기 위한 지침."
applyTo: "frontend/src/**, frontend/index.html, frontend/vite.config.ts, frontend/tailwind.config.js"
---
# 프런트엔드 검토 지침
React + Vite + Tailwind 스택의 UX 품질, 접근성, 성능 및 유지 관리성에 집중하세요.

## 핵심 원칙
- 접근성 우선: 시맨틱 HTML과 적절한 레이블을 사용하고 의미만으로 부족할 때만 ARIA를 사용하며 포커스 순서를 유지하세요.
- 상태 관리: 서버 캐시에는 React Query를 우선하고 로컬 UI 상태는 로컬에 유지하세요. Context는 필요한 만큼만 사용하여 prop drilling을 피하세요.
- 성능: 라우트/컴포넌트를 지연 로딩으로 분할하고 큰 번들 추가를 피하며 드물게 사용하는 뷰에는 dynamic import를 우선하세요.
- 스타일링: Tailwind 유틸리티 클래스를 우선하고 반복되는 클래스 그룹은 사용자 지정 CSS 대신 작은 컴포넌트나 `clsx` 헬퍼로 추상화하세요.
- 타입: `any`를 피하고 공통 DTO 타입으로 API 응답 타입을 지정하며 가능하면 제네릭으로 추론하세요.

## 검토 체크리스트
1. 데이터 가져오기는 임시 `useEffect` + `axios` 대신 React Query(staleTime, 오류 처리, 로딩 상태)를 사용하세요.
2. 컴포넌트는 작고 집중된 상태를 유지하세요(< 약 150 LOC). 관심사가 섞이면(데이터 + 복잡한 레이아웃 + 서식 지정) 분리를 제안하세요.
3. 반응형: 주요 뷰를 mobile(≤640px), md(약 768px), lg(≥1024px)에서 검증하세요.
4. 폼 입력: 키보드 접근, 눈에 보이는 포커스 링, 색상뿐 아니라 텍스트로 된 유효성 검사 피드백을 제공하세요.
5. 이미지: 최적화하고(올바른 크기, `alt` 텍스트) 레이아웃 이동을 피하세요(width/height 또는 aspect-ratio 설정).
6. 라우팅: `react-router-dom` v7 패턴(도입한 경우 data router)을 사용하고 중첩된 suspense waterfall을 피하세요.
7. 보안: 신뢰할 수 없는 HTML을 보간하지 말고 불가피하면 정제하세요.

## 테스트 지침
- 복잡한 로직(조건부 렌더링, 폼 유효성 검사, Custom Hook)에 React Testing Library 테스트를 권장하세요.
- Snapshot 테스트는 안정적인 표현용 컴포넌트에만 사용하세요.

## 성능 주의 사항
- 반복 렌더링이 집중되는 곳(큰 목록)은 항목 수가 약 200개를 넘으면 `memo` 또는 windowing(예: `react-window`)을 사용해야 합니다.
- 측정 가능한 영향이 있는 경우 큰 목록의 자식에서 익명 인라인 함수를 피하세요.

## 개선을 유도할 안티패턴
- 단순한 prop 전달에 Context를 과도하게 사용.
- 하나의 큰 컴포넌트에 데이터 가져오기와 표현용 마크업 혼합.
- Tailwind 유틸리티를 중복 구현한 사용자 지정 CSS 파일.

## 피드백 스타일 예시
"가격 서식 지정이 ProductCard와 OrderSummary에 중복되어 서로 달라질 위험이 있으므로 `formatCurrency()` 유틸리티로 추출하는 것을 고려하세요."
