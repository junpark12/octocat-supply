<a id="github-actions-demos"></a>
# GitHub Actions 데모

## Required Workflows

적용된 ruleset인 [OD OctoCAT Supply Ruleset](https://github.com/organizations/msft-common-demos/settings/rules/8702023)(자세한 내용은 [governance.md](./governance.md) 참고)은 필수 workflow인 [Dependency Review](https://github.com/msft-common-demos/od-octocat-supply-workflows/blob/main/.github/workflows/dependency-review.yml)를 강제 적용합니다.

`Feature: Add ToS Download` pull request에서 작동 방식을 보여 줄 수 있습니다.

필수 workflow는 https://github.com/msft-common-demos/od-octocat-supply-workflows repository에 있습니다. 위치: https://github.com/msft-common-demos/od-octocat-supply-workflows/blob/main/.github/workflows/dependency-review.yml.

필수 workflow로 dependency review 같은 공통 검사를 강제 적용하는 방법을 시연할 수 있습니다. workflow는 다른 repository는 물론 같은 enterprise의 다른 organization에도 있을 수 있다는 점을 강조하세요.

## Reusable Workflows

**시연 내용:** Actions workflow를 재사용하여 organization 전체 또는 enterprise 전반의 공통 CI/CD 작업을 간소화합니다.

**목적:** 재사용 가능한 workflow가 여러 프로젝트에서 일관성을 유지하고 중복을 줄이며 유지 관리성을 높이는 방법을 보여 줍니다.

**진행 방법:**

1. 데모 repository의 **Actions** 탭으로 이동합니다.
2. 왼쪽 sidebar에서 [빌드 및 게시](../../.github/workflows/build-and-publish.yml) workflow를 선택합니다.
3. workflow 파일이 중앙 repository의 재사용 가능한 workflow를 참조하는 방식을 살펴봅니다.
4. 중앙 repository에서 workflow를 확인합니다: https://github.com/msft-common-demos/od-octocat-supply-workflows/blob/main/.github/workflows/build-publish-containers.yml

## Artifact Attestations

<a id="creating-the-attestation"></a>
### Attestation 생성

**시연 내용:** GitHub Actions 및 `gh` CLI의 통합 기능인 Artifact Attestations를 보여 줍니다.

**목적:** 검증 가능하고 변조 방지된 빌드 metadata로 보안과 compliance를 개선합니다.

**진행 방법:**

1. 데모 repository의 **Actions** 탭으로 이동하여 **Attestations**를 선택합니다.
  ![왼쪽 sidebar의 Attestations 메뉴가 강조된 Actions 탭](./images/attestation-navigation.png)
2. 최소 네 개의 attestation(frontend와 API 각각 두 개)이 있습니다. API attestation과 서로 다른 `predicate-types`에 집중합니다.

    ![frontend 및 API container의 서로 다른 predicate type을 보여 주는 artifact attestation 목록](./images/attestation-types.png)

    1. `https://spdx.dev/Document/v2.3`: SBOM이 첨부되었음을 확인합니다(참고: SBOM의 내용을 검증하지는 않습니다).
    2. `https://slsa.dev/provenance/v1`: artifact의 출처를 검증하여 특정 재사용 workflow로 빌드되었고 데모 repository에서 비롯되었음을 확인합니다.
3. [빌드 및 게시](../../.github/workflows/build-and-publish.yml) workflow로 돌아갑니다(attestation 페이지의 `Workflow File` 링크로 접근 가능).
4. 이 workflow가 재사용 workflow로 attestation을 생성한다는 점을 설명하고 해당 workflow로 이동합니다: https://github.com/msft-common-demos/od-octocat-supply-workflows/blob/main/.github/workflows/build-publish-containers.yml
5. 재사용 workflow의 맨 아래로 스크롤하여 attestation을 생성하는 간단한 내장 action을 보여 줍니다.
  ![GitHub Actions로 SBOM 및 SLSA attestation을 생성하는 step이 있는 workflow YAML 파일](./images/attestation-workflow-file.png)

<a id="verifying-the-attestation"></a>
### Attestation 검증

> [!NOTE]
> 데모 repo의 [`./demo/resources/verify-attestation.sh`](../../demo/resources/verify-attestation.sh) script는 손쉬운 데모를 위해 `gh attestation verify` 명령어 생성을 자동화합니다. 최신 container 이미지를 찾아 적절한 `gh` 명령어를 실행합니다. `gh` CLI로 인증되어 있는지 확인하세요(`read:packages` scope). 필요하면 script가 안내합니다.

**시연 내용:** `gh` CLI로 artifact attestation을 검증합니다.

**목적:** 배포 전에 artifact 무결성을 확인하는 간단한 방법을 보여 줍니다.

**진행 방법:**

1. 로컬 checkout 또는 Codespace에서 terminal을 엽니다.
2. 검증 script를 실행합니다.

    ```bash
    ./demo/resources/verify-attestation.sh
    ```

3. 다음 출력이 표시됩니다.
  ![SLSA provenance 및 SBOM 검사로 artifact attestation 검증에 성공한 terminal 출력](./images/attestation-cli-output.png)
    1. `gh attestation verify` 명령어의 원본 출력
    2. 검증 결과를 설명하는 요약

4. (선택 사항) Azure 배포가 설정되어 있다면 GitHub Action에서 검증을 강제 적용하는 방법을 보여 줍니다.
    1. 배포 workflow를 엽니다: [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml).
    2. `Verify Container Attestations` step에서 로컬 custom action을 사용한다는 점을 설명합니다.
    3. custom action의 source로 이동합니다: [.github/actions/verify-container-attestations/action.yml](../../.github/actions/verify-container-attestations/action.yml).
    4. `GH_COMMAND` 환경 변수에는 SLSA와 SBOM 검사 모두를 위한 `gh attestation verify` 명령어가 있습니다.
    5. 이 action은 유용한 job 요약도 생성하며, 성공한 workflow 실행으로 이동하여 보여 줄 수 있습니다.

<a id="virtual-registry-aka-linked-artifacts"></a>
## Virtual Registry(Linked Artifacts)

**시연 내용:** GitHub Virtual Registry로 artifact의 production context를 repository 및 GHAS alert와 직접 연결합니다.

**목적:** 애플리케이션 보안 관리자는 수많은 alert에 부담을 느끼는 경우가 많지만, 영향을 받는 코드가 production에 도달하지 않아 실제 위험이 아닌 alert도 많습니다. GitHub Virtual Registry에서 production context와 alert를 연결하면 실제 배포 상태에 따라 우선순위를 정하여 noise를 줄이고 중요한 문제에 집중할 수 있습니다.

**진행 방법:**

> [!IMPORTANT]
> 이 데모는 데모 옵션 `Requires Azure Deployment`를 `Yes`로 설정해야 합니다!

1. repository 생성 후 배포 action이 완료될 때까지 기다립니다.
2. [organization의 Linked artifacts 페이지](https://github.com/orgs/msft-common-demos/artifacts)로 이동합니다.

    ![GitHub organization의 Linked Artifacts 페이지](./images/linked-artifacts-overview.png)

3. linked artifact에서 repository의 `api` artifact를 검색합니다.

    ```txt
    msft-common-demos/-api
    ```

4. 이 화면의 다양한 정보를 설명합니다.
    ![Linked Artifacts 상세 페이지](./images/linked-artifacts-details.png)
    1. **Source Repository:** metadata record를 실제 source repository에 연결합니다. 데모에서는 빌드 중 생성한 provenance attestation을 통해 자동으로 연결됩니다(위 [Artifact Attestations](#artifact-attestations) 절 참고).
    2. **Attestations:** 페이지 아래에 관련된 모든 attestation 목록이 있습니다.
    3. **Storage Record:** artifact 자체를 이 metadata record에 연결합니다.
    4. **Deployments:** 핵심 항목입니다. cluster 이름, 위험 metadata(예: `internet-exposed`), 물리적 위치 등 production의 artifact 배포 metadata를 추가할 수 있습니다.

5. `Organization's Security Page` -> `Alerts (Section Header)` -> `Code Scanning`으로 이동합니다.
6. `runtime-risk:internet-exposed`와 `severity:high` 필터를 적용합니다(데모 organization의 결과가 너무 많으면 선택적으로 repository 이름 필터 `repo:msft-common-demos/`를 추가).
7. 목록에 `SQL query built from user-controlled sources` alert가 표시됩니다. 앞서 확인한 artifact metadata의 `internet-exposed` runtime risk를 통해 이 alert의 우선순위를 더 잘 정할 수 있음을 설명합니다.
    1. (선택 사항) 필터링된 화면의 직접 링크를 사용합니다: <https://github.com/orgs/msft-common-demos/security/alerts/code-scanning?query=is%3Aclosed+runtime-risk%3Ainternet-exposed+severity%3Ahigh++repo%3A>
8. 이 필터로 인터넷에 노출된 모든 SQL injection alert를 대상으로 집중적인 security campaign을 만드는 방법도 설명합니다.

> [!TIP]
> artifact의 **sha256-digest**가 provenance attestation, storage record, deployment record를 모두 연결하여 이들 사이를 쉽게 탐색할 수 있게 합니다.

<a id="optional-show-the-creation-of-the-records-in-the-deployment-workflow"></a>
### (선택 사항) 배포 workflow의 record 생성 과정 시연

1. repository로 돌아가 workflow 파일로 이동합니다: [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml).
2. `update-virtual-registry` job에는 네 개의 step이 있습니다. API 배포용 두 개를 보여 줍니다.
    1. **Create API Storage Record**
    2. **Create API Deployment Record**
3. 두 step 모두 간단한 `gh cli` 명령어 하나로 Virtual Registry에 record를 생성한다는 점을 설명합니다.

> [!TIP]
> Azure Defender for Cloud나 Artifactory 같은 외부 도구는 이미 이러한 record를 자동으로 생성하지만, 내부적으로는 위 `gh` CLI 호출과 동일한 REST API를 사용합니다.
