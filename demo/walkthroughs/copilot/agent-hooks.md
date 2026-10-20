# Agent Hooks 데모

이 실습에서는 **Agent Hooks**를 사용하여 AI 지원 개발 과정에서 워크플로를 자동화하고 거버넌스 정책을 적용하는 방법을 보여 줍니다.

## Agent Hooks란?

Agent Hooks는 Copilot Agent 수명 주기의 특정 시점에 임의의 명령이나 스크립트를 실행할 수 있게 합니다. 이러한 hook은 다음과 같은 고급 워크플로를 지원합니다.

- **감사 로깅**: 규정 준수를 위해 프롬프트와 세션 이벤트를 기록합니다.
- **자동 체크포인트**: 각 agent 세션이 끝난 후 git commit을 생성합니다.
- **검증**: agent가 진행하도록 허용하기 전에 linter나 테스트를 실행합니다.

Hook은 `.github/hooks/hooks.json`에 정의되며 `sessionStart`, `UserPromptSubmit`, `Stop` 등의 수명 주기 이벤트를 지원합니다.

## 데모 1: 감사 로깅

- **보여 줄 내용:** Start, Prompt, Stop hook이 agent 활동을 파일에 기록하는 방식입니다.
- **이유:** Agent Hooks의 확장성을 보여 줍니다. 이 간단한 파일 로깅 예제는 조직에서 Agent 활동을 내부 규정 준수 시스템, 메트릭 대시보드 또는 거버넌스 도구와 통합하는 방법을 설명합니다.
- **방법:**
  1. `.github/hooks/hooks.json`을 열고 `sessionStart`, `UserPromptSubmit`, `Stop` hook 구성을 설명합니다.
  2. Copilot Chat(Agent Mode)을 열고 다음과 같은 프롬프트를 입력합니다.

     ```txt
     이 프로젝트에는 어떤 프레임워크가 사용되나요?
     ```

  3. `.agent.log`를 열어(또는 터미널에서 `cat .agent.log`를 실행하여) 타임스탬프가 포함된 기록을 보여 줍니다.

## 데모 2: 자동 체크포인트

- **보여 줄 내용:** "checkpoint commit" hook을 활성화하고 매 agent 세션이 끝날 때 작업을 자동으로 보호하는 방식을 보여 줍니다.
- **이유:** Hook이 자동 commit과 같은 흐름 메커니즘으로 개발자 경험을 개선하는 방법을 보여 줍니다.

### 옵션 1: 빠른 시각적 데모

- **방법:**
  1. `.github/hooks/hooks.json`을 엽니다.
  2. `Stop` 이벤트 섹션을 찾아 `checkpoint-commit.sh` 블록의 **주석을 해제**합니다.

     ```jsonc
     // comment this in if you want automatic commits after each agent session
     {
       "type": "command",
       "bash": ".github/hooks/checkpoint-commit.sh",
       "cwd": ".",
       "timeoutSec": 10
     }
     ```

  3. Copilot에 눈에 띄는 변경을 요청합니다.

     ```
     README 제목에 로켓 이모지 두 개 🚀🚀를 추가해 주세요.
     ```

  4. Agent가 완료할 때까지 기다립니다.
  5. **Source Control** 보기를 표시하거나 `git log -1`을 실행하여 타임스탬프와 메시지가 포함된 새 commit이 있는지 확인합니다.

### 옵션 2: 복합 워크플로(Skills 사용)

- **방법:**
  1. 체크포인트 hook이 활성화되어 있는지 확인합니다(옵션 1 참조).
  2. [Agent Skills](./agent-skills.md) 실습을 진행하여 `api-endpoint` skill을 설정합니다.
  3. 대량으로 생성된 코드(Model, Route, Test)가 하나의 "checkpoint" commit으로 깔끔하게 묶여 이전 작업과 분리됨을 강조합니다.

## 핵심 요점

| 기능                   | 이점                                                                                    |
| :--------------------- | :-------------------------------------------------------------------------------------- |
| **감사 로그**         | 개발자 개입 없이 규정 준수와 사용 현황을 자동으로 추적합니다.                            |
| **체크포인트 Commit** | AI 코딩을 위한 "게임 저장" 기능입니다. 좋은 코드는 보존하고 잘못된 코드는 쉽게 되돌립니다. |
| **확장성**            | Agent 세션의 모든 수명 주기에서 고급 기능을 결정적으로 실행할 수 있습니다.               |

---

## 관련 자료

- [Agent Skills](./agent-skills.md)
- [Copilot 사용자 지정 지침](./copilot.md)
