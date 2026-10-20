---
name: frontend-testing
description: Playwright MCP로 OctoCAT Supply Chain 애플리케이션의 프런트엔드 기능을 검증합니다. 내비게이션, 상품 카탈로그, 장바구니, 로그인, 관리자 패널, 다크 모드, 접근성 또는 반응형 레이아웃 등 UI 기능의 테스트, 검증 또는 QA를 요청받으면 이 스킬을 사용하세요.
---
# Playwright MCP를 사용한 프런트엔드 테스트

이 스킬은 Playwright MCP server를 사용한 OctoCAT Supply Chain React 애플리케이션의 에이전트 기반 테스트를 안내합니다. 페이지 이동, 컴포넌트 상호작용, 시각적 상태 검증, 결함 이슈 등록을 다룹니다.

## 이 스킬을 사용할 때

- 구현 후 프런트엔드 기능 테스트 또는 검증
- 사용자가 프런트엔드 개선 사항이나 버그 수정 검증 요청
- 기존 페이지(products, cart, login, admin)의 탐색적 QA 실행
- 다크 모드 / 라이트 모드 테마 검증
- 접근성 확인(키보드 탐색, ARIA, 포커스 관리)
- 다양한 viewport 크기에서 반응형 레이아웃 검증
- 장바구니 작업 확인(추가, 수량 변경, 제거, 빈 상태)
- 인증 흐름 검증(로그인, 관리자 역할 접근 제한, 로그아웃)

## 테스트 대상 애플리케이션 — 빠른 참고

| 라우트 | 컴포넌트 | 주요 동작 |
|-------|-----------|---------------|
| `/` | `Welcome` | Hero 섹션, 행동 유도 링크 |
| `/products` | `Products` | 상품 그리드, 검색 필터, 장바구니 추가 |
| `/cart` | `Cart` | 상품 항목, 수량 +/−, 제거, 소계, 빈 상태 |
| `/login` | `Login` | 이메일 + 비밀번호 폼, 오류 표시, 성공 시 리디렉션 |
| `/about` | `About` | 정적 콘텐츠 페이지 |
| `/admin/products` | `AdminProducts` | 관리자 역할 필요; CRUD 테이블, 정렬, 추가/편집 폼 |

**인증 규칙:** 어떤 이메일 + 비밀번호로도 로그인됩니다. `@github.com`으로 끝나는 이메일에는 관리자 역할이 부여됩니다.

**테마:** 내비게이션 바의 다크 모드 토글. 클래스 기반(`darkMode` Context)입니다.

## 워크플로

모든 테스트 세션에서 다음 단계를 순서대로 따르세요.

### 1단계 — 범위 식별

테스트할 기능이나 페이지를 결정하세요. 세션 범위를 현재 작업으로 제한하고 관련 없는 기능은 테스트하지 마세요.

맥락을 수집하세요.
- 어떤 컴포넌트나 라우트가 변경되었나요?
- `frontend/tests/features/`에 해당 기능의 기존 Gherkin 명세가 있나요? 있다면 테스트 계획으로 사용하세요.
- 접근성 또는 반응형 요구 사항이 있나요?

### 2단계 — 실행 및 이동

모든 브라우저 상호작용에 Playwright MCP server를 사용하세요. 터미널 명령(`npx playwright`, 스크립트 등)은 사용하지 마세요.

모든 Playwright MCP 테스트에서 브라우저로 **항상 Microsoft Edge를 사용하세요**. Playwright 설정(`frontend/playwright.config.ts`)에는 `edge` 프로젝트(`--headless=new`를 사용하는 `Desktop Edge`)가 포함되어 있습니다. Chromium은 사용하지 마세요.

1. **Microsoft Edge**에서 애플리케이션을 여세요.
2. 페이지 로드 후 snapshot을 캡처하여 앱 실행을 확인하세요.
3. 링크 클릭 또는 직접 URL로 테스트할 페이지에 이동하세요.

### 3단계 — 테스트 시나리오 실행

아래에서 테스트 대상 기능과 관련된 시나리오를 실행하세요. 각 시나리오마다:

1. **Arrange(준비)** — 올바른 페이지로 이동하고 사전 조건을 설정하세요(예: 로그인, 장바구니에 상품 추가).
2. **Act(실행)** — 사용자 상호작용을 수행하세요(클릭, 입력, 토글).
3. **Assert(검증)** — snapshot을 캡처하고 예상 DOM 상태를 검증하세요(텍스트 내용, 표시 여부, 요소 수, URL).

#### 3a — 내비게이션 및 라우팅

