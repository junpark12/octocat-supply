# Issue & Projects

## Issues

이 repository에는 GitHub Issues의 다양한 기능을 시연할 수 있는 issue가 미리 생성되어 있습니다.

- **PR과 issue 연결**: `Allow downloading our terms and conditions` issue는 미리 생성된 `Feature: Add ToS Download` PR과 연결되어 있습니다.
- **Sub-Issues**: `Add terms acceptance to checkout process` issue는 `Compliance Requirements`의 sub-issue이므로 상위 issue로 쉽게 이동할 수 있습니다.
- **Issue Types**: `Compliance Requirements` issue에서 `Epic` issue type을 확인하고 다른 sub-issue의 `Feature` 및 `Task`와 비교할 수 있습니다.
- **Issue Dependencies**: `Compliance Requirements` issue에서 `Add terms acceptance to checkout process` issue가 `Allow downloading our terms and conditions` issue에 의해 blocked 상태임을 확인할 수 있습니다.

## Projects

모든 issue는 repository에 연결된 project board에도 배치되어 있습니다. 여러 기능을 포함한 Agile 프로젝트의 실제 project board를 반영하도록 설계되었습니다.

> [!NOTE]
> 대부분의 기능은 직관적이고 project board 데모는 보통 클릭하며 보여 주는 방식으로 진행하므로 별도의 구체적인 단계별 가이드는 없습니다. 다만 데모를 준비한다면 다음 주요 항목을 강조하세요.

<a id="project-fields"></a>
### Project field

- **Status** (`Single Select`): 사전 정의된 값이 있는 Single Select field 시연
- **Priority** (`Single Select`): Single Select의 또 다른 활용 사례
- **Sprint** (`Iteration`): 날짜 범위가 지정된 선택 시연
- **Estimate** (`Number`): Story point(1, 2, 3, 5, 8) 추정에 사용
- **Squad** (`Single Select`): issue를 여러 팀에 쉽게 할당하는 방식 시연

<a id="views"></a>
### View

- **Team backlog:** Squad(`Teams`)별로 그룹화된 Backlog로 issue의 Status, Priority 및 Sub-Issue Progress 표시
- **Sprint Board:** 현재 sprint의 board view로 issue의 Status 및 Priority 표시
- **Roadmap:** 다음 두 sprint의 timeline view
- **PRs in review:** 미리 생성된 `Feature: Add ToS Download` PR을 보여 주며 PR도 계획의 일부가 될 수 있음을 시연
- **Copilot Tasks:** 이전에 Copilot에 issue를 추가했다면 여기에 표시
- **My items:** 현재 사용자에게 할당된 issue 표시
- **Needs triage:** `Status`로 issue를 필터링하는 방법 시연

<a id="workflows"></a>
### Workflow

Projects는 API 또는 Actions 기반의 custom 자동화 외에도 프로젝트별로 활성화하거나 비활성화할 수 있는 기본 workflow를 제공합니다. 예시는 다음과 같습니다.

- **Auto-add to project:** `is:issue state:open type:bug` 같은 필터 조건에 맞는 repository의 항목을 자동으로 추가합니다.
- **Auto-add sub-issues to project:** sub-issue가 있는 항목을 프로젝트에 추가할 때 sub-issue도 추가합니다.
- **Auto-archive items:** 30일 넘게 업데이트되지 않은 닫힌 항목처럼 더 이상 필요하지 않은 항목을 프로젝트에서 자동으로 archive합니다.
- **Item added to project:** 항목이 프로젝트에 추가되면 `Status`를 "Backlog" 또는 "Triage" 등으로 설정합니다.
- **Auto-close issue:** `Status`가 "Done"이나 다른 값으로 변경되면 issue를 닫습니다.
- **Item closed** 및 **Pull request merged**: issue가 닫히거나 pull request가 merge되면 `Status`를 "Done"으로 설정합니다.

### Insights

> [!WARNING]
> 데모를 "과거 시점에" 만들 수는 없으므로 `Burn up` 같은 시간 기반 insight에는 데이터가 많지 않습니다. 실제 프로젝트에서는 이러한 insight가 훨씬 더 유용하다는 점을 고객에게 설명하세요.

- **Bugs per sprint**: sprint마다 발생한 bug 수를 시각화하는 막대 차트
- **Priority Breakdown**: Status별로 Priority를 그룹화하여 최우선 항목이 진행 중인지 확인하는 방법 시연
- **Sprint capacity**: 각 sprint에 배치된 story point 수 시연
- **Team priority breakdown**: 팀별 우선순위 분포 시연
