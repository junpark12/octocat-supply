# IDE의 Copilot

> 참고: 가장 기본적인 "Copilot으로 무엇을 할 수 있나요?" 시나리오는 `demo-unit-test-coverage` 프롬프트를 사용하여 Agent Mode가 단위 테스트를 추가하도록 합니다.

## 일반 Copilot 기능

### 데모: 단위 테스트 및 커버리지 개선

#### 옵션 1: Coding Agent 사용

Copilot Coding Agent를 시연하려면 저장소에 있는 코드 커버리지 개선 Issue를 사용합니다. Issue #2일 것입니다(`Improve test coverage for API` - 데모 초기 생성 과정에서 생성됨). 이를 Copilot에 할당하면 끝입니다. 약 15분이 걸리므로 필요하면 미리 실행하세요!

> [!TIP]
> **타사 Agent 사용:** Copilot에 Issue를 할당할 때 **Web agents panel**을 열거나 VSCode의 **Agent Picker**로 기본 Copilot Coding Agent 대신 **Claude** 또는 **Codex** 같은 다른 agent를 선택할 수 있습니다. 이를 통해 코딩 작업에 다양한 agent를 활용할 수 있습니다.

#### 옵션 2: 라이브 코딩

- **보여 줄 내용:** Copilot이 여러 테스트를 생성하고 실행하며 커버리지를 분석하고 자체 복구하는 모습과 테스트 워크플로에서 사용자 지정 프롬프트를 효율적으로 사용하는 방법을 보여 줍니다.
- **이유:** Copilot이 빠르고 쉽게 테스트를 생성, 검증, 자체 복구하고 커버리지를 분석하는 능력을 보여 줍니다. 사용자 지정 프롬프트로 테스트 방식을 표준화하는 방법도 보여 줍니다.
- **접근 방식 1 - 사용자 지정 프롬프트(데모에 권장):**
  1. [demo-unit-test-coverage.prompt.md](../../.github/prompts/demo-unit-test-coverage.prompt.md) 파일을 엽니다
  2. Agent 모드 사전 구성, 포괄적인 도구 목록, 상세 테스트 요구 사항 등 프롬프트 구조를 보여 줍니다
  3. 구체적인 커버리지 요구 사항, CRUD 작업, 오류 처리 등을 포함하는 방식을 설명합니다
  4. "Run"을 클릭하여 자동 테스트 생성을 실행합니다
  5. Product와 Supplier route 모두에 대한 포괄적인 테스트 파일을 생성하는 모습을 보여 줍니다
  6. 테스트 실패 시 자체 복구 기능을 보여 줍니다

- **접근 방식 2 - 수동 Chat(심층 설명용):**
  1. Copilot에 `테스트를 실행하고 커버리지를 분석한 후 테스트되지 않은 시나리오를 포함하도록 누락된 Branch 테스트를 추가해 주세요`라고 요청합니다
  2. Agent가 테스트를 작업하고 API Branch route의 새 테스트를 추가하는 모습을 보여 줍니다
  3. Copilot의 "자체 복구"를 보여 줍니다(테스트 실패 시)
  4. 변경 사항을 수락합니다
  5. Copilot에 `Product route의 테스트를 추가해 주세요`라고 요청하여 새 테스트 생성을 보여 줍니다

- **핵심 요점**: 사용자 지정 프롬프트는 테스트 모범 사례를 담고 포괄적인 커버리지를 자동으로 보장할 수 있습니다.

### 데모: Vision과 Agent로 장바구니 기능 생성

> [!NOTE]
> **빠른 시작 옵션**: 자동 데모에는 `demo-cart-page.prompt.md` 사용자 지정 프롬프트를 사용합니다. 이 프롬프트는 적절한 컨텍스트와 도구가 사전 구성되어 있어 Agent Mode가 전체 장바구니 페이지 기능을 자동 구현합니다.

- **보여 줄 내용:** Agent Mode와 Vision의 "vibe coding"으로 복잡한 작업을 완료하고 사용자 지정 프롬프트의 효율성을 보여 줍니다.
- **이유:** Copilot Vision의 디자인 패턴 감지, Agent의 코드베이스 이해와 여러 파일에 걸친 복잡한 변경 생성, 사용자 지정 프롬프트의 복잡한 데모 간소화 방식을 보여 줍니다.