| # | 시나리오 | 단계 | 예상 결과 |
|---|----------|-------|----------|
| 1 | Home → Products | 내비게이션의 "Products" 클릭 | URL에 `/products` 포함; "Products" 제목 표시 |
| 2 | Home → About | 내비게이션의 "About us" 클릭 | URL에 `/about` 포함; About 콘텐츠 표시 |
| 3 | Home → Cart | 내비게이션의 장바구니 아이콘 클릭 | URL에 `/cart` 포함; 빈 장바구니 상태 표시 |
| 4 | Home → Login | 내비게이션의 "Login" 클릭 | URL에 `/login` 포함; 로그인 폼 표시 |
| 5 | 로고 클릭으로 홈 복귀 | 아무 페이지에서 OctoCAT Supply 로고 클릭 | URL이 `/` |

#### 3b — 상품 카탈로그

| # | 시나리오 | 단계 | 예상 결과 |
|---|----------|-------|----------|
| 1 | 상품 로드 | `/products`로 이동 | 여러 상품 카드가 있는 상품 그리드 렌더링 |
| 2 | 검색 — 일치 | 검색 입력에 "SmartFeeder" 입력 | "SmartFeeder One" 카드 표시; 무관한 상품 숨김 |
| 3 | 검색 — 일치 없음 | 검색 입력에 "Space Tuna" 입력 | 필터 조정 안내와 함께 "No products found" 빈 상태 표시 |
| 4 | 검색 — 지우기 | 검색어 입력 후 입력 내용 지우기 | 전체 상품 그리드 복원 |
| 5 | 장바구니 추가 | 상품 카드의 "Add to Cart" 클릭 | 장바구니 아이콘 배지 수 증가 |

#### 3c — 장바구니

| # | 시나리오 | 단계 | 예상 결과 |
|---|----------|-------|----------|
| 1 | 빈 장바구니 | 상품 없이 `/cart`로 이동 | "Your cart is empty" 메시지 및 "Browse Products" 링크 |
| 2 | 상품이 있는 장바구니 | 상품 추가 후 `/cart`로 이동 | 이름, 가격, 수량이 있는 상품 항목 표시; 올바른 소계 |
| 3 | 수량 증가 | 상품 항목의 "+" 버튼 클릭 | 수량 증가; 소계 업데이트 |
| 4 | 수량 감소 | "−" 버튼 클릭(수량 > 1) | 수량 감소; 소계 업데이트 |
| 5 | 상품 제거 | 상품 항목의 제거/휴지통 아이콘 클릭 | 상품 사라짐; 소계 업데이트 또는 빈 상태 표시 |

#### 3d — 인증 및 관리자

| # | 시나리오 | 단계 | 예상 결과 |
|---|----------|-------|----------|
| 1 | 로그인 성공 | 이메일 + 비밀번호 입력 후 제출 | `/`로 리디렉션; 내비게이션에 로그아웃 옵션 표시 |
| 2 | 관리자 접근 | `admin@github.com`으로 로그인 | 내비게이션에 "Admin" 드롭다운 표시 |
| 3 | 관리자 상품 페이지 | 관리자로 로그인하고 `/admin/products`로 이동 | 정렬 헤더가 있는 상품 테이블과 Add 버튼 표시 |
| 4 | 비관리자 접근 제한 | 관리자 로그인 없이 `/admin/products`로 이동 | 다른 곳으로 리디렉션(관리자 콘텐츠 미표시) |
| 5 | 로그아웃 | "Logout" 버튼 클릭 | Login 링크 다시 표시; 관리자 메뉴 숨김 |

#### 3e — 다크 모드 및 테마

| # | 시나리오 | 단계 | 예상 결과 |
|---|----------|-------|----------|
| 1 | 다크 모드 전환 | 내비게이션의 테마 토글 클릭 | 배경이 어두운 팔레트로 전환; 텍스트가 밝게 표시 |
| 2 | 라이트 모드 전환 | 테마 토글 다시 클릭 | 배경이 밝은 팔레트로 복귀 |
| 3 | 페이지 간 유지 | 다크 모드를 켜고 다른 페이지로 이동 | 다크 모드 유지 |

#### 3f — 접근성

| # | 시나리오 | 단계 | 예상 결과 |
|---|----------|-------|----------|
| 1 | 키보드 탐색 | Tab으로 내비게이션 링크 이동 | 각 링크에 순서대로 눈에 보이는 포커스 링 표시 |
| 2 | 검색 입력 레이블 | 상품 검색 입력 검사 | `aria-label="Search products"` 존재 |
| 3 | 장바구니 링크 레이블 | 장바구니 내비게이션 링크 검사 | `aria-label="Shopping cart"` 존재 |
| 4 | 시맨틱 제목 | 각 페이지 확인 | 페이지 제목에 적절한 `<h1>` 존재 |
| 5 | 이미지 대체 텍스트 | 상품 이미지 검사 | 모든 `<img>` 태그에 의미 있는 `alt` 속성 |

