/* ==========================================================================
   CAREER DATA
   --------------------------------------------------------------------------
   Twelve IS career paths. Every salary figure carries the source it came from
   and a `basis` flag, because the two kinds of number are NOT comparable:

     basis: 'bls'      -> U.S. Bureau of Labor Statistics median annual wage.
                          All experience levels pooled. Government survey.
     basis: 'industry' -> Salary guides / aggregator postings (Robert Half,
                          Glassdoor, PayScale, ZipRecruiter...). Self-reported
                          or posting-derived. Wider spread, less consistent.

   `payMid`   = the single number used on the comparison chart.
   `payRange` = the human-readable spread, shown verbatim next to it.

   The distinction matters: a BLS median is what the role pays across a whole
   career, not what a BYU junior will be offered next summer. The app surfaces
   BYU's own reported starting average alongside these so the gap is visible
   rather than hidden.

   traitScores drives the Fit Finder (0-3 per dimension). See docs/ARCHITECTURE.md.
   ========================================================================== */

const DEPARTMENT_STATS = {
  // Source: BYU IS Careers, Placement Stats -> https://iscareers.byu.edu/placement-stats
  years: [
    { year: 2023, bsisPlacement: 93, bsisSalary: 73130, mismPlacement: 93, mismSalary: 93865 },
    { year: 2024, bsisPlacement: 75, bsisSalary: 76211, mismPlacement: 94, mismSalary: 89797 },
    { year: 2025, bsisPlacement: 91, bsisSalary: 72487, mismPlacement: 90, mismSalary: 91826 }
  ],
  latest: 2025,
  sourceLabel: 'BYU IS Careers - Placement Stats (BSIS & MISM, classes of 2023-2025)',
  sourceUrl: 'https://iscareers.byu.edu/placement-stats'
};

