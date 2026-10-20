# TypeScript API Observability Framework (TAO)

TAO는 TypeScript 기반 API를 위해 특별히 설계한 가볍고 강력한 observability framework입니다. 최소한의 설정으로 metric, trace, log를 원활하게 통합합니다.

<a id="features"></a>
## 기능

- 🔄 Express.js route의 auto-instrumentation
- 📊 내장 metric 수집(응답 시간, 오류율, 요청 수)
- 🔍 OpenTelemetry와 호환되는 distributed tracing
- 📝 context correlation을 지원하는 structured logging
- 🎯 사용자 지정 metric decorator
- 🔌 교체 가능한 backend 지원(Prometheus, Jaeger, ELK)

<a id="quick-start"></a>
## 빠른 시작

```typescript
import { initTAO, observe } from '@tao/core';
import express from 'express';

// Initialize TAO with default settings
initTAO({
  serviceName: 'my-api',
  environment: 'production'
});

const app = express();

// Automatically instrument all routes
app.use(observe());
```

<a id="decorators"></a>
## Decorator

TAO는 세밀한 observability를 위한 decorator를 제공합니다.

```typescript
import { Measure, Trace, Log } from '@tao/core';

class UserService {
  @Measure('user.creation.time')
  @Trace('user-creation')
  @Log('debug')
  async createUser(userData: UserData): Promise<User> {
    // Your implementation
  }
}
```

<a id="custom-metrics"></a>
## 사용자 지정 metric

```typescript
import { MetricRegistry } from '@tao/core';

// Create a custom counter
const requestCounter = MetricRegistry.counter({
  name: 'api_requests_total',
  labels: ['endpoint', 'status']
});

// Increment the counter
requestCounter.inc({ endpoint: '/api/users', status: '200' });
```

<a id="trace-context"></a>
## Trace context

TAO는 W3C Trace Context header를 사용하여 서비스 경계를 넘어 trace context를 자동으로 전파합니다.

```typescript
import { getTraceContext, withContext } from '@tao/core';

async function makeDownstreamCall() {
  const context = getTraceContext();
  
  return await fetch('http://other-service/api', {
    headers: withContext(context)
  });
}
```

<a id="configuration"></a>
## 설정

```typescript
initTAO({
  serviceName: 'my-api',
  environment: 'production',
  metrics: {
    backend: 'prometheus',
    endpoint: '/metrics'
  },
  tracing: {
    backend: 'jaeger',
    samplingRate: 0.1
  },
  logging: {
    level: 'info',
    format: 'json'
  }
});
```

<a id="best-practices"></a>
## 권장 사항

1. **의미 있는 이름 사용**: metric과 trace에 내용을 잘 설명하는 이름을 선택하세요.
2. **Label 추가**: 필터링과 집계를 개선하도록 관련 label을 포함하세요.
3. **적절한 sampling**: traffic이 많은 서비스에 적절한 sampling rate를 설정하세요.
4. **데이터 연계**: 디버깅을 개선하도록 log에 trace ID를 사용하세요.
5. **Resource 사용량 모니터링**: 내장 resource metric 수집을 활성화하세요.