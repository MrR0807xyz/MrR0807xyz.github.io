---
title: "Reconnaissance & Service Enumeration Cheatsheet"
description: "High-efficiency port scanning, web directory fuzzing, subdomains, and network service enumeration techniques."
pubDate: "2024-04-15"
category: "Cheatsheet"
tags: ["enumeration", "nmap", "ffuf", "smb", "snmp", "dns", "recon"]
---

# Reconnaissance & Service Enumeration

## 1. Fast Port Scanning with Nmap & Rustscan
```bash
# High-speed initial scan with Rustscan
rustscan -a 10.10.10.100 --range 1-65535 -- -sC -sV -oN full_scan.nmap

# Standard Aggressive Nmap Scan
nmap -sC -sV -p- -T4 --min-rate 1000 -oN nmap_all_ports.txt 10.10.10.100

# UDP Scan for Top Services (SNMP, DNS, TFTP, NTP)
nmap -sU --top-ports 50 -T4 -oN nmap_udp.txt 10.10.10.100

# Targeted Vulnerability Scripts
nmap --script "vuln and safe" -p 80,443,445,8080 10.10.10.100
```

## 2. Web Directory & Endpoint Fuzzing
```bash
# Directory discovery with FFUF
ffuf -u http://10.10.10.100/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -e .php,.txt,.html,.json,.bak -c -v

# Parameter Fuzzing (GET and POST)
ffuf -u 'http://10.10.10.100/api/v1/user?FUZZ=1' -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs 0

# VHost / Subdomain Enumeration
ffuf -u http://10.10.10.100 -H "Host: FUZZ.domain.local" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs 154
```

## 3. SMB & Windows File Sharing (Port 445 / 139)
```bash
# List Anonymous Shares with NetExec
netexec smb 10.10.10.100 -u '' -p '' --shares

# Connect to Share with SMBClient
smbclient //10.10.10.100/ShareName -U ''%''

# Automated SMB Enumeration with Enum4linux-ng
enum4linux-ng -A 10.10.10.100 -oA enum4linux_report
```

## 4. SNMP Enumeration (Port 161 UDP)
```bash
# Brute-force Community Strings with Onesirty
onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp.txt 10.10.10.100

# Dump entire SNMP MIB tree with public community string:
snmpwalk -v2c -c public 10.10.10.100

# Extract running processes and installed software:
snmpwalk -v2c -c public 10.10.10.100 1.3.6.1.2.1.25.4.2.1.2
```

## 5. DNS & Zone Transfer (Port 53)
```bash
# Test for DNS Zone Transfer (AXFR)
dig axfr @10.10.10.100 domain.local

# Subdomain Lookup via DNS Recon
dnsrecon -d domain.local -r 10.10.10.0/24 -n 10.10.10.100
```
