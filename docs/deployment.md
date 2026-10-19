<a id="azure-container-apps-deployment-plan-for-octocat-supply-chain-management"></a>
# OctoCAT 공급망 관리를 위한 Azure Container Apps 배포 계획

이 문서는 비용 효율성과 유지 관리성을 중심으로 OctoCAT 공급망 관리 애플리케이션을 Azure Container Apps에 배포하는 계획을 설명합니다.

<a id="1-bicep-infrastructure-plan"></a>
## 1. Bicep 인프라 계획

<a id="file-structure"></a>
### 파일 구조
```
infra/
├── main.bicep                 # Main orchestration file
├── modules/
│   ├── webapps.bicep          # Web Apps (Sites) connected to ACR for running containers
│   ├── logAnalytics.bicep     # Log Analytics workspace
├── parameters/
│   ├── staging.parameters.json # Staging environment parameters
│   └── production.parameters.json # Production environment parameters
```

<a id="parameters-must-include"></a>
#### 필수 parameter:
- environmentName
- appName
- acrName
- imageTag

ACR resource ID는 `main.bicep` 파일에서 정확히 계산하여 `acrName`, `imageTag` 및 기타 필요한 변수와 함께 `webapps.bicep` 파일에 전달해야 합니다. 모든 resource의 기본 location이 resource group의 location이 되도록 하세요.

<a id="outputs"></a>
#### 출력

Actions workflow의 environment에서 출력 parameter로 사용할 수 있도록 `main.bicep` 파일에서 API와 frontend의 URL을 모두 출력하세요.

#### Managed Identity

principalID에 `AcrPull` role을 할당하여 Managed Identity(SystemAssigned)로 ACR에 인증하도록 Web Apps를 설정합니다. Web Apps에 `acrUseManagedIdentityCreds: true`를 설정합니다.

<a id="key-resources-to-include"></a>
### 포함할 주요 resource

1. **Logging**
   - 모니터링을 위한 Log Analytics 통합

2. **Container Registry**
   - container registry로 AZCR.io 사용(설정 script가 생성)
   - 이미지를 push하는 빌드는 반드시 이 Container Registry에 push

3. **Azure Web Apps(Sites) 두 개**
   - 둘 다 B1 SKU에서 실행
   - API container를 실행하는 API web app
   - frontend container를 실행하는 frontend web app
      - ACR을 가리키도록 설정
     - 각각의 API 또는 frontend 이미지 및 tag 사용
     - API의 CORS에서 frontend URL 허용 확인
   - `uniqueString()`으로 web app 이름에 고유한 접미사 추가
   - frontend 배포에 API_HOST와 API_PORT가 올바르게 설정되었는지 확인
      - API의 SQLite persistence: DB 파일용 쓰기 가능한 volume을 mount하고 `DB_FILE`을 그에 맞게 설정(예: `/home/site/data/app.db`)

4. **Role 할당 제외**
   - ACR Pull role 할당을 포함하지 마세요. Service Principal에 이미 설정되어 있습니다.

5. **순환 할당 방지**
   - 주의: API에는 frontend 정보가 필요하고 그 반대도 마찬가지이므로, 이를 고려하여 순환 논리가 생기지 않게 하세요!

<a id="2-important-configuration-points--gotchas"></a>
## 2. 중요 설정 사항 및 주의점

<a id="cors-configuration"></a>
### CORS 설정
- frontend container app의 요청을 허용하도록 API container app에 CORS 설정
- environment별 동적 CORS origin에 환경 변수 사용(반드시 `https://`로 시작!)
```
API_CORS_ORIGINS=https://${frontendAppFqdn},https://${stagingFrontendAppFqdn}
```
- frontend Web App에 다음 환경 변수가 있는지 확인:
```
API_HOST=<host_of_API_web_app>
API_PORT=80
```
- `API_HOST`에 `https://`가 포함되지 않도록 하세요(URL이 아니라 host입니다).

<a id="sqlite-persistence-api"></a>
### SQLite persistence(API)
- API는 SQLite를 사용합니다. 호스팅 환경의 persistence를 설정하세요.
   - `DB_FILE`을 Web App persistent storage 하위 경로로 설정(예: Linux의 `/home/site/data/app.db`)
   - 상위 디렉터리가 존재하거나 시작 시 생성되는지 확인
   - 더 나은 concurrency를 위해 선택적으로 `DB_ENABLE_WAL=true`로 WAL 활성화
   - foreign key 강제 적용은 기본적으로 활성화되며, 필요하면 `DB_FOREIGN_KEYS=false`로 재정의
- container(compose/k8s)에서는 DB 파일을 보존하도록 host 또는 managed volume mount

API 환경 변수 예:
```
DB_FILE=/home/site/data/app.db
DB_ENABLE_WAL=true
DB_FOREIGN_KEYS=true
DB_TIMEOUT=30000
```