#### 접근 방식 1 - 사용자 지정 프롬프트(데모에 권장)

  1. [demo-cart-page.prompt.md](../../.github/prompts/demo-cart-page.prompt.md) 파일을 엽니다
  2. 포괄적인 도구 목록과 현재 상태에 대한 상세 컨텍스트 등 프롬프트 구조를 보여 줍니다
  3. 프롬프트에 [장바구니 이미지](../docs/design/cart.png)를 첨부합니다
  4. "Run"을 클릭하여 전체 장바구니 구현을 자동 실행합니다
  5. 사용자 지정 프롬프트가 적절한 컨텍스트로 전체 워크플로를 처리하는 방식을 보여 줍니다

#### 접근 방식 2 - 수동 Chat(심층 설명용)

  1. 앱을 실행하여 원래 코드를 보여 줍니다. 사이트가 시작되면 NavBar의 "Products"를 클릭하여 제품 페이지를 보여 줍니다. 장바구니에 항목을 추가합니다. "Added to Cart" 메시지 외에는 아무 일도 일어나지 않는 점에 주목합니다. 현재 frontend 앱에는 장바구니가 없다고 설명합니다.
  2. Copilot을 열고 "Plan" 모드로 전환합니다.
  3. 클립 아이콘이나 끌어서 놓기로 [장바구니 이미지](../docs/design/cart.png)를 Chat에 첨부합니다.
  4. 다음 프롬프트를 입력합니다.

    ```txt
    간단한 장바구니 페이지를 구현해야 합니다. NavBar에 장바구니 항목 수를 보여 주는 장바구니 아이콘도 필요합니다.
    ```

  5. Copilot이 변경 사항을 제안하고 추가/수정할 구성 요소를 계획했음을 강조합니다.
  6. (GitHub MCP Server가 구성된 경우 선택 사항): Copilot에 `장바구니 페이지와 장바구니 아이콘 구현을 위한 Issue를 저장소에 생성해 주세요`라고 요청합니다
  7. 저장소의 Issue를 보여 줍니다
  8. Copilot Chat에서 "Agent" 모드로 전환합니다. `Claude 3.5 Sonnet`(구현에 좋은 모델)으로 전환하고 다음 프롬프트를 입력합니다.

    ```txt
    변경 사항을 구현해 주세요.
    ```

  9. Copilot의 변경 사항과 각 변경을 확인하고 유지/거부하는 방법을 보여 줍니다.
  10. Copilot이 제안한 수정을 수락합니다.
  11. Frontend 앱으로 돌아가 Products로 이동합니다. 장바구니에 항목을 추가하는 모습을 보여 줍니다(아이콘 갱신에 주목). 장바구니 아이콘을 클릭하여 장바구니 페이지로 이동합니다. 합계와 장바구니 항목 추가/삭제를 보여 줍니다.

- **핵심 요점**: 사용자 지정 프롬프트는 일관성을 제공하며 여러 수동 단계가 필요한 복잡한 워크플로를 담을 수 있습니다.

## 사용자 지정

<a id="demo-custom-prompt-files-and-reusable-workflows"></a>
<a id="demo-custom-prompt-files-and-standardized-ai-workflows"></a>

### 데모: 사용자 지정 프롬프트 파일과 표준화된 AI 워크플로

- **보여 줄 내용:** 사용자 지정 프롬프트를 재사용하여 AI 네이티브 워크플로를 간소화하고 프롬프트 엔지니어링 모범 사례를 보여 줍니다
- **이유:** Copilot과 VSCode가 사용자 지정 프롬프트로 AI 네이티브 워크플로를 간소화하고 개발자의 작업 흐름을 유지하며 일관되고 반복 가능한 결과를 제공하는 방법을 보여 줍니다.
- **방법:**  
  1. **모델 선택 프롬프트**: Prompts 디렉터리의 [model-selection.prompt.md](../../.github/prompts/model-selection.prompt.md) 파일을 보여 줍니다. YAML frontmatter(mode: 'agent', description, tools)를 설명합니다. 위쪽 Run 버튼을 클릭하거나 Command Palette → "Prompts: Run Prompt"를 사용하여 Agent 모드 자동 선택, 최신 문서 가져오기, 최적 모델 선택 지원 또는 비교 Markdown 파일 업데이트를 보여 줍니다.
  2. **빠른 데모 프롬프트**: `.github/prompts/` 디렉터리의 데모 프롬프트를 보여 줍니다.
     - `demo-cart-page.prompt.md` - Vision을 활용한 전체 장바구니 구현
     - `demo-unit-test-coverage.prompt.md` - 자동 테스트 생성 및 커버리지 분석
  3. **사용자 지정 Chat Mode**: 아래에서 각각 설명하는 `Plan`, `ModelSelection`, `BDD` 모드를 보여 줍니다.
  4. **라이브 데모**: 데모 프롬프트 하나(예: `demo-unit-test-coverage.prompt.md`)를 실행하여 Agent 모드가 복잡한 워크플로를 자동으로 실행하는 모습을 보여 줍니다.
  5. **참고:** 사용자 지정 프롬프트가 일관성을 제공하고 인지 부하를 줄이며 표준화된 워크플로를 위해 팀 간에 공유할 수 있음을 설명합니다.

