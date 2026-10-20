# 사용자 지정 Agent :copilot: 🤖

사용자 지정 Agent는 사용자 지정 프롬프트와 도구 모음으로 자신만의 agent를 만들 수 있는 새 기능입니다. 저장소의 `.github/agents` 폴더에 위치하며, 이제 [사용자 지정 Agent 구성 및 Ruleset 실습](../governance.md#12-custom-agents-configuration-and-rulesets)에서처럼 전체 enterprise에 대해 중앙에서 정의할 수도 있습니다.

> [!IMPORTANT]
> VSCode의 `ChatModes`가 `Agents`로 바뀝니다. 기능은 동일하지만 목적을 더 잘 나타내도록 이름이 변경되었습니다.

## BDD Agent

1. 데모 저장소로 이동합니다.
2. `.github/agents/bdd-specialist.md` 파일을 열어 고객에게 보여 줍니다.
3. 오른쪽 위에서 Agents Panel을 클릭합니다.
    ![저장소 보기의 Agents Panel 버튼](../images/custom-agent-agents-panel.png)  
4. `feature-add-tos-download` 브랜치를 선택합니다.
    ![Agents Panel의 브랜치 선택 드롭다운](../images/custom-agent-select-branch.png)

5. `BDD Specialist` agent를 선택합니다.

    ![Agents Panel에서 BDD Specialist agent 선택](../images/custom-agent-select-agent.png)

6. 다음 프롬프트를 입력하고 세션을 시작합니다.

    ```txt
    ToS 다운로드 기능에 포괄적인 BDD 테스트를 추가해 주세요!
    ```

    ![BDD Specialist agent로 새 세션 시작](../images/custom-agent-select-prompt.png)

7. Mission Control로 이동하여 실행 중인 세션을 보여 줍니다(데모 방법은 [Mission Control](./copilot-coding-agent.md#mission-control-copilot-) 참조).
8. 세션 도중이나 이후에, `BDD Specialist` agent가 프롬프트를 거의 또는 전혀 입력하지 않아도 정교한 BDD 테스트 모음을 만드는 방식을 강조합니다.

> [!TIP]
> 사용자 지정 agent 목록에 `Documentation Specialist`와 `Compliance Bot`이 표시됩니다. 이들은 enterprise 수준에서 정의된 사용자 지정 agent입니다. 간단히 언급하되 자세한 설명은 [사용자 지정 Agent 구성 및 Ruleset](../governance.md#12-custom-agents-configuration-and-rulesets) 데모에서 진행하세요.

### 대안 1: Cart 기능 사용

또는 `add-cart-page` 브랜치에서 다음 프롬프트로 이 기능을 시연할 수 있습니다.

```txt
Cart Page 기능에 포괄적인 BDD 테스트를 추가해 주세요!
```

## 대안 2: `API Specialist` 사용

위와 동일한 단계를 따르되 `.github/agents/api-specialist.md`에 있는 `API Specialist`와 다음 프롬프트를 사용합니다.

```txt
cartId를 반환하는 `POST /cart` 요청을 처리하는 새 Cart API endpoint와 해당 API를 `/cart/:cartId`로 사용할 수 있는 CRUD endpoint를 구현해 주세요.
```
