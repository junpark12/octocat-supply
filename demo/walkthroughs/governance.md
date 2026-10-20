<a id="governance-features"></a>
# Governance 기능

## Rulesets & Custom Properties

repository에는 organization ruleset인 [OD OctoCAT Supply Ruleset](https://github.com/organizations/msft-common-demos/settings/rules/8702023)이 적용되어 다음과 같은 표준 규칙을 설정합니다.

1. main branch의 삭제, force push 등 방지
2. pull request 필수
3. CodeQL Scan 필수
4. 필수 workflow인 [Dependency Review]() 요구

이 ruleset은 값이 `high`인 custom property `od_octocat_supply_risk_tier`를 통해 적용됩니다. 이 custom property는 데모 repository에도 적용됩니다.

이를 통해 repository metadata에 따라 ruleset을 동적으로 적용하는 방식과, 이 방식이 제어력과 유연성을 함께 제공한다는 점을 보여 줄 수 있습니다.

데모에는 일부 규칙을 위반하는 `Feature: Add ToS Download` PR이 미리 생성되어 있습니다. 위반 사항이 표시되는 방식과 개발 과정에 미치는 영향을 보여 주며 이 PR에서 ruleset의 효과를 시연할 수 있습니다.

## Copilot Control Plane: "AI Controls" :copilot:🎛

![새 AI Controls 페이지의 위치](./images/copilot-control-plane-navigation.png)

새 AI Control Plane은 organization 전반의 AI 관련 기능 모니터링과 관리를 통합하는 enterprise 수준의 설정 페이지입니다. 정책과 access control 같은 기존 기능에 Agent Rulesets 같은 새 기능을 결합합니다.

> [!NOTE]
> enterprise 관리자 계정에 접근할 수 있을 때만 시연할 수 있습니다. GitHub 직원은 <https://github.com/enterprises/octodemo>를 사용합니다.

> [!IMPORTANT]
> **읽기 전용 데모**: enterprise 설정 변경은 모든 organization과 사용자에게 심각한 영향을 줄 수 있으므로 이 절에서는 설정 변경을 시연하지 마세요. 읽기 전용 데모입니다.

<a id="1-agents-section"></a>
### 1. Agents 영역

이 영역은 첫 화면으로, agent 관련 활동과 설정을 종합적으로 보여 줍니다.

데모에서는 더 명확하게 설명하도록 `GitHub Agents`와 `Custom Agents`로 나누는 것을 권장합니다.

<a id="11-github-agents-installed-agents-agent-sessions-and-audit-logs"></a>
#### 1.1. GitHub Agents: Installed Agents, Agent Sessions 및 Audit Log

> [!TIP]
> 여기로 오기 전에 본인의 CCA task를 시작해 두면 이 부분에서 상세 내용을 살펴볼 수 있어 좋습니다.

1. **Installed Agents:**
    1. **Installed Agents** 화면으로 이동합니다.
    2. enterprise에 `Copilot code review`와 `Copilot coding agent`가 모두 설치되어 있음을 보여 줍니다.
    3. 향후 추가 GitHub Agent가 이곳에 표시된다는 점을 설명합니다.
2. **Agent Sessions:**
    1. **Agent Sessions** 화면으로 이동합니다.
    2. agent type(`Code Review` 또는 `Coding Agent`) 및 특정 organization으로 session을 필터링할 수 있음을 보여 줍니다.
    3. issue 할당으로 시작된 실행 중인 session을 보여 줍니다.

        > [!WARNING]
        > 현재 본인이 아닌 다른 사람의 session에 접근하면 404 오류가 발생합니다. 향후 수정될 예정입니다.
3. **Copilot Audit Log:**
    1. 마지막으로 redirect 링크를 통해 **Audit Log**로 이동합니다.
    2. AI 관련 활동만 표시하도록 log에 `actor:Copilot` 필터가 미리 적용되어 있음을 보여 줍니다.

        ![actor:Copilot으로 필터링된 AI Control Plane Audit Log](./images/copilot-control-plane-actor-filter.png)

    3. `agent_session.task` event를 찾아 강조합니다.
    4. event를 클릭하고 상세 정보를 살펴보며 새로운 agent 전용 field를 보여 줍니다.
      - `actor_is_agent: true`
      - agent가 누구를 대신하여 작업하는지 보여 주는 `user` field

        ![Agent session 상세 정보](./images/copilot-control-plane-audit-log.png)

<a id="12-custom-agents-configuration-and-rulesets"></a>
#### 1.2. Custom Agents: 설정 및 ruleset

> [!NOTE]
> 향후 여러 항목을 선택할 수 있는 field로 변경되어 enterprise가 둘 이상의 organization에서 custom agent를 선택할 수 있게 됩니다.

이 영역에서는 enterprise 전반의 custom agent를 표준화할 수 있습니다.

1. **Custom Agent 설정:**
    1. enterprise에 따라 데모 organization이 미리 선택되어 있습니다. 향후 여러 항목을 선택할 수 있는 field가 된다는 점을 강조합니다.
    2. 목록의 custom agent 하나를 클릭하여 구현을 보여 주고, 모든 custom agent에서 동일한 `.github-private` repository와 그 구조를 강조합니다.
    ![private repository의 Custom Agent 구현](./images/copilot-control-plane-custom-agents.png)
2. **Custom Agent 생성 제어:**
    1. 기존 custom agent 규칙을 클릭합니다.
    ![평가 모드의 기존 custom agent ruleset](./images/copilot-control-plane-custom-ruleset.png)
    2. 규칙이 없으면 첫 클릭 시 생성된다는 점을 설명합니다.
    3. 이 사전 정의된 ruleset은 기본적으로 모든 organization과 repository에서 구성원이 지원 파일 경로(`.github/agents/*.md`)에 새 custom agent를 생성하지 못하게 한다는 점을 설명합니다.
    4. enterprise owner는 특정 organization이나 repository만 허용하거나, 완전히 자유롭게 사용하도록 규칙을 비활성화하는 등 필요에 따라 설정을 완화할 수 있음을 설명합니다.

> [!TIP]
> 데모를 위해 규칙을 `Evaluate` 모드로 두었습니다(enterprise 전반에서 custom agent 데모를 허용하려는 목적). 이 역시 규칙을 완화하는 좋은 예입니다.

<a id="2-copilot-section"></a>
### 2. Copilot 영역

**새로운 내용은 없습니다:** Copilot 영역은 기존 Copilot 정책의 위치만 바뀐 것입니다. 정책 자체는 바뀌지 않아 시연할 내용이 많지는 않지만, Copilot 관련 설정이 한곳에 통합되었다고 언급할 수 있습니다.

![현재 AI Controls의 새 위치로 redirect만 제공하는 이전 Copilot 정책 페이지](./images/copilot-control-plane-policies.png)

<a id="3-mcp-section"></a>
### 3. MCP 영역

> [!IMPORTANT]
> 현재 allowlist는 VS Code에서만 강제 적용됩니다. 다른 IDE와 GitHub.com 지원도 곧 제공될 예정입니다.

1. **MCP** 영역으로 이동합니다.
2. third-party MCP registry를 통해 **MCP allowlist**를 설정하는 새 정책을 강조합니다.
3. 여기에 third-party registry URL을 설정하면 enterprise 전체의 allowlist가 생성된다고 설명합니다. 이를 통해 개발자가 VS Code에서 agent를 사용할 때 검증된 MCP 연결만 허용됩니다.
