---
image: "/assets/img/posts/banditcover_80c40419ad.png"
title: "Overthewire Bandit11 15"
description: "Detailed offensive security CTF walkthrough and exploit analysis for overthewire-bandit11-15."
pubDate: "2023-09-15"
author: "MrR0807"
categories: ["CTF"]
tags: ["cybersecurity", "writeup"]
pin: false
---
Welcome back Hackers, to The Hacking Journey, In our previous articles, we embarked on an exciting Hacking Journey through the Bandit wargame by OverTheWire, specifically focusing on Bandit levels 6 to 10. If you missed those adventures, dont worry; you can catch up on all the action and insights [here](https://blackcybersec.xyz/categories/overthewire/).



But before we do, we invite you to join our vibrant Hacking Journey community on Discord! Connect with like-minded hackers, share your experiences, and get ready for more thrilling challenges. Whether youre a seasoned pro or just getting started, theres a place for you in our community. Lets learn, explore, and hack together. Join us on Discord [here](https://discord.gg/wBT9wr9ruG).



The Best Academy to Learn Hacking is [Here](https://affiliate.hackthebox.com/nenandjabhata).Beginner Friendly challenges on TryHackMe [Here](https://tryhackme.com/signup?referrer=61e8a27ddd3f3b00496505d1).

## Level 11: Decoding Base64 Cipher.



GOAL: The password for the next level is stored in the file data.txt, which contains base64 encoded data



SOLUTION: In this bandit level, our GOAL is to decode the base64 encoded data in the data.txt file. First, lets check the contents of the file using the cat command:



  `





```bash

bandit10@bandit:~$ ls

data.txt

bandit10@bandit:~$ cat data.txt 

VGhlIHBhc3N3b3JkIGlzIDZ6UGV6aUxkUjJSS05kTllGTmI2blZDS3pwaGxYSEJNCg==

bandit10@bandit:~$



```

`



We find a Base64-encoded string in data.txt, which is VGhlIHBhc3N3b3JkIGlzIDZ6UGV6aUxkUjJSS05kTllGTmI2blZDS3pwaGxYSEJNCg==. To decode it, we can use either online tools like CyberChef or dcode.fr, or we can use a command-line approach. Heres how to decode it using the command line:



  `





```bash

┌──(root㉿kali)-[/home/kali]

└─# echo "VGhlIHBhc3N3b3JkIGlzIDZ6UGV6aUxkUjJSS05kTllGTmI2blZDS3pwaGxYSEJNCg==" | base64 -d

The password is 6zPeziLdR2RKNdNYFNb6nVCKzphlXHBM



```

`



By using the echo command and base64 -d we successfully decode the Base64 string and reveal the password: 6zPeziLdR2RKNdNYFNb6nVCKzphlXHBM.



## Level 12: Decoding Rot13 Cipher.

GOAL: The password for the next level is stored in the file data.txt, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions.SOLUTION: In this level, we are presented with the data.txt file, which contains a text encoded using the ROT13 cipher. Our task is to decode this cipher to obtain the password. Lets first examine the contents of data.txt using the cat command:  `





```bash

bandit11@bandit:~$ cat data.txt 

Gur cnffjbeq vf WIAOOSFzMjXXBC0KoSKBbJ8puQm5lIEi

bandit11@bandit:~$



```

`



Here, we find a ROT13 cipher text: Gur cnffjbeq vf WIAOOSFzMjXXBC0KoSKBbJ8puQm5lIEi. To decode this cipher, we can use either online tools or a command-line approach. This time, lets use the command line for a swift solution:



  `





```bash

┌──(root㉿kali)-[/home/kali]

└─# echo "Gur cnffjbeq vf WIAOOSFzMjXXBC0KoSKBbJ8puQm5lIEi" | tr A-Za-z N-ZA-Mn-za-m

The password is JVNBBFSmZwKKOP0XbFXOoW8chDz5yVRv



```

`



By using the echo command followed by the tr command with the ROT13 character mapping (A-Za-z N-ZA-Mn-za-m), we successfully decode the ROT13 cipher and reveal the password: JVNBBFSmZwKKOP0XbFXOoW8chDz5yVRv. You can also use this command :



  `





```bash

┌──(root㉿kali)-[/home/kali]

└─# echo "Gur cnffjbeq vf WIAOOSFzMjXXBC0KoSKBbJ8puQm5lIEi" | rot13

The password is JVNBBFSmZwKKOP0XbFXOoW8chDz5yVRv



```

`



In my local command-line i enter the echo command followed by the rot13 command and then we successfuly decoded it and reveal the password JVNBBFSmZwKKOP0XbFXOoW8chDz5yVRv



## Level 13: Hexdumps\Compressions\File Signature.



GOAL: The password for the next level is stored in the file data.txt, which is a hexdump of a file that has been repeatedly compressed. For this level it may be useful to create a directory under /tmp in which you can work using mkdir. For example: mkdir /tmp/myname123. Then copy the datafile using cp, and rename it using mv (read the manpages!)



SOLUTION: In this level we have an hexdump file and we need to decompress it while we found the right Ascii file. To begin we will create a directory in the /tmp and we will move the data.txt file in that directory.



  `





```bash

bandit12@bandit:~$ mkdir /tmp/level13

bandit12@bandit:~$ cp data.txt /tmp/level13

bandit12@bandit:~$



```

`



Looking at the file, we see the format of the data. As stated it is a hexdump. It looks like this:



  `





```bash

bandit12@bandit:/tmp/level13$ cat data.txt | head

00000000: 1f8b 0808 2773 4564 0203 6461 7461 322e  ....sEd..data2.

00000010: 6269 6e00 0145 02ba fd42 5a68 3931 4159  bin..E...BZh91AY

00000020: 2653 597b 4f96 5f00 0018 ffff fd6f e7ed  &SY{O._......o..

00000030: bff7 bef7 9fdb d7ca ffbf edff 8ded dfd7  ................

00000040: bfe7 bbff bfdb fbff ffbf ff9f b001 3b56  ..............;V

00000050: 0400 0068 0064 3400 d341 a000 0680 0699  ...h.d4..A......

00000060: 0000 69a0 0000 1a00 1a0d 0034 0034 d3d4  ..i........4.4..

00000070: d1a3 d464 6834 6403 d469 b422 0d00 3400  ...dh4d..i."..4.

00000080: 1a68 068d 3403 4d06 8d00 0c80 00f5 0003  .h..4.M.........

00000090: 4031 3119 00d0 1a68 1a34 c86d 4640 00d0  @11....h.4.mF@..

bandit12@bandit:/tmp/level13$



```

`



Now i will rename this file into hexdump_data using the mv command:



  `





```bash

bandit12@bandit:/tmp/level13$ mv data.txt hexdump_data

bandit12@bandit:/tmp/level13$ file hexdump_data 

hexdump_data: ASCII text



```

`



Okay as you can see here using the file command we see that this file is an Ascii file, but the contains is in hexdump. However, we want to operate on the actual data. To do that well use the xxd command.



  `





```bash

bandit12@bandit:/tmp/level13$ xxd -r hexdump_data hexdumped

bandit12@bandit:/tmp/level13$ file hexdumped 

hexdumped: gzip compressed data, was "data2.bin", last modified: Sun Apr 23 18:04:23 2023, max compression, from Unix, original size modulo 2^32 581

bandit12@bandit:/tmp/level13$



```

`



The command xxd -r hexdump_data hexdumped is used to reverse or convert a hexadecimal dump (created using the xxd command) back into its binary or original form. So, when you run the xxd -r hexdump_data hexdumped command, it reads the hexadecimal data from the hexdump_data file, converts it back into binary data, and then writes the binary data to a new file named hexdumped. This is useful when you have a hexadecimal dump of a binary file and you want to restore the original binary file from it.



Then after the xxd command, i use the file command to examine the file signature and we found its a gzip file and the filename was data2.bin We will now use gzip command to decompress it.



  `





```bash

bandit12@bandit:/tmp/level13$ mv hexdumped data2.bin.gz

bandit12@bandit:/tmp/level13$ gzip -d data2.bin.gz 

bandit12@bandit:/tmp/level13$ ls

data2.bin



```

`



To do that we move the hexdumped to data2.bin.gz first and then we unzip it using the gzip -d  command. To continue we will use the file command to examine our file signature.



  `





```bash

bandit12@bandit:/tmp/level13$ file data2.bin 

data2.bin: bzip2 compressed data, block size = 900k



```

`



Here also as you can see, we have another file signature, we need to move it into that file extensions and then decompress it.



  `





```bash

bandit12@bandit:/tmp/level13$ mv data2.bin data2.bin.bz2

bandit12@bandit:/tmp/level13$ bzip2 -d data2.bin.bz2 

bandit12@bandit:/tmp/level13$ ls 

data2.bin  hexdump_data

bandit12@bandit:/tmp/level13$ file data2.bin 

data2.bin: gzip compressed data, was "data4.bin", last modified: Sun Apr 23 18:04:23 2023, max compression, from Unix, original size modulo 2^32 20480



```

`



we moved it into a .bz2 and we got also another file which is a gzip file with the name data4.bin. Now we will move this also in data4.bin.gz and then decompress it using the gzip -d command



  `





```bash

bandit12@bandit:/tmp/level13$ mv data2.bin data4.bin.gz

bandit12@bandit:/tmp/level13$ gzip -d data4.bin.gz 

bandit12@bandit:/tmp/level13$ ls

data4.bin  hexdump_data

bandit12@bandit:/tmp/level13$ file data4.bin 

data4.bin: POSIX tar archive (GNU)



```

`



After that we found a file signature name POSIX and its look like a tar file, i will move the data4.bin into data4.bin.tar



  `





```bash

bandit12@bandit:/tmp/level13$ cp data4.bin data4.bin.tar

bandit12@bandit:/tmp/level13$ ls

data4.bin  data4.bin.tar  hexdump_data

bandit12@bandit:/tmp/level13$ tar -xvf data4.bin.tar 

data5.bin



```

`



As you can see, we got also another file named data5.bin and we are going also to repeat our last tasks:



  `





```bash

bandit12@bandit:/tmp/level13$ file data4.bin 

data4.bin: POSIX tar archive (GNU)

bandit12@bandit:/tmp/level13$ cp data4.bin data4.bin.tar

bandit12@bandit:/tmp/level13$ ls

data4.bin  data4.bin.tar  hexdump_data

bandit12@bandit:/tmp/level13$ tar -xvf data4.bin.tar 

data5.bin

bandit12@bandit:/tmp/level13$ file data5.bin 

data5.bin: POSIX tar archive (GNU)

bandit12@bandit:/tmp/level13$ mv data5.bin data5.bin.tar

bandit12@bandit:/tmp/level13$ tar -xvf data5.bin.tar 

data6.bin

bandit12@bandit:/tmp/level13$ file data6.bin 

data6.bin: bzip2 compressed data, block size = 900k

bandit12@bandit:/tmp/level13$ mv data6.bin data6.bin.bz2

bandit12@bandit:/tmp/level13$ bzip2 -d data6.bin.bz2 

bandit12@bandit:/tmp/level13$ ls

data4.bin  data4.bin.tar  data5.bin.tar  data6.bin  hexdump_data

bandit12@bandit:/tmp/level13$ file data6.bin 

data6.bin: POSIX tar archive (GNU)

bandit12@bandit:/tmp/level13$ mv data6.bin data7.tar

bandit12@bandit:/tmp/level13$ tar -xf data7.tar 

bandit12@bandit:/tmp/level13$ ls

data4.bin  data4.bin.tar  data5.bin.tar  data7.tar  data8.bin  hexdump_data

bandit12@bandit:/tmp/level13$ file data8.bin 

data8.bin: gzip compressed data, was "data9.bin", last modified: Sun Apr 23 18:04:23 2023, max compression, from Unix, original size modulo 2^32 49



```

`



I repeated the same tasks and same commands for some times and also got another file named data8.bin and its a gz file.



  `





```bash

bandit12@bandit:/tmp/level13$ mv data8.bin data8.bin.gz

bandit12@bandit:/tmp/level13$ gzip -d data8.bin.gz 

bandit12@bandit:/tmp/level13$ ls

data4.bin  data4.bin.tar  data5.bin.tar  data7.tar  data8.bin  hexdump_data

bandit12@bandit:/tmp/level13$ file data8.bin 

data8.bin: ASCII text



```

`



As you see here we found an ASCII text file after decoding the data88.bin.gz file, Then i will use the command and reveal the contains of this file:



  `





```bash

bandit12@bandit:/tmp/level13$ cat data8.bin 

The password is wbWdlBxEir4CaE8LaPhauuOo6pwRmrDw



```

`



Now we found our password for the next challenge. See you S00n.



### Join Us



Thanks for reading. Lets learn, explore, and hack together. Join us on Discord [here](https://discord.gg/wBT9wr9ruG).



 Share        [](https://twitter.com/intent/tweet?text=Hacking%20for%20Beginners%20-%20Bandit%20Levels%2011-13%20on%20OverTheWire%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Foverthewire-bandit11-15%2F)       [](https://www.facebook.com/sharer/sharer.php?title=Hacking%20for%20Beginners%20-%20Bandit%20Levels%2011-13%20on%20OverTheWire%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE&u=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Foverthewire-bandit11-15%2F)       [](https://t.me/share/url?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Foverthewire-bandit11-15%2F&text=Hacking%20for%20Beginners%20-%20Bandit%20Levels%2011-13%20on%20OverTheWire%20-%20%E1%97%A9%E1%97%B7%E1%97%AAO%E1%91%8C%E1%92%AA%E1%97%A9YE)       [](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F0xMrR0807.github.io%2Fposts%2Foverthewire-bandit11-15%2F)

