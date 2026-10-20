<a id="github-advanced-security-demo-features"></a>
# GitHub Advanced Security 데모 기능

## Code Scanning / CodeQL

> [!NOTE]
> 데모에서는 Code Scanning이 기본적으로 `Default Setup`으로 실행됩니다. CodeQL의 advanced setup을 시연하려면 아래 ["Advanced CodeQL Setup으로 전환"](#switch-to-advanced-codeql-setup)을 참고하세요.

<a id="main-branch-past-vulnerabilities"></a>
### Main branch: 기존 취약점

- **시연 내용:** GHAS Autofix는 기존 alert를 감지한 후 수정할 수 있습니다.
- **목적:** Copilot 기반 Autofix가 플랫폼에 내장되어 있음을 보여 줍니다.
- **진행 방법:**  
  1. repository의 security 페이지 -> Code Scanning으로 이동합니다.
  2. SQL injection(`Database query built from user-controlled sources`)을 포함한 여러 alert가 표시됩니다.
  3. "Generate fix"와 이를 통한 수정안 자동 생성을 보여 줍니다.
  4. Chat에서 이 취약점과 수정안에 관해 대화하는 방법을 보여 줍니다.

> [!NOTE]
> 여러 alert가 표시되지만 반드시 존재하는 것은 위 SQL injection alert뿐입니다. 다른 alert가 있으면 데모에 활용할 수 있으나, 데모 업데이트 시 일부를 수정하거나 변경할 수 있으므로 이에 의존하지 마세요.

<a id="pr-protection-introduced-vulnerabilities"></a>
### PR 보호: 새로 유입된 취약점

- **시연 내용:** GHAS는 pull request에 유입된 취약점을 감지할 수 있습니다.
- **목적:** GHAS가 취약한 코드의 merge를 사전에 방지할 수 있음을 보여 줍니다.
- **진행 방법:**  
  1. repository의 Pull Requests로 이동합니다.
  2. `Feature: Add ToS Download` PR을 찾습니다.
  3. Code Scanning 검사가 이미 끝났다면 다음 두 alert가 표시됩니다(순서는 무관).
     1. **Uncontrolled data used in path expression**
     2. **Missing rate limiting**
  4. `Uncontrolled data used in path expression`은 path traversal 취약점으로, 현재 OWASP 1위 취약점인 `Broken Access Control`에 속합니다(<https://owasp.org/Top10/A01_2021-Broken_Access_Control/>).
  5. GHAS가 path 및 data traversal을 보여 줄 뿐 아니라 Copilot Autofix가 이미 이 취약점의 수정안을 제공한다는 점도 시연합니다.

<a id="demo-exploiting-the-vulnerability"></a>
#### 취약점 악용 데모

이 취약점의 악용 방식을 시연하려면 다음을 진행합니다.

1. Codespace에서 PR의 branch를 checkout합니다.
2. `npm install`이 완료되면 `npm run dev`로 앱을 시작합니다.
3. 애플리케이션으로 이동합니다(시작 시 링크가 표시됩니다).
4. 페이지 맨 아래로 스크롤하여 `Terms & Conditions`를 클릭합니다.
5. 버튼 하나에 마우스를 올리고 오른쪽 클릭하여 URL을 복사합니다.
6. 브라우저 창에 붙여 넣은 다음 `&file=` 경로를 `file=../../super-secret.txt`로 바꿉니다.
7. `.api/documents/super-secret.txt`의 같은 이름 파일이 다운로드됩니다. 원래 허용되어서는 안 되는 동작입니다.

<a id="live-code-introduced-vulnerabilities"></a>
### Live 코딩: 새로 유입된 취약점

취약점을 live 코딩으로 시연하려면 다음 단계를 따릅니다.

- **시연 내용:** PR에 내장된 GHAS Autofix
- **목적:** Autofix가 PR에서 개발자 workflow에 자연스럽게 통합된다는 점을 보여 줍니다.
- **진행 방법:**  
  1. Chat 창을 열고 `/code-injection`을 입력하여 code injection prompt를 실행합니다.
  2. **참고**: 때로는 model이 "나쁜" 작업이라는 이유로 거부합니다. 이 경우 다른 model을 시도하고 고객에게 Copilot이 얼마나 "책임감 있게" 동작하는지 보여 줍니다.
  3. prompt는 새 branch를 만들고 `delivery.ts` route에 취약점을 추가한 다음 push합니다.
  4. 새 branch의 PR을 만들고 GHAS가 PR 안에서 alert와 수정 제안을 표시하는 방식을 보여 줍니다.

<a id="switch-to-advanced-codeql-setup"></a>
### Advanced CodeQL Setup으로 전환

더 고급의 CodeQL setup을 시연하려면 기존 `codeql-advanced.yml` workflow를 사용하여 다음 단계를 진행하면 됩니다.

1. Repository Settings -> Advanced Security로 이동합니다.
2. `Code scanning -> Tools`까지 스크롤합니다.
3. `CodeQL analysis`의 점 세 개를 클릭하고 `Switch to advanced`를 선택합니다.
4. 먼저 `CodeQL`을 비활성화해야 한다는 메시지가 표시되지만 괜찮습니다.
5. custom `codeql.yml` workflow 파일 생성 화면으로 이동하면 취소해도 됩니다.
6. repository에서 `Actions`로 이동합니다.
7. 왼쪽의 `CodeQL Advanced`를 클릭하여 workflow를 활성화합니다.
8. `main` branch에서 workflow를 수동으로 trigger합니다(`workflow_dispatch` trigger가 있음).
9. workflow가 끝나면 advanced setup이 완료됩니다(그때까지 repo 설정 페이지에 표시되는 경고는 무시해도 됩니다).

> [!NOTE]
> 이 데모 기능의 첫 버전에서는 `codeql-advanced.yml`이 기본적으로 default setup과 같은 작업을 수행합니다. 향후 실제로 더 고급인 workflow로 개선할 예정입니다.

## Secret Scanning

<a id="main-branch-leaked-secrets"></a>
### Main branch: 유출된 secret

1. Repository -> Security -> Secrets로 이동합니다.
2. Default 하나와 generic 한두 개의 alert가 표시됩니다(두 번째는 AI가 감지하며, 표시되기까지 시간이 걸릴 수 있습니다).
    1. **Default: GitHub PAT** - `api/.env.example` 파일에 유출되었지만 다른 commit에서 삭제된 secret입니다. Secret Scanning이 GitHub history 전체를 검사하는 방식을 보여 줄 수 있습니다.
    2. **Generic: AI Detected Password** - 이 역시 `api/.env.example`에 유출된 후 다른 commit에서 삭제된, AI가 감지한 `generic secret`입니다. 프로젝트 전용 password를 나타내므로 GitHub가 이런 항목도 감지할 수 있음을 시연할 수 있습니다.
    3. **Generic: RSA Token** - `api/ca.key`에 유출된 `non-provider` pattern secret입니다.

<a id="push-protection-anthropic-api-key"></a>
### Push Protection: Anthropic API key

1. `GHAS: Inject Secrets` Patch Set을 적용합니다.[^1]
2. 유출된 `anthropic` API key가 있는 `logs/debug.log` 파일이 생성됩니다.
3. 파일을 commit합니다.
4. terminal을 열고 `git push`를 입력합니다.
5. push protection을 확인합니다.
6. (선택 사항) push protection 메시지의 bypass 웹사이트로 이동하여 push protection 우회를 시연합니다.

## Dependabot

<a id="existing-3rd-party-vulnerabilities"></a>
### 기존 third-party 취약점

반드시 존재하는 취약점은 두 가지입니다.

1. **Axios v1.8.1**: [frontend/package.json](../../frontend/package.json)에 [보안 권고 "CVE-2025-27152"](https://github.com/advisories/GHSA-jr5f-v2jv-69x6)의 취약점이 있는 Axios 버전이 설치되어 있습니다.
    - repository의 `Security -> Dependabot`으로 이동하여 alert를 시연합니다.
    - alert의 EPSS score, CWE 및 기타 정보를 설명할 수 있습니다.
2. **Dockerfile Alpine:** [frontend/Dockerfile](../../frontend/Dockerfile)과 [api/Dockerfile](../../api/Dockerfile)에서는 오래된 Alpine 버전을 사용합니다. Dependabot은 이에 대한 취약점 alert는 지원하지 않지만 업데이트 PR을 생성합니다.

> [!NOTE]
> 데모에 반드시 존재하는 취약점은 위 항목뿐입니다. 모든 package를 항상 최신으로 유지할 수는 없으므로 다른 dependency 취약점도 자연스럽게 나타날 수 있습니다. 데모에 큰 영향을 주지 않는 비결정성이 조금 더해지지만, 이를 "실제 프로젝트와 같다"는 장점으로 활용할 수 있습니다.

<a id="dependency-review-licensde-violation-with-a-agpl-30-licensed-package"></a>
### Dependency Review: AGPL-3.0 licensed package의 license 위반

1. `feature: Add download of terms and services` PR을 검색합니다.
2. PR은 필수 workflow인 `Dependency Review`로 검사되었습니다(자세한 내용은 [actions.md](../actions.md) 참고).
3. PR이 `ua-parser-js` dependency를 추가하려 하므로 review는 실패해야 합니다. 이 library는 user-agent 문자열을 읽으며, 여기서는 DDoS 방지를 위해 SEO 및 AI parser의 파일 다운로드를 막는 데 사용합니다. `ua-parser-js`는 `Dependency Review` workflow에서 명시적으로 금지한 `AGPL-3.0` license를 사용합니다.

> [!NOTE]
> `GPL-3.0` is a strong Copy-Left license, meaning any derivative work must also be open-sourced under the same license. This means: Customers cna not use these libraries to work on their private commercialised applications, and it's a common problem for enterprise to prevent their users from spotting and using these. `ua-parser-js`  uses this to only allow other open source projects from using it for free - non-copy-left licenses are available with a $-Tag.

<a id="live-demo-add-a-vulnerable--blocked-action"></a>
### Live 데모: 취약하고 차단된 action 추가

1. `GHAS: Inject Dependabot Vulnerable Action` Patch Set을 적용합니다.[^1] 새 branch 생성은 `Yes`를 선택하는 것이 좋습니다.
2. 생성된 workflow 파일(`./github/workflows/aut-label-by-branch.yml`)을 commit합니다.
3. 이 action이 포함된 PR을 생성합니다.
4. 다음 두 가지를 시연할 수 있습니다.
   1. 사용한 action `tj-actions/branch-names@v8.2.0`에 [보안 권고 "CVE-2025-54416"](https://github.com/advisories/GHSA-gq52-6phf-x2r6)의 취약점이 있어 Dependabot alert가 생성됩니다.
   2. Actions Allow List에서 명시적으로 차단한 action이므로 실행이 차단됩니다. repository의 `Settings -> Actions -> General`에서 시연할 수 있습니다.
`

---------

[^1]: patch set 적용 방법은 [patch-sets.md](../general/patch-sets.md)를 참고하세요.

<a id="cca-uses-codeql-tooling-copilot-"></a>
## CCA의 CodeQL 도구 사용 :copilot: 🔒

Copilot Coding Agent는 이제 각 coding session이 끝날 때 CodeQL을 호출합니다.

<a id="option-1-no-findings"></a>
### 방법 1: 발견 사항 없음

가장 쉬운 시연 방법은 Mission Control에서 agent session 하나로 이동하여 CodeQL을 검색하는 것입니다.

![Copilot Coding Agent session의 CodeQL step](../images/cca-calls-codeql-no-finding.png)

<a id="option-2-force-a-finding"></a>
### 방법 2: 발견 사항이 나오도록 유도

CCA에서 발견 사항이 확실히 나오도록 유도하기는 어려울 수 있습니다. 알려진 취약점이 있는 기존 기능과 비슷한 기능을 구현하도록 요청하는 방법을 사용합니다. 다음 단계를 따르세요.

1. Mission Control로 이동하여 데모 repository를 선택합니다(또는 데모 repository에서 agents 패널을 엽니다).
2. 다음 prompt로 새 coding session을 시작합니다.

    ```txt
    `/order`에 `/status` endpoint를 추가하고 싶습니다. `/delivery`에는 이미 status endpoint가 있으니 같은 방식으로 구현하세요.
    ```

3. CCA에는 약 15분이 걸리지만 session에 발견 사항이 나타납니다.
    ![Copilot Coding Agent session의 CodeQL 발견 사항](../images/cca-calls-codeql-finding.png)

4. 주어진 지침 때문에 대부분 이 취약점을 수정하지 **않습니다**. 그러나 요약에 경고를 표시합니다.
    ![Copilot Coding Agent session 요약의 CodeQL 취약점 경고](../images/cca-calls-codeql-summary.png)

5. 이를 데모에 포함하여 CCA가 취약한 코드를 생성하게 만드는 것이 얼마나 어려운지, 명확하게 지시해야만 가능하다는 점을 설명할 수 있습니다. 발견 사항을 직접 처리하지 않더라도 요약에는 경고를 표시하며, 이후 CI의 CodeQL 검사에서도 감지된다는 점을 강조하세요. 다음과 같이 직접 보여 줄 수도 있습니다.

    1. Mission Control에서 CCA가 생성한 PR의 실행된 status check를 직접 엽니다.
        ![Mission Control에서 pull request status check로 이동](../images/cca-calls-codeql-click-status-checks.png)
    2. 실패한 CodeQL Scan이 있는 popup이 표시됩니다.
        ![pull request status check의 실패한 CodeQL 검사](../images/cca-calls-codeql-status-checks.png)

<a id="assign-codeql-alerts-to-coding-agents-copilot-"></a>
## CodeQL alert를 Coding Agent에 할당 :copilot: 🚨

<a id="assign-from-alert-page"></a>
### Alert 페이지에서 할당

1. `Security` → `Code scanning alerts`로 이동합니다.
2. `Database query built from user-controlled sources` alert를 찾아 클릭합니다.
  ![사용자가 제어하는 source로 생성된 database query의 Code Scanning alert](../images/ghas_codeql_alert.png)
3. `Generate Autofix`를 클릭합니다(Copilot 할당 전에 필요).
  ![CodeQL alert의 autofix 생성 옵션](../images/ghas_codeql_alert_autofix.png)
4. 목록에서 Copilot을 할당합니다.
  ![CodeQL alert의 Assign Copilot 옵션](../images/ghas_codeql_alert_assign_copilot.png)
5. 연결된 PR로 이동하여 Copilot이 끝날 때까지 기다리거나 [Copilot Mission Control](/copilot/agents)에서 상태를 직접 보여 줍니다.
  ![CodeQL alert autofix에 연결된 pull request로 이동](../images/ghas-codeql-navigate-pr.png)
6. 여러 할당을 보여 주려면 `Code injection` 취약점에도 같은 과정을 반복할 수 있습니다.

> [!TIP]
> Copilot은 autofix가 이미 생성된 alert에만 할당할 수 있습니다. 시간을 절약하려면 데모 전에 생성해 두세요.

<a id="bulk-assign-from-campaign-not-natively-supported"></a>
### Campaign에서 (일괄) 할당(기본 지원 아님)

> [!WARNING]
> campaign 10개 제한으로 인해 현재 데모에 campaign이 생성되어 있지 않습니다. 이 기능을 보여 주려면 임시 campaign을 직접 생성하거나 다른 사람의 기존 campaign을 사용해야 합니다. security campaign이 미리 생성된 전용 org를 구성하는 심화 GHAS 데모를 준비 중이지만 Universe 이후에 완료될 예정입니다.

> [!IMPORTANT]
> 직접 campaign을 만들었다면 다른 사람이 이 데모를 진행하는 데 방해되지 않도록 데모 직후 반드시 삭제하세요.

1. 다음 데이터로 `From Code Scanning Filters`에서 security campaign을 생성합니다([방법을 모르면 문서 참고](https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization/fixing-security-alerts-at-scale/creating-managing-security-campaigns?versionId=enterprise-cloud%40latest#create-a-campaign)).
2. `Repository` 필터를 추가하고 데모 repository를 값으로 사용합니다.
  ![security campaign의 repository 필터 생성](../images/ghas_campaign_create_filter.png)
3. `Save as` → `Published campaign`을 클릭하고 게시 전에 본인을 `Campaign Manager`로 지정합니다.
  ![campaign 필터 생성 및 campaign manager 할당 확인](../images/ghas_campaign_filter_created.png)
4. campaign 화면에서 repository를 클릭하여 해당 repository의 campaign 페이지로 이동합니다.
  ![repository의 campaign 페이지로 이동](../images/ghas_campaign_navigate_repo.png)
5. autofix가 생성되기 전에는 Copilot을 할당할 수 없으므로 몇 초 기다려야 할 수 있습니다. 포함된 alert로 이동하여 상태를 확인합니다.
6. 이제 오른쪽 위의 `Assign` → `Copilot`을 클릭하여 autofix가 생성된 alert에 Copilot을 일괄 할당할 수 있습니다(일반적으로 `Code injection`과 `Workflow does not contain permissions`에서 작동).
  ![security campaign의 Copilot 일괄 할당 옵션](../images/ghas_campaign_bulk_assign_copilot.png)
7. repo의 PR 또는 Copilot Mission Control Center로 이동하여 진행 상황을 확인합니다.

<a id="secret-scanning-with-additional-metadata--"></a>
## 추가 metadata를 사용하는 Secret Scanning 🔒 🤫

> [!WARNING]
> 이 기능에는 아직 API가 없어 repository에서 수동으로 설정해야 합니다. 설정을 데모에 포함하거나 미리 활성화할 수 있습니다. 미리 활성화하려면 데모 repository의 `Settings` 탭에서 `Advanced Security` 탭으로 이동하고 `Secret scanning extended metadata` 영역까지 스크롤하여 활성화하세요.

1. 데모 repository의 `Security` 탭으로 이동합니다.
2. `Secret scanning -> Default`를 클릭합니다. 유출된 `Slack API Token`을 찾아 클릭합니다.
    ![유출된 Slack API Token이 표시된 secret alert 페이지](../images/ghas-secret-scanning-extended-metadata-alerts.png)
3. metadata가 없으면 secret을 아는 것만으로는 중요도를 판단하거나 즉시 교체/폐기 방법을 알기 어려울 수 있음을 설명합니다.
4. 오른쪽 위의 `Verify Secret`을 클릭합니다.
    ![Verify Secret 버튼이 표시된 secret alert 페이지](../images/ghas-secret-scanning-extended-metadata-verify.png)
5. 검증 후 `Slack API Token (Preview)` 오른쪽에 `Other metadata: Enable in settings` 링크가 표시됩니다. 클릭합니다.

    ![Other metadata 링크가 표시된 secret alert 페이지](../images/ghas-secret-scanning-extended-metadata-enable.png)

6. `Secret scanning` 영역까지 스크롤하여 `Extended metadata`를 활성화합니다.

    ![Extended metadata 옵션이 표시된 Secret Scanning 설정 페이지](../images/ghas-secret-scanning-extended-metadata.png)

7. 2단계의 secret alert로 돌아갑니다. 유출된 secret의 추가 metadata, 유효성, `Org name`, `Owner name`이 표시됩니다.

    ![유출된 Slack API Token의 확장 metadata가 표시된 secret alert 페이지](../images/ghas-secret-scanning-extended-metadata-data.png)
