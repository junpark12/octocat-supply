# Code Injection 취약점 데모

이 프롬프트는 데모 목적으로 Delivery API에 Code injection 취약점을 도입하는 방법을 보여 줍니다. **경고: 의도적으로 보안 취약점을 만드는 예제이며, 프로덕션 코드에서는 절대로 사용하면 안 됩니다.**

## 개요

배송 상태를 업데이트할 때 명령이 실행되는 방식을 보여 주는 새 로직 블록을 추가합니다. 이 실행 방식에는 악용 가능한 취약점이 있어 공격자가 애플리케이션에 임의의 코드를 주입할 수 있습니다.

### 새 브랜치

먼저 취약한 구현을 위한 `code-injection-demo` 브랜치를 만드세요. 이미 존재하면 `code-injection-demo-1`과 같은 다른 이름으로 새 브랜치를 만드세요.

```bash
git checkout -b <branch_name>
```

### 취약한 블록 만들기


`api/src/routes/delivery.ts`에서 기존 `router.put('/:id/status')` 메서드를 교체하세요. 이 취약한 코드는 `child_process`의 `exec()`를 사용하여 사용자가 제공한 `notifyCommand`를 정제 없이 실행합니다.

```typescript
// Update api/src/routes/delivery.ts, replacing the existing router.put('/:id/status') method

router.put('/:id/status', async (req, res, next) => {
  try {
    const { status, notifyCommand } = req.body;
    const repo = await getDeliveriesRepository();
    const delivery = await repo.findById(parseInt(req.params.id));

    if (delivery) {
      const updatedDelivery = await repo.updateStatus(parseInt(req.params.id), status);

      if (notifyCommand) {
        exec(notifyCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error}`);
            return res.status(500).json({ error: error.message });
          }
          res.json({ delivery: updatedDelivery, commandOutput: stdout });
        });
      } else {
        res.json(updatedDelivery);
      }
    } else {
      res.status(404).send('Delivery not found');
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Delivery not found');
    } else {
      next(error);
    }
  }
});
```


**이 취약점은 교육 목적으로만 사용합니다. Code injection 취약점이 있는 코드를 프로덕션에 배포하지 마세요.**

### Push 및 PR 만들기

```bash
git add .
git commit -m "Add Code injection vulnerability for demo"
git push origin <branch_name>
```

그런 다음 GitHub 리포지토리에서 `<branch_name>` 브랜치에서 main 브랜치로 향하는 pull request(PR)를 만드세요.
