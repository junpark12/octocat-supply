# Copilot Code Review :copilot: 👀

> [!WARNING]
> 새 CCR 기능은 아직 feature flag로 제한되어 있으며 화요일 Keynote 이후에만 사용할 수 있습니다.

Copilot Code Review(CCR)에 다음 기능이 추가되었습니다.

- Code Graph 접근을 통한 **향상된 컨텍스트 인식**
- CodeQL과 ESLint를 첫 지원 도구로 하는 **추가 도구 호출**
- 가시성과 감사 가능성을 높이는 **Actions 내 실행**
- 더 정교한 수정도 빠르게 구현할 수 있도록 **제안을 Coding Agent에 넘기는 기능**

## Copilot Code Review 데모 흐름

1. **PR에 CCR 할당:** 데모 저장소에서 `Feature: Add ToS Download` PR을 찾아 Copilot을 검토자로 할당합니다.
2. **Actions로 이동:** 이제 CCR은 GitHub Actions 내에서 실행됩니다. `Actions` → `Copilot Code Review`에서 확인할 수 있습니다.

    ![Actions의 Copilot Code Review 워크플로](../images/ccr_workflow.png)

   1. **CodeQL 분석:** CCR이 이제 기본적으로 CodeQL Scan을 사용하는 방식을 강조합니다.

      ![Copilot Code Review Actions의 CodeQL 분석 단계](../images/ccr_action.png)

   2. **자동 검증(ESLint):** `Autovalidate` job으로 이동합니다. 여기서 `Run ESLint` 단계를 찾을 수 있습니다. 이를 통해 CCR이 이제 검토 과정에서 ESLint를 실행할 수 있음을 강조합니다.

      ![Run ESLint 단계가 표시된 Autovalidate job](../images/ccr_eslint.png)

3. **발견 사항 검토:** 검토가 끝나면 PR로 돌아갑니다. 주의할 점은 Copilot의 비결정적 동작으로 인해 데모마다 발견 사항이 다를 수 있다는 것입니다. 해당 발견 사항이 없으면 Copilot을 다시 할당하거나 고객이 추가로 기대할 수 있는 다음 발견 사항을 설명합니다.

   1. **[CodeQL] 취약점 발견:** CodeQL scan으로 CCR이 새 endpoint에서 path traversal 취약점을 발견했습니다.

      ![새 endpoint의 path traversal 취약점을 보여 주는 CodeQL 발견 사항](../images/ccr_finding_codeql.png)

   2. **[ESLint] 규칙 위반:** 오류를 반환하는 ESLint 실행으로 CCR이 문제를 발견했습니다(CI 워크플로에서도 발견되지만 CCR을 사용하면 쉽게 수정할 수 있습니다).

      ![새 endpoint의 규칙 위반을 보여 주는 ESLint 발견 사항](../images/ccr_finding_eslint.png)

   3. **[지침] Swagger 누락:** CCR이 새 endpoint의 Swagger 문서 누락을 발견한 모습을 보여 줍니다. 이 발견은 `.github/instructions/api.instructions.md`의 지침 파일에 기반합니다. 파일을 열어 CCR이 지침 파일을 활용하여 검토를 개선하는 방식을 보여 줄 수 있습니다.

      ![지침 파일을 바탕으로 Swagger 문서 누락을 보여 주는 CCR 발견 사항](../images/ccr_finding_instructions.png)

   4. **추가 컨텍스트:** CCR은 Code Graph로 PR에 포함되지 **않은** 추가 컨텍스트를 찾습니다. 이 예제의 PR에는 React Query 관련 내용이 전혀 없습니다.

      ![Code Graph에서 PR 외부의 추가 컨텍스트를 보여 주는 CCR 발견 사항](../images/ccr_finding_additional_context.png)

4. **`Implement Suggestions`:** 마지막으로 버튼 한 번으로 모든 발견 사항의 구현을 CCA에 넘기는 방법을 설명합니다.

    ![Copilot Code Review PR의 Implement Suggestions 버튼](../images/ccr_handover_to_cca.png)

## PR의 Copilot 변경 사항 그룹화 :copilot: 📦

> [!WARNING]
> Group Changes는 사람이 생성하거나 편집한 PR에만 표시되므로 기존 `Feature: Add ToS Download` PR에는 나타나지 않습니다. 이 기능을 쉽게 시연할 수 있도록 `feature-add-cart-page` 브랜치를 추가했습니다.

1. `feature-add-cart-page` 브랜치에서 `main` 브랜치로 pull request를 엽니다(데모 저장소에 처음 접근하면 안내가 표시됩니다).
2. PR의 `Files changed` 탭으로 이동합니다.
3. 오른쪽 위에서 Copilot이 변경 사항을 논리적 섹션으로 묶어 검토와 이해를 쉽게 하는 모습을 보여 줍니다.

  ![Pull request에서 그룹화된 변경 사항](../images/copilot-group-changes.png)

> [!TIP]
> 또는 기존 `Feature: Add ToS Download` PR에 형식적인 commit을 추가하여(아무 곳에나 주석 추가) 변경 사항 그룹화를 실행할 수 있습니다. 어차피 이 단계가 필요한 [코드 품질 데모](#-code-quality-demo)와 결합할 수도 있습니다.