<a id="demo-custom-instructions-and-repository-configuration"></a>

### 데모: 사용자 지정 지침 및 저장소 구성

- **보여 줄 내용:** 기존 `.github/copilot-instructions.md` 구성을 사용하는 Copilot의 **사용자 지정 지침** 기능입니다.
- **이유:** 기반 모델에 없는 내부 라이브러리, 코딩 표준, 팀 관행에 맞게 Copilot을 사용자 지정하고 개인화할 수 있음을 보여 줍니다.
- **방법:**  
  1. 저장소의 기존 [.github/copilot-instructions.md](../../.github/copilot-instructions.md) 파일을 보여 줍니다
  2. 이 파일이 다음 컨텍스트를 제공하는 방식을 설명합니다.
     - 저장소 정보(owner, 저장소 이름)
     - 아키텍처 참조
     - 빌드 및 테스트 지침
  3. **향상된 사용자 지정 지침 데모**:
      1. 옵션 1: 사용자 지정 지침 파일을 업데이트하는 `Copilot: Custom Instructions` Patch Set[^1]을 적용합니다
      2. 옵션 2: 사용자 지정 지침 파일을 수동으로 업데이트하여 다음 지침을 추가합니다

          ```markdown
          ## REST API 추가 지침
          
          REST API에는 다음 지침을 사용하세요.
          
          * 의미가 명확한 이름 사용
          * 모든 API 메서드에 Swagger 문서 추가
          * [TAO](../docs/tao.md)를 사용하여 로깅 및 모니터링 구현
            - TAO가 설치되어 있다고 가정하고 패키지를 절대 추가하지 않음
          ```

  4. [TAO](./tao.md) 문서로 가상의 내부 라이브러리를 보여 줍니다
  5. Copilot에 `내부 표준에 따라 Supplier route에 observability를 추가해 주세요`라고 요청합니다
  6. Copilot이 사용자 지정 지침으로 TAO observability 패턴을 구현하는 모습을 보여 줍니다
  7. **참고**: TAO가 실제로 존재하지 않아 컴파일되지 않는다고 설명합니다. 사용자 지정 지침에서 내부 프레임워크를 참조하는 방식을 보여 주는 예제입니다
  8. **핵심 요점**: 사용자 지정 지침으로 팀 고유의 관행, 내부 라이브러리, 코딩 표준을 담을 수 있습니다

### 데모: Agent Skills로 타사 Web Interface Guidelines 준수 여부 검토

