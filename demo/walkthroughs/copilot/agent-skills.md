# GitHub Copilot Skills 데모

이 실습에서는 **Agent Skills**를 사용하여 특정 지침, 형식 또는 도구를 따르는 고품질의 일관된 코드를 생성하는 방법을 보여 줍니다.

## Skills란?

Agent Skills는 전문 작업을 수행할 때 GitHub Copilot이 필요에 따라 로드할 수 있는 지침, 스크립트 및 리소스 폴더입니다. Skills는 VS Code의 GitHub Copilot, GitHub Copilot CLI, GitHub Copilot coding agent 등 여러 AI agent에서 작동하는 [개방형 표준](https://agentskills.io/)입니다.

**Agent Skills의 주요 이점:**

- **Copilot 전문화**: 컨텍스트를 반복하지 않고 도메인별 작업에 맞게 기능을 조정합니다
- **반복 감소**: 한 번 만들면 모든 대화에서 자동으로 사용됩니다
- **기능 조합**: 여러 skill을 결합하여 복잡한 워크플로를 구성합니다
- **효율적인 로딩**: 필요할 때 관련 콘텐츠만 컨텍스트에 로드됩니다
- **이식성**: VS Code, Copilot CLI, Copilot coding agent에서 작동합니다

### Agent Skills와 사용자 지정 지침 비교

| 측면            | Agent Skills                                                | 사용자 지정 지침                       |
| --------------- | ----------------------------------------------------------- | -------------------------------------- |
| **목적**        | 전문 기능과 워크플로를 가르칩니다                            | 코딩 표준과 가이드라인을 정의합니다      |
| **이식성**      | VS Code, Copilot CLI, Copilot coding agent에서 작동합니다   | VS Code와 GitHub.com만 지원합니다      |
| **콘텐츠**      | 지침, 스크립트, 예제 및 리소스                              | 지침만 포함합니다                      |
| **범위**        | 작업별로 필요할 때 로드됩니다                              | 항상 적용됩니다(또는 glob 패턴 사용)   |
| **표준**        | 개방형 표준([agentskills.io](https://agentskills.io/))      | VS Code 전용                           |

**다음과 같은 경우 Agent Skills를 사용하세요.**
- 다양한 AI 도구에서 작동하는 재사용 가능한 기능을 만들 때
- 지침과 함께 스크립트, 예제 또는 기타 리소스를 포함할 때
- API 생성, 테스트, 배포 프로세스와 같은 전문 워크플로를 정의할 때

**다음과 같은 경우 사용자 지정 지침을 사용하세요.**
- 프로젝트별 코딩 표준을 정의할 때
- 언어나 프레임워크의 규칙을 설정할 때
- glob 패턴으로 파일 유형에 따라 규칙을 적용할 때

### Skill 구조

Skills는 `.github/skills/` 또는 `.claude/skills/` 디렉터리에 정의되며 다음을 포함합니다.
- `SKILL.md` - YAML frontmatter(name, description)와 상세 지침을 포함하는 skill 정의
- 추가 리소스 - 스크립트, 예제, 템플릿 및 참조 문서

---

## 데모: `api-endpoint` Skill로 새 엔터티 추가하기

### 이유

- **일관성**: 신규 개발자(또는 AI assistant)는 고품질 결과를 얻으려면 전문 지식이 필요합니다. Skills는 조직의 지식을 담아 일관된 맞춤형 코드를 생성하게 합니다.
- **검토 부담 감소**: 코드 생성이 확립된 패턴을 따르면 검토자는 스타일이나 규칙 수정 대신 비즈니스 로직에 집중할 수 있습니다.
- **빠른 온보딩**: 새 팀원은 Skills로 코드베이스의 작업 방식을 이해할 수 있습니다.
- **확장성**: 코드베이스가 커져도 Skills가 일관성을 보장하여 결과 품질과 유지 관리 편의성을 높입니다.

### 보여 줄 내용

1. **Skill 정의**: `api-endpoint` skill 구조를 보여 주고 특정 기술 역량(여기서는 API endpoint 생성)을 담는 방식을 설명합니다
2. **자연어 프롬프트**: 간단한 프롬프트로 완전한 프로덕션용 API endpoint를 생성하는 방법을 보여 줍니다
3. **생성된 산출물**: Copilot이 생성하는 모든 파일(model, repository, route, migration, seed data, test)을 보여 줍니다
4. **패턴 준수**: 생성된 코드가 기존 코드와 정확히 동일한 패턴을 따르는 방식을 강조합니다

### 방법

#### 1부: Skill 살펴보기

0. Agent Skills를 사용하려면 VSCode에서 `chat.useAgentSkills` 설정을 활성화합니다.
1. [.github/skills/api-endpoint/SKILL.md](../../.github/skills/api-endpoint/SKILL.md) 파일을 엽니다
2. 주요 섹션을 살펴봅니다.
   - **아키텍처 개요**: 계층형 아키텍처(Routes → Repository → Database)를 보여 줍니다
   - **이 Skill을 사용하는 시점**: Skill의 트리거 조건
   - **워크플로 단계**: Model, repository, route, migration, seed data를 생성하는 단계별 가이드
   - **패턴 및 예제**: 각 구성 요소의 구체적인 코드 패턴
3. (선택 사항) [references/database-conventions.md](../../.github/skills/api-endpoint/references/database-conventions.md) 파일을 보여 주며 보조 문서를 포함하는 방식을 설명합니다

#### 2부: DeliveryVehicle 엔터티 생성하기

1. Copilot Chat을 열고 **Agent** 모드로 전환합니다
2. 다음 프롬프트를 입력합니다.

   ```txt
   'DeliveryVehicle'이라는 새 엔터티에 대한 API endpoint를 추가해 주세요. 차량은 지점에 속합니다.
   ```

3. Copilot의 다음 작업을 관찰합니다.
   - 기존 코드베이스 구조 분석
   - `api-endpoint` skill 자동 참조
   - 확립된 패턴에 따라 필요한 모든 구성 요소 생성:
     - **Model**: 규칙에 따라 model 생성
     - **Repository**: CRUD 작업이 포함된 Repository 생성
     - **Routes**: 완전한 REST endpoint가 포함된 route 생성
     - **Migration**: DB migration 생성
     - **Seed Data**: Seed data 생성
     - **Tests**: 새 endpoint의 단위 테스트 생성 및 실행

4. 생성된 코드를 검토하며 다음을 강조합니다.
   - **명명 규칙**: 엔터티와 메서드의 명명 규칙 준수
   - **외래 키 관계**: `branches` 테이블에 연결되는 `branchId` 필드
   - **API 문서**: 모든 endpoint에 대한 완전한 OpenAPI annotation
   - **오류 처리**: 사용자 지정 오류의 일관된 사용
   - **SQL 유틸리티**: 지정된 유틸리티 사용
   - **단위 테스트**: 단위 테스트 생성 및 검증

#### 3부: 구현 검증하기

1. 변경 사항을 수락합니다
2. 빌드와 단위 테스트를 실행합니다
3. `http://localhost:3000/api-docs`에서 Swagger UI를 열고 새 DeliveryVehicle endpoint를 보여 줍니다
4. (선택 사항) Swagger UI로 CRUD 작업을 테스트합니다

---

## 핵심 요점

| 이점                           | 설명                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **조직 지식**                  | Skills는 팀의 패턴과 규칙을 담아 모든 개발자와 AI assistant가 활용할 수 있게 합니다                              |
| **일관된 코드 생성**           | 생성된 모든 endpoint가 동일한 구조를 따라 코드 검토 부담을 줄입니다                                              |
| **자체 문서화**                | Skills는 프로젝트 아키텍처와 패턴에 대한 살아 있는 문서 역할을 합니다                                            |
| **확장 가능한 개발**           | API가 커져도 Skills가 모든 endpoint의 일관성을 보장합니다                                                        |
| **빠른 개발**                  | 개발자는 간단한 자연어 프롬프트로 프로덕션용 코드를 생성할 수 있습니다                                            |

---

## 관련 자료

- [VSCode의 Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Copilot 사용자 지정 지침](./copilot-in-ide.md#demo-custom-instructions-and-repository-configuration)
- [사용자 지정 프롬프트 파일](./copilot-in-ide.md#demo-custom-prompt-files-and-reusable-workflows)
- [API 아키텍처 문서](../../docs/architecture.md)
- [SQLite 통합](../../docs/sqlite-integration.md)
