# 데이터베이스 규칙 참고 자료

이 문서는 OctoCAT Supply Chain API의 SQLite 데이터베이스 규칙을 설명합니다.

## 파일 위치

```
api/
├── data/
│   └── app.db              # SQLite database file (gitignored)
└── sql/
    ├── migrations/         # Schema changes
    │   ├── 001_init.sql
    │   └── 002_add_supplier_status_fields.sql
    └── seed/               # Demo data
        ├── 001_suppliers.sql
        ├── 002_headquarters.sql
        ├── 003_branches.sql
        └── 004_products.sql
```

## 마이그레이션 파일

### 명명 규칙

```
{sequence}_{description}.sql
```

- **sequence**: 앞을 0으로 채운 3자리 숫자(001, 002 등)
- **description**: snake_case로 작성한 변경 내용 설명

### 마이그레이션 구조

```sql
-- 003_add_inventory_table.sql

-- Create the inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    branch_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    last_updated TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_branch ON inventory(branch_id);
```

### 핵심 규칙

1. **항상 IF NOT EXISTS 사용** - 마이그레이션에 멱등성 부여
2. **INTEGER PRIMARY KEY AUTOINCREMENT** - 자동 증가 ID의 표준
3. **외래 키** - 항상 REFERENCES 절로 정의
4. **인덱스** - 외래 키 및 자주 조회하는 열에 생성
5. **기본값** - 타임스탬프에 `datetime('now')` 등의 SQLite 함수 사용

## 열 명명

| TypeScript | SQLite 열 | 참고 |
|------------|---------------|-------|
| `supplierId` | `supplier_id` | 기본 키 |
| `productName` | `product_name` | 일반 필드 |
| `isActive` | `is_active` | Boolean(INTEGER 0/1로 저장) |
| `createdAt` | `created_at` | 타임스탬프(TEXT ISO 8601로 저장) |

## 데이터 타입

| TypeScript | SQLite 타입 | 참고 |
|------------|-------------|-------|
| `number` | `INTEGER` | 모든 숫자 값 |
| `number` (소수) | `REAL` | 부동 소수점 |
| `string` | `TEXT` | 문자열 및 날짜 |
| `boolean` | `INTEGER` | 0 = false, 1 = true |
| `Date` | `TEXT` | ISO 8601 형식 |

## Boolean 처리

SQLite에는 네이티브 boolean 타입이 없습니다. INTEGER(0/1)로 저장하고 리포지토리에서 변환하세요.

```typescript
private convertBooleanFields(entity: Entity): Entity {
  return {
    ...entity,
    active: Boolean(entity.active),
    verified: Boolean(entity.verified),
  };
}
```

## 시드 파일

### 명명 규칙

```
{sequence}_{table_name}.sql
```

순서가 중요합니다! 외래 키가 있는 테이블은 참조 대상 테이블 뒤에 시드를 넣어야 합니다.

### 시드 구조

```sql
-- 004_products.sql

INSERT INTO products (product_id, name, supplier_id, price, description)
VALUES 
  (1, 'Smart Cat Feeder', 1, 129.99, 'Automatic feeding system'),
  (2, 'GPS Cat Collar', 1, 79.99, 'Real-time tracking'),
  (3, 'Interactive Laser Toy', 2, 49.99, 'Automated play system');
```

### 핵심 규칙

1. **명시적 ID** - 예측 가능한 참조를 위해 ID 명시
2. **모델 필드 일치** - 열 이름은 데이터베이스 스키마와 일치해야 함
3. **의존성 순서** - 참조 대상 테이블에 먼저 시드 삽입

## SQL 유틸리티

### buildInsertSQL

camelCase 객체를 snake_case INSERT로 변환합니다.

```typescript
const supplier = { name: 'Acme', contactPerson: 'John' };
const { sql, values } = buildInsertSQL('suppliers', supplier);
// sql: "INSERT INTO suppliers (name, contact_person) VALUES (?, ?)"
// values: ['Acme', 'John']
```

### buildUpdateSQL

camelCase 객체를 snake_case UPDATE로 변환합니다.

```typescript
const updates = { contactPerson: 'Jane', email: 'jane@acme.com' };
const { sql, values } = buildUpdateSQL('suppliers', updates, 'supplier_id = ?');
// sql: "UPDATE suppliers SET contact_person = ?, email = ? WHERE supplier_id = ?"
// values: ['Jane', 'jane@acme.com']  // Note: WHERE value added separately
```

### 대소문자 표기 변환

```typescript
// DB row → TypeScript object
const row = { supplier_id: 1, contact_person: 'John' };
const supplier = objectToCamelCase<Supplier>(row);
// { supplierId: 1, contactPerson: 'John' }

// Multiple rows
const suppliers = mapDatabaseRows<Supplier>(rows);
```

## 데이터베이스 연결

### 프로덕션

```typescript
import { getDatabase } from '../db/sqlite';

const db = await getDatabase();
```

데이터베이스 파일 위치는 `DB_FILE` 환경 변수로 설정합니다(기본값 `api/data/app.db`).

### 테스트(In-Memory)

```typescript
const db = await getDatabase(true);  // isTest = true
```

빠르고 격리된 테스트를 위해 `:memory:` SQLite 데이터베이스를 사용합니다.

## 일반 쿼리

### 정렬을 포함한 SELECT

```typescript
const rows = await this.db.all<DatabaseRow>(
  'SELECT * FROM suppliers ORDER BY supplier_id'
);
```

### 매개변수를 포함한 SELECT

```typescript
const row = await this.db.get<DatabaseRow>(
  'SELECT * FROM suppliers WHERE supplier_id = ?',
  [id]
);
```

### 반환값을 사용하는 INSERT

```typescript
const result = await this.db.run(sql, values);
const newId = result.lastID;
```

### 영향받은 행을 확인하는 UPDATE/DELETE

```typescript
const result = await this.db.run(sql, values);
if (result.changes === 0) {
  throw new NotFoundError('Entity', id);
}
```

## 외래 키 제약 조건

SQLite 외래 키는 연결 설정에서 활성화됩니다. 위반 시:

```typescript
// Caught by handleDatabaseError and converted to ValidationError
throw new ValidationError('Invalid reference to related entity');
```

## 새 테이블 추가

1. 마이그레이션 생성: `api/sql/migrations/00X_add_table_name.sql`
2. 시드 생성(필요한 경우): `api/sql/seed/00X_table_name.sql`
3. API를 재시작하여 마이그레이션 실행
4. 스킬 패턴에 따라 모델, 리포지토리 및 라우트 생성
