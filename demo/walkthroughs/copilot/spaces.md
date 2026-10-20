# Copilot Spaces

- [Copilot Spaces](#copilot-spaces)
  - [데모: 규정 준수 Space 데모](#데모-규정-준수-space-데모)
    - [규정 준수 Space 데모 1: 일반적인 Copilot Spaces 질문](#규정-준수-space-데모-1-일반적인-copilot-spaces-질문)
    - [규정 준수 Space 데모 2: Space와 코드베이스를 결합한 규정 준수 평가](#규정-준수-space-데모-2-space와-코드베이스를-결합한-규정-준수-평가)
    - [규정 준수 Space 데모 3: Spaces MCP로 특정 코드의 규정 준수 확인](#규정-준수-space-데모-3-spaces-mcp로-특정-코드의-규정-준수-확인)
      - [MCP에서 Spaces 도구 활성화](#mcp에서-spaces-도구-활성화)

## 데모: 규정 준수 Space 데모

Copilot Spaces 데모는 같은 이름의 저장소인 `od-octocat-supply-compliance-docs`에서 자료를 가져오는 `OD OctoCAT Supply Compliance Docs` Space를 중심으로 진행됩니다. 둘 다 데모 저장소의 조직에서 찾을 수 있습니다.

> [!IMPORTANT]
> **Space나 저장소를 변경하지 마세요!:** 둘 다 데모 환경의 모든 데모가 공유하는 정적 리소스입니다. 다른 데모에 영향을 주므로 변경하거나 수정하지 마세요.

이 Space와 문서는 enterprise의 소프트웨어 개발 팀이 따라야 하는 법률, 보안 및 규정 준수 관련 규칙과 가이드라인의 현실적인 예제로 설계되었습니다.

여러 데모가 포함되어 있으며 개별적으로 또는 여기에 제시된 순서대로 진행할 수 있습니다.

> [!NOTE]
> **모델 선택 참고:** 모델 선택에 따라 답변 구조와 길이가 크게 달라집니다.
>
> - `GPT-4`는 매우 장황하고 상세합니다. 프롬프트의 목적이 AI assistant에 관련 컨텍스트를 모두 제공하기 위한 정보 전달(예: Issue 생성이나 코딩)이라면 좋지만 사람이 읽기에는 덜 적합합니다.
> - 반면 `Gemini 1.5 Pro`는 훨씬 간결하고 핵심적이어서 사람이 읽기에 더 나은 경우가 많습니다.
> - `Claude 3 Sonnet`은 그 중간 정도이지만 역시 더 간결한 편입니다.
>
> 다른 모델도 자유롭게 실험해 보세요.

### 규정 준수 Space 데모 1: 일반적인 Copilot Spaces 질문

1. `/copilot/spaces`로 이동한 후 Organization 탭에서 `OD OctoCAT Supply Compliance Docs` Space를 찾습니다.
2. 규정 준수 질문에 대한 Copilot 동작을 조정하는 정교한 지침을 강조합니다. 콘텐츠와 저장소를 보여 주며 규정 준수 문서가 대체로 길고 복잡하다는 점을 설명할 수도 있습니다.
3. 다음 질문을 합니다(`Gemini 1.5 Pro` 모델 권장).

    ```txt
    쿠키 배너를 구현해야 합니다. 규정 준수 관점에서 무엇을 고려해야 하나요?
    ```

4. Copilot이 규정 준수 문서에서 관련 정보를 추출하고 포괄적인 답변과 추가 조사를 위한 출처를 제공하는 모습을 보여 줍니다.

### 규정 준수 Space 데모 2: Space와 코드베이스를 결합한 규정 준수 평가

1. `/copilot/`로 이동합니다(`/copilot/spaces`가 아님에 주의).
2. Copilot Space `OD OctoCAT Supply Compliance Docs`와 데모 저장소를 모두 추가 컨텍스트로 첨부합니다.
3. `GPT-4`(매우 장황함) 또는 `Gemini 1.5 Pro`(더 간결함)를 사용하여 요청합니다.

    ```txt
    출시 전에 저장소의 규정 준수 준비 상태를 평가해 주세요.
    웹 쇼핑몰을 출시하기 전에 아직 보완해야 할 부분은 무엇인가요?

    철저하게 검토해 주세요. 기존 PR과 Issue를 분석하여 이미 처리한 내용을 확인하고 아직 구현해야 하는 항목을 나열해 주세요.
    ```

4. 특정 파일과 PR을 참조한 포괄적인 코드베이스 규정 준수 평가와 함께, 정식 출시(GA) 전에 규정 준수를 위해 완료해야 할 작업 목록을 생성하는 모습을 보여 줍니다.
5. 다시 요청합니다.

    ```txt
    좋아요. 필요한 모든 단계를 더 체계적으로 묶고 더 간결하게 정리해 줄 수 있나요?

    실행 가능한 작업 목록을 만들고 단계별로 묶어 우선순위를 정해 주세요. GA를 막는 항목(Phase 0), GA 직후 필요한 항목(Phase 1), 나중으로 미룰 수 있는 항목(Phase 2)은 무엇인가요?
    ```

6. Copilot이 Space의 정보를 다시 활용하여 규정 준수 작업에 우선순위를 지정하고 실행 가능한 단계로 묶는 모습을 보여 줍니다.
7. 마지막으로 모든 작업에 대한 상세한 상위 Issue 및 하위 Issue 목록 초안을 요청합니다.

    ```txt
    이제 Issue를 생성해 주세요.

    "Become Compliant"라는 제목의 Epic으로 상위 Issue 하나를 만들고 나머지 모든 작업을 상세 내용과 함께 하위 Issue로 추가해 주세요. 각 단계를 명확하게 표시해 주세요.
    ```

8. 해당 Issue를 실제로 생성한 후 구현을 위해 Copilot Coding Agent에 할당할지는 자유롭게 선택합니다.

### 규정 준수 Space 데모 3: Spaces MCP로 특정 코드의 규정 준수 확인

> [!IMPORTANT]
> 현재 Copilot Spaces 도구는 GitHub Remote MCP에서만 사용할 수 있습니다. 기본 도구 모음에 포함되어 있지 않으므로 별도로 구성해야 합니다. 작동하지 않으면 [아래 지침](#mcp에서-spaces-도구-활성화)을 따르세요. 제공된 Codespace에는 이미 `github-remote`로 구성되어 있습니다.

데모 실습 단계:

1. 저장소를 checkout하고 `github-remote` MCP 서버가 실행 중인지 확인합니다.
2. `feature-add-tos-download` 브랜치를 checkout합니다.
3. Copilot Chat을 열고 `GPT-4` 또는 `Gemini 1.5 Pro` 모델을 사용하여 `Agent` 모드로 전환합니다.
4. 다음 프롬프트를 입력합니다.

    ```txt
    Copilot Space `OD OctoCAT Supply Compliance Docs`의 콘텐츠를 가져와 주세요. 가져온 후 PR의 현재 변경 사항을 분석해 주세요. 서비스 약관 다운로드에 필요한 모든 언어를 포함했나요?
    ```

5. 사용할 수 있는 추가 프롬프트:

    ```txt
    개인정보 처리방침 업데이트에 필요한 모든 법적 고지 사항이 포함되어 있는지 확인해 주세요.
    ```

    ```txt
    쿠키 배너를 구현해야 합니다. Copilot Space `OD OctoCAT Supply Compliance Docs`의 규정 준수 요구 사항에 따라 구현해 주세요.
    ```

#### MCP에서 Spaces 도구 활성화

Copilot Spaces 도구는 GitHub Remote MCP Server의 기본 도구 모음에서 활성화되어 있지 **않습니다**. 활성화하려면 `.vscode/mcp.json` 파일에서 `X-MCP-Toolsets: copilot_spaces` 헤더를 사용해야 합니다. 다른 도구와 함께 사용할 수 있도록 구성 예제를 제시합니다.

```json
"github-remote": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "X-MCP-Toolsets": "actions, code_security, dependabot, discussions, issues, orgs, projects, pull_requests, repos, secret_protection, security_advisories, copilot, copilot_spaces"
  }
},
```

별도로 유지하려면 Copilot Spaces만을 위한 전용 MCP 서버 항목을 구성할 수도 있습니다.

```json
"github-copilot-spaces": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "X-MCP-Toolsets": "copilot_spaces"
  }
},
```

전체 내용은 [github/github-mcp-server 문서](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md?tab=readme-ov-file#additional-remote-server-toolsets)를 참조하세요.
