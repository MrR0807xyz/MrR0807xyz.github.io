---
image: "/assets/img/posts/passes_eb01d1fd4d.jpg"
title: "Password Cracking"
description: "Password Cracking is an essential skill for any member of"
pubDate: "2024-06-24"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Challenges 1





Can you decrypt these 10 passwords from our hash file?





  `








```bash


user1:1013:633c097a37b26c0caad3b435b51404ee:f2477a144dff4f216ab81f2ac3e3207d:::


user2:1014:874ea23df4afd3cf93e28745b8bf4ba6:fb4bf3ddf37cf6494a9905541290cf51:::


user3:1015:598ddce2660d3193aad3b435b51404ee:2d20d252a479f485cdf5e171d93985bf:::


user4:1016:44efce164ab921caaad3b435b51404ee:32ed87bdb5fdc5e9cba88547376818d4:::


user5:1017:5de640a31c34882ff500944b53168930:320a78179516c385e35a93ffa0b1c4ac:::


user6:1018:45bf38fbd873819aaad3b435b51404ee:152efbcfafeb22eabda8fc5e68697a41:::


user7:1019:e52cac67419a9a224a3b108f3fa6cb6d:8846f7eaee8fb117ad06bdd830b7586c:::


user8:1020:87199f718f851325359d3fc755b08c91:d33b15ba0f27dbf0fd56cd54b1db1ade:::


user9:1021:7b6007cf0384ac234dd8ea76ea0efefb:b31c6aa5660d6e87ee046b1bb5d0ff79:::


user10:1022:a7f6fe4d214a8591613e9293942509f0:b963c57010f218edc2cc3c229b5e4d0f:::





```


`





In this first challenge, Here are the hashes that we were given to crack. For this, I will use a tool available on Kali Linux which is John the Ripper. But To get started, I identified these hashes and I'm just going to take the NT hashes to crack faster.





### Identification des Hashes NT





Here is les hashes NT extraits des données :





[![NT Hash](/assets/img/posts/nt_37771e6361.png)](https://i.ibb.co/brZ4NHb/nt.png)





Next, I'm going to use the john tool while specifying the hash format to be quick.





  `








```bash


└─# john --format=NT hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt





```


`





Here is an overview of the command execution:





[![John](/assets/img/posts/john_a66f28bafa.png)](https://i.ibb.co/6B55cnS/john.png)





## Challenges 2





In this second challenge Here is what the author tells us:





> We have the hashes and know that they follow the same format as during a previous intrusion. They must start with HACK-ME- followed by four numbers. For example, HACK-ME-1111


  `








```bash


74f464283a165fb9f47b8451a9bc7dc0


8151c07fc7a11fa33ae9ffea5eba7aa3


9fba0c637e9ff1ce7e14f255e1c8367d


b956ca6aa424e6b19932e0172e8df74a


2e97f889a75b972802b235f9053800e7





```


`





From what the author tells us, here we need to generate our own wordlist to be able to crack these hashes. To do this, I will use a very well-known tool on Kali Linux to create a custom wordlist, which is called crunch.





> The crunch tool allows us to create wordlists based on specific patterns. Here are the options I will use on this challenge:


  `








```bash


$ man crunch


       -t @,%^


              Specifies a pattern, eg: @@god@@@@ where the only the @s, ,s, %s, and ^s will change.


              @ will insert lower case characters


              , will insert upper case characters


              % will insert numbers


              ^ will insert symbols





```


`





as the challenge says, passwords start with HACK-ME- and are followed by 4 digits, so I'm going to use the % to insert numbers at the end.





  `








```bash


└─# crunch 12 12 -t HACK-ME-%%%% -o wordlist.txt


Crunch will now generate the following amount of data: 130000 bytes


0 MB


0 GB


0 TB


0 PB


Crunch will now generate the following number of lines: 10000


crunch: 100% completed generating output





```


`





Next, I only have to launch john while specifying this wordlist which I also generated with the Hashes format.





  `








```bash


john hashes.txt --format=Raw-MD5 --wordlist=wordlist.txt





```


`





[![John2](/assets/img/posts/john2_63cbcb93c6.png)](https://i.ibb.co/4Ktj7jq/john2.png)





## Ressources supplementaires





Here are some additional resources that might be helpful to you:





[Crunch wordlist](https://www.hackingarticles.in/a-detailed-guide-on-crunch/)[Password Cracking Challenges](https://cybercompaacc.com/challenges/password-cracking-challenges/)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=Password%20Cracking%20-%20Guide%20Pratique%20pour%20les%20Comp%C3%A9titions%20CTF%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpassword-cracking%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Password%20Cracking%20-%20Guide%20Pratique%20pour%20les%20Comp%C3%A9titions%20CTF%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpassword-cracking%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpassword-cracking%2F&text=Password%20Cracking%20-%20Guide%20Pratique%20pour%20les%20Comp%C3%A9titions%20CTF%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpassword-cracking%2F)


