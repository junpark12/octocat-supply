# API 엔드포인트 테스트 패턴

이 문서는 OctoCAT Supply Chain 애플리케이션의 API 엔드포인트에 대한 단위 테스트 및 통합 테스트 작성 지침을 제공합니다.

## 개요

새 리포지토리에는 `api/src/repositories/{entity}sRepo.test.ts`에 **항상 단위 테스트를 만드세요**.

모든 테스트는 Vitest를 테스트 프레임워크로 사용하며 주요 라이브러리는 다음과 같습니다.
- `vitest` - 테스트 실행기 및 검증 라이브러리
- `supertest` - 라우트 통합 테스트용 HTTP 테스트(선택 사항)

## 리포지토리 단위 테스트

### 테스트 파일 구조

`api/src/repositories/{entity}sRepo.test.ts`에 테스트를 만드세요.

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EntityNamesRepository } from './entityNamesRepo';
import { NotFoundError } from '../utils/errors';
import { DatabaseRow } from '../utils/sql';

describe('EntityNamesRepository', () => {
  let repository: EntityNamesRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(),
      close: vi.fn()
    };
    repository = new EntityNamesRepository(mockDb);
    vi.clearAllMocks();
  });

  // Test suites for each method...
});
```

### 필수 테스트 커버리지

다음 시나리오로 모든 CRUD 작업을 테스트하세요.

#### findAll()
```typescript
describe('findAll', () => {
  it('should return all entities mapped to camelCase', async () => {
    const mockRows: DatabaseRow[] = [
      { entity_name_id: 1, name: 'Test 1', status: 'active' },
      { entity_name_id: 2, name: 'Test 2', status: 'inactive' }
    ];
    mockDb.all.mockResolvedValue(mockRows);

    const result = await repository.findAll();

    expect(mockDb.all).toHaveBeenCalledWith('SELECT * FROM entity_names ORDER BY entity_name_id');
    expect(result).toEqual([
      { entityNameId: 1, name: 'Test 1', status: 'active' },
      { entityNameId: 2, name: 'Test 2', status: 'inactive' }
    ]);
  });

  it('should handle empty result set', async () => {
    mockDb.all.mockResolvedValue([]);

    const result = await repository.findAll();

    expect(result).toEqual([]);
  });

  it('should handle database errors', async () => {
    mockDb.all.mockRejectedValue(new Error('Database connection failed'));

    await expect(repository.findAll()).rejects.toThrow();
  });
});
```

#### findById()
```typescript
describe('findById', () => {
  it('should return entity when found', async () => {
    const mockRow: DatabaseRow = { entity_name_id: 1, name: 'Test', status: 'active' };
    mockDb.get.mockResolvedValue(mockRow);

    const result = await repository.findById(1);

    expect(mockDb.get).toHaveBeenCalledWith(
      'SELECT * FROM entity_names WHERE entity_name_id = ?',
      [1]
    );
    expect(result).toEqual({ entityNameId: 1, name: 'Test', status: 'active' });
  });

  it('should return null when not found', async () => {
    mockDb.get.mockResolvedValue(null);

    const result = await repository.findById(999);

    expect(result).toBeNull();
  });
});
```

#### create()
```typescript
describe('create', () => {
  it('should create entity and return created record', async () => {
    const newEntity = { name: 'New Entity', status: 'active' };
    const mockCreated = { entity_name_id: 5, ...newEntity };
    
    mockDb.run.mockResolvedValue({ lastID: 5, changes: 1 });
    mockDb.get.mockResolvedValue(mockCreated);

    const result = await repository.create(newEntity);

    expect(mockDb.run).toHaveBeenCalled();
    expect(mockDb.get).toHaveBeenCalledWith(
      'SELECT * FROM entity_names WHERE entity_name_id = ?',
      [5]
    );
    expect(result).toEqual({
      entityNameId: 5,
      name: 'New Entity',
      status: 'active'
    });
  });

  it('should throw error if created entity cannot be retrieved', async () => {
    mockDb.run.mockResolvedValue({ lastID: 5, changes: 1 });
    mockDb.get.mockResolvedValue(null);

    await expect(repository.create({ name: 'Test' })).rejects.toThrow(
      'Failed to retrieve created entity'
    );
  });
});
```

#### update()
```typescript
describe('update', () => {
  it('should update entity and return updated record', async () => {
    const updates = { name: 'Updated Name', status: 'inactive' };
    const mockUpdated = { entity_name_id: 1, ...updates };
    
    mockDb.run.mockResolvedValue({ changes: 1 });
    mockDb.get.mockResolvedValue(mockUpdated);

    const result = await repository.update(1, updates);

    expect(mockDb.run).toHaveBeenCalled();
    expect(result).toEqual({
      entityNameId: 1,
      name: 'Updated Name',
      status: 'inactive'
    });
  });

  it('should throw NotFoundError when entity does not exist', async () => {
    mockDb.run.mockResolvedValue({ changes: 0 });

    await expect(repository.update(999, { name: 'Test' })).rejects.toThrow(NotFoundError);
  });
});
```

#### delete()
```typescript
describe('delete', () => {
  it('should delete entity successfully', async () => {
    mockDb.run.mockResolvedValue({ changes: 1 });

    await repository.delete(1);

    expect(mockDb.run).toHaveBeenCalledWith(
      'DELETE FROM entity_names WHERE entity_name_id = ?',
      [1]
    );
  });

  it('should throw NotFoundError when entity does not exist', async () => {
    mockDb.run.mockResolvedValue({ changes: 0 });

    await expect(repository.delete(999)).rejects.toThrow(NotFoundError);
  });
});
```

#### exists()
```typescript
describe('exists', () => {
  it('should return true when entity exists', async () => {
    mockDb.get.mockResolvedValue({ count: 1 });

    const result = await repository.exists(1);

    expect(result).toBe(true);
  });

  it('should return false when entity does not exist', async () => {
    mockDb.get.mockResolvedValue({ count: 0 });

    const result = await repository.exists(999);

    expect(result).toBe(false);
  });

  it('should handle null result', async () => {
    mockDb.get.mockResolvedValue(null);

    const result = await repository.exists(999);

    expect(result).toBe(false);
  });
});
```

### 테스트 커버리지 요구 사항

리포지토리 테스트는 다음을 다뤄야 합니다.

- ✅ **CRUD 작업** - 모든 create, read, update, delete 메서드 테스트
- ✅ **성공 사례** - 유효한 데이터로 올바른 동작 검증
- ✅ **경계 사례** - 빈 결과, null 값, 경계 조건
- ✅ **오류 사례** - 데이터베이스 실패, 찾을 수 없는 경우, 제약 조건 위반
- ✅ **Mock 검증** - 올바른 SQL 쿼리 및 매개변수 사용 확인

## 라우트 통합 테스트(선택 사항)

HTTP 엔드포인트를 테스트하도록 `api/src/routes/{entity}.test.ts`에 통합 테스트를 만드세요.

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import entityNameRoutes from './entityName';
import * as repo from '../repositories/entityNamesRepo';

vi.mock('../repositories/entityNamesRepo');

describe('EntityName Routes', () => {
  let app: express.Application;
  let mockRepo: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/entity-names', entityNameRoutes);
    
    mockRepo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };
    
    vi.mocked(repo.getEntityNamesRepository).mockResolvedValue(mockRepo);
  });

  describe('GET /api/entity-names', () => {
    it('should return all entities', async () => {
      const mockEntities = [
        { entityNameId: 1, name: 'Test 1' },
        { entityNameId: 2, name: 'Test 2' }
      ];
      mockRepo.findAll.mockResolvedValue(mockEntities);

      const response = await request(app).get('/api/entity-names');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEntities);
    });
  });

  describe('GET /api/entity-names/:id', () => {
    it('should return entity when found', async () => {
      const mockEntity = { entityNameId: 1, name: 'Test' };
      mockRepo.findById.mockResolvedValue(mockEntity);

      const response = await request(app).get('/api/entity-names/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEntity);
    });

    it('should return 404 when not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/entity-names/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/entity-names', () => {
    it('should create entity and return 201', async () => {
      const newEntity = { name: 'New Entity' };
      const createdEntity = { entityNameId: 1, ...newEntity };
      mockRepo.create.mockResolvedValue(createdEntity);

      const response = await request(app)
        .post('/api/entity-names')
        .send(newEntity);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdEntity);
    });
  });

  describe('PUT /api/entity-names/:id', () => {
    it('should update entity and return 200', async () => {
      const updates = { name: 'Updated' };
      const updatedEntity = { entityNameId: 1, name: 'Updated' };
      mockRepo.update.mockResolvedValue(updatedEntity);

      const response = await request(app)
        .put('/api/entity-names/1')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedEntity);
    });

    it('should return 404 when entity not found', async () => {
      mockRepo.update.mockRejectedValue(new NotFoundError('EntityName', 999));

      const response = await request(app)
        .put('/api/entity-names/999')
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/entity-names/:id', () => {
    it('should delete entity and return 204', async () => {
      mockRepo.delete.mockResolvedValue(undefined);

      const response = await request(app).delete('/api/entity-names/1');

      expect(response.status).toBe(204);
    });

    it('should return 404 when entity not found', async () => {
      mockRepo.delete.mockRejectedValue(new NotFoundError('EntityName', 999));

      const response = await request(app).delete('/api/entity-names/999');

      expect(response.status).toBe(404);
    });
  });
});
```