- **보여 줄 내용:** Web Interface Guidelines agent skill로 특정 웹 접근성 가이드라인에 따라 코드를 검토하는 Copilot의 능력입니다
- **이유:** 사용자 지정 지침의 개방형 표준인 타사 [agent skills](https://agentskills.io/home)를 활용하여 웹 접근성 표준 등의 모범 사례와 가이드라인을 적용하는 방법을 보여 줍니다
- **방법:**  
  1. 터미널에서 `npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a github-copilot` 명령을 실행하여 저장소에 Web Interface Guidelines skill을 추가합니다.
  2. `SKILL.md`를 열고 이 skill이 접근성, 타이포그래피 및 기타 웹 디자인 모범 사례에 대한 지침을 제공한다고 설명합니다. GitHub에서 최신 지침을 가져옵니다. 전체 지침은 [Web Interface Guidelines 문서](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)를 참조하세요
  3. Copilot에 `UI를 검토해 주세요`라고 요청합니다
  4. Copilot이 skill을 읽고 지침을 가져와 코드를 검토하는 모습을 보여 줍니다 
  5. 검토가 끝나면 발견 사항 일부를 공유하고 필요하면 Copilot에 문제 수정을 요청합니다
  6. **핵심 요점**: Copilot은 Copilot Chat 사용자 지정을 위한 타사 agent skills를 지원합니다 

## 보안

### 데모: Copilot과 애플리케이션 보안

- **보여 줄 내용:** 보안 취약점을 이해하고 수정하는 Copilot의 능력입니다
- **이유:** 개발자에게 보안 전문 지식을 직접 제공하여 AppSec를 확장하는 데 Copilot을 활용할 수 있음을 보여 줍니다.
- **방법:**  
  1. Copilot Chat을 열고 `Ask` 모드로 전환합니다.
  2. Copilot에 `@workspace를 분석하고 명백한 보안 취약점이 있는지 확인해 주세요`라고 요청합니다
  3. 다음과 같은 문제가 표시될 것입니다.
      - Cross-site Scripting(XSS) 취약점
      - Command Injection 취약점
      - 안전하지 않은 CORS 구성
      - 보안 헤더 누락
      - 안전하지 않은 인증 구현
  4. Copilot과 대화하여 문제 하나를 해결합니다. `...에 대한 수정안을 생성해 주세요`
  5. (GitHub MCP Server 사용 시 선택 사항): Copilot에 `...을 수정할 Issue를 생성해 주세요`라고 요청하고 Issue를 생성할 취약점을 선택합니다

## CI/CD

### 데모: GitHub Actions, Azure, Bicep으로 배포 자동화

- **보여 줄 내용:** Copilot이 Actions 워크플로와 Infrastructure-as-code를 생성하는 모습입니다.
- **이유:** Copilot의 CI/CD 워크플로 자동화 능력을 보여 줍니다.
- **방법:**
  1. [configure-deployment.sh](../infra/configure-deployment.sh) 스크립트를 실행하여 초기 인프라와 저장소의 환경 및 변수를 구성했는지 확인합니다.
  2. [deployment.md](../docs/deployment.md) 파일을 컨텍스트로 추가합니다.
  3. Copilot Agent에 `배포 계획에 따라 Bicep 파일과 워크플로를 생성해 주세요`라고 요청합니다
  4. 생성된 파일을 보여 줍니다.
     - 빌드 및 테스트를 위한 GitHub Actions YAML
     - 승인 단계를 포함하는 배포용 GitHub Actions YAML
  5. 변경 사항을 수락합니다
  6. Commit하고 push하여 pipeline 실행을 확인합니다
  7. 배포를 보여 줍니다

## TDD Agent 모드

### 데모: Agent 인계를 활용한 TDD 워크플로

- **보여 줄 내용:** 계획, 테스트 작성, 구현 단계 간 자동 인계를 제공하는 전문 agent 모드로 완전한 Test-Driven Development 워크플로를 진행합니다.
- **이유:** 사용자 지정 agent 모드가 복잡한 다단계 워크플로를 오케스트레이션하고 단계 간 상태를 유지하며 TDD 같은 소프트웨어 엔지니어링 모범 사례를 자동 적용하는 방식을 보여 줍니다.
- **방법:**

  1. **계획 단계:**
     - Copilot Chat을 열고 Chat Modes 드롭다운에서 `tdd-planner`를 선택합니다
     - 프롬프트를 입력합니다. `지점 ID로 주문을 가져오는 새 메서드가 필요합니다`
     - Planner agent의 다음 작업을 보여 줍니다.
       - 기존 패턴을 이해하기 위한 코드베이스 조사
       - `docs/tdd-plans/`에 포괄적인 TDD 계획 문서 생성
       - Given-When-Then 형식으로 테스트 명세 정의
       - 인수 조건과 예외 상황 문서화
       - 생성/수정할 파일 식별
     - 전체 계획이 담긴 생성된 Markdown 파일을 검토합니다

  2. **Red 단계(실패하는 테스트):**
     - 계획 문서에 표시되는 **"Write Red Tests"** 버튼을 클릭합니다
     - `tdd-red` 모드로 자동 전환되어 계획이 인계됩니다
     - Red agent의 다음 작업을 보여 줍니다.
       - 테스트 명세를 위해 TDD 계획 읽기
       - 계획에 따른 포괄적인 테스트 파일 생성
       - 테스트가 올바르게 실패하는지 확인하기 위한 실행(예상된 동작)
       - 테스트 실패 원인 보고
     - 생성된 테스트 파일을 검토합니다(예: `api/src/routes/order.test.ts`)
     - 모든 테스트가 HTTP 404로 실패함을 확인하는 테스트 출력을 보여 줍니다(route 미구현)

  3. **Green 단계(최소 구현):**
     - 테스트 결과의 **"Write Green Implementation"** 버튼을 클릭합니다
     - `tdd-green` 모드로 자동 전환되어 컨텍스트가 인계됩니다
     - Green agent의 다음 작업을 보여 줍니다.
       - 요구 사항을 이해하기 위한 실패한 테스트 분석
       - 테스트를 통과시키는 최소 코드 구현
       - 적절한 Swagger 문서 추가
       - 이제 테스트가 통과하는지 확인하기 위한 실행
       - 구현 요약과 함께 성공 보고
     - 구현을 검토합니다(예: `api/src/routes/order.ts`의 새 route)
     - 모든 테스트가 초록색 체크 표시 ✅로 통과하는 모습을 보여 줍니다

  4. **강조할 핵심 사항:**
     - **자동 컨텍스트 인계**: 각 단계가 다음 단계에 올바른 컨텍스트를 자동 전달합니다
     - **모범 사례 적용**: Agent 모드가 TDD 워크플로를 강제합니다
     - **최소 구현**: Green agent는 테스트에 필요한 코드만 작성합니다(과도한 설계 방지)
     - **자체 검증**: 각 단계가 작업을 검증합니다(테스트 자동 실행)
     - **문서화**: TDD 계획 문서에 완전한 감사 추적 기록을 남깁니다
     - **코드 품질**: 기존 패턴과 규칙을 자동으로 따릅니다

  5. **(선택 사항) Agent 구성 보여 주기:**
     - `.github/copilot-modes.json`을 열어 TDD agent 세 개를 보여 줍니다.
       - `tdd-planner`: 조사를 바탕으로 포괄적인 테스트 계획 생성
       - `tdd-red`: 계획에 따라 실패하는 테스트 작성
       - `tdd-green`: 테스트를 통과하는 최소 코드 구현
     - 각 모드에 고유한 지침과 제약이 있음을 강조합니다
     - 모드를 연결하여 완전한 워크플로를 구성하는 방법을 보여 줍니다

- **핵심 요점**: 사용자 지정 agent 모드는 인계 간 컨텍스트를 유지하면서 모범 사례를 적용하는 정교한 다단계 워크플로를 지원합니다. 이를 통해 팀이 고품질 소프트웨어 제공에 활용할 수 있는 일관되고 반복 가능한 프로세스를 만듭니다.

## VSCode의 Planning Mode :copilot: 📝

1. **VSCode**에서 데모 저장소를 엽니다.
2. Copilot Chat을 열고 `Plan` 모드로 전환합니다.
  
    ![Copilot Chat에서 Plan 모드로 전환](../images/vscode-plan-switch-mode.png)

3. 다음 프롬프트로 계획 세션을 시작합니다.

    ```txt
    이 애플리케이션에 장바구니 기능을 구현해야 합니다. 계획을 세우는 데 도움을 주세요.
    ```

4. Copilot이 먼저 정보를 수집한 후 몇 가지 질문을 합니다(주의: 아래와 정확히 같지 않을 수 있으므로 유연하게 대응하세요).

    ![Copilot Chat의 Planning Mode 질문](../images/vscode-plan-questions.png)

5. 질문에 적절히 답합니다. Copilot이 추가로 질문할 수 있습니다. 계속 답할지 아니면 어느 시점에 계획을 실행으로 옮길지 결정할 수 있습니다.

6. 다음 작업 중 하나를 선택합니다.
    ![Copilot Chat의 Planning Mode 작업](../images/vscode-plan-action-choices.png)
    1. `Start Implementation`을 클릭하여 Agent Mode로 계획을 바로 구현합니다.
    2. `Open in Editor`를 클릭하여 계획을 Markdown 파일에 저장합니다.
    3. `Agent` 모드로 전환하고 Copilot에 이를 Coding Agent로 넘기도록 요청합니다(MCP가 시작되어 있어야 함).

        ```txt
        이 계획을 coding agent에 넘겨 줄 수 있나요?
        ```

---------

[^1]: Patch-set 적용 방법은 [patch-sets.md](../general/patch-sets.md)를 참조하세요
