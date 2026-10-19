---
name: api-endpoint
description: 확립된 패턴에 따라 OctoCAT Supply Chain 애플리케이션의 REST API 엔드포인트를 생성합니다. 새 CRUD 엔드포인트 생성, 라우트 추가, 리포지토리 클래스 구현 또는 Swagger 문서가 있는 TypeScript 모델 정의 시 이 스킬을 사용하세요. API 기능 추가, 엔드포인트 생성, 데이터 접근 계층 구현 또는 Express.js 백엔드 확장 요청 시 활성화됩니다.
---

# API 엔드포인트 개발

이 스킬은 OctoCAT Supply Chain 애플리케이션의 확립된 패턴에 따른 REST API 엔드포인트 생성을 안내합니다.

## 아키텍처 개요

API는 계층형 아키텍처를 따릅니다.
```
Routes (Express.js) → Repository (Data Access) → SQLite Database
     ↓                      ↓
   Models              SQL Utilities
```

## 이 스킬을 사용할 때

- 엔터티의 새 CRUD 엔드포인트 생성
- 시스템에 새 모델/엔터티 추가
- 데이터 접근용 리포지토리 클래스 구현
- Swagger/OpenAPI 문서 작성
- 기존 라우트에 새 작업 추가

## 워크플로

### 1단계: 모델 정의

`api/src/models/{entity}.ts`에 Swagger 스키마 문서가 있는 TypeScript 인터페이스를 만드세요.

**패턴:**
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     EntityName:
 *       type: object
 *       required:
 *         - entityNameId
 *         - name
 *       properties:
 *         entityNameId:
 *           type: integer
 *           description: The unique identifier
 *         name:
 *           type: string
 *           description: The name field
 *         // ... other properties
 */