const CAREERS = [
  /* ---------------------------------------------------------------- 1 --- */
  {
    id: 'software-developer',
    name: 'Software Developer',
    icon: 'code',
    tagline: 'Design and build the applications a business runs on.',
    family: 'Build',
    dayToDay:
      'Analyze user needs, design and develop software and applications, plan how pieces ' +
      'of a system fit together, create technical diagrams for other programmers, maintain ' +
      'and upgrade existing software, and document systems so they can be maintained later.',
    skills: [
      'Strong programming fundamentals',
      'A language/stack (varies by employer)',
      'System architecture design',
      'Security requirements awareness',
      'Version control (Git)'
    ],
    entry:
      "Bachelor's degree in computer science, IT, or a related field (math, engineering). " +
      'Internships are the common way to gain the experience employers screen for; some ' +
      "employers prefer a master's for certain specialised roles.",
    payMid: 135040,
    payBasis: 'bls',
    payRange: 'Median $135,040/yr (May 2025)',
    payNote:
      '~106,100 openings/year across the broader "software developers, QA analysts & testers" group.',
    growthPct: 10,
    growthWindow: '2025-2035',
    growthLabel: 'much faster than average',
    traits: [
      'Analytical thinking',
      'Explaining technical issues to non-technical stakeholders',
      'Creativity',
      'Detail orientation',
      'Persistent problem-solving'
    ],
    sources: [
      {
        label: 'BLS Occupational Outlook Handbook - Software Developers, QA Analysts, and Testers',
        url: 'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm'
      }
    ],
    traitScores: { code: 3, data: 1, people: 1, design: 1, risk: 1, systems: 2, lead: 0, ambiguity: 2 }
  },

  /* ---------------------------------------------------------------- 2 --- */
  {
    id: 'systems-analyst',
    name: 'Systems Analyst',
    icon: 'systems',
    tagline: 'Sit between the business and IT, and decide what gets built.',
    family: 'Analyze',
    dayToDay:
      "Consult with managers on IT's role in the business, research new technologies, " +
      'analyze the cost/benefit of systems and upgrades, design and configure new systems, ' +
      'oversee installation and customization, test systems, and write training manuals.',
    skills: [
      'Data modeling',
      'Cost-benefit analysis',
      'Requirements gathering',
      'Some programming',
      'Industry domain knowledge (finance, healthcare)'
    ],
    entry:
      "Bachelor's degree - computer/information science is common, but business or " +
      'liberal-arts degrees plus technical skills are also accepted. An MBA with an IS ' +
      'concentration is a plus for some employers.',
    payMid: 105850,
    payBasis: 'bls',
    payRange: 'Median $105,850/yr (May 2025)',
    payNote: '~32,900 openings/year.',
    growthPct: 8,
    growthWindow: '2025-2035',
    growthLabel: 'faster than average',
    traits: [
      'Analytical and business skills',
      'Understanding organizational goals',
      'Acting as liaison between IT and management',
      'Creativity',
      'Organizational skill'
    ],
    sources: [
      {
        label: 'BLS Occupational Outlook Handbook - Computer Systems Analysts',
        url: 'https://www.bls.gov/ooh/computer-and-information-technology/computer-systems-analysts.htm'
      }
    ],
    traitScores: { code: 1, data: 2, people: 3, design: 1, risk: 1, systems: 2, lead: 1, ambiguity: 2 }
  },

  /* ---------------------------------------------------------------- 3 --- */
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: 'chart',
    tagline: 'Turn messy company data into decisions leaders actually make.',
    family: 'Analyze',
    dayToDay:
      'Meet with stakeholders to define problems and KPIs, pull and query data (SQL), clean ' +
      'and validate datasets (Excel/Python), build dashboards and visualizations ' +
      '(Tableau/Power BI), then summarize findings and present recommendations to ' +
      'non-technical audiences.',
    skills: [
      'SQL',
      'Excel (pivot tables, XLOOKUP)',
      'Tableau or Power BI',
      'Python / R',
      'Business acumen',
      'Presenting to non-technical audiences'
    ],
    entry:
      'A portfolio (GitHub/Kaggle projects), at least one internship, and often a certificate ' +
      '(e.g. Google Data Analytics) on top of coursework. The bar for "entry-level" has risen ' +
      'in the current market.',
    payMid: 90000,
    payBasis: 'industry',
    payRange: '$63,000 - $117,250/yr depending on industry and source',
    payNote:
      'Robert Half puts entry-level financial data analysts at $53,500-$63,250 and tech-sector ' +
      'data analysts at $96,250-$138,500 (midpoint ~$117,250); Glassdoor lists ~$63,000 average ' +
      'entry-level. "Data analyst" spans industries and seniority - cross-check the specific ' +
      'range you cite.',
    growthPct: null,
    growthWindow: null,
    growthLabel: 'Not published as a single BLS occupation',
    traits: [
      'Comfort with SQL and Excel from day one',
      'Curiosity and attention to detail',
      'Translating technical findings into business language',
      'A demonstrated project portfolio'
    ],
    sources: [
      {
        label: 'Robert Half - 2026 Data Analyst Salary Trends',
        url: 'https://www.roberthalf.com/us/en/insights/landing-job/2026-data-analyst-salary-trends'
      },
      {
        label: 'Glassdoor - Entry Level Data Analyst salary',
        url: 'https://www.glassdoor.com/Salaries/entry-level-data-analyst-salary-SRCH_KO0,24.htm'
      },
      {
        label: '365 Data Science - Data Analyst Job Outlook 2026',
        url: 'https://365datascience.com/career-advice/data-analyst-job-outlook-2025/'
      }
    ],
    traitScores: { code: 2, data: 3, people: 2, design: 1, risk: 1, systems: 1, lead: 0, ambiguity: 2 }
  },

  /* ---------------------------------------------------------------- 4 --- */
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: 'lock',
    tagline: 'Defend systems against people actively trying to break them.',
    family: 'Secure',
    dayToDay:
      'Monitor networks for breaches and investigate incidents, maintain firewalls and ' +
      'encryption tools, check for vulnerabilities, research emerging threats, write reports ' +
      'on attempted attacks, develop security standards, and build and test disaster ' +
      'recovery plans.',
    skills: [
      'Firewalls',
      'Encryption / data protection',
      'Vulnerability scanning',
      'Incident response',
      'SIEM tools',
      'Disaster recovery planning'
    ],
    entry:
      "Bachelor's degree in computer science or a related field is typical, plus related work " +
      'experience (often network or systems administration first). Certification (Security+, ' +
      'CISA, CISSP) is frequently preferred.',
    payMid: 129180,
    payBasis: 'bls',
    payRange: 'Median $129,180/yr (May 2025)',
    payNote: '~14,100 openings/year. One of the fastest-growing IT roles.',
    growthPct: 21,
    growthWindow: '2025-2035',
    growthLabel: 'much faster than average',
    traits: [
      'Analytical skills',
      'Explaining risk to non-technical audiences',
      'Creativity in anticipating threats',
      'Extreme attention to detail',
      'Problem-solving under pressure (on-call)'
    ],
    sources: [
      {
        label: 'BLS Occupational Outlook Handbook - Information Security Analysts',
        url: 'https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm'
      }
    ],
    traitScores: { code: 2, data: 2, people: 1, design: 0, risk: 3, systems: 3, lead: 0, ambiguity: 2 }
  },

  /* ---------------------------------------------------------------- 5 --- */
  {
    id: 'web-developer',
    name: 'Web Developer',
    icon: 'globe',
    tagline: 'Build the interfaces customers actually touch.',
    family: 'Build',
    dayToDay:
      'Meet with clients and management about site needs, build and test applications, ' +
      'interfaces and navigation, write code (HTML, JavaScript), integrate graphics/audio/' +
      'video, build prototypes and mockups, and monitor site traffic and performance.',
    skills: [
      'HTML (required)',
      'JavaScript',
      'CSS',
      'SQL',
      'REST APIs',
      'Front-end vs back-end specialisation'
    ],
    entry:
      "Education ranges from a high school diploma to a bachelor's depending on employer. " +
      "A bachelor's in computer science/programming is preferred by many, but a strong " +
      'portfolio of prior projects can substitute.',
    payMid: 99520,
    payBasis: 'bls',
    payRange: 'Median $99,520/yr (May 2025)',
    payNote:
      '~13,600 openings/year for the combined "web developers and digital designers" group. ' +
      'AI tools may temper growth for pure coding tasks.',
    growthPct: 5,
    growthWindow: '2025-2035',
    growthLabel: 'faster than average',
    traits: [
      'Communication across a project team',
      'Creativity balanced with functionality',
      'Extreme attention to detail',
      'Debugging skill'
    ],
    sources: [
      {
        label: 'BLS Occupational Outlook Handbook - Web Developers and Digital Designers',
        url: 'https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm'
      }
    ],
    traitScores: { code: 3, data: 1, people: 1, design: 2, risk: 1, systems: 1, lead: 0, ambiguity: 1 }
  },

  /* ---------------------------------------------------------------- 6 --- */
  {
    id: 'ux-designer',
    name: 'UX Designer',
    icon: 'user',
    tagline: 'Research what users need, then design the thing that solves it.',
    family: 'Design',
    dayToDay:
      'Conduct user research and usability testing (interviews, surveys, observation), ' +
      'create wireframes and prototypes, design the look, feel and navigation of a product, ' +
      'test and iterate across devices, and collaborate with developers and product managers.',
    skills: [
      'Figma',
      'Wireframing',
      'Prototyping',
      'Usability testing',
      'User research methods',
      'Basic understanding of front-end development'
    ],
    entry:
      "Typically a bachelor's degree (design, HCI, or related), though career-changers " +
      'commonly enter via bootcamps or certificates such as the Google UX Design ' +
      'Professional Certificate. A portfolio of case studies matters as much as the degree.',
    payMid: 108000,
    payBasis: 'industry',
    payRange: '~$96,500 early-career; ~$108,000 median total pay',
    payNote:
      "Robert Half's 2026 guide: early-career ~$96,500, mid-career ~$119,000, seasoned " +
      "$142,250+. Glassdoor's broader median total pay is ~$108,000, with entry-level " +
      'reported from ~$77,000 to $99,000+ depending on market and company size.',
    growthPct: null,
    growthWindow: null,
    growthLabel: 'Not published as a single BLS occupation',
    traits: [
      'User empathy and research skill',
      'Justifying design decisions with data',
      'Cross-functional communication',
      'A portfolio showing process, not just polished visuals'
    ],
    sources: [
      {
        label: 'Robert Half - UX Designer Salary and Career Outlook for 2026',
        url: 'https://www.roberthalf.com/us/en/insights/career-development/hot-job-ux-designer'
      },
      {
        label: 'Coursera - UX Designer Salary: Your 2026 Guide (citing Glassdoor)',
        url: 'https://www.coursera.org/articles/ux-designer-salary-guide'
      }
    ],
    traitScores: { code: 1, data: 1, people: 3, design: 3, risk: 0, systems: 0, lead: 1, ambiguity: 3 }
  },

  /* ---------------------------------------------------------------- 7 --- */
  {
    id: 'qa-tester',
    name: 'QA Tester',
    icon: 'clipboard',
    tagline: "Find what's broken before the customer does.",
    family: 'Secure',
    dayToDay:
      'Create test plans, scenarios and procedures for new software, identify project risks, ' +
      'run manual and automated tests, document and report defects, give developers feedback ' +
      'on usability and functionality, and re-test after fixes.',
    skills: [
      'Manual and automated testing tools',
      'Exploratory testing',
      'Bug-tracking software',
      'Basic scripting',
      'Test case design'
    ],
    entry:
      "Bachelor's in computer/information technology or a related field is typical (BLS " +
      'groups QA with software developers). Some QA roles are accessible to career-changers ' +
      'with strong attention to detail and a testing certificate such as ISTQB.',
    payMid: 134040,
    payBasis: 'bls',
    payRange: 'Median $134,040/yr (May 2025)',
    payNote: 'Reported within the broader software developers / QA / testers group.',
    growthPct: 6,
    growthWindow: '2025-2035',
    growthLabel: 'faster than average',
    traits: [
      'Extremely detail-oriented',
      'Methodical and organized',
      'Communicating defects clearly',
      "Diplomatic but rigorous about others' work"
    ],
    sources: [
      {
        label: 'BLS Occupational Outlook Handbook - Software Developers, QA Analysts, and Testers',
        url: 'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm'
      }
    ],
    traitScores: { code: 2, data: 1, people: 1, design: 1, risk: 3, systems: 1, lead: 0, ambiguity: 1 }
  },

  /* ---------------------------------------------------------------- 8 --- */
  {
    id: 'it-auditor',
    name: 'IT Auditor',
    icon: 'docCheck',
    tagline: 'Independently verify that controls actually work.',
    family: 'Secure',
    dayToDay:
      'Test and evaluate IT systems and controls against industry standards, verify ' +
      'compliance with regulations, evaluate technical infrastructure (operating systems, ' +
      'networks, databases, ERP), write audit findings and recommendations, and mentor ' +
      'junior audit staff.',
    skills: [
      'Broad platform knowledge (OS, networks, databases, ERP)',
      'Controls testing',
      'Risk assessment',
      'Audit report writing',
      'Presentation to leadership'
    ],
    entry:
      "Bachelor's in computer science, information systems, accounting, business " +
      'administration, or finance. The CISA credential from ISACA is the standard ' +
      'certification and is often preferred even early-career. Many entry candidates start ' +
      'in general internal audit or IT roles first.',
    payMid: 92800,
    payBasis: 'industry',
    payRange: '$70,500 - $101,000 (general); ~$92,800 entry-level average',
    payNote:
      "Robert Half's 2026 guide: general IT auditor $70,500-$101,000, technology-focused IT " +
      'auditor $108,500-$152,250, senior $91,500-$128,750. ZipRecruiter estimates the ' +
      'entry-level average at ~$92,800 with a typical range of $72,000-$112,000.',
    growthPct: null,
    growthWindow: null,
    growthLabel: 'Not published as a single BLS occupation',
    traits: [
      'Precision and professional skepticism',
      'Strong writing for audit reports',
      'Comfort presenting findings to management',
      'Working toward CISA / CIA / CPA'
    ],
    sources: [
      {
        label: 'Robert Half - IT Auditor Salary and Job Description',
        url: 'https://www.roberthalf.com/us/en/job-details/it-auditor'
      },
      {
        label: 'ZipRecruiter - Entry Level IT Auditor Salary',
        url: 'https://www.ziprecruiter.com/Salaries/Entry-Level-It-Auditor-Salary'
      }
    ],
    traitScores: { code: 0, data: 2, people: 3, design: 0, risk: 3, systems: 2, lead: 1, ambiguity: 1 }
  },

  /* ---------------------------------------------------------------- 9 --- */
  {
    id: 'erp-consultant',
    name: 'ERP Consultant',
    icon: 'layers',
    tagline: 'Configure the platforms (SAP, Salesforce) a company runs on.',
    family: 'Advise',
    dayToDay:
      'Gather business requirements from stakeholders in finance, ops and sales, configure ' +
      'and customize the ERP/CRM platform to match business processes, document current- vs ' +
      'future-state workflows, support rollouts and migrations, train end users, and ' +
      'troubleshoot after launch.',
    skills: [
      'SAP S/4HANA modules (FICO, MM, SD)',
      'Salesforce Sales/Service Cloud, Flow Builder',
      'Requirements gathering',
      'Business process mapping',
      'End-user training'
    ],
    entry:
      "A bachelor's degree helps but isn't always required, especially for Salesforce roles - " +
      'the Salesforce Certified Administrator credential (via Trailhead, ~$200 exam, no ' +
      'degree requirement) is a common on-ramp. SAP consulting roles more often expect a ' +
      "bachelor's in IT, business, or a related field.",
    payMid: 99860,
    payBasis: 'industry',
    payRange: '$70,500 - $127,000 (general ERP consultant)',
    payNote:
      'Salesforce-certified administrators average ~$88,000-$100,000 (junior ~$65,000-$85,000 ' +
      'per Salesforce Ben); SAP consultants average ~$99,860 (PayScale); SAP S/4HANA ' +
      "specialists can exceed $137,000 given a shortage ahead of SAP's 2027 ECC deadline.",
    growthPct: null,
    growthWindow: null,
    growthLabel: 'Not published as a single BLS occupation',
    traits: [
      'Translating business needs into system configuration',
      'Strong client-facing communication',
      'A relevant platform certification early',
      'Comfort with travel / client sites'
    ],
    sources: [
      {
        label: 'Robert Half - ERP Consultant Salary',
        url: 'https://www.roberthalf.com/ca/en/job-details/erp-consultant'
      },
      {
        label: 'KORE1 - Salesforce Administrator Salary Guide 2026',
        url: 'https://www.kore1.com/salesforce-admin-salary-guide/'
      },
      {
        label: 'PayScale - SAP Consultant Salary',
        url: 'https://www.payscale.com/research/US/Job=SAP_Consultant/Salary'
      }
    ],
    traitScores: { code: 1, data: 2, people: 3, design: 0, risk: 1, systems: 3, lead: 1, ambiguity: 2 }
  },

  /* --------------------------------------------------------------- 10 --- */
  {
    id: 'it-project-manager',
    name: 'IT Project Manager',
    icon: 'people',
    tagline: 'Get technical projects delivered on scope, time and budget.',
    family: 'Lead',
    dayToDay:
      'Plan and lead IT projects from scope through delivery, coordinate developers, ' +
      'analysts and QA, track budgets, timelines and deliverables, manage risks, and ' +
      'communicate status to stakeholders.',
    skills: [
      'Agile / Scrum',
      'Waterfall',
      'Scheduling and tracking tools',
      'Risk management',
      'Stakeholder communication',
      'General IT background'
    ],
    entry:
      "Bachelor's in an IT- or business-related field. Robert Half notes employers commonly " +
      'expect five or more years managing complex projects for the "IT Project Manager" ' +
      'title specifically - most people enter from an analyst, developer, or coordinator ' +
      'role first. PMP is valued but generally requires prior project experience to sit for.',
    payMid: 102320,
    payBasis: 'bls',
    payRange: 'Median $102,320/yr (project management specialists)',
    payNote:
      "Robert Half's 2026 guide lists IT project manager salaries specifically at " +
      '$103,500-$147,000. BLS figure is the broader "project management specialists" ' +
      'category, ~58,700-78,200 openings/year across the field.',
    growthPct: 6,
    growthWindow: '2024-2034',
    growthLabel: 'faster than average',
    traits: [
      'Detail-oriented across many moving pieces',
      'Communicates to technical and business audiences',
      'Resourceful under budget and timeline pressure',
      'Demonstrated leadership, even in a class or club project'
    ],
    sources: [
      {
        label: 'BLS Occupational Outlook Handbook - Project Management Specialists',
        url: 'https://www.bls.gov/ooh/business-and-financial/project-management-specialists.htm'
      },
      {
        label: 'Robert Half - IT Project Manager Salary',
        url: 'https://www.roberthalf.com/us/en/job-details/it-project-manager'
      }
    ],
    traitScores: { code: 0, data: 1, people: 3, design: 0, risk: 2, systems: 1, lead: 3, ambiguity: 2 }
  },

  /* --------------------------------------------------------------- 11 --- */
  {
    id: 'product-manager',
    name: 'Product Manager',
    icon: 'box',
    tagline: 'Decide what to build and why, then align everyone behind it.',
    family: 'Lead',
    dayToDay:
      'Define product vision and strategy, gather and prioritize requirements from customers ' +
      'and stakeholders, work with engineering and design to build features, analyze usage ' +
      'data and market trends, and coordinate launches with sales and marketing.',
    skills: [
      'Roadmapping tools',
      'Basic data analysis / product metrics',
      'Prioritization frameworks',
      'Cross-functional collaboration',
      'Written communication'
    ],
    entry:
      "Bachelor's in computer science or business is common. Robert Half notes 5+ years of " +
      'software product-management experience for its "IT Product Manager" listing. Many ' +
      'break in through Associate Product Manager (APM) programs at larger tech companies, ' +
      'or by moving over from engineering, analytics, or marketing.',
    payMid: 116000,
    payBasis: 'industry',
    payRange: '$80,000 - $110,000 entry; $92,750 - $139,250 general PM',
    payNote:
      "Robert Half's 2026 guide lists IT-specific product manager roles at $117,000-$168,000; " +
      'senior/lead PMs and product leads can exceed $170,000-$210,000+ base.',
    growthPct: null,
    growthWindow: null,
    growthLabel: 'Not published as a single BLS occupation',
    traits: [
      'Synthesizing many stakeholders into one clear plan',
      'Deciding with incomplete data',
      'Strong written and verbal communication',
      "Curiosity about users' problems, not just the technology"
    ],
    sources: [
      {
        label: 'Robert Half - Product Manager Salary',
        url: 'https://www.roberthalf.com/us/en/job-details/product-manager'
      },
      {
        label: 'Robert Half - IT Product Manager Salary',
        url: 'https://www.roberthalf.com/us/en/job-details/it-product-manager'
      }
    ],
    traitScores: { code: 1, data: 2, people: 3, design: 2, risk: 1, systems: 1, lead: 3, ambiguity: 3 }
  },

  /* --------------------------------------------------------------- 12 --- */
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    icon: 'cloud',
    tagline: 'Run the infrastructure everything else is deployed onto.',
    family: 'Build',
    dayToDay:
      'Design, deploy and maintain cloud infrastructure (AWS, Azure, GCP), manage servers, ' +
      'networking and storage in the cloud, automate deployments with infrastructure as ' +
      'code, monitor performance and security, and migrate on-premises systems to the cloud.',
    skills: [
      'AWS / Azure / GCP',
      'Infrastructure as code',
      'Containers and Kubernetes',
      'Networking fundamentals',
      'Security fundamentals',
      'Scripting and automation'
    ],
    entry:
      "Bachelor's in computer science/IT or a related field is typical. Because this is a " +
      'newer specialisation than traditional network administration, many candidates enter ' +
      'via a general IT/networking role plus a cloud certification (AWS Solutions Architect, ' +
      'Azure Administrator) rather than a cloud-specific degree.',
    payMid: 142500,
    payBasis: 'industry',
    payRange: '$82,000 - $130,000 entry; $130,000 - $155,000 average/mid',
    payNote:
      'Entry ranges vary by source: KORE1 $110,000-$130,000; VeriiPro $90,000-$110,000; ' +
      'RockstarDeveloperUniversity $82,000-$101,000. Sources cite ~15% growth for cloud roles ' +
      'through the early 2030s, against BLS projecting traditional network/systems ' +
      'administrator roles to decline ~4% from 2025-2035 as cloud and DevOps absorb the work.',
    growthPct: 15,
    growthWindow: 'through early 2030s',
    growthLabel: 'industry estimate, not a BLS occupation code',
    traits: [
      'Hands-on project experience (home lab, personal cloud projects)',
      'At least one recognised cloud certification',
      'Comfort with automation over manual configuration',
      'Troubleshooting live systems under pressure'
    ],
    sources: [
      {
        label: 'BLS OOH - Network and Computer Systems Administrators (context for the declining role this replaces)',
        url: 'https://www.bls.gov/ooh/computer-and-information-technology/network-and-computer-systems-administrators.htm'
      },
      {
        label: 'KORE1 - Cloud Engineer Salary Guide 2026',
        url: 'https://www.kore1.com/cloud-engineer-salary-guide-2026/'
      },
      {
        label: 'VeriiPro - The Rise of Cloud Engineering: Salary Trends to Watch in 2026',
        url: 'https://veriipro.com/blog/the-rise-of-cloud-engineering-salary/'
      }
    ],
    traitScores: { code: 2, data: 1, people: 1, design: 0, risk: 2, systems: 3, lead: 0, ambiguity: 2 }
  }
];

