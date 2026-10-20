<a id="building-and-testing-the-octocat-supply-chain-application"></a>
# OctoCAT 공급망 애플리케이션 빌드 및 테스트

이 가이드는 API component와 React frontend로 구성된 OctoCAT 공급망 관리 애플리케이션의 빌드, 실행 및 테스트 방법을 안내합니다.

<a id="prerequisites"></a>
## 사전 요구 사항



- Node.js (버전 18 이상)
- npm (최신 버전 권장)

- Docker/Podman (선택 사항, container화용)

<a id="installation"></a>
## 설치

1. repository를 clone합니다.
2. 의존성을 설치합니다.

```bash
make install
```

<a id="building-the-application"></a>
## 애플리케이션 빌드

<a id="using-make-commands"></a>
### Make 명령어 사용

다음 명령어로 전체 애플리케이션 또는 개별 component를 빌드할 수 있습니다.

```bash
# Build both API and Frontend components
make build

# Build only the API component
make build-api

# Build only the Frontend component
make build-frontend
```



또는 `api/`나 `frontend/` 디렉터리에서 npm 명령어를 직접 사용할 수 있습니다.

```bash
cd api && npm run build
cd frontend && npm run build
```





<a id="database-management"></a>
### Database 관리

```bash
# Initialize DB (migrations + seed)
make db-init

# Run migrations only
make db-migrate

# Seed data only
make db-seed
```



또는 `api/` 디렉터리에서 npm 명령어를 직접 사용할 수 있습니다.

```bash
cd api
npm run db:init
npm run db:migrate
npm run db:seed
```





환경 변수:

- DB_FILE: SQLite database 파일 경로 (기본값: `api/data/app.db`)
- DB_ENABLE_WAL: WAL 모드 활성화 (기본값: true)
- DB_FOREIGN_KEYS: foreign key 강제 적용 (기본값: true)
- DB_TIMEOUT: 밀리초 단위 busy timeout (기본값: 30000)

<a id="using-vs-code-tasks"></a>
### VS Code task 사용

빌드 과정을 간소화하도록 VS Code task가 설정되어 있습니다.

1. `Ctrl+Shift+P`(macOS에서는 `Cmd+Shift+P`)를 눌러 Command Palette를 엽니다.
2. `Tasks: Run Task`를 입력하고 선택합니다.
3. 다음 task 중 하나를 선택합니다.
   - `Build All`: API와 frontend component 모두 빌드
   - `Build API`: API component만 빌드
   - `Build Frontend`: frontend component만 빌드


또는 `Ctrl+Shift+B`(macOS에서는 `Cmd+Shift+B`)를 눌러 기본 빌드 task(`Build All`)를 실행할 수 있습니다.


<a id="running-the-application"></a>
## 애플리케이션 실행

<a id="using-make-commands-1"></a>
### Make 명령어 사용

```bash
# Start both API and Frontend in development mode with hot reloading
make dev

# Start only the API in development mode
make dev-api

# Start only the Frontend in development mode
make dev-frontend

# Start the application in production mode
make start
```



또는 `api/`나 `frontend/` 디렉터리에서 npm 명령어를 직접 사용할 수 있습니다.

```bash
cd api && npm run dev
cd frontend && npm run dev
```





<a id="using-vs-code-debugger"></a>
### VS Code Debugger 사용

1. Debug 패널을 엽니다(`Ctrl+Shift+D`, macOS에서는 `Cmd+Shift+D`).
2. dropdown 메뉴에서 `Start API & Frontend`를 선택합니다.
3. 초록색 재생 버튼을 클릭하거나 F5를 누릅니다.

통합 terminal에서 API와 frontend가 모두 개발 모드로 시작되어 console 출력을 확인할 수 있습니다.

<a id="testing-the-application"></a>
## 애플리케이션 테스트

<a id="running-tests"></a>
### 테스트 실행

```bash
# Run all tests
make test

# Run API tests only
make test-api

# Run frontend tests only
make test-frontend
```



또는 `api/`나 `frontend/` 디렉터리에서 npm 명령어를 직접 사용할 수 있습니다.

```bash
cd api && npm run test
cd frontend && npm run test
```





<a id="linting"></a>
### Lint 검사

```bash
# Run linting checks
make lint
```



또는 `api/`나 `frontend/` 디렉터리에서 npm 명령어를 직접 사용할 수 있습니다.

```bash
cd frontend && npm run lint
```

```bash
cd api && npm run lint
```





<a id="additional-information"></a>
## 추가 정보

<a id="port-configuration"></a>
### Port 설정

API는 기본적으로 port 3000에서, frontend는 port 5137에서 실행됩니다. Codespace 환경에서는 frontend가 API와 통신할 때 CORS 오류가 발생하지 않도록 API port의 visibility를 `public`으로 설정하세요.

Docker의 샘플 compose는 API를 3000에, frontend를 3001에 매핑합니다.

<a id="docker-deployment"></a>
### Docker 배포

이 프로젝트에는 API와 frontend component의 Dockerfile 및 간편한 container 배포를 위한 docker-compose.yml 파일이 포함되어 있습니다.

```bash
# Build and start using Docker Compose
docker-compose up --build
```
