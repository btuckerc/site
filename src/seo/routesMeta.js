export const SITE_URL = 'https://btuckerc.dev'
export const HUB_URL = 'https://tuckercraig.com'
export const PERSON_ID = `${HUB_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const PERSON_ENTITY = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Tucker Craig',
  alternateName: ['btuckerc', 'btuckercdev'],
  jobTitle: 'Software Engineer',
  description:
    'Software engineer building everyday tools with coding agents across macOS, Windows, iOS, web, and embedded hardware, including angl browser, winstream, Herdwick, Pace Bar, Dictation, Inkjoin, and omalo.',
  url: `${HUB_URL}/`,
  mainEntityOfPage: `${HUB_URL}/`,
  image: `${SITE_URL}/avatar-courtyard.jpg`,
  email: 'mailto:hello@tuckercraig.com',
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Davidson College',
    sameAs: 'https://www.davidson.edu',
  },
  knowsAbout: [
    'macOS and Swift software engineering',
    'Windows and Rust systems programming',
    'iOS app development',
    'Coding-agent workflows and multi-model orchestration',
    'Embedded hardware and ESP32-S3 firmware',
  ],
  sameAs: [
    `${SITE_URL}/`,
    `${SITE_URL}/about`,
    'https://github.com/btuckerc',
    'https://www.linkedin.com/in/tucker-craig/',
    'https://x.com/btuckercdev',
    'https://www.instagram.com/btuckerc.dev/',
    'https://www.twitch.tv/itux',
    'https://open.spotify.com/user/tuxedo7777',
    'https://soundcloud.com/tuxix',
  ],
}

export const WEBSITE_ENTITY = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'btuckerc.dev',
  alternateName: "Tucker Craig's Portfolio",
  url: `${SITE_URL}/`,
  description:
    "Tucker Craig's software engineering portfolio, apps, hardware prototypes, and AI coding-agent workflow.",
  inLanguage: 'en-US',
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
}

export const ROUTES_META = [
  {
    route: '/',
    mdPath: '/index.md',
    title: 'Tucker Craig — Projects, Apps & AI Workflow (btuckerc.dev)',
    description:
      'Software engineering portfolio of Tucker Craig: angl browser, winstream, Herdwick, Pace Bar, Dictation, Inkjoin, omalo, and how he builds with coding agents.',
    image: `${SITE_URL}/og/home.jpg`,
    imageAlt: 'Tucker Craig, software engineer. Building my own tools with coding agents.',
    type: 'website',
    schemaType: 'ProfilePage',
    updated: '2026-11-27',
    llmsSection: 'Core Pages',
    llmsSummary:
      'Engineering portfolio homepage highlighting flagship macOS, Windows, iOS, and ESP32-S3 hardware projects plus winstream vs OBS benchmarks.',
  },
  {
    route: '/workflow',
    mdPath: '/workflow.md',
    title: 'How I build with AI — Tucker Craig',
    description:
      'How Tucker Craig splits work across Gemini 4 Neon, Claude Opus 5.5, GPT-6.2 Sol, local Qwen 3.8, and a five-model blind council to build and test his own apps.',
    image: `${SITE_URL}/og/workflow.jpg`,
    imageAlt: 'Tucker Craig, workflow: how I build with AI.',
    type: 'article',
    schemaType: 'TechArticle',
    datePublished: '2026-09-12',
    updated: '2026-11-26',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Workflow', route: '/workflow' },
    ],
    llmsSection: 'Core Pages',
    llmsSummary:
      'Technical essay on multi-model director/worker coding-agent orchestration, isolated Git worktrees, blind five-model council reviews, and real-target verification.',
  },
  {
    route: '/about',
    mdPath: '/about.md',
    title: 'About — Tucker Craig',
    description:
      'About Tucker Craig: software engineer and Davidson College alumnus building a macOS browser, an iOS coding-agent client, local voice-to-text, quota tools, and omalo firmware.',
    image: `${SITE_URL}/og/about.jpg`,
    imageAlt: "Tucker Craig, about. Hello, world! I'm Tucker.",
    type: 'profile',
    schemaType: 'ProfilePage',
    updated: '2026-11-27',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'About', route: '/about' },
    ],
    llmsSection: 'Core Pages',
    llmsSummary:
      'Biography, background (Davidson College, The Nuances), current engineering focus, and verified cross-domain identity links.',
  },
  {
    route: '/projects',
    mdPath: '/projects.md',
    title: 'Projects — Tucker Craig',
    description:
      'Public software and hardware projects by Tucker Craig: angl browser, winstream, Herdwick, Inkjoin, Pace Bar, Dictation, CenterSeat, StreamApp, and more.',
    image: `${SITE_URL}/og/projects.jpg`,
    imageAlt: 'Tucker Craig, projects: angl browser, winstream, Herdwick, Inkjoin, Pace Bar, and more.',
    type: 'website',
    schemaType: 'CollectionPage',
    updated: '2026-11-27',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Projects', route: '/projects' },
    ],
    llmsSection: 'Core Pages',
    llmsSummary:
      'Complete reviewed catalog of software, systems, iOS, macOS, Windows, and music/hardware projects (open-source repos and local builds).',
  },
  {
    route: '/projects/omalo',
    mdPath: '/projects/omalo.md',
    title: 'omalo: Pocket Companion Running ichr — Tucker Craig',
    description:
      'omalo is a pocket ESP32-S3 hardware companion by Tucker Craig running ichr. Play Pokémon Emerald yourself, or hand off goals to an AI.',
    image: `${SITE_URL}/media/omalo/share.jpg`,
    imageAlt: 'omalo, a pocket companion running ichr, with Pokémon Emerald on omalo.',
    type: 'article',
    schemaType: 'TechArticle',
    datePublished: '2026-09-12',
    updated: '2026-11-27',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Projects', route: '/projects' },
      { label: 'omalo', route: '/projects/omalo' },
    ],
    appInfo: {
      name: 'omalo / ichr',
      operatingSystem: 'ESP32-S3 / Arduino',
      applicationCategory: 'GameApplication',
      description:
        'Open-source-minded firmware and pocket companion prototype running Pokémon Emerald with AI goal handoffs and motion-controlled Grain.',
    },
    llmsSection: 'Case Studies',
    llmsSummary:
      'Product introduction for omalo (pocket ESP32-S3 companion) and ichr firmware, including Pokémon Emerald AI handoffs and Grain.',
  },
  {
    route: '/projects/s3-amoled',
    mdPath: '/projects/s3-amoled.md',
    title: 'What happens when you hand Pokémon to an AI? — Tucker Craig',
    description:
      'Technical notes inside omalo by Tucker Craig: a Pokémon Emerald battle handoff, verifying what an agent actually did, Route 102 navigation, and Grain corner physics.',
    image: `${SITE_URL}/og/s3-amoled.jpg`,
    imageAlt: 'omalo notes, s3-amoled: what happens when you hand Pokémon to an AI?',
    type: 'article',
    schemaType: 'TechArticle',
    datePublished: '2026-09-12',
    updated: '2026-11-27',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'omalo', route: '/projects/omalo' },
      { label: 's3-amoled', route: '/projects/s3-amoled' },
    ],
    llmsSection: 'Case Studies',
    llmsSummary:
      'Deep technical case study on ESP32-S3 AMOLED firmware, deterministic local battle controllers, state verification, and rounded-screen geometry.',
  },
  {
    route: '/contact',
    mdPath: '/contact.md',
    title: 'Contact — Tucker Craig',
    description:
      'Get in touch with Tucker Craig via email, GitHub, LinkedIn, X, tuckercraig.com, or the contact form.',
    image: `${SITE_URL}/og/contact.jpg`,
    imageAlt: 'Tucker Craig, contact. Say hello at btuckerc.dev@gmail.com.',
    type: 'website',
    schemaType: 'ContactPage',
    updated: '2026-11-27',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Contact', route: '/contact' },
    ],
    llmsSection: 'Core Pages',
    llmsSummary: 'Direct email, contact form, and verified social/developer profiles for Tucker Craig.',
  },
  {
    route: '/privacy/flipping-seven-calculator',
    mdPath: '/privacy/flipping-seven-calculator.md',
    title: 'Privacy Policy - Flipping Seven Calculator',
    description:
      'Privacy policy for Flipping Seven Calculator, an offline iOS scorekeeper by Tucker Craig that collects no personal data.',
    openGraphDescription:
      'Flipping Seven Calculator does not collect, transmit, sell, or share personal data.',
    image: `${SITE_URL}/og/flipping-seven-privacy.jpg`,
    imageAlt: 'Flipping Seven privacy: simple app, simple privacy.',
    type: 'website',
    schemaType: 'WebPage',
    updated: '2026-07-28',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Flipping Seven Privacy', route: '/privacy/flipping-seven-calculator' },
    ],
    appInfo: {
      name: 'Flipping Seven Calculator',
      operatingSystem: 'iOS, iPadOS',
      applicationCategory: 'UtilitiesApplication',
      url: 'https://apps.apple.com/us/app/flipping-seven-calculator/id6756905042',
      codeRepository: 'https://github.com/btuckerc/flip7calculator',
    },
    llmsSection: 'App Support & Privacy',
    llmsSummary: 'Offline zero-data-collection privacy policy for Flipping Seven Calculator.',
  },
  {
    route: '/privacy/herdwick',
    mdPath: '/privacy/herdwick.md',
    title: 'Privacy Policy - Herdwick',
    description:
      'Privacy policy for Herdwick, an iOS coding-agent client by Tucker Craig that connects directly over SSH to your own machines.',
    openGraphDescription:
      "Herdwick connects directly to your own machines over SSH. I don't collect or store any of your data.",
    image: `${SITE_URL}/og/herdwick-privacy.jpg`,
    imageAlt: 'Herdwick privacy: your agents stay on your machines.',
    type: 'website',
    schemaType: 'WebPage',
    updated: '2026-09-26',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Herdwick Privacy', route: '/privacy/herdwick' },
    ],
    appInfo: {
      name: 'Herdwick',
      operatingSystem: 'iOS 26+, iPadOS 26+',
      applicationCategory: 'DeveloperApplication',
      url: 'https://apps.apple.com/app/id6815920496',
      codeRepository: 'https://github.com/btuckerc/herdwick',
    },
    llmsSection: 'App Support & Privacy',
    llmsSummary: 'Privacy policy for Herdwick iOS/iPadOS SSH coding-agent client.',
  },
  {
    route: '/herdwick/support',
    mdPath: '/herdwick/support.md',
    title: 'Support - Herdwick',
    description:
      'Help and setup guide for Herdwick, the iPhone and iPad app by Tucker Craig for reading and answering coding agents on your own machines.',
    openGraphDescription: 'Help for Herdwick: setup, connecting a machine, and contact.',
    image: `${SITE_URL}/og/herdwick-support.jpg`,
    imageAlt: 'Herdwick support: coding agents on your phone.',
    type: 'website',
    schemaType: 'WebPage',
    updated: '2026-09-30',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Herdwick Support', route: '/herdwick/support' },
    ],
    appInfo: {
      name: 'Herdwick',
      operatingSystem: 'iOS 26+, iPadOS 26+',
      applicationCategory: 'DeveloperApplication',
      url: 'https://apps.apple.com/app/id6815920496',
      codeRepository: 'https://github.com/btuckerc/herdwick',
    },
    llmsSection: 'App Support & Privacy',
    llmsSummary: 'Setup, SSH/Tailscale connection guide, and troubleshooting for Herdwick.',
  },
  {
    route: '/privacy/inkjoin',
    mdPath: '/privacy/inkjoin.md',
    title: 'Privacy Policy - Inkjoin',
    description:
      'Privacy policy for Inkjoin, an iPhone logic puzzle game by Tucker Craig.',
    openGraphDescription:
      'What Inkjoin keeps on your device and what its daily puzzles and optional anonymous analytics send.',
    image: `${SITE_URL}/og/inkjoin-privacy.jpg`,
    imageAlt: 'Inkjoin privacy policy.',
    type: 'website',
    schemaType: 'WebPage',
    updated: '2026-11-26',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Inkjoin Privacy', route: '/privacy/inkjoin' },
    ],
    appInfo: {
      name: 'Inkjoin',
      operatingSystem: 'iOS 26+',
      applicationCategory: 'GameApplication',
      url: 'https://apps.apple.com/app/id6819489546',
      codeRepository: 'https://github.com/btuckerc/inkjoin',
    },
    llmsSection: 'App Support & Privacy',
    llmsSummary: 'Privacy policy for Inkjoin iOS logic puzzle game.',
  },
  {
    route: '/inkjoin/support',
    mdPath: '/inkjoin/support.md',
    title: 'Support - Inkjoin',
    description:
      'Help, rules, and common questions for Inkjoin, an iPhone logic puzzle game by Tucker Craig.',
    openGraphDescription: 'How to play Inkjoin and answers to common questions.',
    image: `${SITE_URL}/og/inkjoin-support.jpg`,
    imageAlt: 'Inkjoin support.',
    type: 'website',
    schemaType: 'WebPage',
    updated: '2026-10-06',
    breadcrumbs: [
      { label: 'Home', route: '/' },
      { label: 'Inkjoin Support', route: '/inkjoin/support' },
    ],
    appInfo: {
      name: 'Inkjoin',
      operatingSystem: 'iOS 26+',
      applicationCategory: 'GameApplication',
      url: 'https://apps.apple.com/app/id6819489546',
      codeRepository: 'https://github.com/btuckerc/inkjoin',
    },
    llmsSection: 'App Support & Privacy',
    llmsSummary: 'Rules, daily puzzles, and common questions for Inkjoin.',
  },
]

const routesByPath = new Map(ROUTES_META.map((entry) => [entry.route, entry]))

export const getRouteMeta = (route) => routesByPath.get(route) || null

export const getCanonicalUrl = (route) => `${SITE_URL}${route === '/' ? '/' : route}`

export const getMarkdownUrl = (route) => {
  const meta = getRouteMeta(route)
  return meta ? `${SITE_URL}${meta.mdPath}` : null
}

export const getProjectDate = (project, boundary = '12-31') =>
  project.date || `${project.year}-${boundary}`

export const compareFeaturedProjects = (a, b) => {
  const featuredDelta = (b.featured || 0) - (a.featured || 0)
  if (featuredDelta !== 0) return featuredDelta
  return new Date(getProjectDate(b)) - new Date(getProjectDate(a))
}
