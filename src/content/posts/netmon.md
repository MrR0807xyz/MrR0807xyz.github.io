---
image: "/assets/img/posts/Manager_bc92de8c12.png"
title: "Netmon"
description: "Netmon is an Easy difficulty Windows Box with simple enumeration and operation. PRTG is currently being developed"
pubDate: "2024-11-15"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Reconnaissance





Like the beginning of each Machine that I make, first the recognition…





  `








```bash


$ nmap -sV -Pn -p1-65535 --min-rate 3000 10.10.10.152





Host is up (7.8s latency).


Not shown: 62891 filtered tcp ports (no-response), 2639 closed tcp ports (reset)


PORT    STATE SERVICE    VERSION


21/tcp  open  tcpwrapped


80/tcp  open  tcpwrapped


135/tcp open  tcpwrapped


139/tcp open  tcpwrapped


445/tcp open  tcpwrapped





$ nmap -sCV -Pn -p21,80,135,139,445 $ip


Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-11-14 20:14 EST


Host is up (0.17s latency).





PORT    STATE SERVICE      VERSION


21/tcp  open  ftp          Microsoft ftpd


| ftp-anon: Anonymous FTP login allowed (FTP code 230)


| 02-02-19  11:18PM                 1024 .rnd


| 02-25-19  09:15PM                 inetpub


| 07-16-16  08:18AM                 PerfLogs


| 02-25-19  09:56PM                 Program Files


| 02-02-19  11:28PM                 Program Files (x86)


| 02-03-19  07:08AM                 Users


|_11-10-23  09:20AM                 Windows


| ftp-syst: 


|_  SYST: Windows_NT


80/tcp  open  http         Indy httpd 18.1.37.13946 (Paessler PRTG bandwidth monitor)


| http-title: Welcome | PRTG Network Monitor (NETMON)


|_Requested resource was /index.htm


|_http-trane-info: Problem with XML parsing of /evox/about


135/tcp open  msrpc        Microsoft Windows RPC


139/tcp open  netbios-ssn  Microsoft Windows netbios-ssn


445/tcp open  microsoft-ds Microsoft Windows Server 2008 R2 - 2012 microsoft-ds


Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows





Host script results:


| smb-security-mode: 


|   authentication_level: user


|   challenge_response: supported


|_  message_signing: disabled (dangerous, but default)


|_clock-skew: mean: 21s, deviation: 0s, median: 20s


| smb2-time: 


|   date: 2024-11-15T01:15:14


|_  start_date: 2024-11-15T01:10:29


| smb2-security-mode: 


|   3:1:1: 


|_    Message signing enabled but not required





```


`





After my scan, I found interesting ports such as FTP(21) and also port 80 which runs a website.





But first, let's check FTP on port 21





[![FTP Ouvert](/assets/img/posts/1_f657521d91.png)](https://i.ibb.co/3BnSytg/1.png)





But hey in the FTP I don't find enough information, so I'm going to go to the website.





Well, on the site I find that in the footer of the site page it says version PRTG Network Monitor 18.1.37.13946.





By doing some research I found that there is a Remote Code Execution vulnerability for this type of Site and version. But the problem is that the vulnerability is PRTG Network Monitor 18.2.38 - (Authenticated) Remote Code Execution (CVE-2018-9276), so I must be authenticated to exploit it.





Thanks to this [article](https://codewatch.org/2018/06/25/prtg-18-2-39-command-injection-vulnerability/) I understand that the configuration files of this type of PRTG Software are located in the \ProgramData\Paessler\PRTG Network Monitor\, so access the FTP and I find important files.





[![Files](/assets/img/posts/2_f4bf80ee5d.png)](https://i.ibb.co/LYySCPX/2.png)





Here first I have a simple PRTG Configuration.old file and I also have the backup of the old PRTG Configuration.old.bak.





So I dumped the Backup of the old one, then I found in the file





  `








```bash





          


          PrTg@dmin2018


            





```


`But whaaaaaaaaaaaat, I am told incorrect password.





[![Incorrect](/assets/img/posts/3_1c48e1108e.png)](https://i.ibb.co/bJf4pyN/3.png)





So, after some thought, I tried to increment the number in the password so that it became PrTg@dmin2019 and it worked





[![Welcome](/assets/img/posts/4_ee37266fa6.png)](https://i.ibb.co/GktG659/4.png)





From here Now, I will use CVE-2018-9276 that I found to have a shell on the Machine.





https://github.com/A1vinSmith/CVE-2018-9276





[![Exploit](/assets/img/posts/6_b3c82d3d4d.png)](https://i.ibb.co/myGJpMY/6.png)





Thanks to this automated exploit, I just had a SYSTEM shell directly on the Machine.





[![SYSTEM](/assets/img/posts/system_7bd6d30637.png)](https://i.ibb.co/RbyyWb9/system.png)





## Ressources supplementaires





Here are some additional resources that might be helpful to you:





[PRTG Metasploit](https://www.rapid7.com/db/modules/exploit/windows/http/prtg_authenticated_rce/)[Github Exploit](https://github.com/A1vinSmith/CVE-2018-9276)Love my artciles? Follow me on [Twitter](https://x.com/@MrR0807) and [Github](https://github.com/0xMrR0807)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=Netmon%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fnetmon%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Netmon%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fnetmon%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fnetmon%2F&text=Netmon%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fnetmon%2F)


