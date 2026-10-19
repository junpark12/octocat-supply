# Copilot Coding Agent 및 Mission Control

## Copilot Coding Agent

### 데모: `/handoff` 사용자 지정 프롬프트로 세션 관리

- **보여 줄 내용:** 사용자 지정 `/handoff` 프롬프트로 컨텍스트를 적절히 보존하며 Ask/Agent 작업을 다른 세션에 넘깁니다.
- **이유:** 사용자 지정 프롬프트로 컨텍스트를 제어하고 불필요한 정보를 제거하며 Chat/Agent 세션 또는 팀원 간에 작업을 효율적으로 넘기는 방법을 보여 줍니다.
- **방법:**  
  1. Copilot Chat을 열고 `Plan` 모드로 전환합니다.
  2. `앱에 사용자 프로필과 구매 내역을 보여 주는 개인 프로필 페이지를 추가하고 싶습니다.`를 입력합니다.
  3. 결과를 보여 주고 Copilot에 계획의 일부 변경을 요청합니다. 예를 들어 `purchases` 부분을 제거합니다
  4. **컨텍스트 문제 설명**: 현재 전체 대화가 컨텍스트에 포함되어 시간이 지나면 길어지고 컨텍스트 윈도를 과도하게 사용할 수 있습니다. 사용자 지정 프롬프트는 깔끔한 인계를 만들어 이 문제를 해결할 수 있습니다.
  5. **사용자 지정 프롬프트 보여 주기**: Prompts 디렉터리의 [handoff.prompt.md](../../.github/prompts/handoff.prompt.md) 파일을 엽니다. 다음을 강조합니다.
     - Agent 모드 프롬프트로 구성하는 YAML frontmatter
     - HTML 주석의 내부 사고 과정(사용자에게 표시되지 않음)
     - 일관된 인계를 위한 구조화된 템플릿
  6. **프롬프트 실행**: "Run" 버튼, Command Palette → "Prompts: Run Prompt" 또는 Chat의 `/handoff` 입력으로 인계 프롬프트를 실행합니다
  7. **결과 보여 주기**: 생성된 `handoff.md` 문서를 표시합니다. 다음을 포함해야 합니다.
     - 대화의 불필요한 내용이 없는 깔끔한 요약
     - 수집한 정보와 요구 사항
     - 다듬어진 계획(제거한 `purchases` 부분 제외)
     - 인계받는 개발자의 다음 작업
  8. **인계 완료**: `Agent` 모드로 전환하고 인계 문서를 컨텍스트에 포함한 후 Copilot에 `인계 문서에 따라 변경 사항을 구현해 주세요`라고 요청합니다. 전체 구현을 보여 줄 필요는 없으므로 몇 초 후 취소해도 됩니다.
  9. **모범 사례**: 사용자 지정 인계 프롬프트가 다음에 유용함을 설명합니다.
     - 컨텍스트 크기 관리
     - 세션 간 명확한 지식 전달
     - 팀 협업과 인계
     - 불필요한 내용을 제거하면서 중요한 결정 보존
  10. **정리**: 데모 후 `handoff.md` 파일의 변경 사항을 되돌릴 수 있습니다.

### 데모: `/handoff-to-copilot-coding-agent` 사용자 지정 프롬프트로 비동기 세션 이어가기

- **보여 줄 내용:** 사용자 지정 `/handoff-to-copilot-coding-agent` 프롬프트로 컨텍스트를 적절히 보존하며 현재 계획 작업을 GitHub Copilot Coding Agent에 넘깁니다.
- **이유:** 사용자 지정 프롬프트가 IDE 도구와 MCP 도구 호출을 하나의 일관된 워크플로로 묶는 방법을 보여 줍니다.