#### 3g — 반응형 레이아웃

| # | 시나리오 | 단계 | 예상 결과 |
|---|----------|-------|----------|
| 1 | Desktop(1280×720) | viewport를 1280×720으로 변경 | 전체 내비게이션 바 표시; 다중 열 상품 그리드 |
| 2 | Tablet(768×1024) | viewport를 768×1024로 변경 | 레이아웃 조정; 내비게이션이 접힐 수 있음 |
| 3 | Mobile(375×667) | viewport를 375×667로 변경 | 단일 열 레이아웃; 햄버거 메뉴 또는 세로 내비게이션 |



### 4단계 — 증거 캡처

모든 테스트 시나리오에 대해:
- **통과**: 예상 상태를 확인하는 snapshot을 캡처하고 통과로 기록하세요.
- **실패**: 결함을 보여 주는 screenshot을 캡처하고 다음과 함께 실패로 기록하세요.
  - 재현 단계
  - 예상 결과와 실제 결과 비교
  - screenshot 참조

### 5단계 — 결함 이슈 등록

각 **실패한** 시나리오에 대해 GitHub CLI로 GitHub 이슈를 만드세요. 이슈 생성에 GitHub MCP server를 사용하지 마세요.

```bash
gh issue create \
  --title "🐛 [Frontend] <Short defect description>" \
  --label "bug,frontend,playwright" \
  --body "## Description
<What went wrong>

## Steps to Reproduce
1. Navigate to ...
2. Click ...
3. Observe ...

## Expected Result
<What should happen>

## Actual Result
<What actually happened>

## Evidence
<Paste screenshot or snapshot reference>

## Environment
- Browser: Microsoft Edge (Playwright)
- Viewport: <dimensions>
- Theme: <dark/light>

## Test Scenario Reference
Section: <3a–3g> | Scenario #: <number>"
```

### 6단계 — 요약 보고서 작성

모든 시나리오 실행 후 요약 이슈를 만드세요.

```bash
gh issue create \
  --title "📋 Playwright Test Report — <Feature/Page> — $(date +%Y-%m-%d)" \
  --label "test-report,frontend" \
  --body "## Test Summary

| Category | Passed | Failed | Skipped |
|----------|--------|--------|---------|
| Navigation & Routing | X | X | X |
| Product Catalog | X | X | X |
| Shopping Cart | X | X | X |
| Auth & Admin | X | X | X |
| Dark Mode | X | X | X |
| Accessibility | X | X | X |
| Responsive | X | X | X |

## Defects Filed
- #<issue_number> — <title>
- #<issue_number> — <title>

## Notes
<Any observations, flaky behaviors, or recommendations>"
```

## 규칙 및 보호 장치

1. **MCP 전용** — 모든 브라우저 자동화는 반드시 Playwright MCP server를 통해 수행하세요. 터미널 기반 Playwright 명령은 금지합니다.
2. **코드 변경 금지** — 테스트 중 애플리케이션 소스 코드를 수정하지 마세요. 테스트는 읽기 전용입니다.
3. **범위 제한 테스트** — 전체 회귀 테스트를 명시적으로 요청받지 않았다면 현재 작업과 관련된 기능이나 페이지만 테스트하세요.
4. **증거 기반** — 모든 검증은 snapshot 또는 screenshot으로 뒷받침해야 합니다. 시각적 증거 없이 통과/실패를 보고하지 마세요.
5. **결정적인 locator** — 취약한 CSS 클래스 선택자보다 `aria-label`, `role`, `data-testid` 또는 시맨틱 선택자(`<h1>`, `<nav>`, `<button>`)를 우선하세요.
6. **준비 상태 대기** — 검증 전에 항상 콘텐츠(예: 상품 그리드, API 응답)가 로드될 때까지 기다리세요. `expect(...).toBeVisible()`을 통해 Playwright의 내장 auto-waiting을 사용하세요.

## 기존 테스트 자산

| 자산 | 위치 | 목적 |
|-------|----------|---------|
| Gherkin feature | `frontend/tests/features/product-navigation.feature` | 상품 카탈로그 BDD 명세 |
| E2E 명세 | `frontend/tests/e2e/product-navigation.spec.ts` | Playwright 테스트 구현 |
| Playwright 설정 | `frontend/playwright.config.ts` | 브라우저/프로젝트/서버 설정 |

테스트 대상 페이지의 Gherkin feature가 있으면 기본 테스트 계획으로 사용하고 각 시나리오를 검증하세요.