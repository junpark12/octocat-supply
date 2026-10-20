# **GitHub Agentic Workflows 데모**

이 데모에서는 GitHub Actions에서 직접 실행되는 AI 기반 자동화인 GitHub Agentic Workflows(`gh-aw`)를 살펴봅니다.

- [**GitHub Agentic Workflows 데모**](#github-agentic-workflows-데모)
  - [Agentic Workflows란?](#agentic-workflows란)
    - [제공 가치](#제공-가치)
  - [중요: 소요 시간](#중요-소요-시간)
  - [설정 요구 사항](#설정-요구-사항)
    - [토큰 구성](#토큰-구성)
      - [COPILOT\_GITHUB\_TOKEN(Copilot 인증)](#copilot_github_tokencopilot-인증)
      - [GH\_AW\_AGENT\_TOKEN(Agent 할당)](#gh_aw_agent_tokenagent-할당)
  - [워크플로 작성](#워크플로-작성)
    - [새 워크플로 생성](#새-워크플로-생성)
    - [기존 워크플로 업데이트](#기존-워크플로-업데이트)
    - [핵심 개념](#핵심-개념)
      - [사용자 지정 Frontmatter - 예: Schedule Jittering](#사용자-지정-frontmatter---예-schedule-jittering)
      - [안전한 Sandbox와 권한](#안전한-sandbox와-권한)
      - [Safe Outputs](#safe-outputs)
  - [데모 시나리오](#데모-시나리오)
    - [데모 1: 새 워크플로를 처음부터 생성](#데모-1-새-워크플로를-처음부터-생성)
    - [데모 2: 빌드 실패 자동 분석](#데모-2-빌드-실패-자동-분석)
    - [데모 3: 일일 저장소 활동 요약](#데모-3-일일-저장소-활동-요약)
  - [요약: 핵심 요점](#요약-핵심-요점)

---

## Agentic Workflows란?

Agentic Workflows는 자율적으로 추론하고 의사결정하며 작업할 수 있는 AI 기반 GitHub Actions 워크플로입니다. 고정된 사전 정의 단계를 따르는 기존 YAML 기반 워크플로와 달리, agentic workflow는 Markdown으로 작성되며 agent가 달성할 목표를 자연어로 설명합니다.

Agent는 지침을 해석하고 컨텍스트를 수집하며 오류 처리, 재시도, 적응형 의사결정을 포함하여 목표 달성에 가장 적합한 경로를 동적으로 결정합니다. 보안을 위해 명시적 권한과 safe outputs가 적용된 sandbox 내에서 안전하게 실행됩니다.

### 제공 가치

| 기존 워크플로                    | Agentic Workflows                 |
| -------------------------------- | --------------------------------- |
| 고정된 단계별 실행               | 동적이고 목표 지향적인 실행        |
| 예상치 못한 조건에서 실패        | 적응 및 자체 복구                  |
| 명시적 오류 처리 필요            | 지능형 오류 복구                   |
| 복잡한 YAML 구성                 | 자연어 지침                        |
| 사전 정의된 작업으로 제한        | 새로운 상황에 대한 추론 가능       |

**주요 이점:**

- **유지 관리 감소**: Agent가 수동 업데이트 없이 변경에 적응합니다
- **빠른 작성**: 자연어는 복잡한 YAML보다 작성이 빠릅니다
- **지능형 자동화**: 예외 상황과 예상치 못한 시나리오를 처리합니다
- **자체 복구**: 일시적인 실패에서 자동으로 복구합니다
- **GitHub 통합**: Issue, PR, Actions 등에 기본적으로 접근합니다

---

## 중요: 소요 시간

> [!CAUTION]
> **발표자 참고:** Agentic workflow는 기존 워크플로보다 생성과 테스트에 훨씬 더 많은 시간이 필요합니다. 다음을 계획하세요.
>
> - **초기 생성**: CCA의 워크플로 생성 및 검증에 10~30분 소요
> - **테스트 및 반복 개선**: 동작과 권한을 다듬기 위해 여러 번 실행
> - **데모 준비**: "새 워크플로 생성" 데모를 먼저 시작하고 실행 중에 기존 워크플로 시연

이 저장소의 워크플로는 미리 생성하고 테스트했습니다. 실시간 워크플로 생성을 시연한다면 일찍 시작하고 기존 예제로 전환하세요.

---

## 설정 요구 사항

Agentic Workflows를 사용하기 전에 저장소에 필요한 토큰이 구성되어 있는지 확인합니다.

### 토큰 구성

자세한 내용은 [공식 토큰 문서](https://github.github.com/gh-aw/reference/auth/)를 참조하세요. 이 데모에는 다음 토큰이 필요합니다.

#### COPILOT_GITHUB_TOKEN(Copilot 인증)

이 토큰은 Copilot agent가 GitHub Actions 내에서 실행되도록 인증합니다.

- **문서**: [COPILOT_GITHUB_TOKEN 참조](https://github.github.com/gh-aw/reference/auth/#copilot_github_token)
- **설정**: 일반적으로 조직/저장소에서 Copilot을 활성화하면 GitHub Actions 환경이 자동으로 제공합니다

#### GH_AW_AGENT_TOKEN(Agent 할당)

이 토큰은 워크플로가 Copilot Coding Agent에 Issue를 할당할 수 있게 합니다.

- **문서**: [GH_AW_AGENT_TOKEN 참조](https://github.github.com/gh-aw/reference/auth/#gh_aw_agent_token)
- **설정**: 적절한 권한이 있는 Personal Access Token을 생성하고 `GH_AW_AGENT_TOKEN`이라는 저장소 secret으로 추가합니다
- **필요한 경우**: `assign-to-agent` safe outputs를 사용하는 워크플로(예: `auto-analyze-failures.md`)

> [!TIP] 이러한 토큰에 대한 조직 수준 지원이 제공되면 토큰을 더 이상 구성할 필요가 없어 설정이 간소화됩니다.

---

## 워크플로 작성

> [!IMPORTANT]
> **핵심 원칙:** 사용자는 Markdown 워크플로 파일을 직접 편집하지 않아야 합니다. 항상 Copilot Coding Agent(CCA)로 워크플로를 생성하거나 수정하세요. 물론 고급 사용자는 파일을 수동으로 편집할 수 있지만 권장 방식은 agentic workflow 사용자 지정 agent로 워크플로를 업데이트하는 것입니다.

워크플로 작성의 기본 참조 자료: [워크플로 생성](https://github.github.io/gh-aw/setup/creating-workflows/)

### 새 워크플로 생성

CCA로 워크플로를 "vibe-code"합니다.

1. 저장소를 열고 Agents 탭으로 이동합니다
2. 생성할 워크플로를 설명하고 다음 형식으로 프롬프트를 작성합니다.

3. ```text
    다음 문서를 사용하여 GitHub Agentic Workflows용 워크플로를 생성해 주세요: https://github.com/github/gh-aw/blob/main/create.md
    워크플로의 목적은 <x>입니다.
    ```

    여기서 `<x>`는 워크플로의 목표를 자연어로 설명합니다.
4. Agent가 작업하도록 둡니다!

### 기존 워크플로 업데이트

기존 YAML 워크플로를 업데이트하거나 agentic workflow로 변환하려면:

1. 저장소를 열고 Agents 탭으로 이동합니다
2. **agentic-workflows** 사용자 지정 agent를 선택합니다
3. 필요한 변경이나 변환을 설명합니다
4. Agent가 의도를 유지하면서 워크플로를 업데이트합니다

> [!TIP] "이전" YML 자동 분석 워크플로와 업데이트된 agentic workflow를 차례로 보여 주며 구조와 기능의 차이를 강조할 수 있습니다. 이 agentic workflow는 agent에 YAML 워크플로를 agentic workflow로 변환하도록 요청하여 생성했습니다.

### 핵심 개념

#### 사용자 지정 Frontmatter - 예: Schedule Jittering

Agentic workflow의 Markdown 파일에는 Actions 속성과 비슷한 사용자 지정 frontmatter 속성이 있습니다. 하지만 차이점도 있습니다. 예를 들어 `schedule: daily`는 매일 **무작위 시간**에 실행됩니다. 이러한 "jittering"은 여러 워크플로가 동시에 실행되어 리소스에 과부하를 주는 것을 방지합니다.

```yaml
on:
  schedule: daily  # Runs at a random time each day
```

#### 안전한 Sandbox와 권한

Agentic workflow는 최소 기본 권한이 적용된 **안전한 sandbox**에서 실행됩니다.

- **네트워크 격리**: 명시적으로 허용된 도메인에만 접근할 수 있습니다
- **기본 읽기 전용**: 쓰기 권한은 명시적으로 부여해야 합니다
- **도구 제한**: 지정된 도구와 명령만 사용할 수 있습니다

권한 블록 예제:

```yaml
permissions:
  contents: read
  issues: read
  pull-requests: read
network:
  allowed:
    - node  # Allow npm registry access
```

#### Safe Outputs

Safe outputs는 agent가 수행할 수 있는 작업을 제한하는 보안 기능입니다. Agent는 전체 쓰기 권한을 갖는 대신 생성할 수 있는 특정 출력을 선언합니다.

```yaml
safe-outputs:
  create-issue:
    title-prefix: "[auto] "  # All created issues must have this prefix
    max: 1                    # Only one issue per run
  assign-to-agent:
    allowed: [copilot]        # Can only assign to Copilot
  noop:                       # Allow "no operation" output
```

자세한 내용은 [Safe Outputs 문서](https://github.github.io/gh-aw/reference/safe-outputs/)를 참조하세요.

---

## 데모 시나리오

### 데모 1: 새 워크플로를 처음부터 생성

> [!NOTE]
> 완료하는 데 10~30분이 걸립니다. **먼저 시작**한 다음 실행 중에 기존 워크플로를 시연하세요.

**보여 줄 내용:** CCA로 agentic workflow를 처음부터 생성합니다.

**이유:** 워크플로 작성의 "vibe-coding" 접근 방식을 보여 줍니다.

**방법:**

1. 저장소의 Agents 탭에서 Copilot Chat을 엽니다
2. 다음 프롬프트를 입력합니다.

   ```text
   다음 문서를 사용하여 GitHub Agentic Workflows용 워크플로를 생성해 주세요: https://github.com/github/gh-aw/blob/main/create.md
   워크플로의 목적은 github/gh-aw의 multi-device resolution tester agentic workflow를 가져와 이 저장소의 웹사이트를 테스트하도록 조정하는 것입니다.
   ```

3. CCA가 작업하도록 둡니다. 다음을 수행합니다.
   - 생성 가이드 가져오기
   - 워크플로의 의도를 설명하는 Markdown 파일 생성
   - `.github/workflows/`에 워크플로 파일 생성

4. 기다리는 동안 데모 2와 데모 3을 진행합니다

5. 완료되면 생성된 워크플로를 검토합니다.
   - Frontmatter(permissions, tools, safe-outputs) 확인
   - 자연어 지침 검토
   - `${{ github.xxx }}` 컨텍스트 변수 참조 방식 설명

**핵심 요점:** 자연어 프롬프트 + CCA = YAML 전문 지식 없이 빠른 워크플로 생성

---

### 데모 2: 빌드 실패 자동 분석

**보여 줄 내용:** 자동 실패 분석 및 Issue 생성

**이유:** 지능적인 자율 DevOps 자동화를 보여 줍니다.

**설정:** [auto-analyze-failures.md](../../.github/workflows/auto-analyze-failures.md) 워크플로는 이미 구성되어 있습니다.

> [!WARNING]
> 생성된 워크플로 `auto-analyze-failures.lock.yml`은 토큰이 구성되지 않은 상태에서 오류가 발생하지 않도록 기본적으로 비활성화되어 있습니다.
>
> **활성화하려면:**
>
> 1. 저장소의 **Actions** 탭으로 이동합니다
> 2. 왼쪽 사이드바에서 **"Auto Analyze Build Failures"**를 선택합니다
> 3. **Enable workflow** 버튼을 클릭합니다

**방법:**

1. 다음과 같이 코드에 의도적인 실패를 만듭니다.
   1. *Cmd-shift-P*를 누르고 `Tasks: Run Task`를 선택한 다음 `Copilot: Self-healing DevOps`를 선택합니다.
   2. 동작을 깨뜨리는 코드 변경이 생성됩니다.
   3. 변경 사항을 commit하고 push한 다음 PR을 생성하여 CI 워크플로를 트리거합니다. 워크플로가 실패해야 합니다.
2. CI 빌드가 실패할 때까지 기다립니다(잠시 걸립니다)
3. 실패 시 `auto-analyze-failures` 워크플로가 자동으로 트리거됩니다
4. 워크플로 실행을 보여 줍니다.
   - Agent가 실패 로그를 읽습니다
   - 실패 유형(code, test, config, dependency 등)을 분류합니다
   - 일시적인 실패인지 조치가 필요한지 판단합니다
5. 일시적이지 않으면 다음 내용의 Issue가 자동 생성됩니다.
   - 실패 분석 요약
   - 수정 계획
   - 실패한 실행 링크
6. 특정 실패 범주의 경우 Issue가 Copilot Coding Agent에 자동 할당됩니다
7. Issues 탭을 열어 새로 생성된 Issue를 보여 줍니다

**워크플로 코드 보여 주기:**

```markdown
## 분석 지침

실패를 다음 범주 중 하나로 분류하세요.
- `code`
- `test`
- `config`
- `dependency`
- `infrastructure`
- `quality`
- `repeat-transient`

일시적인 실패인지 판단하세요(재실행하면 성공할 가능성이 있는지).
```

**핵심 요점:** Agentic workflow는 실패를 분류하고 실행 가능한 Issue를 생성하며 자동 수정을 위해 Copilot에 할당할 수도 있습니다.

---

### 데모 3: 일일 저장소 활동 요약

**보여 줄 내용:** 예약된 자율 보고

**이유:** 예약된 agentic 자동화와 저장소 인사이트를 보여 줍니다.

**설정:** [daily-repo-activity-summary.md](../../.github/workflows/daily-repo-activity-summary.md) 워크플로는 이미 구성되어 있습니다.

**방법:**

1. GitHub의 **Actions** 탭으로 이동합니다
2. **"Daily Repo Activity Summary"** 워크플로를 찾습니다
3. **"Run workflow"**를 클릭하여 수동으로 트리거합니다
   - 참고: 프로덕션에서는 매일 무작위 시간에 실행됩니다(jittering 적용)
4. 완료될 때까지 기다립니다(약 2~5분)
5. **Issues** 탭에서 새 요약 Issue를 확인합니다
6. 생성된 콘텐츠를 보여 줍니다.
   - 최근 24시간 동안 열린/닫힌 Issue
   - Pull request 활동
   - 활동이 특히 많은 주요 항목
   - 참조된 모든 항목의 직접 링크

**워크플로 코드 보여 주기:**

```markdown
## 출력 요구 사항

- 제목은 구성된 접두사를 사용하고 간결해야 합니다(예: "[daily activity] 2026-02-04 Repo Summary")
- 본문은 보고 형식 가이드라인을 따라야 합니다.
  - `###` 이하 수준의 제목 사용
  - 주요 개수를 포함하는 요약 섹션 제공
  - Issue와 PR 목록에 `<details>` 섹션 사용
```

**safe-outputs 제약 강조하기:**

```yaml
safe-outputs:
  create-issue:
    title-prefix: "[daily activity] "
    max: 1  # Only one issue per run
```

**핵심 요점:** Agentic workflow는 일정에 따라 자율적으로 데이터를 수집하고 인사이트를 종합하며 구조화된 보고서를 작성할 수 있습니다.

---

## 요약: 핵심 요점

| 주제            | 요점                                                   |
| --------------- | ------------------------------------------------------ |
| **정의**        | 추론하고 적응하는 AI 기반 워크플로                     |
| **이유**        | 빠른 작성, 지능형 자동화, 자체 복구                    |
| **방법**        | YAML이 아닌 자연어 Markdown                           |
| **작성**        | 항상 CCA를 사용하고 직접 편집하지 않음                |
| **보안**        | 안전한 sandbox, 명시적 권한, safe-outputs              |
| **예약 실행**   | Jittering 실행으로 리소스 충돌 방지                    |
| **통합**        | GitHub API와 도구에 기본적으로 접근                   |

**다음 단계:**

- [gh-aw 문서](https://github.github.io/gh-aw/) 살펴보기
- `.github/workflows/*.md`의 기존 워크플로 검토
- 팀의 요구에 맞는 사용자 지정 워크플로 생성
