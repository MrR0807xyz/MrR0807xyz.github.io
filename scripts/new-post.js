import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const title = args[0] || 'My New Security Writeup';
const type = args[1] || 'bounty'; // bounty | cve | ctf

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)+/g, '');

const date = new Date().toISOString().split('T')[0];

const targetPath = path.join(process.cwd(), 'src', 'content', 'posts', `${slug}.md`);

if (fs.existsSync(targetPath)) {
  console.error(`Error: Post ${slug}.md already exists!`);
  process.exit(1);
}

let template = '';

if (type === 'cve') {
  template = `---
title: "${title}"
description: "Security advisory and technical analysis of ${title}."
pubDate: "${date}"
author: "MrR0807"
categories: ["CVE Research"]
tags: ["cve", "vulnerability", "exploit"]
pin: false
severity: "High"
cve: "CVE-2026-XXXX"
cvss: "8.8"
---

# ${title}

## Summary

Technical overview of the vulnerability.

## Reproduction & PoC

\`\`\`python
# Exploit PoC
print("Exploit triggered")
\`\`\`
`;
} else if (type === 'ctf') {
  template = `---
title: "${title}"
description: "Walkthrough of ${title} machine/challenge."
pubDate: "${date}"
author: "MrR0807"
categories: ["HackTheBox", "CTF"]
tags: ["ctf", "linux", "privesc"]
pin: false
---

# ${title}

## Reconnaissance

\`\`\`bash
nmap -sC -sV target_ip
\`\`\`

## Initial Foothold

Exploitation details.

## Privilege Escalation

Privilege escalation details.
`;
} else {
  template = `---
title: "${title}"
description: "Bug bounty writeup on ${title}."
pubDate: "${date}"
author: "MrR0807"
categories: ["Bug Bounty", "Web Security"]
tags: ["bug-bounty", "web", "idor"]
pin: false
severity: "High"
bounty: "$1,000"
---

# Executive Summary

Brief summary of the vulnerability discovered.

## Technical Details & Reproduction Steps

\`\`\`http
POST /api/v1/resource HTTP/1.1
Host: target.com
\`\`\`

## Impact & Remediation

Impact explanation and recommended fixes.
`;
}

fs.writeFileSync(targetPath, template, 'utf-8');
console.log(`\x1b[32m✔ Successfully created new writeup:\x1b[0m src/content/posts/${slug}.md`);
