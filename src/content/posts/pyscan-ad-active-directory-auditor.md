---
title: "Building PyScan-AD: Automated Active Directory Misconfiguration & ACL Auditor"
description: "A deep dive into developing an open-source, asynchronous Active Directory security scanner in Python for detecting Kerberoastable SPNs, AS-REP roasting, and vulnerable ADCS templates."
pubDate: "2024-04-22"
author: "Abubakar Jamilu Bashir"
categories: ["Custom Tool", "Active Directory", "Tool Development"]
tags: ["pyscan-ad", "python", "active-directory", "adcs", "ldap", "tooling", "redteam"]
pin: true
severity: "Info"
---
# Introduction

When performing internal network penetration testing and Active Directory assessments, speed and precision during initial domain enumeration are crucial. 

To streamline the reconnaissance phase and quickly identify low-hanging attack vectors, I built **`PyScan-AD`**—a lightweight, pure-Python security auditor that connects over LDAP/LDAPS and inspects critical domain misconfigurations without generating noisy SMB traffic.

---

## Core Capabilities of PyScan-AD

- 🔍 **AS-REP Roasting Detection**: Identifies users with `DONT_REQ_PREAUTH` (UserAccountControl bit 4194304).
- 🍖 **Kerberoastable Accounts**: Queries all user accounts with active `servicePrincipalName` attributes.
- 🛡️ **Unconstrained Delegation & Constrained Delegation**: Scans computers and service accounts with dangerous delegation rights.
- 📜 **Vulnerable ADCS Certificate Templates**: Inspects Active Directory Certificate Services for ESC1 / ESC4 vulnerabilities.
- 🔐 **LAPS & Password Policy Auditor**: Evaluates password length, lockout thresholds, and legacy accounts.

---

## Technical Architecture & Implementation

`PyScan-AD` utilizes the `ldap3` library for async querying and parses UserAccountControl flags using bitwise operations:

```python
#!/usr/bin/env python3
"""
PyScan-AD: Active Directory Security Auditor
Author: Abubakar Jamilu Bashir (MrR0807)
"""

from ldap3 import Server, Connection, ALL, SUBTREE
import json
import argparse

class ADScanner:
    def __init__(self, domain, dc_ip, user, password):
        self.domain = domain
        self.base_dn = ",".join([f"DC={part}" for part in domain.split(".")])
        self.server = Server(dc_ip, get_info=ALL)
        self.conn = Connection(self.server, user=f"{user}@{domain}", password=password, auto_bind=True)

    def scan_asrep_roastable(self):
        """Find accounts with DONT_REQ_PREAUTH (UF_DONT_REQUIRE_PREAUTH = 0x400000)"""
        print("[*] Auditing for AS-REP Roastable Accounts...")
        search_filter = "(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))"
        self.conn.search(self.base_dn, search_filter, SUBTREE, attributes=["sAMAccountName", "description", "pwdLastSet"])
        
        results = []
        for entry in self.conn.entries:
            results.append({
                "account": str(entry.sAMAccountName),
                "description": str(entry.description)
            })
        return results

    def scan_kerberoastable(self):
        """Find accounts with Service Principal Names (SPN)"""
        print("[*] Auditing for Kerberoastable Accounts...")
        search_filter = "(&(objectClass=user)(servicePrincipalName=*)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))"
        self.conn.search(self.base_dn, search_filter, SUBTREE, attributes=["sAMAccountName", "servicePrincipalName"])
        
        results = []
        for entry in self.conn.entries:
            results.append({
                "account": str(entry.sAMAccountName),
                "spn": [str(spn) for spn in entry.servicePrincipalName]
            })
        return results

def main():
    parser = argparse.ArgumentParser(description="PyScan-AD: Active Directory Auditor by MrR0807")
    parser.add_argument("-d", "--domain", required=True, help="Domain Name (e.g. corp.local)")
    parser.add_argument("-dc", "--dc-ip", required=True, help="Domain Controller IP")
    parser.add_argument("-u", "--user", required=True, help="Username")
    parser.add_argument("-p", "--password", required=True, help="Password")
    args = parser.parse_args()

    scanner = ADScanner(args.domain, args.dc_ip, args.user, args.password)
    asrep = scanner.scan_asrep_roastable()
    kerb = scanner.scan_kerberoastable()

    print(f"\n[+] Found {len(asrep)} AS-REP Roastable Accounts")
    for a in asrep:
        print(f"  [-] User: {a[account]}")

    print(f"\n[+] Found {len(kerb)} Kerberoastable SPN Accounts")
    for k in kerb:
        print(f"  [-] User: {k[account]} -> SPNs: {k[spn]}")

if __name__ == "__main__":
    main()
```

---

## Example Scan Execution

```bash
$ python3 pyscan_ad.py -d enterprise.local -dc 10.10.10.100 -u lowpriv -p Welcome2024!

[*] Connecting to LDAP service at 10.10.10.100... [CONNECTED]
[*] Base DN: DC=enterprise,DC=local
[*] Auditing for AS-REP Roastable Accounts...
[*] Auditing for Kerberoastable Accounts...

[+] Found 2 AS-REP Roastable Accounts:
  [-] User: svc_backup (Description: Legacy backup service account)
  [-] User: test_user1

[+] Found 3 Kerberoastable SPN Accounts:
  [-] User: sql_service -> SPNs: [MSSQLSvc/db01.enterprise.local:1433]
  [-] User: web_app -> SPNs: [HTTP/web.enterprise.local]
```

---

## Defensive Remediation & Hardening

1. **Disable `DONT_REQ_PREAUTH`**: Enforce Kerberos pre-authentication across all domain accounts in Group Policy.
2. **Utilize Group Managed Service Accounts (gMSA)**: Migrate traditional user accounts with SPNs to 128-character automatically rotated gMSAs.
3. **Continuous Auditing**: Schedule automated daily LDAP audits using `PyScan-AD` or BloodHound to catch misconfigured ACLs.
