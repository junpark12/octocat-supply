# MCP 서버

## **MCP 서버 설치 및 구성**

MCP 서버 통합을 보여 주려면 데모 _이전에_ MCP 서버를 설정하고 구성해야 합니다. 필요한 `mcp` 구성을 [mcp.json](../.vscode/mcp.json) 파일에 포함해 두었습니다. 파일을 열고 서버 위의 HUD 표시를 사용하여 시작합니다.

![Start 버튼과 playwright 및 github 서버가 표시된 VS Code MCP 서버 구성](./mcp.png)

Command Palette로 MCP 서버를 시작할 수도 있습니다.

> [!NOTE]
> GitHub MCP 서버는 `github-local`과 `github-remote` 두 가지입니다. 로컬 서버는 `docker`로 실행됩니다(Podman이 설치되어 있다면 `podman`으로 변경해도 됩니다). 이 경우 PAT를 요청합니다. 원격 서버는 Remote MCP 서버에 연결하고 OAuth로 인증합니다. **둘 다 시작하지 말고 하나만 시작하세요**!

### Playwright MCP 서버 시작

- Command Palette에서 `Cmd/Ctrl + Shift + P` -> `MCP: List servers` -> `playwright` -> `Start server`를 사용합니다

### GitHub MCP 서버 시작

> [!IMPORTANT]
> Issue와 PR, 컨텍스트 및 시연하려는 다른 기능에 대한 읽기/쓰기 권한이 있는 fine-grained PAT를 생성하세요. 조직/저장소 수준에서 만들 수 있습니다. 쉽게 사용할 수 있도록 PAT를 생성하여 key vault(또는 1Password)에 저장하는 것을 권장합니다.

- 이 서버는 Docker 이미지로 실행되므로 서버를 시작하기 전에 Docker를 설치하고 실행해야 합니다. 저는 Mac에서 Podman을 사용합니다.
- Command Palette에서 `Cmd/Ctrl + Shift + P` -> `MCP: List servers` -> `github` -> `Start server`를 사용합니다. 처음 실행할 때 PAT를 제공해야 합니다.

> **전문가 팁:** PAT를 변경하려면 Settings json 파일을 엽니다. `input` 섹션에 `"id": "github_token" = ****`가 표시됩니다. `***` 부분을 마우스 오른쪽 버튼으로 클릭하여 캐시된 토큰을 편집하거나 지웁니다.(`***`는 GUI 기능이며 실제 값은 json 파일에 저장되지 않습니다.)

## 데모: MCP 서버 - Playwright  

- **보여 줄 내용:** Playwright MCP 서버로 브라우저 탐색을 시작하여 자연어 기반 기능 테스트와 사용자 지정 프롬프트를 통한 feature 파일 생성을 보여 줍니다.
- **이유:** MCP 서버 프로토콜을 활용한 Copilot 기능 확장과 사용자 지정 프롬프트로 테스트 방식을 표준화하는 방법을 보여 줍니다.
- **1부 - 사용자 지정 BDD 모드:**
  1. `BDD` 모드로 전환합니다.
  2. `장바구니 아이콘과 페이지를 테스트할 feature를 추가해 주세요`라는 프롬프트로 Cart 기능에 대한 포괄적인 Gherkin feature 파일을 생성합니다
  3. 생성된 동작 테스트 시나리오를 보여 줍니다

- **(선택 사항) 2부 - Playwright MCP:**
  1. Copilot에 `다음 주소로 이동하여 테스트 단계를 실행해 주세요: http://localhost:5137`라고 요청합니다
  2. Playwright 명령 요청을 수락하고 Copilot이 테스트를 "실행"하는 모습을 보여 줍니다.
  3. (선택 사항): Copilot에 `.feature 파일에 대한 headless Playwright 테스트를 생성해 주세요`라고 요청합니다

- **핵심 요점**: MCP 서버는 Copilot의 기능을 확장하고 사용자 지정 프롬프트는 팀 전반의 테스트 접근 방식을 표준화할 수 있습니다.

## 데모: MCP 서버 - GitHub

- **보여 줄 내용:** Chat에서 GitHub와 상호 작용합니다.
- **이유:** MCP 서버 프로토콜과 GitHub MCP 서버를 사용한 Copilot 기능 확장을 보여 줍니다.
- **방법:**  
  1. Agent 모드로 전환합니다
  2. Copilot에 `저장소에서 나에게 할당된 Issue를 확인해 주세요`라고 요청합니다.
  3. Copilot이 가져온 Issue를 보여 줍니다(또는 Issue가 없음을 보여 줍니다)
  4. Copilot에 `API 프로젝트의 테스트 커버리지 향상을 위한 Issue를 생성하고 나에게 할당해 주세요`라고 요청합니다.(인수의 owner/repo를 꼭 확인하세요!)
  5. Copilot이 의미 있는 설명과 label을 포함한 새 Issue를 만드는 모습을 보여 줍니다
  6. (선택 사항): Issue를 Copilot에 할당하여 Copilot Coding Agent를 대기열에 추가합니다!
