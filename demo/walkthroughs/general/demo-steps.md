
## 목차

1. [데모 1: Copilot 기초](#데모-1-copilot-기초)
2. [데모 2: Copilot Agent Mode](#데모-2-copilot-agent-mode)
3. [선택 사항: Copilot CLI](#선택-사항-copilot-cli)

---

## 데모 1: Copilot 기초

### 초기 설정: VS Code Workspace

---

### 프로젝트 개요

**[프롬프트]** `[Ask Mode]`
```
코드베이스를 검토하고 사용된 관련 프로그래밍 언어와 테스트 케이스를 포함하여 프로젝트를 설명해 주세요.
```

---

### 설치 및 실행

**[실행]** VS Code에서 터미널을 열고 `make install` 명령으로 의존성을 설치합니다

> **Windows:** 해당 디렉터리(예: `/api` 또는 `/frontend`)로 이동하여 `npm install`을 실행합니다

**[선택 사항]** `make dev`로 frontend를 실행합니다

---

### Inline Chat Completion 데모

**[실행]** 다음 파일을 열고 열린 상태로 유지합니다.
- `api/src/models/order.ts`
- `api/src/repositories/ordersRepo.ts`
- `api/src/routes/order.ts`

**[실행]** `ordersRepo.ts` 파일의 기존 async 메서드 사이에 다음 인라인 주석을 추가합니다(맨 끝이나 맨 앞에 추가하지 마세요).
```typescript
// Count orders by branch
```

**[프롬프트]** `[Agent Mode]`
```
방금 추가한 countByBranch의 조회 endpoint를 추가해 주세요. 해당 API 문서도 업데이트해 주세요. 아직 배포하거나 테스트하지 마세요
```

---

### 검증

Agent가 구현을 완료하면 `make dev`로 애플리케이션을 실행하고 새 endpoint를 보여 줍니다

**열기:** http://localhost:3000/api-docs
- Orders 섹션을 찾습니다
- `GET /api/orders/branch/{branchId}/count`를 찾습니다

---

## 데모 2: Copilot Agent Mode

### 심층 코드베이스 분석

**[프롬프트]** `[Agent Mode]`
```
이 #codebase를 매우 깊이 분석해 주세요. 프로젝트에서 사용되는 모든 프로그래밍 언어의 모범 사례를 포함하도록 .github/copilot-instructions.md 파일을 업데이트해 주세요. #fetch https://www.w3schools.com/typescript/typescript_best_practices.php
```

---

### 선택 사항: 사용자 지정 페르소나

**[선택 사항 - 실행]** 원하는 페르소나를 선택합니다. 예: James Bond, Elon Musk, Neil Armstrong. 아래 이름을 선택한 이름으로 바꿉니다. Agent가 지침 파일의 컨텍스트를 거의 즉시 파악하여 모든 세션에 적용하는 방식을 보여 주는 것이 목적입니다

**[선택 사항 - Copilot 지침 파일에 추가]**
```
당신은 코드계의 Neil Armstrong입니다. Neil Armstrong처럼 말하고 설명에 우주 관련 문자를 사용해 주세요!
```

---

### 코드 검토 

**[프롬프트]** `[Agent Mode]`
```
코드를 검토하고 업데이트된 copilot-instructions 파일의 모범 사례를 따르는지 확인해 주세요
```

---

### 프롬프트 파일

**[프롬프트]** `[Agent Mode]`
```
/model-selection Frontend 애플리케이션에 간단한 장바구니 아이콘과 장바구니 페이지를 추가하고 싶습니다. 아직 구현하지 마세요.
```

---

### 애플리케이션 실행

**[애플리케이션 실행]** `make install` 명령으로 의존성을 설치합니다

> **Windows:** 해당 디렉터리(예: `/api` 또는 `/frontend`)로 이동하여 `npm install`을 실행합니다

**[선택 사항]** `make dev`를 실행하여 frontend를 확인합니다

---

### Agent 세션 데모

> **참고:** Cloud 및 background agent는 완료까지 몇 분이 걸립니다. 그동안 로컬 세션을 계속 진행하고 나중에 cloud 및 background 세션으로 돌아올 수 있습니다.

---

#### Cloud Agent 세션

**[프롬프트]** `[새 Cloud Agent 세션 생성]` 
```
제품 페이지의 각 제품에 별점 리뷰 옵션을 추가해 주세요. 별 버튼은 눈에 띄고 클릭하기 쉽게 만들어 주세요. 버튼 색상은 반드시 빨간색으로 해 주세요! 기능을 테스트하고 쉽게 검토할 수 있도록 PR에 별점 리뷰 기능의 스크린샷을 포함해 주세요.
```

---

#### Background Agent 세션

**[프롬프트]** `[Copilot CLI로 새 background agent 세션 생성]`
```
당신은 보안 엔지니어입니다. 코드를 심층 점검하여 CVE를 찾는 CVEFinder.prompt.md를 만들어 주세요. 또한 프롬프트는 다음 작업을 수행해야 합니다. 1) 취약점을 식별한 후 GiHub MCP 서버로 취약점별 Issue 생성 2) 수정을 위해 Issue를 copilot에 할당 3) 추가 지침 없이도 copilot coding agent에 할당하여 취약점을 수정할 수 있도록 Issue에 상세한 정보 포함.
```

---

### 사용자 지정 Agent 및 Subagent(Agent 오케스트레이션)

**참고:** 사용자 지정 agent를 호출하기 전에 Agent Debug Log Panel [설정](https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view#_agent-debug-log-panel)이 활성화되어 있는지 확인합니다. 이후 섹션에서 agent 로그를 검토합니다.

**[프롬프트]** `[accessibility-report 사용자 지정 agent 사용]`
```
접근성 보고서를 생성해 주세요
```

> **참고:** 로컬 agent가 장바구니 기능을 구현하면서 생성한 GitHub Issue를 살펴봅니다. Cloud agent와 background agent의 결과도 검토합니다

---

### Plan Mode 및 Issue 생성

---

#### 장바구니 구현 계획(Copilot Vision 사용)

**[프롬프트]** `[Plan Mode]` (Chat에 `/docs/design/cart.png` 이미지 첨부)
```
Navbar에 장바구니 아이콘이 있는 간단한 장바구니 페이지 구현 계획을 작성해 주세요. 제품을 장바구니에 추가하면 navbar에 장바구니 항목 수가 표시되어야 합니다. 지금은 할인 옵션을 포함하지 마세요. 구현 단계는 간단하고 최소한으로 유지해 주세요. 단위 테스트는 건너뛰세요.
```

> **참고:** Agent가 계획을 완료하면 검토한 후 Agent 모드를 선택하거나 "Start Implementation" 인계 옵션으로 agent에 넘깁니다.

---

#### GitHub Issue 통합

**[프롬프트]** `[Default Agent]`
```
구현 작업을 추적할 Issue를 저장소에 생성해 주세요. 체크리스트로 만들어 주세요.
```

**[프롬프트]** `[Default Agent]`
```
방금 생성한 Issue를 검토하고 장바구니 기능 구현의 예상 일정을 알려 주세요
```

**[프롬프트]** `[Default Agent]`
```
변경 사항을 구현해 주세요. 각 단계를 완료할 때마다 GitHub Issue에 진행 상황을 댓글로 남겨 주세요. 변경된 파일을 저장소에 commit하지 마세요.
```

---

### Agent Skills(api-endpoint skill)

**[프롬프트]**
```
주문 현황 파악과 추적을 개선할 API endpoint 추가 방안을 제안해 주세요
```

> **참고:** Agent의 제안에서 옵션 하나를 선택하여(order statistics를 대체) 구현합니다

**[프롬프트]**
```
주문 통계 endpoint를 구현해 주세요
```

Agentic skills로 구현한 새 API endpoint를 확인합니다

---

### Agent Hooks

이 시점에는 Hooks 정의로 여러 agent 세션 감사 로그가 이미 생성되어 있어야 합니다. 아래 단계를 따라 로그 파일로 이동합니다. 로그가 없다면 새 agent 세션을 시작하고 중단 없이 완료될 때까지 기다려 hook이 세션 시작 및 종료 감사 로그를 모두 생성하도록 할 수 있습니다.

**[작동 방식]**
- Hook은 `.github/hooks/hooks.json` 정의로 agent 동작을 사용자 지정할 수 있게 합니다
- `session-start-audit.sh` 스크립트는 agent 세션 시작 전 브랜치와 commit 기록을 추적할 기준 스냅샷을 만듭니다
- `session-stop-audit.sh` 스크립트는 agent가 수정/생성한 파일, 생성한 commit, 세션 시간을 추적합니다
- Hook은 `.agent-audit/{sessionID}` 디렉터리에 세션 시작 및 종료 로그를 저장합니다. 

---

### Agent 디버그 로그 / 흐름도

**참고:** 보고서 생성 세션의 agent 디버그 로그를 보려면 위의 사용자 지정 Agent 및 Subagent 섹션을 완료해야 합니다. 다른 세션의 agent 디버그 로그/흐름도는 여전히 볼 수 있습니다.

Agent Debug Log 패널은 agent 워크플로 문제 해결, 모델 선택 이해, Chat 세션 중 agent 상호 작용의 시간순 이벤트 로그 확인을 위한 강력한 도구입니다. 특히 사용자 지정 agent와 오케스트레이션된 subagent 워크플로를 디버깅할 때 유용합니다.

1) [여기](https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view#_agent-debug-log-panel)의 지침에 따라 Agent Debug Log Panel을 엽니다
2) 기본적으로 패널에는 [Tree View](https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view#_logs-view)가 표시됩니다. `Agent Debug Logs > Report Generation Request > Logs`의 트리 맨 위를 클릭하여 [Summary 보기](https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view#_summary-view)로 전환합니다
3) 사용자 지정 agent 및 subagent 호출이 표시된 해당 세션을 선택합니다
4) Agent Flow Chart를 선택하여 도구 호출, 모델 선택, 사용자 메시지, agent 응답이 표시된 subagent 워크플로를 확인합니다

---

## 선택 사항: Copilot CLI

### Space Invaders 게임 데모

**참고:** 독립 실행형 터미널이나 VS Code 터미널에서 Copilot CLI를 실행합니다. 프롬프트가 Azure MCP 서버로 게임을 Azure Web App에 배포하므로 프롬프트 실행 전에 Azure MCP 서버가 실행 중이어야 합니다.

**[프롬프트]**
```
반짝이는 별 객체가 "침략자"이고 대포가 로켓인 Space Invaders 스타일 미니 게임을 만들기 위한 requirement.md를 작성해 주세요. 임무는 별들을 쏘아 물리치고 한밤의 공세에서 살아남으며 각 웨이브를 완료할 때 축하 불꽃놀이를 터뜨리는 것입니다. 가볍지만 창의적으로 만들고 빠르게 배포해 주세요. 단일 Azure Web App으로 게시하여 브라우저에서 플레이할 수 있게 해 주세요. 해당 모델로 앱을 만들었다고 자랑스럽게 말할 수 있도록 앱 안에 모델 이름을 넣어 주세요.
```

> **참고:** 이 프롬프트는 게임 빌드와 배포 전에 requirements.md 파일을 생성하므로 입력에 주의를 기울이고 agent가 작업을 완료하는 데 필요한 도구를 허용하세요.

---