- **방법:**  
  1. Remote GitHub MCP Server가 실행 중인지 확인합니다.
  2. Copilot Chat을 열고 `Plan` Chat Mode로 전환합니다.
  3. `앱에 사용자 프로필과 구매 내역을 보여 주는 개인 프로필 페이지를 추가하고 싶습니다.`를 입력합니다.
  4. 결과를 보여 주고 Copilot에 계획의 일부 변경을 요청합니다. 예를 들어 `purchases` 부분을 제거합니다
  5. **시간 제약 설명**: 이제 상세한 계획이 있으므로 Copilot Agent가 이에 따라 원하는 기능을 구현할 수 있습니다. 하지만 시간을 효율적으로 사용하기 위해 구현을 Copilot Agent에 넘겨 다른 작업에 집중할 수 있습니다(또는 데모에서 다른 Copilot 기능 시연).
  6. **사용자 지정 프롬프트 보여 주기**: Prompts 디렉터리의 [handoff-to-copilot-coding-agent.prompt.md](../../.github/prompts/handoff-to-copilot-coding-agent.prompt.md) 파일을 엽니다. 다음을 강조합니다.
     - Agent 모드 프롬프트로 구성하는 YAML frontmatter
     - HTML 주석의 내부 사고 과정(사용자에게 표시되지 않음)
     - 일관된 인계를 위한 구조화된 Issue 템플릿
     - `changes`, `create_issue`, `assign_copilot_to_issue` 같은 도구 사용.
     - 도구 구성 방법(`tools: []` 줄 위의 'Configure Tools' 링크 클릭)
  7. **프롬프트 실행**:
      - _중요_ 현재 'Plan' Chat Mode에서는 사용할 수 있는 도구가 제한됩니다. /handoff-to-copilot-coding-agent 프롬프트를 사용하려면 `Agent` 모드로 전환해야 합니다. 현재는 모드 전환을 강제할 수 없습니다.
      - "Run" 버튼, Command Palette → "Prompts: Run Prompt" 또는 `/handoff-to-copilot-coding-agent` 입력으로 인계 프롬프트를 실행합니다
  8. **결과 보여 주기**: 생성된 결과를 표시합니다. GitHub MCP 호출과 Issue 링크가 포함된 짧은 요약이 있어야 합니다.
     - 대화의 불필요한 내용이 없는 깔끔한 요약
     - 수집한 정보와 요구 사항
     - 다듬어진 계획(제거한 `purchases` 부분 제외)
  
      GitHub 저장소를 열고 새 Issue를 보여 줍니다. GitHub Copilot Coding Agent에 할당되었고 세션이 시작되었음을 보여 줍니다.

      > [!TIP]
      > **타사 Agent 사용:** Issue를 볼 때 기본 Copilot Coding Agent 대신 **Claude Code**나 **Codex**를 구현 담당 agent로 선택할 수 있습니다.

  9. **인계 완료**: 데모에 이 구현이 필요하지 않으면 세션을 중지할 수 있습니다.
  10. **모범 사례**: 사용자 지정 프롬프트가 다음에 유용함을 설명합니다.
  - 기존 워크플로의 반복 작업 명문화
  - 사용 가능한 Copilot 활용 사례를 더 쉽게 발견하도록 개선

### 데모: Copilot을 더 잘 활용하도록 Copilot의 도움 받기(인셉션)

- **보여 줄 내용:** 명확성 점수를 포함하여 프롬프트를 다듬는 데 Chat Mode를 활용합니다
- **이유**: 좋은 결과를 얻으려면 사용자가 프롬프트를 명확히 작성하도록 돕는 것이 중요하지만 대부분의 개발자는 개선 방법을 모릅니다. 이 사용자 지정 Chat Mode는 프롬프트 개선을 돕습니다.
- **방법:**
  1. `/refine-prompt` 프롬프트를 실행합니다
  2. 모호한 프롬프트를 입력합니다. `장바구니 페이지를 원합니다`. 결과에 확인 질문과 낮은 명확성 점수가 표시되어야 합니다.
  3. Chat에 [장바구니 이미지](docs/design/cart.png)를 첨부합니다.
  4. 더 상세한 프롬프트를 입력합니다. `첨부 이미지의 디자인 요소를 사용하여 현재 장바구니의 항목을 보여 주는 장바구니 페이지를 원합니다. Dark/light 모드를 맞춰 주세요. 배송비는 $25로 표시하되 $150 초과 주문에는 무료로 해 주세요. NavBar에 장바구니 항목 수를 표시하고 항목 추가/삭제 시 갱신되는 장바구니 아이콘을 추가해 주세요. 아이콘을 클릭하면 장바구니 페이지로 이동하게 해 주세요.`
  5. 높은 명확성 점수와 함께 더욱 개선된 프롬프트를 받을 수 있습니다.

### 데모: Copilot Coding Agent로 병렬 실험

- **보여 줄 내용:** 장바구니 페이지의 세 가지 변형을 병렬로 만듭니다.
- **이유:** 실험은 시간과 비용이 많이 들 수 있지만 Copilot Coding Agent에 맡기면 병렬로 진행할 수 있습니다! 그 후 가장 마음에 드는 옵션을 선택하면 됩니다.
- **방법:**  
  1. GitHub Remote MCP 서버가 실행 중인지 확인합니다
  2. `/demo-cca-parallel` 프롬프트를 실행합니다
  3. **참고**: Issue 생성에 몇 분, Copilot Coding Agent의 코드 변경 완료에 약 20분이 걸립니다. 다른 데모를 준비하거나 라이브 데모 전에 실행하여 결과만 보여 주세요.

