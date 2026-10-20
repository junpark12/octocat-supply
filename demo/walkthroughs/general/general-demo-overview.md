# **데모 소개**

- **앱 소개:** API와 Frontend(React) 프로젝트가 분리된 최신 TypeScript 웹 앱입니다. Copilot Agent Mode, Vision, MCP 서버, GHAS/Actions로 이 앱을 개선합니다.
- **이유:** Copilot이 기존 코드를 자동으로 분석하고 개선하며 이미지, 취약점, 테스트를 이해하는 방식과 MCP 서버로 Copilot의 기능을 확장하는 방법을 보여 줍니다.
- **데모**: 모든 데모를 진행하거나 순서대로 진행할 필요는 없습니다. 시나리오에 익숙해지도록 연습한 후 청중에 맞게 조합하세요.
- **MCP 서버**: GitHub MCP 서버는 Docker로 실행됩니다. 실행하려면 로컬에 Docker를 설치해야 합니다(Codespace에서는 자동으로 잘 작동할 것입니다). 저는 Mac에서 Podman을 사용합니다. 데모를 시도하기 _전에_ 설치하세요! 데모에 충분한 권한이 있는 PAT도 필요합니다. 자세한 내용은 아래에 있습니다.
- **Padawan**: Padawan을 사용하려면 저장소에서 Padawan과 Actions가 활성화되어 있고 `main`에 대한 브랜치 보호 규칙이 있는지 확인해야 합니다. Default 브랜치 변경에 PR을 요구하고 필수 검토자 1명을 지정하는 것을 권장합니다.
- **로컬과 Codespaces 비교:**  
  - 이 데모는 Codespace에서 진행할 수 있지만 일부 시나리오(예: Playwright 테스트 실행)는 로컬 VSCode에서 작업해야 합니다(저장소를 로컬로 clone)
  - 브라우저 기반 및 로컬 VS Code Codespaces 모두에서 API endpoint가 자동 감지됩니다. API 포트(3000)는 devcontainer에서 `public`으로 구성되며 브라우저 접근을 위해 설치 후 명령으로 강제 적용됩니다. Frontend는 올바른 endpoint URL을 동적으로 구성합니다.
  - API 포트(3000)가 자동으로 `public`으로 설정되지만 예상치 못한 CORS 오류를 피하려면 데모 전에 Codespace에서 포트 공개 여부를 확인하는 것이 좋습니다.
  - 고객 앞에서 진행하기 _전에_ 반드시 이 데모를 **연습**하세요
  - Copilot은 비결정적이므로 정확한 동작을 항상 예측할 수는 없습니다. 빠르게 대응할 수 있도록 환경에 익숙해지세요!
  - Preview 기능을 시연하려는 경우가 아니라면 **VS Code Insiders** 버전을 사용할 필요는 없습니다.
    - 웹 버전 Codespace에서 Insiders 버전에 접근하려면 왼쪽 아래 톱니바퀴 아이콘을 클릭하고 `Switch to Insiders Version...`을 선택합니다

  ![Insiders로 전환](../images/vscode-switch-to-insiders.png)

## **코드 빌드, 실행 및 디버깅**

[빌드 문서](../../docs/build.md)를 참조하세요.