export interface EntityName {
  entityNameId: number;
  name: string;
  // ... other fields using camelCase
}
```

**핵심 규칙:**
- 기본 키: `{entityName}Id`(camelCase)
- 플래그는 `boolean`, 날짜는 `string`(ISO 형식) 사용
- 인터페이스 위에 Swagger `@swagger` JSDoc 주석 포함

### 2단계: 리포지토리 생성

repository 패턴에 따라 `api/src/repositories/{entityName}sRepo.ts`를 만드세요.

**필수 import:**
```typescript
import { getDatabase, DatabaseConnection } from '../db/sqlite';
import { EntityName } from '../models/entityName';
import { handleDatabaseError, NotFoundError } from '../utils/errors';
import { buildInsertSQL, buildUpdateSQL, objectToCamelCase, mapDatabaseRows, DatabaseRow } from '../utils/sql';
```

**리포지토리 클래스 구조:**
```typescript
export class EntityNamesRepository {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  async findAll(): Promise<EntityName[]> {
    try {
      const rows = await this.db.all<DatabaseRow>('SELECT * FROM entity_names ORDER BY entity_name_id');
      return mapDatabaseRows<EntityName>(rows);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findById(id: number): Promise<EntityName | null> {
    try {
      const row = await this.db.get<DatabaseRow>('SELECT * FROM entity_names WHERE entity_name_id = ?', [id]);
      return row ? objectToCamelCase<EntityName>(row) : null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async create(entity: Omit<EntityName, 'entityNameId'>): Promise<EntityName> {
    try {
      const { sql, values } = buildInsertSQL('entity_names', entity);
      const result = await this.db.run(sql, values);
      const created = await this.findById(result.lastID || 0);
      if (!created) throw new Error('Failed to retrieve created entity');
      return created;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async update(id: number, entity: Partial<Omit<EntityName, 'entityNameId'>>): Promise<EntityName> {
    try {
      const { sql, values } = buildUpdateSQL('entity_names', entity, 'entity_name_id = ?');
      const result = await this.db.run(sql, [...values, id]);
      if (result.changes === 0) throw new NotFoundError('EntityName', id);
      const updated = await this.findById(id);
      if (!updated) throw new Error('Failed to retrieve updated entity');
      return updated;
    } catch (error) {
      handleDatabaseError(error, 'EntityName', id);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.db.run('DELETE FROM entity_names WHERE entity_name_id = ?', [id]);
      if (result.changes === 0) throw new NotFoundError('EntityName', id);
    } catch (error) {
      handleDatabaseError(error, 'EntityName', id);
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.db.get<{ count: number }>(
        'SELECT COUNT(*) as count FROM entity_names WHERE entity_name_id = ?', [id]
      );
      return (result?.count || 0) > 0;
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
```

**factory 및 singleton 패턴 추가:**
```typescript
export async function createEntityNamesRepository(isTest: boolean = false): Promise<EntityNamesRepository> {
  const db = await getDatabase(isTest);
  return new EntityNamesRepository(db);
}

let entityNamesRepo: EntityNamesRepository | null = null;

export async function getEntityNamesRepository(isTest: boolean = false): Promise<EntityNamesRepository> {
  if (!entityNamesRepo) {
    entityNamesRepo = await createEntityNamesRepository(isTest);
  }
  return entityNamesRepo;
}
```

### 3단계: 라우트 생성

Swagger 문서와 Express 핸들러가 있는 `api/src/routes/{entityName}.ts`를 만드세요.

**Swagger 문서 패턴(파일 상단):**
```typescript
/**
 * @swagger
 * tags:
 *   name: EntityNames
 *   description: API endpoints for managing entity names
 */

/**
 * @swagger
 * /api/entity-names:
 *   get:
 *     summary: Returns all entity names
 *     tags: [EntityNames]
 *     responses:
 *       200:
 *         description: List of all entity names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EntityName'
 *   post:
 *     summary: Create a new entity name
 *     tags: [EntityNames]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntityName'
 *     responses:
 *       201:
 *         description: Entity created successfully
 *
 * /api/entity-names/{id}:
 *   get:
 *     summary: Get by ID
 *     tags: [EntityNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entity found
 *       404:
 *         description: Entity not found
 *   put:
 *     summary: Update by ID
 *     tags: [EntityNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntityName'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete by ID
 *     tags: [EntityNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
```

**라우트 핸들러:**
```typescript
import express from 'express';
import { EntityName } from '../models/entityName';
import { getEntityNamesRepository } from '../repositories/entityNamesRepo';
import { NotFoundError } from '../utils/errors';

const router = express.Router();

// Create
router.post('/', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    const newEntity = await repo.create(req.body as Omit<EntityName, 'entityNameId'>);
    res.status(201).json(newEntity);
  } catch (error) {
    next(error);
  }
});

// Read all
router.get('/', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    const entities = await repo.findAll();
    res.json(entities);
  } catch (error) {
    next(error);
  }
});

// Read one
router.get('/:id', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    const entity = await repo.findById(parseInt(req.params.id));
    if (entity) {
      res.json(entity);
    } else {
      res.status(404).send('EntityName not found');
    }
  } catch (error) {
    next(error);
  }
});

// Update
router.put('/:id', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    const updated = await repo.update(parseInt(req.params.id), req.body);
    res.json(updated);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('EntityName not found');
    } else {
      next(error);
    }
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    await repo.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('EntityName not found');
    } else {
      next(error);
    }
  }
});

export default router;
```

### 4단계: 라우트 등록

`api/src/index.ts`에 다음을 추가하세요.
```typescript
import entityNameRoutes from './routes/entityName';
// ...
app.use('/api/entity-names', entityNameRoutes);
```

### 5단계: 데이터베이스 마이그레이션 생성

마이그레이션 파일 규칙은 `references/database-conventions.md`를 참고하세요.

### 6단계: 시드 데이터 생성

새 엔터티에는 `api/sql/seed/{NNN}_{entity_names}.sql`에 **항상 시드 데이터를 만드세요**.

**시드 파일 명명 규칙:**
- 다음 순번 사용(예: `005_categories.sql`)
- snake_case 복수형 엔터티 이름 사용
- `api/sql/seed/` 디렉터리에 배치

**시드 데이터 모범 사례:**
```sql
-- 005_entity_names.sql
-- Seed data for entity_names table
-- Provides realistic test data for development and demo purposes

INSERT INTO entity_names (entity_name_id, name, description, status, created_at) VALUES
  (1, 'Example Entity 1', 'First example for testing', 'active', '2024-01-15T10:00:00.000Z'),
  (2, 'Example Entity 2', 'Second example for testing', 'active', '2024-01-16T11:30:00.000Z'),
  (3, 'Example Entity 3', 'Third example with different status', 'inactive', '2024-01-17T09:15:00.000Z'),
  (4, 'Example Entity 4', 'Fourth example for edge cases', 'pending', '2024-01-18T14:45:00.000Z');
```

**시드 데이터 지침:**
- 엔터티마다 현실적인 예제 3-5개 제공
- 관련 엔터티와의 참조 무결성을 위해 명시적 ID 사용
- 다양한 상태, 날짜, 경계 사례 포함
- 날짜는 ISO 8601 형식(`YYYY-MM-DDTHH:mm:ss.sssZ`) 사용
- 목적을 설명하는 주석 추가
- 경계 테스트 데이터 포함(빈 문자열, 허용되는 null, 최대 길이)
- 외래 키는 다른 테이블의 기존 시드 데이터 참조

**관계가 있는 예제:**
```sql
-- Reference existing suppliers (from 001_suppliers.sql)
INSERT INTO entity_names (entity_name_id, name, supplier_id, stock_quantity) VALUES
  (1, 'Widget A', 1, 100),  -- References supplier_id = 1
  (2, 'Widget B', 1, 50),   -- Same supplier
  (3, 'Widget C', 2, 200);  -- Different supplier
```

### 7단계: 단위 테스트 생성

새 리포지토리에는 `api/src/repositories/{entity}sRepo.test.ts`에 **항상 단위 테스트를 만드세요**.

다음 내용은 `references/testing-patterns.md`를 참고하세요.
- 전체 테스트 파일 구조 및 패턴
- 모든 CRUD 작업의 필수 테스트 커버리지
- Mock 설정 및 검증
- 선택적 라우트 통합 테스트
- 테스트 실행 명령

**테스트 커버리지 요구 사항:**
- ✅ 모든 CRUD 작업(create, read, update, delete, exists)
- ✅ 유효한 데이터의 성공 사례
- ✅ 경계 사례(빈 결과, null 값, 경계 조건)
- ✅ 오류 사례(데이터베이스 실패, 찾을 수 없는 경우, 제약 조건 위반)
- ✅ Mock 검증(올바른 SQL 쿼리 및 매개변수)

## 명명 규칙

| 맥락 | 규칙 | 예제 |
|---------|------------|---------|
| TypeScript 인터페이스 | PascalCase | `Supplier` |
| 인터페이스 속성 | camelCase | `supplierId` |
| 데이터베이스 테이블 | snake_case, 복수형 | `suppliers` |
| 데이터베이스 열 | snake_case | `supplier_id` |
| 라우트 경로 | kebab-case, 복수형 | `/api/suppliers` |
| 리포지토리 클래스 | PascalCase + Repository | `SuppliersRepository` |
| 라우트 파일 | camelCase.ts | `supplier.ts` |

## 오류 처리

`utils/errors.ts`의 사용자 지정 오류 타입을 사용하세요.
- `NotFoundError(entity, id)` - 404 응답
- `ValidationError(message)` - 400 응답  
- `ConflictError(message)` - 409 응답
- `DatabaseError(message, code, statusCode)` - 일반 DB 오류

리포지토리 호출은 항상 try/catch로 감싸고 일관된 오류 변환을 위해 `handleDatabaseError()`를 사용하세요.

## SQL 유틸리티

`utils/sql.ts`에서 사용 가능한 헬퍼:
- `buildInsertSQL(table, data)` - 플레이스홀더가 있는 INSERT 생성
- `buildUpdateSQL(table, data, whereClause)` - 플레이스홀더가 있는 UPDATE 생성
- `objectToCamelCase<T>(row)` - 단일 DB 행을 타입이 지정된 모델로 변환
- `mapDatabaseRows<T>(rows)` - DB 행 배열을 타입이 지정된 모델로 변환
- `toSnakeCase(str)` / `toCamelCase(str)` - 문자열 변환

## 파일 위치

```
api/src/
├── models/{entity}.ts          # TypeScript interface + Swagger schema
├── repositories/{entity}sRepo.ts  # Data access layer
├── routes/{entity}.ts          # Express routes + Swagger docs
├── utils/
│   ├── errors.ts              # Custom error types
│   └── sql.ts                 # SQL helper utilities
└── index.ts                   # Route registration
```

## 빠른 참고: 전체 체크리스트

새 API 엔드포인트를 만들 때 모든 단계를 완료하세요.

- [ ] **모델** (`api/src/models/{entity}.ts`) - TypeScript 인터페이스 + Swagger 스키마
- [ ] **리포지토리** (`api/src/repositories/{entity}sRepo.ts`) - 모든 CRUD 메서드를 갖춘 데이터 접근
- [ ] **라우트** (`api/src/routes/{entity}.ts`) - Express 핸들러 + Swagger 문서
- [ ] **등록** (`api/src/index.ts`) - Express 앱에 라우트 추가
- [ ] **마이그레이션** (`api/sql/migrations/{NNN}_{description}.sql`) - CREATE TABLE 문
- [ ] **시드 데이터** (`api/sql/seed/{NNN}_{entity_names}.sql`) - 현실적인 예제 3-5개
- [ ] **단위 테스트** (`api/src/repositories/{entity}sRepo.test.ts`) - 모든 CRUD 작업, 경계 사례, 오류
- [ ] **라우트 테스트** (`api/src/routes/{entity}.test.ts`) - HTTP 엔드포인트 통합 테스트

**시드 데이터나 단위 테스트를 생략하지 마세요**. 모든 새 엔드포인트에 필수입니다.

## 추가 자료

- 포괄적인 테스트 지침은 `references/testing-patterns.md` 참고
- 상세 오류 패턴은 `references/error-handling.md` 참고
- SQLite 세부 사항은 `references/database-conventions.md` 참고
- OpenAPI 문서는 `references/swagger-patterns.md` 참고