### 데모: 자체 복구 DevOps

- **보여 줄 내용:** Copilot Coding Agent는 실패한 Actions 워크플로를 자체 복구할 수 있습니다.
- **이유:** 실패한 CI/CD pipeline은 간단한 변경으로 해결되는 경우가 많습니다. 이 데모에서는 GitHub Copilot([ai-inference Action](https://github.com/actions/ai-inference) 사용)으로 실패한 job을 자체 복구하는 방법을 보여 줍니다.
- **방법:**  
  1. 실패한 job 분석 프롬프트가 MCP를 사용하므로 PAT를 생성해야 합니다. GitHub Developer Settings로 이동하여 다음 권한이 있는 Fine-grained token을 생성합니다.
     1. 조직 수준: `Models` 읽기 전용
     2. 저장소 수준: `Actions` 읽기 전용, `Contents` 읽기 전용, `Issues` 읽기/쓰기
  2. 저장소의 Settings로 이동하고 PAT를 값으로 하는 `AUTO_REMEDIATION_PAT`라는 새 Actions 저장소 secret을 추가합니다
  3. `Auto Analyze Build Failures` Action을 활성화합니다
  4. 코드에 오류를 만드는 `Copilot: Self-Healing DevOps` Patch Set[^1]을 적용합니다
  5. Commit하고 push합니다
  6. `ci` 워크플로가 트리거되고 실패합니다
  7. 이 실패로 `auto-analyze-failures` 워크플로가 트리거되어 빌드 실패를 분석하고 Issue를 생성하여 Copilot에 할당합니다
  8. Copilot Coding Agent가 테스트를 깨뜨린 줄을 되돌려 문제를 수정하는 PR을 만듭니다
  9. **참고**: 전체 워크플로에 몇 분이 걸리므로 시연하려면 데모 전에 실행해 두는 것이 좋습니다.
  10. [failed-run-analyze.prompt.yml](.github/models/failed-run-analyze.prompt.yml) 파일에는 워크플로에서 빌드 실패 분석에 사용하는 프롬프트가 있습니다. 저장소의 Models 탭에서 열 수 있지만 MCP가 필요하므로 Models에서 완전히 테스트할 수는 없습니다.

---------

[^1]: Patch-set 적용 방법은 [patch-sets.md](../general/patch-sets.md)를 참조하세요

## Mission Control :copilot: 🛰️

Mission Control은 <https://github.com/copilot/agents>에서 접근할 수 있는 사용자 수준 기능으로, 진행 중인 모든 agent 작업을 표시합니다. 주로 "보여 주고 설명하는" 기능이므로 시작할 coding agent 목록과 [권장 데모 흐름](#데모-권장-mission-control-실습)을 준비했습니다.

### 준비: 시작할 Agent

- **Mission Control에서 직접 시작**: 가장 쉬운 방법이며 Mission Control에서 시작하려는 경우 적합합니다. 시작을 위한 예제 프롬프트 두 가지를 소개합니다.
  - **[간단] ESLint 규칙 추가**: CCA가 새 규칙에 맞게 모든 코드도 수정하므로 빠르면서 효과가 좋은 예제입니다.

      ```txt
      세미콜론 사용을 강제하는 ESLint 규칙을 추가해 주세요
      ```
  
      그 후 세션 도중 Copilot의 방향을 조정하는 방법도 보여 줄 수 있습니다.

      ```txt
      작업하는 김에 작은따옴표 대신 큰따옴표 사용을 강제하는 규칙도 추가해 주세요
      ```

    세션이 끝나면 다음 프롬프트로 새 세션을 시작합니다.

      ```txt
      UPPER_CASE 변수를 허용하지 않는 규칙을 찾아 경고만 표시하도록 해 주세요.
      ```

  - **[중간] BDD 테스트 추가**: `BDD Specialist` 사용자 지정 agent([사용자 지정 Agent](./custom-agents.md) 참조)를 선택하고 다음 프롬프트를 사용합니다.

      ```txt
      ToS 다운로드 기능에 대한 BDD 테스트를 추가해 주세요
      ```

  - **[복잡] 화면 문제 수정**: Copilot이 잠시 고민하겠지만 세션 도중 문제를 찾고 Playwright MCP로 수정을 검증하는 과정을 보여 주기에 좋습니다.

      ```txt
      메인 페이지를 큰 화면에서 보면 "Smart Tech CAT" 텍스트 상자가 hero 이미지 안에 머물지 않고 오른쪽으로 벗어납니다. 이미지 오른쪽에 약간의 padding을 두고 항상 이미지 경계 안에 완전히 들어가도록 변경해 주세요.
      ```

  - **Issue에서 시작**: 다음 두 Issue를 CCA에 (일괄) 할당합니다.
  - `Improve test coverage for API`
  - `Move "Terms and conditions" to the bottom of the "Helpful Links" list`
- **CodeQL 알림:** CCA에 할당하기 전에 autofix를 생성해야 합니다. 아래 [CodeQL 알림을 Coding Agent에 할당](../ghas/ghas.md#assign-codeql-alerts-to-coding-agents-copilot-)을 참조하세요.
  - `Database query built from user-controlled sources`
  - `Workflow does not contain permissions`

### 데모: 권장 Mission Control 실습

1. **Issue 할당**: 데모 전: 완료된 세션을 보여 줄 수 있도록 `Improve test coverage for API` Issue를 Copilot에 할당합니다.
2. **실시간 Agent 시작**: 위 목록의 여러 작업을 Coding Agent에 할당하며 데모를 시작합니다(아직 ESLint 작업은 사용하지 마세요).

3. **Mission Control 개요**: <https://github.com/copilot/agents>로 이동한 후:
    1. Mission Control의 목적과 주요 기능을 설명합니다.
    2. 모든 agent와 대화의 개요가 표시된 오른쪽을 강조합니다.
    3. 열려 있는 세션을 보여 줍니다.
    4. 위의 ESLint 규칙으로 새 세션을 시작합니다.

    ![Agent와 대화가 표시된 Mission Control 개요](../images/mission-control-overview.png)

4. **세션 개요**: 실행 중인 ESLint 작업을 선택하고 클릭하여 세션 보기로 이동합니다.
    1. **세션 진행 상황:** CCA가 수행하는 Commands, MCP Servers 및 기타 단계의 실시간 보기를 제공하는 세션 진행 상황 보기를 강조합니다.
    2. **Overview 및 Files Changed 탭:** Copilot이 Overview에 요약을 유지하고 Files Changed 탭에서 변경된 모든 파일을 확인하는 방법을 보여 줍니다.
    3. **작업 전환:** 왼쪽에서 작업 간에 쉽게 전환하는 방법을 보여 줍니다.
    4. **Copilot 방향 조정:**
        1. **세션 도중:** Copilot에 ESLint 규칙을 하나 더 추가하도록 요청합니다.
        2. **세션 종료 시:** 완료된 작업에 새 세션을 트리거합니다. ESLint 완료 여부에 따라 데모 전에 할당한 단위 테스트 작업으로 전환하여 다음 요청을 사용할 수 있습니다.

          ```txt
          Mock data 처리를 개선해 주세요. Mock database와 mock object를 사용해 주세요.
          ```

    5. **PR 또는 Codespace로 이동:** 오른쪽 위에서 agent가 만든 PR로 바로 이동하거나 agent가 작업한 Codespace를 열어 마무리하며 Mission Control 데모를 끝낼 수 있습니다.

    ![Agent 활동과 세션 세부 정보가 표시된 진행 중인 Mission Control 세션](../images/mission-control-mid-session.png)

> [!TIP]
>
> - **사용자 지정 Agent 데모 추가:** 위 목록의 `BDD Specialist`나 `API Specialist`를 시작하여 [사용자 지정 Agent](./custom-agents.md) 데모와 쉽게 결합할 수 있습니다.
> - **데모 흐름:** 5단계에서 PR로 이동한 후 [Copilot Code Review](./copilot-code-review.md) 데모로 바로 넘어갑니다.
> - **데모 전에 최소 하나의 coding agent 실행**: Coding agent는 시간이 걸리므로 데모 중에 끝나지 않을 수 있습니다. 미리 실행하면 완료된 세션을 보여 줄 수 있습니다.
> - **Mission Control에서 데모 저장소 미리 선택:** 데모 저장소를 대상으로 미리 선택한 Mission Control 탭을 열어 둡니다. 현재 저장소 검색은 다소 번거롭고 느리므로 저장소를 찾는 데 소중한 데모 시간을 낭비하지 않게 됩니다.
> - **여러 agent 시작:** 위 목록에서 가장 편하게 시연할 수 있는 작업 몇 개(또는 모두)를 선택합니다. Mission Control의 핵심은 여러 agent 관리이므로 이를 보여 줘야 합니다.
