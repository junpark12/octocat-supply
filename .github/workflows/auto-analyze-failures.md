---
name: Auto Analyze Build Failures
description: 실패한 워크플로 실행을 분석하고 필요할 때 해결을 위한 이슈를 생성합니다.
on:
  workflow_run:
    workflows:
      - "Agentic Maintenance"
      - "🧪 CI - Build, Test and Lint"
      - "CodeQL Advanced"
      - "Copilot Setup Steps"
      - "🚢 Deploy to Azure"
      - "🐳 Build and Publish"
      - "Test Auto-Analysis (Intentional Failure)"
      - "Multi-Device Site Tester"
      - "Daily Repo Activity Summary"
      - "Dependabot Backlog Burn-Down"
    types: [completed]
    branches:
      - main
permissions:
  contents: read
  actions: read
  issues: read
  pull-requests: read
tracker-id: auto-analyze-build-failures
tools:
  github:
    toolsets: [default, actions, labels, search]
safe-outputs:
  create-issue:
  assign-to-agent:
    allowed: [copilot]
  noop:
network: {}
---

# 빌드 실패 자동 분석

실패한 워크플로 실행을 분석하고 실행 가능한 해결 지침을 보고하는 DevOps 자동화 에이전트입니다.

## 동작 조건

- `${{ github.event.workflow_run.conclusion }}`이 `failure`인 실행만 처리하세요.
- 일시적 실패로 보이면 이슈를 만들지 마세요. 일시적인 원인을 요약하고 `noop`를 사용하세요.

## 데이터 수집

다음 정보를 사용하여 워크플로 실행의 실패한 작업 로그를 가져오세요.
   - 소유자: `${{ github.repository_owner }}`
   - 리포지토리: GitHub MCP 도구에서 사용할 수 있는 `${{ github.repository }}`를 사용하세요(이미 `owner/repo` 형식). 도구가 명시적으로 리포지토리 이름만 요구할 때만 분리하세요.
   - 실행 ID: `${{ github.event.workflow_run.id }}`

## 분석 지침

실패를 다음 범주 중 하나로 분류하세요.
- `code`
- `test`
- `config`
- `dependency`
- `infrastructure`
- `quality`
- `repeat-transient`

일시적인 문제인지 판단하세요(재실행 시 성공할 가능성이 높은지).

## 이슈 생성

일시적 문제가 **아니라면**:

1. 본문에 `Run ID: ${{ github.event.workflow_run.id }}`를 참조하는 열린 이슈를 검색하세요. 이렇게 하면 특수 문자를 포함하거나 안정적으로 일치시키기 어려운 동적 워크플로 이름 레이블을 만들지 않아도 됩니다. `run-id:${{ github.event.workflow_run.id }}`와 같은 레이블이 이미 있으면 정확한 일치를 위해 우선 사용하세요.
2. 이슈가 있으면 새로 만들지 말고 발견 사항을 요약한 뒤 `noop`를 호출하세요.
3. 이슈가 없으면 다음 내용으로 하나를 만드세요.
   - 제목: `🔧 Auto-Remediation: Build Failure Run #${{ github.event.workflow_run.run_number }}`
   - 레이블: 기존 레이블만 포함하세요. 존재하는 경우 `auto-remediation`, 실행별 그룹화를 위한 `workflow-run:${{ github.event.workflow_run.run_number }}`, `category:<category>`를 우선하세요. 없는 레이블은 생략하고 실패 없이 계속 진행하세요. 이 워크플로에서 새 레이블을 만들지 마세요. 레이블 생성은 이 워크플로 외부에서 별도로 처리해야 합니다.
   - 본문 형식:

```markdown
### 빌드 실패 분석
- **워크플로 실행:** [#${{ github.event.workflow_run.run_number }}](${{ github.event.workflow_run.html_url }})
- **Run ID:** ${{ github.event.workflow_run.id }}
- **범주:** <category>
- **커밋:** ${{ github.event.workflow_run.head_sha }}

#### 요약
<간결한 요약>

#### 해결 계획
<단계별 계획>

#### 링크
- [실패한 워크플로 실행](${{ github.event.workflow_run.html_url }})
- [리포지토리](${{ github.server_url }}/${{ github.repository }})
```

4. 범주가 `code`, `test` 또는 `config`이면 `assign-to-agent` safe output으로 이슈를 Copilot에 할당하세요.
   - `assign-to-agent` safe output은 Copilot 에이전트를 사용하도록 미리 설정되어 있습니다.
   - 동일한 실행에서 할당되도록 `create-issue` 출력에 항상 `temporary_id`를 포함하고 `assign-to-agent` 출력의 `issue_number`로 재사용하세요.
   - 출력 예(순서가 중요함):
     ```json
     {"type":"create_issue","temporary_id":"aw_abc123def456","title":"🔧 Auto-Remediation: Build Failure Run #123","body":"..."}
     {"type":"assign_to_agent","issue_number":"aw_abc123def456","agent":"copilot"}
     ```

## 출력 요구 사항

- safe output(`create-issue`, `assign-to-agent`, `noop`)만 사용하세요.
- 원시 로그나 비밀 값을 출력하지 마세요.
- 요약은 간결하고 실행 가능하게 유지하세요.