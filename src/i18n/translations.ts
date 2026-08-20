export type Language = 'en' | 'ha' | 'pcm';

export interface Translations {
  // Navigation & Brand
  home: string;
  categories: string;
  machines: string;
  allPosts: string;
  cheatsheets: string;
  about: string;
  tagline: string;
  navigationMenu: string;
  securityLabOnline: string;
  securityDomain: string;

  // Search & Modals
  searchPlaceholder: string;
  searchTitle: string;
  searchSubtitle: string;
  noResults: string;
  navigateHint: string;
  closeHint: string;

  // Sidebar & Widgets
  pgpFingerprint: string;
  recentlyUpdated: string;
  trendingTags: string;

  // Home Feed & Hero
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  latestResearch: string;
  filterAll: string;
  filterHTB: string;
  filterTHM: string;
  filterCheatsheets: string;
  filterMatrix: string;

  // Post & Article View
  tableOfContents: string;
  authorLabel: string;
  tagsLabel: string;
  securityResearchBadge: string;
  responsibleNoticeTitle: string;
  responsibleNoticeText: string;
  backToAllWriteups: string;
  backToTop: string;
  readWriteup: string;
  analyzePoC: string;

  // Cheatsheets
  cheatsheetBadge: string;
  cheatsheetTitle: string;
  cheatsheetSubtitle: string;
  topicsLabel: string;
  backToAllCheatsheets: string;
  viewCheatsheet: string;

  // Machines Matrix
  matrixTitle: string;
  matrixSubtitle: string;
  searchMachineLabel: string;
  searchMachinePlaceholder: string;
  platformLabel: string;
  osLabel: string;
  difficultyLabel: string;
  allPlatforms: string;
  allOS: string;
  allDifficulties: string;
  colName: string;
  colPlatform: string;
  colOS: string;
  colDifficulty: string;
  colSkills: string;
  colWriteup: string;

  // Archives & Taxonomies
  allPostsTitle: string;
  allPostsSubtitle: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  tagsTitle: string;
  tagsSubtitle: string;
  viewAllInCat: string;
  articlesCount: string;
  postCount: string;

  // Pagination
  showingPage: string;
  of: string;
  totalWriteups: string;
  prev: string;
  next: string;

  // Footer & Common
  footerNotice: string;
  copyCode: string;
  copiedCode: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    home: "HOME",
    categories: "CATEGORIES",
    machines: "MACHINES",
    allPosts: "ALL POSTS",
    cheatsheets: "CHEATSHEETS",
    about: "ABOUT",
    tagline: "Cybersecurity Enthusiast | Bug Hunter | CTFs | Road to RedTeam",
    navigationMenu: "Navigation Menu",
    securityLabOnline: "SECURITY LAB ONLINE",
    securityDomain: "OFFENSIVE SECURITY & BUG BOUNTY",

    searchPlaceholder: "Search posts, CVEs, tools...",
    searchTitle: "Search Research & Writeups",
    searchSubtitle: "Type a keyword, CVE ID, machine name, or vulnerability to search instantly",
    noResults: "No writeups or CVEs matching your search query.",
    navigateHint: "Navigate",
    closeHint: "Close",

    pgpFingerprint: "PGP Fingerprint",
    recentlyUpdated: "Recently Updated",
    trendingTags: "Trending Tags",

    heroBadge: "Cybersecurity Researcher & Bug Hunter",
    heroTitle: "Offensive Security, CVE Disclosures & Bug Bounty Writeups",
    heroSubtitle: "Welcome to my security research blog. Exploring web vulnerabilities, Active Directory, privilege escalation, CTF solutions, and exploit proof-of-concepts.",
    latestResearch: "Latest Research & Writeups",
    filterAll: "All",
    filterHTB: "#HackTheBox",
    filterTHM: "#TryHackMe",
    filterCheatsheets: "#Cheatsheets",
    filterMatrix: "#MachineMatrix",

