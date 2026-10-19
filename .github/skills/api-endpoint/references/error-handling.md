# 오류 처리 참고 자료

이 문서는 OctoCAT Supply Chain API에서 사용하는 오류 처리 패턴을 설명합니다.

## 오류 클래스 계층

```
Error
└── DatabaseError (base class)
    ├── NotFoundError (404)
    ├── ValidationError (400)
    └── ConflictError (409)
```

## 오류 타입

### DatabaseError(기본 클래스)

상태 코드를 사용자 지정할 수 있는 일반 데이터베이스 오류입니다.

```typescript
export class DatabaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string = 'DATABASE_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
```

### NotFoundError

ID로 엔터티를 찾을 수 없을 때 사용하세요.

```typescript
export class NotFoundError extends DatabaseError {
  constructor(entity: string, id: string | number) {
    super(`${entity} with ID ${id} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}
```

**사용법:**
```typescript
throw new NotFoundError('Supplier', id);
// → "Supplier with ID 123 not found" (404)
```

### ValidationError

잘못된 입력 또는 제약 조건 위반에 사용하세요.

```typescript
export class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(`Validation error: ${message}`, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}
```

**사용법:**
```typescript
throw new ValidationError('Email format is invalid');
// → "Validation error: Email format is invalid" (400)
```

### ConflictError

중복/고유 제약 조건 위반에 사용하세요.

```typescript
export class ConflictError extends DatabaseError {
  constructor(message: string) {
    super(`Conflict: ${message}`, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}
```

**사용법:**
```typescript
throw new ConflictError('Supplier with this email already exists');
// → "Conflict: Supplier with this email already exists" (409)
```

## handleDatabaseError 함수

SQLite 고유 오류를 적절한 타입으로 변환하는 중앙 오류 핸들러입니다.

```typescript
export function handleDatabaseError(error: unknown, entity?: string, id?: string | number): never {
  // Re-throw if already a DatabaseError
  if (error instanceof DatabaseError) {
    throw error;
  }

  const message = error instanceof Error ? error.message : error;

  // SQLite constraint violations
  if (error.code === 'SQLITE_CONSTRAINT') {
    if (error.message.includes('UNIQUE')) {
      throw new ConflictError('Resource already exists');
    }
    if (error.message.includes('FOREIGN KEY')) {
      throw new ValidationError('Invalid reference to related entity');
    }
    throw new ValidationError(error.message);
  }

  // SQLite busy/locked
  if (error.code === 'SQLITE_BUSY') {
    throw new DatabaseError('Database is temporarily unavailable', 'DATABASE_BUSY', 503);
  }

  // Default
  throw new DatabaseError(`Database operation failed: ${message}`, 'DATABASE_ERROR', 500);
}
```

## 리포지토리 메서드에서 사용

데이터베이스 호출은 항상 try/catch로 감싸세요.

```typescript
async findById(id: number): Promise<Entity | null> {
  try {
    const row = await this.db.get<DatabaseRow>('SELECT * FROM entities WHERE id = ?', [id]);
    return row ? objectToCamelCase<Entity>(row) : null;
  } catch (error) {
    handleDatabaseError(error);  // Will throw appropriate error type
  }
}

async update(id: number, data: Partial<Entity>): Promise<Entity> {
  try {
    const { sql, values } = buildUpdateSQL('entities', data, 'id = ?');
    const result = await this.db.run(sql, [...values, id]);
    
    if (result.changes === 0) {
      throw new NotFoundError('Entity', id);
    }
    
    // ... return updated entity
  } catch (error) {
    handleDatabaseError(error, 'Entity', id);  // Pass entity info for context
  }
}
```

## 라우트 핸들러에서 사용

오류 타입을 확인하고 적절하게 응답하세요.

```typescript
router.put('/:id', async (req, res, next) => {
  try {
    const repo = await getEntitiesRepository();
    const updated = await repo.update(parseInt(req.params.id), req.body);
    res.json(updated);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Entity not found');
    } else {
      next(error);  // Let error middleware handle other errors
    }
  }
});
```

## 오류 미들웨어

`index.ts`의 전역 오류 핸들러가 처리되지 않은 오류를 잡습니다.

```typescript
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof DatabaseError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  // Default 500 response
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
```

## JSON 오류 응답 형식

모든 API 오류는 일관된 JSON을 반환합니다.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Supplier with ID 123 not found"
  }
}
```

## 모범 사례

1. **항상 handleDatabaseError 사용** - 리포지토리에서 원시 오류를 던지지 마세요.
2. **맥락 제공** - 의미 있는 메시지를 위해 엔터티 이름과 ID를 `handleDatabaseError()`에 전달하세요.
3. **구체적인 오류 타입부터 확인** - `next()`에 위임하기 전에 라우트에서 `NotFoundError`를 명시적으로 처리하세요.
4. **적절한 오류 타입 사용** - 누락된 엔터티는 `NotFoundError`, 잘못된 입력은 `ValidationError`, 중복은 `ConflictError`를 사용하세요.
