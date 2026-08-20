---
title: "OAuth 2.0 Pre-Account Takeover via State Misconfiguration & Dynamic Linking"
description: "Analysis of an OAuth 2.0 social login implementation flaw enabling account pre-hijacking and identity takeover without user interaction."
pubDate: "2024-04-18"
author: "Abubakar Jamilu Bashir"
categories: ["Bug Bounty", "Web Security", "Authentication"]
tags: ["oauth", "pre-account-takeover", "authentication", "sso", "csrf", "bounty"]
pin: false
severity: "High"
bounty: "$3,200"
cvss: "8.8"
---
# Executive Summary

During testing of a federated Single Sign-On (SSO) workflow on an enterprise web portal, I discovered a high-severity **OAuth 2.0 Pre-Account Takeover** vulnerability.

The application allowed pre-registration of accounts via email/password without requiring immediate email verification, and automatically merged subsequent Google OAuth logins matching the email address without re-authenticating existing session owners.

---

## Attack Mechanics: Pre-Account Takeover (Pre-ATO)

```
[Attacker] ---> 1. Registers account with victim@company.com & AttackerPassword
                 (Target creates user record in unverified state)
                 
[Victim]   ---> 2. Clicks "Sign in with Google" (OAuth 2.0 Flow)
                 Target receives verified email from Google IdP
                 
[Target]   ---> 3. Backend matches email -> Silently links Google ID to existing account
                 (No password reset or unlinking triggered)
                 
[Attacker] ---> 4. Logs in with victim@company.com & AttackerPassword
                 [FULL ACCOUNT TAKEOVER ACHIEVED]
```

---

## Technical Walkthrough

### 1. Account Initialization by Attacker
1. The attacker registers an account using a known target corporate email: `victim@target-corp.com` with password `Password123!`.
2. The server creates the account in the database:
   ```json
   {
     "id": "usr_99812",
     "email": "victim@target-corp.com",
     "email_verified": false,
     "auth_provider": "local"
   }
   ```

### 2. Victim Logs in via OAuth Provider
When the legitimate employee `victim@target-corp.com` visits the site and clicks **"Continue with Google"**, the application exchanges the authorization code with Google and receives the ID token:

```json
{
  "iss": "https://accounts.google.com",
  "sub": "109823019283019283",
  "email": "victim@target-corp.com",
  "email_verified": true
}
```

### 3. Faulty Account Linking Logic
The backend server inspected the database:
```typescript
// Vulnerable Account Resolution Logic
const existingUser = await userRepo.findOne({ where: { email: idToken.email } });

if (existingUser) {
  // FLUID LINKING WITHOUT PASSWORD RESET OR CONFIRMATION
  existingUser.googleId = idToken.sub;
  existingUser.email_verified = true;
  await userRepo.save(existingUser);
  return generateSession(existingUser);
}
```

Because the original password hash created by the attacker remained unchanged and active on `existingUser`, the attacker can now log in at any time with `victim@target-corp.com` and `Password123!`, gaining full access to all victim data, billing info, and corporate dashboards.

---

## Defensive Engineering & Fix

### 1. Strict Identity Provider Separation & Verification Rules
Never automatically link unverified local accounts with third-party identity providers without explicit confirmation or password re-authentication:

```typescript
// Secure Account Resolution Logic
if (existingUser) {
  if (!existingUser.email_verified) {
    // Unverified local account detected: Require explicit verification before link
    throw new SecurityException(
      "An unverified account already exists with this email. Please verify your email or log in with your password to link your Google account."
    );
  }
  
  if (!existingUser.googleId) {
    // Prompt user to enter existing password before binding new OAuth identity provider
    return requireReauthentication(existingUser, idToken);
  }
}
```

### 2. Force Invalidation of Existing Sessions and Passwords
If an external trusted IdP is linked, automatically invalidate previous unverified password hashes and require a multi-factor re-challenge.

---

## Responsible Disclosure Timeline

- **2024-04-18**: Vulnerability submitted via disclosure portal.
- **2024-04-18**: Triaged and confirmed within 4 hours.
- **2024-04-20**: Fix deployed requiring email verification challenge before merging identities.
- **2024-04-23**: **$3,200 Bounty** awarded.
