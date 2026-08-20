export interface SiteConfig {
  title: string;
  author: string;
  nickname: string;
  handle: string;
  tagline: string;
  description: string;
  siteUrl: string;
  avatar: string;
  socials: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    hackerone?: string;
    bugcrowd?: string;
    tryhackme?: string;
    hackthebox?: string;
    email?: string;
  };
  pgp?: {
    fingerprint: string;
    keyUrl?: string;
  };
  disclosurePolicy?: string;
}

export const SITE_CONFIG: SiteConfig = {
  title: "MrR0807",
  author: "Abubakar Jamilu Bashir",
  nickname: "MrR0807",
  handle: "MrR0807",
  tagline: "Cybersecurity Enthusiast | Bug Hunter | CTFs | Road to RedTeam",
  description: "Personal cybersecurity blog, bug bounty writeups, CVE disclosures, offensive security cheatsheets, and CTF walkthroughs.",
  siteUrl: "https://mrr0807.github.io",
  avatar: "/avatar.png",
  socials: {
    github: "https://github.com/MrR0807",
    twitter: "https://twitter.com/MrR0807",
    linkedin: "https://ng.linkedin.com/in/abubakar-jamilu-428960226",
    hackerone: "https://hackerone.com/MrR0807",
    bugcrowd: "https://bugcrowd.com/MrR0807",
    tryhackme: "https://tryhackme.com/p/MrR0807",
    hackthebox: "https://app.hackthebox.com/profile/MrR0807",
    email: "contact@mrr0807.sec",
  },
  pgp: {
    fingerprint: "4A89 F012 3B67 C490 1D23 5E78 9A0B CD12 34EF 5678",
  },
  disclosurePolicy: "I practice responsible disclosure in accordance with ISO/IEC 29147. All vulnerabilities reported here have been fully patched before public writeup.",
};
