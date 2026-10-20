# Swagger/OpenAPI 문서 패턴

이 문서는 OctoCAT Supply Chain 애플리케이션의 API 엔드포인트용 Swagger 문서 작성 방법을 설명합니다.

## 개요

API는 JSDoc 스타일의 `@swagger` 주석을 사용하며 `swagger-jsdoc`가 이를 파싱하여 OpenAPI 3.0 문서를 생성합니다. 문서는 두 곳에 정의됩니다.

1. **모델 파일** - 스키마 정의(`components/schemas`)
2. **라우트 파일** - 엔드포인트 문서(`paths`)

## 스키마 문서(모델)

모델 파일의 TypeScript 인터페이스 위에 스키마를 정의하세요.

```typescript
// api/src/models/supplier.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - supplierId
 *         - name
 *       properties:
 *         supplierId:
 *           type: integer
 *           description: The unique identifier for the supplier
 *         name:
 *           type: string
 *           description: The name of the supplier
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email for the supplier
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         active:
 *           type: boolean
 *           description: Whether the supplier is active
 */
export interface Supplier {
  supplierId: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}
```

### 속성 타입

| TypeScript | OpenAPI 타입 | 형식 |
|------------|--------------|--------|
| `number` | `integer` | - |
| `number` (소수) | `number` | `float` 또는 `double` |
| `string` | `string` | - |
| `string` (이메일) | `string` | `email` |
| `string` (날짜) | `string` | `date-time` |
| `boolean` | `boolean` | - |
| `string[]` | `array` | items: { type: string } |

### 필수와 선택

필수 필드를 `required` 배열에 표시하세요.

```yaml
required:
  - supplierId
  - name
properties:
  supplierId:
    type: integer
  name:
    type: string
  description:   # Optional - not in required array
    type: string
```

## 엔드포인트 문서(라우트)

### 태그

라우트 파일 상단에 정의한 태그로 관련 엔드포인트를 그룹화하세요.

```typescript
/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API endpoints for managing suppliers
 */
```

### GET 전체 조회(목록)

```typescript
/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Returns all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of all suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
```

### GET 단일 조회(ID 기준)

```typescript
/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 */
```

### POST(생성)

```typescript
/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 */
```

### PUT(업데이트)

```typescript
/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 */
```

### DELETE

```typescript
/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */
```

## 쿼리 매개변수

필터링 또는 페이지네이션:

```typescript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns products with optional filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: supplierId
 *         schema:
 *           type: integer
 *         description: Filter by supplier ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of products
 */
```

## 사용자 지정 응답 객체

비표준 데이터를 반환하는 엔드포인트:

```typescript
/**
 * @swagger
 * /api/suppliers/{id}/status:
 *   get:
 *     summary: Get the status of a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [INACTIVE, APPROVED, PENDING]
 *       404:
 *         description: Supplier not found
 */
```

## 오류 응답

표준 오류 응답 형식:

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: NOT_FOUND
 *             message:
 *               type: string
 *               example: Supplier with ID 123 not found
 */
```

응답에서 참조:

```yaml
responses:
  404:
    description: Not found
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Error'
```

## 동일 경로의 여러 작업

동일한 경로 블록 아래에 여러 HTTP 메서드를 문서화하세요.

```typescript
/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     # ... get documentation
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     # ... put documentation
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     # ... delete documentation
 */
```

## Swagger UI 접근

생성된 문서는 다음 위치에서 확인할 수 있습니다.
- **Swagger UI**: `http://localhost:3000/api-docs`
- **JSON 명세**: `http://localhost:3000/api-docs.json`

## 모범 사례

1. **요약 먼저 작성** - 간결하고 동작 중심으로 작성(예: "새 공급업체 생성")
2. **스키마 참조 사용** - 일관성을 위해 `$ref: '#/components/schemas/...'` 사용
3. **모든 응답 문서화** - 적절한 경우 200/201, 400, 404, 500 포함
4. **매개변수 설명** - 매개변수가 나타내는 내용을 항상 설명
5. **스키마는 모델에 유지** - 라우트 파일에 스키마 정의를 중복하지 않기
