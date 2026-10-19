# Ralph Loop 데모

"Ralph loop"는 작업이 완료될 때까지 AI가 계속 작업하는 반복 개발 패턴입니다. 각 반복은 새롭게 시작하여 컨텍스트 윈도 오염을 방지하고 "무한한 컨텍스트"처럼 느껴지게 합니다.

사용자 지정 agent와 subagent로 Ralph loop와 동일한 효과를 얻을 수 있습니다!

**VSCode에서 "Ralph Loop"를 사용하는 주요 이점:**
- 오프라인 agent나 실행용 컴퓨팅 자원을 설정할 필요가 없습니다
- 여전히 완전한 제어권을 가지며 원할 때 언제든 loop를 중지할 수 있습니다
- 필요하면 백그라운드에서 계속 진행하거나 Cloud로 넘길 수 있습니다
- Copilot이 새로운 AI 종교를 만들 가능성은 낮습니다(그렇게 하라고 지시하지 않는 한 :-) )

## 데모: `api-endpoint` Skill로 새 엔터티 추가하기

이 시나리오에서는 "API Test Coverage" loop를 사용합니다. [looper agent](.github/agents/api-coverage-looper.agent.md)가 API route를 검색하여 테스트가 있는 route와 없는 route를 확인합니다. 그런 다음 `subAgents` 도구로 [test-writer agent](.github/agents/api-test-writer.agent.md)를 병렬 호출하여 route별 테스트를 작성합니다(각각 subagent로 실행하여 컨텍스트를 간결하게 유지). 이때 `argument-hint`로 테스트할 route를 전달합니다.

Loop가 시작되면 새 세션을 시작할 수 있으며, looper는 모든 route에 테스트가 생길 때까지 백그라운드에서 계속 실행됩니다!

### 방법

1. 새 Copilot Chat 세션을 엽니다.
2. "Local"을 선택한 다음 agent로 `API Coverage Looper`를 선택합니다. 모델을 선택합니다. 이 데모에는 Haiku나 Gemini Flash 같은 작은 모델로도 충분합니다.
3. Chat에 `테스트 커버리지를 완성해 주세요`를 입력하고 실행되도록 둡니다.
4. 몇 초간 실행한 후 여러 subagent가 컨텍스트를 깔끔하게 유지하기 위해 각자의 스레드에서 병렬로 작업을 시작했음을 강조합니다.
5. 각 subagent에서 "Allow tools"를 클릭해야 합니다(가장 쉬운 방법은 "Allow all tools in this session"). 그렇지 않으면 도구를 호출할 때마다 권한을 요청합니다.
6. 이것이 `yolo` 방식이며 주의해야 한다고 강조합니다!
7. 이제 왼쪽 위 "Back" 화살표를 클릭하여 새 Chat을 시작할 수 있습니다. 작업은 원래 세션에서 계속되며 세션 보기에서 다시 전환할 수 있습니다.
8. Subagent가 완료되면 모든 API route의 커버리지를 보여 주는 최종 보고서가 표시됩니다.

## 보너스! Copilot CLI Fleet 데모

대안으로 CLI의 `fleet` 명령을 사용하여 subagent를 병렬로 실행할 수 있습니다!

최신 버전의 Copilot CLI를 설치합니다. 그런 다음 저장소 폴더에서 `copilot`을 실행합니다.

1. `yolo`를 입력하여 모든 명령을 허용합니다(위험성을 강조하세요!)
2. `/agent`를 입력하고 "API Coverage Looper Agent"를 선택합니다
3. `/fleet complete coverage`를 입력하여 fleet을 시작하고 모든 테스트 작성을 병렬로 완료합니다
