<a id="octocat-supply-chain-management---demo-walkthroughs"></a>
# OctoCAT 공급망 관리 - 데모 가이드

OctoCat 스타일의 현대적인 TypeScript 웹 애플리케이션(React frontend + Express API)으로 GitHub의 enterprise 기능을 보여 주는 종합 데모 환경입니다!

<a id="-quick-setup"></a>
## 🚀 빠른 설정

**많은 데모를 IDE 없이 진행할 수 있습니다!** 대부분의 GitHub 기능(Issues, Projects, Actions, GHAS, Pull Requests)은 웹 기반이므로 로컬 개발 환경 설정이 필요하지 않습니다.

<a id="for-ide-based-demos"></a>
### IDE 기반 데모

<a id="option-1-codespaces-recommended"></a>
#### 방법 1: Codespaces(권장)

- ✅ 설정 불필요 - 모든 항목이 미리 설정됨
- ✅ Docker 및 의존성 포함
- ✅ 브라우저와 로컬 VS Code의 API endpoint 자동 감지
- ❌ 일부 Copilot MCP 데모(예: Playwright)는 작동하지 않음

<a id="option-2-local-checkout"></a>
#### 방법 2: 로컬 checkout

- ✅ 모든 MCP 데모를 포함한 전체 기능
- ✅ 고부하 작업에서 더 나은 성능
- ❌ 로컬 설정 필요([메인 README](../../README.md)의 지침 참고)
- **요구 사항**: Docker, repo 권한이 있는 GitHub PAT

<a id="optional-vscode-insiders"></a>
### (선택 사항) VSCode Insiders

preview 기능을 시연하지 않는다면 VS Code Insiders는 필요하지 않습니다. Codespaces에서는 왼쪽 아래 톱니바퀴 아이콘 → `Switch to Insiders Version...`으로 전환합니다.

![Insiders로 전환](./images/vscode-switch-to-insiders.png)

<a id="-available-walkthroughs"></a>
## 📚 이용 가능한 가이드

<a id="-github-copilot--ai-features"></a>
### 🤖 GitHub Copilot 및 AI 기능

**파일:** [copilot-in-ide.md](./copilot/copilot-in-ide.md)

다음 GitHub Copilot 기능을 종합적으로 시연합니다.

- **Planning Mode**: Copilot Chat으로 새 기능 계획
- **Mission Control**: 여러 Copilot Coding Agent session 관리
- **Custom Agents**: BDD Specialist와 같은 repository 전용 agent
- **Copilot Code Review**: AI 지원 pull request review
- **Group Changes**: Copilot이 PR의 관련 파일 변경을 자동으로 그룹화
- **Copilot Spaces**: compliance 및 knowledge base 통합
- **TDD Agent Mode**: 자동 agent handoff를 사용하는 Test-Driven Development workflow
- **Agent Mode & Vision**: 자연어와 이미지로 장바구니 기능 생성
- **Unit Testing**: 자동 테스트 생성 및 coverage 개선
- **Custom Instructions**: 내부 framework와 표준에 맞게 Copilot 맞춤화
- **MCP Servers**: Playwright 테스트 및 GitHub API 통합
- **보안 분석**: 취약점 감지 및 자동 수정
- **CI/CD 생성**: Actions 및 Infrastructure as Code로 workflow 자동 생성
- **Copilot Coding Agent**: 비동기 task handoff 및 병렬 실험

### 🛠️ Agent Skills

**파일:** [agent-skills.md](./copilot/agent-skills.md)

Agent Skills가 일관된 코드 생성을 위해 특정 지식/pattern/지침을 담는 방식을 시연합니다.

- **Skills 개요**: Agent Skills의 개념과 작동 방식, Skills와 Custom Instructions를 각각 사용하는 시점
- **API endpoint 생성**: `api-endpoint` skill로 새 entity(DeliveryVehicle) 추가
- **Pattern 준수**: 생성된 코드가 캡슐화된 skill 정의를 따르는 방식

### ✨ GitHub Spark

**파일:** [spark.md](./spark.md)