    tableOfContents: "Table of Contents",
    authorLabel: "Author",
    tagsLabel: "Tags & Exploits",
    securityResearchBadge: "Security Research",
    responsibleNoticeTitle: "Responsible Disclosure Notice",
    responsibleNoticeText: "This technical article is published for defensive research and educational purposes. All vulnerabilities discussed here have been properly reported and patched by the respective vendors.",
    backToAllWriteups: "← Back to All Writeups",
    backToTop: "Back to Top ↑",
    readWriteup: "Read Writeup →",
    analyzePoC: "Analyze Full PoC & Exploit",

    cheatsheetBadge: "OFFENSIVE SECURITY CHEATSHEET",
    cheatsheetTitle: "Offensive Security Cheatsheets",
    cheatsheetSubtitle: "Quick-access commands, exploitation payloads, privilege escalation vectors, and Active Directory methodologies.",
    topicsLabel: "Topics",
    backToAllCheatsheets: "← Back to All Cheatsheets",
    viewCheatsheet: "View Cheatsheet",

    matrixTitle: "Target & Machine Matrix",
    matrixSubtitle: "Interactive search matrix of all completed target machines, CTF challenges, and vulnerability research labs with tested skills and writeup links.",
    searchMachineLabel: "Search Machine / Skill",
    searchMachinePlaceholder: "e.g. Codify, ADCS, RCE...",
    platformLabel: "Platform",
    osLabel: "Operating System",
    difficultyLabel: "Difficulty",
    allPlatforms: "All Platforms",
    allOS: "All OS",
    allDifficulties: "All Difficulties",
    colName: "Machine Name",
    colPlatform: "Platform",
    colOS: "OS",
    colDifficulty: "Difficulty",
    colSkills: "Skills & Exploits",
    colWriteup: "Writeup",

    allPostsTitle: "All Posts Archive",
    allPostsSubtitle: "Chronological timeline of all published writeups and vulnerability reports.",
    categoriesTitle: "Categories",
    categoriesSubtitle: "Browse writeups organized by target platform, lab, and research domain.",
    tagsTitle: "Tags & Vulnerabilities",
    tagsSubtitle: "Browse by exploit techniques, vulnerabilities (CVE, RCE, IDOR), and tooling.",
    viewAllInCat: "View all articles in",
    articlesCount: "articles",
    postCount: "posts",

    showingPage: "Showing Page",
    of: "of",
    totalWriteups: "total writeups",
    prev: "← Prev",
    next: "Next →",

