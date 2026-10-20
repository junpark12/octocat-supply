# Patch Set: 라이브 코딩처럼 보여 주는 데모 방법

이 플랫폼 데모에는 여러 "라이브 코딩 데모"가 포함되어 있습니다. 대부분 "patch-set"을 적용하는 방식으로 작동합니다. 기본적으로 특정 위치에 압축을 푸는 파일이므로 실제 라이브 코딩 없이도 변경 사항을 쉽게 빠르게 적용할 수 있습니다.

## Patch-Set 적용하기

1. VSCode에서 Command Palette를 엽니다
2. `Task: Run Task`를 검색하고 Enter를 누릅니다
3. 표시된 목록에서 적용할 patch를 선택합니다
4. Patch-Set이 새 브랜치에 새 파일을 만들지 묻습니다.
    1. `Yes`: `git checkout -b`로 브랜치를 만듭니다. PR을 빠르게 만들어야 할 때 유용합니다
    2. `No`: 현재 브랜치에 압축을 풉니다. 데모 흐름에서 이미 브랜치를 만든 경우 유용합니다

> [!WARNING]
> Patch set은 이 저장소의 파일을 tar-gzip으로 압축한 것입니다. 압축을 풀면 포함된 파일을 덮어쓰므로 데모 중 대상 파일에 적용한 변경 사항이 사라집니다. 보통은 해당 파일을 변경하지 않으므로 큰 문제가 없지만 주의해야 합니다.

## 새 Patch-Set 만들기

데모에 기여하고 새 patch-set을 추가하려면 다음 단계를 따르세요.

1. Patch-Set에 포함하려는 변경 사항을 적용하거나 파일을 만듭니다
2. 루트 디렉터리에서 `tar -czf <path-to-file-1> <path-to-file-2>`를 실행합니다. 예: `tar -czf .github/copilot-instructions.md ./frontend/index.html`
3. [demo/resources]에 patch set에 맞는 이름으로 새 폴더를 만듭니다(기존 폴더를 참고하세요)
4. 생성된 `patch.tgz`를 해당 폴더에 넣습니다
5. [.vscode/tasks.json](../../.vscode/tasks.json)으로 이동하여 기존 task 하나를 복사해 배열에 새 task로 추가합니다
6. `label`을 시연할 기능 이름으로 바꿉니다
7. 다음 순서로 `args`를 바꿉니다.
    1. 첫 번째 인수: `Folder-Name`: 3단계에서 선택한 폴더의 이름입니다
    2. 두 번째 인수: `Branch-Name`: 사용자가 `Yes`를 선택했을 때 새 브랜치를 만들려면 여기에 기본 브랜치 이름을 지정합니다. 세 번째 인수를 `No`로 지정하면 비워 둘 수 있습니다
    3. 세 번째 인수: 변경 사항에 대해 새 브랜치를 만들지 사용자에게 물으려면 여기에 `${input:NEW_BRANCH}`를 넣습니다. 그렇지 않으면 `No`로 설정합니다