## 테스트 실행

### 명령줄

```bash
# Run all tests
npm test --workspace=api

# Run specific test file
npm test --workspace=api -- entityNamesRepo.test.ts

# Run with coverage
npm test --workspace=api -- --coverage

# Run in watch mode
npm test --workspace=api -- --watch

# Run tests matching a pattern
npm test --workspace=api -- --grep "findAll"
```

### 테스트 출력

Vitest는 다음을 보여 주는 명확하고 서식이 지정된 출력을 제공합니다.
- 각 테스트의 통과/실패 상태
- 실행 시간
- 커버리지 백분율(`--coverage` 사용 시)
- 실패에 대한 상세 오류 메시지 및 스택 추적

## 모범 사례

### Mocking
- 단위 테스트에서는 항상 데이터베이스 연결을 mock 처리하세요.
- mock 함수에는 `vi.fn()`을 사용하세요.
- `beforeEach`에서 `vi.clearAllMocks()`로 테스트 사이의 mock을 초기화하세요.
- 경계에서 mock 처리하세요(리포지토리는 데이터베이스 수준, 라우트는 리포지토리 수준).

### 테스트 구성
- 중첩된 `describe` 블록으로 관련 테스트를 그룹화하세요.
- 메서드/함수마다 `describe`를 하나씩 사용하세요.
- "should" 문장을 사용하여 명확하고 설명적인 테스트 이름을 지정하세요.
- 각 테스트에 Arrange-Act-Assert 패턴을 사용하세요.

### 검증
- 결과와 부수 효과(mock 호출)를 모두 검증하세요.
- 관련이 있으면 정확한 SQL 쿼리와 매개변수를 확인하세요.
- 오류 발생 여부뿐 아니라 오류 타입도 테스트하세요.
- 라우트 테스트에서 HTTP 상태 코드와 응답 본문을 검증하세요.

### 테스트할 경계 사례
- 빈 컬렉션
- Null/undefined 값
- 존재하지 않는 ID(404 시나리오)
- 제약 조건 위반(unique, foreign key)
- 데이터베이스 연결 실패
- 잘못된 입력 데이터 타입

## 예제: 완전한 테스트 파일

모든 패턴과 모범 사례를 따르는 프로덕션 수준의 완전한 예제는 `api/src/repositories/suppliersRepo.test.ts`를 참고하세요.

## 관련 문서

- 오류 시나리오 테스트는 `error-handling.md` 참고
- SQLite 고유 테스트 고려 사항은 `database-conventions.md` 참고