    footerNotice: "All vulnerability reports and writeups are published under responsible disclosure guidelines.",
    copyCode: "Copy",
    copiedCode: "Copied!",
  },
  ha: {
    home: "SHAFIN FARKO",
    categories: "RUKUNI",
    machines: "NA'URORIN CTF",
    allPosts: "DUKKAN RUBUCE-RUBUCE",
    cheatsheets: "KAYAN AIKI & DABARU",
    about: "GAME DA NI",
    tagline: "Kwararren Tsaron Yanar Gizo | Bug Hunter | CTFs | Red Team",
    navigationMenu: "Manhajar Zaɓe",
    securityLabOnline: "DANDALIN TSARO NA AIKI",
    securityDomain: "TSARON YANAR GIZO & BUG BOUNTY",

    searchPlaceholder: "Bincika rubuce-rubuce, CVE, kayan aiki...",
    searchTitle: "Bincika Binciken Tsaro",
    searchSubtitle: "Rubuta sunan matsala, lambar CVE, sunan na'ura, ko kayan aiki don bincike kai tsaye",
    noResults: "Babu wani rubutu ko CVE da ya dace da abin da kake nema.",
    navigateHint: "Zaɓa",
    closeHint: "Rufe",

    pgpFingerprint: "Lambar Sirri ta PGP",
    recentlyUpdated: "Sabbin Rubuce-rubuce",
    trendingTags: "Fitattun Alamomi",

    heroBadge: "Kwararren Binciken Tsaro & Bug Hunter",
    heroTitle: "Binciken Tsaron Yanar Gizo, Rahoton CVE & Bug Bounty",
    heroSubtitle: "Barka da zuwa shafina na binciken tsaro. Ina kawo muku dabarun kariya, gano ramukan yanar gizo, Active Directory, da dabarun CTF.",
    latestResearch: "Sabbin Bincike & Dabarun Tsaro",
    filterAll: "Duka",
    filterHTB: "#HackTheBox",
    filterTHM: "#TryHackMe",
    filterCheatsheets: "#KayanAiki",
    filterMatrix: "#JerinNa'urori",

    tableOfContents: "Jerin Abubuwan Ciki",
    authorLabel: "Marubuci",
    tagsLabel: "Alamomi & Dabarun Tsaro",
    securityResearchBadge: "Binciken Tsaro",
    responsibleNoticeTitle: "Sanarwar Kare Hakki & Dokar Bayyana Matsala",
    responsibleNoticeText: "Wannan bincike na ilimi ne da kuma kariya ta yanar gizo. An sanar da kamfanonin da abin ya shafa kuma an gyara dukkan matsalolin kafin wallafa wannan bayani.",
    backToAllWriteups: "← Koma Shafin Rubuce-rubuce",
    backToTop: "Koma Sama ↑",
    readWriteup: "Karanta Bayani →",
    analyzePoC: "Duba Cikakken PoC da Cin Nasara",

    cheatsheetBadge: "KAYAN AIKI NA TSARO",
    cheatsheetTitle: "Kayan Aiki & Dabarun Hacking",
    cheatsheetSubtitle: "Dabarun shiga na'ura, kwace ragamar tsaro, Active Directory, da bayanan umarnin kwamfuta.",
    topicsLabel: "Maudu'i",
    backToAllCheatsheets: "← Koma Kayan Aiki",
    viewCheatsheet: "Duba Kayan Aiki",

    matrixTitle: "Jerin Na'urorin CTF & Bincike",
    matrixSubtitle: "Dandali na binciken dukkan na'urorin da aka yi bincike a kansu da dabarun da aka koya tare da bayanan yadda aka yi.",
    searchMachineLabel: "Bincika Na'ura / Dabara",
    searchMachinePlaceholder: "misali: Codify, ADCS, RCE...",
    platformLabel: "Dandamali",
    osLabel: "Tsarin Na'ura (OS)",
    difficultyLabel: "Matsayin Wahala",
    allPlatforms: "Dukkan Dandamali",
    allOS: "Dukkan OS",
    allDifficulties: "Dukkan Matsayi",
    colName: "Sunan Na'ura",
    colPlatform: "Dandamali",
    colOS: "OS",
    colDifficulty: "Wahala",
    colSkills: "Dabarun Aiki",
    colWriteup: "Bayani",

    allPostsTitle: "Tarihin Dukkan Rubuce-rubuce",
    allPostsSubtitle: "Tsari na dukkan rubuce-rubuce da rahotannin tsaro da aka wallafa a kan lokaci.",
    categoriesTitle: "Rukunin Rubuce-rubuce",
    categoriesSubtitle: "Duba rubuce-rubuce da aka rarraba bisa dandamali, dakin gwaji, da maudu'in bincike.",
    tagsTitle: "Alamomi & Ramukan Tsaro",
    tagsSubtitle: "Duba ta hanyar dabarun kutse, ramukan tsaro (CVE, RCE, IDOR), da kayan aiki.",
    viewAllInCat: "Duba dukkan rubuce-rubuce a",
    articlesCount: "rubuce-rubuce",
    postCount: "rubutu",

    showingPage: "Shafin",
    of: "cikin",
    totalWriteups: "jimillar rubuce-rubuce",
    prev: "← Baya",
    next: "Gaba →",

    footerNotice: "Dukkan rahotannin tsaro an wallafa su ne bisa ka'idojin bayyana matsala na gaskiya.",
    copyCode: "Kwafa",
    copiedCode: "An Kwafa!",
  },
  pcm: {
    home: "HOME PAGE",
    categories: "CATEGORIES",
    machines: "TARGET MACHINES",
    allPosts: "ALL WRITEUPS",
    cheatsheets: "CHEATSHEET & TOOLS",
    about: "ABOUT ME",
    tagline: "Cybersecurity Guy | Bug Hunter | CTF Player | Road to RedTeam",
    navigationMenu: "Navigation Menu",
    securityLabOnline: "SECURITY LAB DEY ONLINE",
    securityDomain: "OFFENSIVE SECURITY & BUG BOUNTY",

    searchPlaceholder: "Search writeups, CVEs, tools...",
    searchTitle: "Find Security Writeups",
    searchSubtitle: "Type keyword, CVE ID, machine name, or vulnerability make you find am sharp sharp",
    noResults: "Nothing match wetin you search for.",
    navigateHint: "Waka enter",
    closeHint: "Close am",

    pgpFingerprint: "PGP Secret Key",
    recentlyUpdated: "New Updates We Just Drop",
    trendingTags: "Hot Topics & Tags",

    heroBadge: "Cybersecurity Researcher & Bug Hunter",
    heroTitle: "Offensive Security, CVE Disclosures & Bug Bounty Writeups",
    heroSubtitle: "Welcome to my security research blog. We dey break down web vulnerabilities, Active Directory hacking, privilege escalation, and CTF walkthroughs.",
    latestResearch: "Latest Research & Bug Bounty Solves",
    filterAll: "All",
    filterHTB: "#HackTheBox",
    filterTHM: "#TryHackMe",
    filterCheatsheets: "#Cheatsheet",
    filterMatrix: "#MachineMatrix",

    tableOfContents: "Table of Content",
    authorLabel: "Author",
    tagsLabel: "Tags & Exploits",
    securityResearchBadge: "Security Research",
    responsibleNoticeTitle: "Responsible Disclosure Notice",
    responsibleNoticeText: "Dis article na for education and how to secure system. All di vulnerability wey dey here, we don report am to di company and dem don patch am finish before we post.",
    backToAllWriteups: "← Go Back To All Posts",
    backToTop: "Go Up Top ↑",
    readWriteup: "Read Am →",
    analyzePoC: "Check Full PoC & Exploit",

    cheatsheetBadge: "OFFENSIVE SECURITY CHEATSHEET",
    cheatsheetTitle: "Cheatsheets & Hacking Tools",
    cheatsheetSubtitle: "Quick commands, exploitation payloads, privilege escalation methods, and Active Directory breakdown.",
    topicsLabel: "Topics",
    backToAllCheatsheets: "← Go Back To Cheatsheets",
    viewCheatsheet: "Open Cheatsheet",

    matrixTitle: "Target Machine Matrix",
    matrixSubtitle: "Interactive matrix of all target machines, CTF challenges, and vulnerability labs wey we don finish with full writeups.",
    searchMachineLabel: "Search Machine / Skill",
    searchMachinePlaceholder: "e.g. Codify, ADCS, RCE...",
    platformLabel: "Platform",
    osLabel: "Operating System (OS)",
    difficultyLabel: "How E Hard Reach",
    allPlatforms: "All Platforms",
    allOS: "All OS",
    allDifficulties: "All Levels",
    colName: "Machine Name",
    colPlatform: "Platform",
    colOS: "OS",
    colDifficulty: "Level",
    colSkills: "Skills & Exploits",
    colWriteup: "Writeup",

    allPostsTitle: "All Writeups Archive",
    allPostsSubtitle: "Everything wey we don post arrange by year and month.",
    categoriesTitle: "Categories",
    categoriesSubtitle: "Browse writeups by platform, security lab, and research domain.",
    tagsTitle: "Tags & Vulnerabilities",
    tagsSubtitle: "Search by exploit technique, vulnerability (CVE, RCE, IDOR), and tooling.",
    viewAllInCat: "See all articles for",
    articlesCount: "articles",
    postCount: "posts",

    showingPage: "Page",
    of: "of",
    totalWriteups: "total writeups",
    prev: "← Previous",
    next: "Next →",

    footerNotice: "All security reports dey published under responsible disclosure guidelines.",
    copyCode: "Copy Code",
    copiedCode: "E Don Copy!",
  },
};
