<a id="sqlite-database-integration"></a>
# SQLite database 통합

이 문서는 OctoCAT 공급망 관리 API에서 SQLite database 통합을 사용하는 방법을 설명합니다.

<a id="overview"></a>
## 개요

API는 in-memory 데이터 storage에서 영속적인 SQLite database로 전환되었습니다. 다음을 제공합니다.

- **데이터 persistence** - 서버 재시작 후에도 데이터 유지
- **ACID transaction** - 신뢰할 수 있는 데이터 일관성
- **적절한 관계** - entity 사이의 foreign key constraint
- **성능** - indexed query를 통한 성능 개선
- **테스트** - unit test용 in-memory database

<a id="database-structure"></a>
## Database 구조

database는 다음 table로 구성됩니다.

- `suppliers` - 공급업체 정보
- `headquarters` - 회사 본사 데이터
- `branches` - 지점 위치(본사와 연결)
- `products` - 제품 catalog(공급업체와 연결)
- `orders` - 고객 주문(지점과 연결)
- `order_details` - 주문 품목(주문 및 제품과 연결)
- `deliveries` - 배송 추적(공급업체와 연결)
- `order_detail_deliveries` - 주문-배송 관계의 junction table
- `migrations` - database schema 버전 추적

<a id="getting-started"></a>
## 시작하기

<a id="1-database-initialization"></a>
### 1. Database 초기화

서버를 처음 시작하면 database가 자동으로 초기화됩니다.

```bash
make dev
```

다음 작업이 수행됩니다.

- `api/data/app.db`에 SQLite database 파일 생성
- 대기 중인 모든 migration 실행
- database가 비어 있으면 샘플 데이터로 seed

<a id="2-manual-database-management"></a>
### 2. 수동 database 관리

root 디렉터리에서 database를 수동으로 관리할 수도 있습니다.

```bash
# Initialize database with migrations and seed data
make db-init

# Run migrations only (no seeding)
make db-migrate

# Seed database only
make db-seed
```

<% if demo_options.backend == 'nodejs' %>

또는 `api/` 디렉터리에서 npm 명령어를 직접 사용할 수 있습니다.

```bash
cd api
npm run db:init
npm run db:migrate
npm run db:seed
```

<% endif %>

<a id="3-database-location"></a>
### 3. Database 위치

database 파일은 다음 위치에 저장됩니다.

- **개발**: `api/data/app.db`
- **테스트**: in-memory (`:memory:`)

`DB_FILE` 환경 변수로 database 위치를 재정의할 수 있습니다.

```bash
export DB_FILE=/path/to/your/database.db
```

<a id="repository-pattern"></a>
## Repository pattern

API는 database와 상호 작용할 때 Repository pattern을 사용합니다.

<a id="using-repositories"></a>
### Repository 사용

```typescript
import { getSuppliersRepository } from './repositories/suppliersRepo';

const repo = await getSuppliersRepository();

// Get all suppliers
const suppliers = await repo.findAll();

// Get supplier by ID
const supplier = await repo.findById(1);

// Create new supplier
const newSupplier = await repo.create({
    name: 'New Supplier',
    description: 'Description',
    contactPerson: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234'
});

// Update supplier
const updated = await repo.update(1, { name: 'Updated Name' });

// Delete supplier
await repo.delete(1);

// Search by name
const results = await repo.findByName('Tech');
```

<a id="repository-features"></a>
### Repository 기능

- **Type safety** - 완전한 TypeScript 지원
- **오류 처리** - 적절한 오류 type(NotFoundError, ValidationError 등)
- **SQL injection 방지** - parameterized query
- **자동 매핑** - snake_case(database)와 camelCase(JavaScript) 사이 변환

<a id="database-schema-management"></a>
## Database schema 관리

<a id="migrations"></a>
### Migration

database schema 변경은 migration 파일로 관리합니다.

1. 새 migration 파일 생성: `api/sql/migrations/002_description.sql`
2. SQL 문 추가
3. migration 실행: `make db-migrate`<% if demo_options.backend == 'nodejs' %> (또는 `cd api && npm run db:migrate`)<% endif %>

migration 파일은 순서대로 실행되고 `migrations` table에서 추적됩니다.

<a id="seed-data"></a>
### Seed 데이터

샘플 데이터는 `api/sql/seed/`의 seed 파일로 제공됩니다.

- `001_suppliers.sql` - 공급업체 데이터
- `002_headquarters.sql` - 본사 데이터
- `003_branches.sql` - 지점 데이터
- `004_products.sql` - 제품 catalog

<a id="testing-strategy"></a>
## 테스트 전략

