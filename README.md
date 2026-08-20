# MrR0807 Cybersecurity Research & Bug Hunting Blog

A high-performance, dark-mode cybersecurity blog, bug bounty portfolio, CVE disclosure archive, and offensive security cheatsheet hub powered by [Astro](https://astro.build) & [Tailwind CSS](https://tailwindcss.com), styled after the iconic **Chirpy** infosec theme.

---

## ⚡ Quick Start

### 1. Local Development
```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### 2. Build for Production
```bash
npm run build
```

---

## ✍️ Writing New Posts & Research

You can create a new post using the CLI helper or by duplicating files in `templates/`:

```bash
# Create a Bug Bounty writeup
node scripts/new-post.js "My Vulnerability Report" bounty

# Create a CVE analysis
node scripts/new-post.js "CVE-2026-1337 Vulnerability Analysis" cve

# Create a CTF Walkthrough
node scripts/new-post.js "MachineName Walkthrough" ctf
```

---

## ⚙️ Customization

Edit [src/config.ts](src/config.ts) to update:
- Your name & handle
- Social links (GitHub, HackerOne, Bugcrowd, Twitter, LinkedIn)
- PGP key fingerprint
- Profile bio & avatar

---

## 🌐 Deploy to GitHub Pages

This repo includes `.github/workflows/deploy.yml`. When you push to your GitHub repository:
1. Go to **Repository Settings** > **Pages**.
2. Set **Source** to **GitHub Actions**.
3. Every `git push` to `main` will build and publish automatically!