Product Manager가 아이디어에서 prototype을 거쳐 배포된 앱까지 만드는 과정을 시연합니다.

- **앱 생성**: 자연어 prompt로 full-stack prototype 생성
- **실시간 편집**: UI와 logic을 개선하는 point-and-edit 경험
- **신속한 prototyping**: 번거로운 설정 없이 아이디어를 조기에 검증

### 🔒 GitHub Advanced Security (GHAS)

**파일:** [ghas.md](./ghas/ghas.md)

다음 보안 중심 데모를 제공합니다.

- **CodeQL & Code Scanning**: 기존 코드의 취약점 감지
- **Autofix**: AI 기반 취약점 수정
- **CCA & CodeQL**: Copilot Coding Agent가 CodeQL 도구를 자동으로 사용
- **Alert 할당**: 보안 수정을 Coding Agent에 위임
- **PR 보안**: 취약한 코드의 merge 방지
- **실시간 취약점 데모**: 대화형 보안 테스트 시나리오
- **Secret Scanning**: 노출된 credential 및 token 감지(확장 metadata 포함)

### 💎 Code Quality

**파일:** [code-quality-demo.md](./ghas/code-quality-demo.md)

코드 품질 및 유지 관리 기능:

- **활성화**: Code Quality 분석 설정
- **발견 사항 검토**: 코드 품질 문제 분석
- **Copilot 수정**: 품질 문제에 대한 수정안 생성 및 적용
- **PR 통합**: Pull Request에서 코드 품질 문제 검토

### ⚙️ GitHub Actions & CI/CD

**파일:** [actions.md](./actions.md)

Workflow 및 자동화 데모:

- **Required Workflows**: organization 수준의 workflow 강제 적용
- **Dependency Review**: 의존성의 자동 보안 검사
- **Reusable Workflows**: 공통 CI/CD 작업 간소화
- **Artifact Attestations**: 빌드 provenance 및 SBOM 생성과 검증

<a id="-governance--compliance"></a>
### 🏛️ Governance 및 compliance

**파일:** [governance.md](./governance.md)

Enterprise governance 기능:

- **AI Controls**: Agent Ruleset 및 Copilot 정책 관리(Control Plane)
- **Repository Rulesets**: metadata 기반의 동적 규칙 강제 적용
- **Custom Properties**: repository 분류 및 자동 정책 적용
- **Branch Protection**: pull request 요구 사항 및 security scanning
- **Compliance workflow**: 필수 보안 및 품질 검사

<a id="-issues--project-management"></a>
### 📊 Issues 및 프로젝트 관리

**파일:** [issues-and-projects.md](./issues-and-projects.md)

프로젝트 계획 및 추적 데모:

- **Issue 관리**: type, dependency 및 sub-issue
- **Project board**: custom field를 사용하는 Agile workflow 시각화
- **자동화**: 프로젝트 항목 관리를 위한 내장 workflow
- **View**: Backlog, Sprint Board, Roadmap 등 지원

<a id="-utilities--guides"></a>
### 📦 유틸리티 및 가이드

**파일:** [general-demo-overview.md](./general/general-demo-overview.md)

- **일반 설정**: 애플리케이션 빌드, 실행 및 디버깅
- **데모 철학**: 이 앱을 시연하는 이유와 방법

**파일:** [patch-sets.md](./general/patch-sets.md)

- **Patch Set**: "가상 live" 코딩 데모에 미리 준비된 변경 사항을 사용하는 방법
- **Patch 생성**: 새 patch set 생성 가이드

<a id="-tips-for-success"></a>
## 💡 성공적인 데모를 위한 팁

- **비결정적인 AI**: Copilot 응답은 달라지므로 상황에 맞게 대응할 준비를 하세요.
- **연습**: live 데모 전에 모든 시나리오를 연습하세요.
- **조합**: 청중의 요구에 맞춰 여러 가이드를 조합하세요.

---

**도움이 필요하신가요?** 각 가이드 파일에는 성공적인 데모를 위한 상세한 단계별 지침과 문제 해결 안내가 있습니다.
