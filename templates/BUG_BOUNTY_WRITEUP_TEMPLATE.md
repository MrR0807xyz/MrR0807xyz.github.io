---
title: "Vulnerability Title (e.g. Broken Object Level Authorization on /api/v1/user)"
description: "Brief 1-2 sentence executive summary of the vulnerability and its real-world impact."
pubDate: "YYYY-MM-DD"
author: "MrR0807"
categories: ["Bug Bounty", "Web Security"]
tags: ["idor", "bounty", "api", "web"]
pin: false
severity: "High" # Critical | High | Medium | Low | Info
bounty: "$X,XXX" # Optional
cvss: "8.5" # Optional CVSS 3.1 Score
---

# Executive Summary

A concise explanation of the finding, targeted component, and potential business/security impact.

---

## Vulnerability Overview

- **Vulnerability Type**: Insecure Direct Object Reference / SSRF / Auth Bypass
- **Affected Endpoint**: `POST /api/v1/...`
- **Severity**: High (CVSS:3.1/...)
- **Bounty Award**: $X,XXX

---

## Technical Details & Steps to Reproduce

### 1. Discovery & Reconnaissance

Detail how you mapped the target and found the vulnerable parameter or workflow.

### 2. Proof of Concept (PoC)

Include reproduction requests, curl commands, or Python PoC scripts:

```http
POST /api/v1/vulnerable-endpoint HTTP/1.1
Host: target.com
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "target_id": "VICTIM_ID"
}
```

```bash
# PoC Script
python exploit_poc.py --target https://target.com
```

### 3. Impact Analysis

Explain what an attacker can achieve (e.g., Data exfiltration, privilege escalation, tenant isolation bypass).

---

## Remediation & Mitigation

Actionable recommendations for engineers:
1. Implement server-side authorization checks.
2. Validate user identity from the authenticated session token.

---

## Disclosure Timeline

- **YYYY-MM-DD**: Vulnerability reported to vendor via HackerOne / Bugcrowd.
- **YYYY-MM-DD**: Triage confirmed.
- **YYYY-MM-DD**: Patch released to production.
- **YYYY-MM-DD**: Bounty awarded.
- **YYYY-MM-DD**: Coordinated disclosure published.