<a id="3-github-actions-workflow-plan"></a>
## 3. GitHub Actions workflow 계획

<a id="workflow-structure"></a>
### Workflow 구조
```
.github/workflows/
├── build-test.yml   # CI workflow for PRs
├── deploy.yml       # CD workflow for deploying to staging on PR and approval for PROD
```

<a id="ci-workflow-build-testyml"></a>
### CI workflow(build-test.yml)
- 모든 branch의 push 시 trigger
- API와 frontend 모두 빌드
- unit test 실행
- 코드 lint 검사
- Docker 이미지를 빌드하되 push하지 않음

<a id="deployment-deployyml"></a>
### 배포(deploy.yml)
- 빌드
  - PR 시 trigger
  - 빌드 및 테스트 실행
  - API용과 frontend용 job 두 개를 병렬 실행
     - Docker 이미지를 빌드하고 GHCR에 push하며, 이미지 버전에 commit의 short SHA 사용
- Staging job
  - 두 빌드 job 모두 필요
  - staging parameter로 Bicep template을 Staging environment에 배포
- Prod job
  - Staging job 필요
  - 승인 대기(Environment에서 설정)
  - staging parameter로 Bicep template을 Prod environment에 배포

<a id="4-deployment-process"></a>
## 4. 배포 과정

1. **사전 요구 사항 설정**
   - `az cli`(`brew install az` 사용)를 설치한 다음 `az login`으로 Azure subscription에 로그인
   - `gh cli`(`brew install gh` 사용)를 설치한 다음 `gh login`으로 GitHub 계정에 로그인

2. **CI/CD pipeline 설정**
   - workflow 인증에 OIDC 사용:
      - [이 script](../infra/create-sp-oidc.sh)를 실행하여 service principal을 생성하고 repo의 OIDC를 설정합니다.
      - script가 설정하는 항목:
         - OIDC가 설정된 Service Principal
         - staging 및 prod용 Resource Group
         - 이미지를 호스팅하는 Azure Container Registry
         - workflow에 필요한 Actions Variable
            - AZURE_CLIENT_ID: SP의 ID
            - AZURE_TENANT_ID: tenant의 ID
            - AZURE_SUBSCRIPTION_ID: subscription의 ID
            - AZURE_RESOURCE_GROUP: Staging Resource Group
            - AZURE_RESOURCE_GROUP_PROD: Prod Resource Group
            - AZURE_ACR_NAME: AZCR의 이름
         - repo에 Staging 및 Prod environment 두 개, Prod에는 수동 승인 설정
         - deploy step의 출력을 사용하여 environment URL을 frontend URL로 업데이트

3. **배포 전략**
   - 모든 push에 CI 빌드 실행
   - PR 및 `main`에 대한 push:
     - 코드 빌드 및 테스트
     - version tag에 short SHA를 사용하여 Docker 이미지 생성
     - AZ login으로 AZURE_ACR_NAME 및 AZURE_RESOURCE_GROUP_PROD 변수에서 AZCR 인증 정보 가져오기
     - 이미지를 AZCR에 push
     - Staging environment를 사용하여 먼저 Staging에 배포
     - Prod 승인 대기(Prod environment에서 설정)
     - Prod environment를 사용하여 Prod에 배포
   - workflow 화면에 URL이 표시되도록 environment에 다음 형식 사용:
      ```yml
      environment:
        name: Staging|Production
        url: ${{ steps.deploy.outputs.frontendUrl }}
      ```

<a id="backups-and-recovery"></a>
### 백업 및 복구
- SQLite는 파일 기반이므로 DB 파일 위치에 대한 정기 백업 구현
- Azure Web Apps에서는 WebJobs 또는 예약된 workflow로 `/home/site/data/app.db`를 blob storage에 복사
- Docker에서는 volume 또는 bind-mount 대상을 백업 storage에 복사

<a id="3-important-final-checks"></a>
## 3. 중요! 최종 확인
- Bicep 파일에 사용하지 않는 선언이나 변수가 없는지 확인
- `main.bicep` 파일이 API와 frontend의 hostname을 출력하고, 이를 `${{ steps.<deploy>.ouputs}}`로 사용하여 environment URL을 설정하는지 확인(`https://`를 앞에 붙여야 함)
- Web Apps의 AcrPull role 할당이 올바르게 수행되고 두 앱 모두 `acrUseManagedIdentityCreds`가 true인지 확인
- resource가 resource group의 location을 사용하는지 확인

이 계획은 Bicep 기반 Infrastructure as Code와 GitHub Actions 기반 자동화 CI/CD로 OctoCAT 공급망 관리 애플리케이션을 Azure Web Apps에 배포하는 견고한 기반을 제공합니다.