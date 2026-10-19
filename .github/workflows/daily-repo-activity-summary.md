---
name: Daily Repo Activity Summary
description: 지난 24시간의 리포지토리 활동을 요약하는 일일 이슈를 생성합니다.
on:
  schedule: daily
permissions:
  contents: read
  issues: read
  pull-requests: read
  metadata: read
safe-outputs:
  create-issue:
    title-prefix: "[daily activity] "
    max: 1
network: {}
tools:
  github:
    toolsets: [repos, issues, pull_requests, search, context]
---

# 일일 리포지토리 활동 요약

지난 24시간의 리포지토리 활동을 요약하는 GitHub 이슈 하나를 만드는 자동화 에이전트입니다.

## 작업

1. 지난 24시간의 리포지토리 활동에서 다음을 중점적으로 검토하세요.
   - 생성되거나 닫힌 이슈.
   - 생성, 종료 또는 병합된 pull request.
   - 댓글이 많은 스레드, 다시 열린 항목, 높은 우선순위 레이블이 있는 항목 등의 주요 활동.
2. GitHub API 데이터로 세부 정보를 수집하세요. 지난 24시간에 발생한 항목만 포함하세요.
3. safe output `create-issue`를 사용하여 간결한 요약 이슈를 준비하세요.

## 출력 요구 사항

- 제목은 설정된 접두사를 사용하고 간결해야 합니다(예: "[daily activity] 2026-02-04 리포지토리 요약").
- 본문은 보고 형식 지침을 따라야 합니다.
  - `###` 또는 그보다 낮은 수준의 제목을 사용하세요.
  - 주요 집계 수치를 포함하는 요약 섹션을 제공하세요.
  - 이슈 및 PR 목록에는 `<details>` 섹션을 사용하세요.
  - 주목할 활동은 별도 섹션에 포함하세요.
- 각 이슈 또는 PR의 링크를 포함하세요.
- 활동이 없어도 이를 명시하고 이슈를 만드세요.

## 데이터 수집 지침

- ISO 타임스탬프를 사용하고 "현재"에서 24시간을 뺀 시각과 비교하세요.
- 활동에서 다른 대상을 가리키지 않는 한 PR은 기본 브랜치에 집중하세요.
- `search` toolset 쿼리로 해당 시간 범위에 업데이트된 이슈와 PR을 찾으세요.
  - 이슈 쿼리 예: `repo:${{ github.repository }} is:issue updated:>=TIMESTAMP`
  - PR 쿼리 예: `repo:${{ github.repository }} is:pr updated:>=TIMESTAMP`

## 안전

- 비밀 값이나 내부 메모를 포함하지 마세요.
- 실행당 이슈를 하나만 만드세요.