/* --------------------------------------------------------------------------
   FIT FINDER
   Six forced-choice questions. Each option adds weight to trait dimensions.
   A career's score = sum over dimensions of (userWeight * careerTraitScore),
   normalised to 0-100 against the best possible score. Deterministic and
   fully inspectable - see docs/ARCHITECTURE.md.
   -------------------------------------------------------------------------- */

const FIT_QUESTIONS = [
  {
    q: 'A group project just landed. Which part do you instinctively grab?',
    options: [
      { label: 'Writing the actual code', w: { code: 3, systems: 1 } },
      { label: 'Figuring out what the client actually needs', w: { people: 3, ambiguity: 2 } },
      { label: 'Pulling the numbers that decide the direction', w: { data: 3 } },
      { label: 'Building the schedule and keeping everyone moving', w: { lead: 3, people: 1 } }
    ]
  },
  {
    q: 'Which class assignment sounds least like work to you?',
    options: [
      { label: 'Debug this program until every test passes', w: { code: 3, risk: 1 } },
      { label: 'Interview five users and redesign the screen', w: { design: 3, people: 2 } },
      { label: 'Find the weakness in this system before someone else does', w: { risk: 3, systems: 2 } },
      { label: 'Build a dashboard that explains last quarter', w: { data: 3, design: 1 } }
    ]
  },
  {
    q: 'How do you feel about a problem with no clear right answer?',
    options: [
      { label: 'Energised - that is the interesting part', w: { ambiguity: 3, lead: 1 } },
      { label: 'Fine, as long as I can research my way to one', w: { ambiguity: 2, data: 1 } },
      { label: 'I would rather have a spec and execute it well', w: { code: 2, risk: 2 } },
      { label: 'I want to talk to people until it becomes clear', w: { people: 3, ambiguity: 1 } }
    ]
  },
  {
    q: 'Pick the workday you would take.',
    options: [
      { label: 'Six hours heads-down, headphones on', w: { code: 3, systems: 1 } },
      { label: 'Four client meetings and a workshop', w: { people: 3, lead: 2 } },
      { label: 'Half building, half explaining what I built', w: { code: 1, people: 2, data: 1 } },
      { label: 'Investigating something that looks wrong', w: { risk: 3, data: 1 } }
    ]
  },
  {
    q: 'What kind of "win" feels best?',
    options: [
      { label: 'The thing I built works and people use it', w: { code: 2, design: 1, systems: 1 } },
      { label: 'My analysis changed what leadership decided', w: { data: 3, people: 1 } },
      { label: 'A shipped project came in on time and on budget', w: { lead: 3, risk: 1 } },
      { label: 'I caught the flaw nobody else caught', w: { risk: 3, systems: 1 } }
    ]
  },
  {
    q: 'Where do you want to be sitting in five years?',
    options: [
      { label: 'Deep technical expert others come to', w: { code: 2, systems: 3 } },
      { label: 'Running a team or a product', w: { lead: 3, people: 2 } },
      { label: 'Trusted advisor clients call directly', w: { people: 3, ambiguity: 2 } },
      { label: 'The person who understands the data best', w: { data: 3, risk: 1 } }
    ]
  }
];
