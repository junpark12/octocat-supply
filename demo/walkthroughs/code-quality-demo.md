<a id="code-quality-demo-"></a>
# Code Quality 데모 <img src="../images/koala_tea.png" alt="koala tea" width="30" height="30">

<a id="turn-on-code-quality"></a>
## Code Quality 활성화

>[!IMPORTANT]
> 현재 Code Quality를 활성화하는 API가 없으므로 데모 전에 수동으로 활성화해야 합니다.
> 또한 이 데모를 실행하기 전에 GHAS와 Default Setup이 활성화되어 있는지 확인해야 합니다.
> Default Setup이 활성화되어 있지 않으면 Code Quality가 작동하지 않습니다.

1. 데모 repository의 `Settings` 탭으로 이동합니다.
2. 왼쪽 sidebar에서 `Code Quality`를 클릭합니다.
3. `Enable Code Quality`를 클릭하여 기능을 활성화합니다.
  ![repository 설정의 Enable Code Quality 버튼](../images/code_quality_enable_view.png)
4. Code Quality가 repository를 분석할 때까지 몇 분 기다립니다.

<a id="review-code-quality-findings-and-generate-fixes-with-copilot"></a>
## Code Quality 발견 사항 검토 및 Copilot으로 수정안 생성

1. Code Quality 결과를 보려면 `Security` 탭을 클릭한 다음 왼쪽 sidebar의 `Code Quality` 아래에서 `All findings`를 선택합니다.
  ![Security 탭의 Code Quality 개요](../images/code_quality_security_tab_location.png)
2. 발견 규칙 중 하나를 선택하여 해당 규칙의 발견 사항 목록을 확인합니다.
3. `Show more`를 클릭하여 코드 품질 문제의 세부 정보와 제공된 권장 사항 및 예제를 검토합니다.
4. `Show less`를 클릭하여 화면을 접고 발견 사항에 집중합니다.
5. 발견 사항이 강조 표시됩니다. 다음으로 `Generate fix` 버튼을 클릭하여 Copilot으로 문제를 해결하는 수정안을 생성할 수 있습니다. Copilot이 수정안 생성을 마칠 때까지 기다립니다.
  ![Code Quality 규칙 화면](../images/code_quality_rule_view.png)
6. UI에 수정안이 표시되면 `Open pull request`를 클릭하여 제안된 수정안으로 PR을 생성할 수 있습니다.
  ![Copilot이 생성한 Code Quality 수정안](../images/code_quality_copilot_generated_fix.png)

<a id="review-code-quality-findings-in-a-pull-request"></a>
## Pull Request에서 Code Quality 발견 사항 검토

>[!IMPORTANT]
> 이 데모 전에 Code Quality를 수동으로 활성화해야 합니다. 그렇지 않으면 pull request에 발견 사항이 표시되지 않습니다.

1. 데모 repository의 `Pull requests` 탭으로 이동합니다.
2. `Feature: Add ToS Download` pull request를 엽니다.
3. `Files Changed` 탭에서 PR의 변경 사항을 확인합니다.
4. 변경된 파일 중 하나의 오른쪽 위 줄임표(`...`) 버튼을 클릭하고 `Edit file`을 클릭합니다.
5. 해당 파일에 주석 한 줄을 추가하고 변경 사항을 현재 commit에 추가합니다.
  ![pull request에서 파일 편집](../images/code_quality_edit_file_commit.png)
6. CI가 Code Quality 분석을 실행하고 결과를 GitHub에 업로드할 때까지 기다립니다. 약 1~2분이 소요됩니다.
7. `Conversation View`로 돌아가 `github-code-quality` bot comment까지 아래로 스크롤하여 이 PR의 Code Quality 발견 사항을 확인합니다.
  ![pull request의 Code Quality 발견 사항](../images/code_quality_pull_request.png)
8. comment에서 Copilot이 제공한 autofix 제안을 검토합니다.
9. 개발자가 선택할 수 있는 조치를 설명합니다. 제안을 PR에 commit하거나, 발견 사항을 dismiss하거나, autofix에 답글을 달 수 있습니다.
10. 제안을 PR에 commit했다면 CI가 실행되어 변경 사항을 검증할 때까지 기다립니다.