<a id="unit-tests"></a>
### Unit test

repository는 mock database 연결로 테스트합니다.

```typescript
import { vi } from 'vitest';
import { SuppliersRepository } from '../repositories/suppliersRepo';

// Mock database
const mockDb = {
    run: vi.fn(),
    get: vi.fn(),
    all: vi.fn(),
    close: vi.fn()
};

// Test repository methods
const repo = new SuppliersRepository(mockDb);
```

<a id="integration-tests"></a>
### Integration test

integration test에는 in-memory database를 사용합니다.

```typescript
import { getDatabase } from '../db/sqlite';

const db = await getDatabase(true); // true = test mode (in-memory)
```

<a id="configuration"></a>
## 설정

database 설정은 `api/src/db/config.ts`에서 관리합니다.

```typescript
export const DB_CONFIG = {
    DB_FILE: process.env.DB_FILE || './data/app.db',
    DB_ENGINE: process.env.DB_ENGINE || 'sqlite',
    ENABLE_WAL: process.env.DB_ENABLE_WAL !== 'false',
    TIMEOUT: parseInt(process.env.DB_TIMEOUT || '30000'),
    FOREIGN_KEYS: process.env.DB_FOREIGN_KEYS !== 'false'
};
```

<a id="environment-variables"></a>
### 환경 변수

- `DB_FILE` - database 파일 경로 (기본값: `./data/app.db`)
- `DB_ENGINE` - database engine (기본값: `sqlite`)
- `DB_ENABLE_WAL` - WAL 모드 활성화 (기본값: `true`)
- `DB_TIMEOUT` - 밀리초 단위 연결 timeout (기본값: `30000`)
- `DB_FOREIGN_KEYS` - foreign key constraint 활성화 (기본값: `true`)

<a id="error-handling"></a>
## 오류 처리

시스템은 전용 오류 type을 제공합니다.

- `DatabaseError` - 일반 database 오류
- `NotFoundError` - entity를 찾을 수 없음(404)
- `ValidationError` - 유효하지 않은 데이터(400)
- `ConflictError` - constraint 위반(409)

이러한 오류는 Express error middleware가 자동으로 처리하고 적절한 HTTP status code를 반환합니다.

<a id="performance-considerations"></a>
## 성능 고려 사항

database에는 다음과 같은 최적화가 포함됩니다.

- **Index** - foreign key 및 자주 조회하는 column에 적용
- **WAL 모드** - 읽기/쓰기 작업의 concurrency 개선
- **Connection pooling** - database 연결 재사용
- **Query 최적화** - parameterized query로 SQL injection 방지

<a id="backup-and-recovery"></a>
## 백업 및 복구

SQLite는 단일 파일에 데이터를 저장하므로 백업이 간단합니다.

```bash
# Backup database
cp api/data/app.db api/data/app-backup-$(date +%Y%m%d).db

# Restore from backup
cp api/data/app-backup-20231225.db api/data/app.db
```

production 배포에서는 정기적인 자동 백업을 고려하세요.

<a id="troubleshooting"></a>
## 문제 해결

<a id="common-issues"></a>
### 일반적인 문제

1. **Database 잠김**: 보통 장시간 실행되는 transaction이나 닫히지 않은 연결이 원인
   - 해결 방법: 모든 database 작업을 올바르게 await하고 연결을 닫는지 확인

2. **Foreign key constraint 오류**: 존재하지 않는 record를 참조하려고 함
   - 해결 방법: 관계를 만들기 전에 참조하는 record가 존재하는지 확인

3. **Migration 오류**: SQL 구문 오류 또는 충돌하는 schema 변경
   - 해결 방법: migration 파일 구문을 점검하고 기존 schema와의 호환성 확인

<a id="debug-mode"></a>
### Debug 모드

상세 SQLite logging을 활성화합니다.

<% if demo_options.backend == 'nodejs' %>

```bash
NODE_ENV=development make dev
```

<% elsif demo_options.backend == 'python' %>

```bash
make dev
```

<% endif %>

실행되는 모든 SQL query가 표시됩니다.

<a id="next-steps"></a>
## 다음 단계

현재 구현에는 다음이 포함됩니다.

- ✅ 완전한 SQLite 인프라
- ✅ Suppliers repository 및 route
- ✅ Migration 및 seeding 시스템
- ✅ mocking을 사용하는 unit test

아직 구현해야 할 항목:

- [ ] 나머지 entity(products, orders 등)의 repository
- [ ] 나머지 endpoint의 route migration
- [ ] Integration test
- [ ] Docker 설정 업데이트
- [ ] Production 배포 고려 사항
