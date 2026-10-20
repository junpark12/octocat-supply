---
description: '데모: API 테스트 커버리지 개선 - 누락된 라우트에 단위 테스트 추가.'
tools: ['search', 'edit', 'web','vscode/openSimpleBrowser', 'read', 'execute', 'azure-mcp-server/search', 'playwright/*', 'github/*']
---
# 🧪 데모: Product 및 Supplier 라우트에 단위 테스트 추가

## 📊 현재 상태

- **테스트 파일이 1개만 존재**합니다: `branch.test.ts`


## 🎯 목표
Product 및 Supplier 라우트에 포괄적인 단위 테스트를 구현하여 API 테스트 커버리지를 높이세요.

## 📋 누락된 테스트 파일

### 🔗 라우트 테스트(높은 우선순위)
다음 라우트 파일에 완전한 테스트 커버리지가 필요합니다.


- [ ] `src/routes/product.test.ts`
- [ ] `src/routes/supplier.test.ts`


## ✅ 테스트 커버리지 요구 사항

### 각 라우트 테스트 파일에 대해:

- **CRUD 작업:**
  - ✅ GET으로 모든 엔터티 조회
  - ✅ GET으로 ID에 해당하는 단일 엔터티 조회
  - ✅ POST로 새 엔터티 생성
  - ✅ PUT으로 기존 엔터티 업데이트
  - ✅ DELETE로 ID에 해당하는 엔터티 삭제

- **오류 시나리오:**
  - ❌ 존재하지 않는 엔터티에 404
  - ❌ 잘못된 요청 페이로드에 400
  - ❌ 유효성 검사 오류에 422
  - ❌ 경계 사례(잘못된 형식의 ID, 빈 요청)

## 🛠️ 구현 지침

### 기존 패턴 사용

`src/routes/branch.test.ts`에 확립된 패턴을 따르세요.
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
```

### 테스트 구조 템플릿
```typescript
describe('[Entity] API', () => {
    beforeEach(() => {
        // Setup app and reset data
    });

    it('should create a new [entity]', async () => { /* POST test */ });
    it('should get all [entities]', async () => { /* GET all test */ });
    it('should get a [entity] by ID', async () => { /* GET by ID test */ });
    it('should update a [entity] by ID', async () => { /* PUT test */ });
    it('should delete a [entity] by ID', async () => { /* DELETE test */ });
    it('should return 404 for non-existing [entity]', async () => { /* Error test */ });
});
```


## 🔧 테스트 실행


```bash
# Run all tests
npm run test:api

# Run tests with coverage
npm run test:api -- -- --coverage

# Run specific test file
npm run test:api -- src/routes/product.test.ts
```


## 📈 성공 기준
- [ ] Product 및 Supplier 라우트 테스트 파일 추가
- [ ] CI/CD에서 모든 테스트 통과

## 🚀 시작하기

1. `product.test.ts`부터 시작하고 `branch.test.ts` 패턴을 복사하세요.
2. 기본 CRUD 테스트를 먼저 구현하세요.
3. 오류 시나리오를 점진적으로 추가하세요.
4. 각 파일을 완료한 후 커버리지를 실행하여 진행 상황을 추적하세요.
5. 엔터티 간 테스트에서는 ERD 관계를 따르세요.


## 📚 관련 파일

- ERD 다이어그램: `api/ERD.png`
- 기존 테스트: `api/src/routes/branch.test.ts`
- 테스트 설정: `api/vitest.config.ts`
- 커버리지 보고서: `api/coverage/index.html`
