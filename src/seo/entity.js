import projectsData from '../../data/projects.json'
import {
  HUB_URL,
  PERSON_ENTITY,
  PERSON_ID,
  ROUTES_META,
  SITE_URL,
  WEBSITE_ENTITY,
  WEBSITE_ID,
  compareFeaturedProjects,
  getCanonicalUrl,
  getMarkdownUrl,
  getRouteMeta,
} from './routesMeta.js'

export {
  HUB_URL,
  PERSON_ENTITY,
  PERSON_ID,
  ROUTES_META,
  SITE_URL,
  WEBSITE_ENTITY,
  WEBSITE_ID,
  getCanonicalUrl,
  getMarkdownUrl,
  getRouteMeta,
}

const inferOperatingSystem = (project) => {
  const tags = (project.tags || []).map((tag) => tag.toLowerCase())
  const platforms = []
  if (tags.includes('macos')) platforms.push('macOS')
  if (tags.includes('windows')) platforms.push('Windows 11')
  if (tags.includes('ios')) platforms.push('iOS')
  if (tags.includes('ipados')) platforms.push('iPadOS')
  if (tags.includes('web') || tags.includes('next.js') || tags.includes('react')) platforms.push('Web')
  return platforms.length ? platforms.join(', ') : undefined
}

const inferApplicationCategory = (project) => {
  const id = (project.id || '').toLowerCase()
  const tags = (project.tags || []).map((tag) => tag.toLowerCase())
  if (id === 'inkjoin' || tags.includes('puzzle') || tags.includes('game')) {
    return 'GameApplication'
  }
  if (id === 'angl-browser' || tags.includes('browser')) {
    return 'BrowserApplication'
  }
  if (
    id === 'winstream' ||
    id === 'streamapp' ||
    id === 'audioreader' ||
    id === 'earcandy' ||
    id === 'angl-dj' ||
    tags.includes('streaming') ||
    tags.includes('audio')
  ) {
    return 'MultimediaApplication'
  }
  if (
    id === 'herdwick' ||
    id === 'pace-bar' ||
    id === 'boilerplate' ||
    id === 'opencode-menu' ||
    id === 'omp-serve' ||
    tags.includes('developer tools') ||
    tags.includes('coding agents') ||
    tags.includes('dev environment')
  ) {
    return 'DeveloperApplication'
  }
  if (
    id === 'flipping-seven-calculator' ||
    id === 'farkle' ||
    id === 'center-seat' ||
    id === 'dictation' ||
    id === 'tablet-companion' ||
    id === 'tempo'
  ) {
    return 'UtilitiesApplication'
  }
  return undefined
}

const projectToSchemaItem = (project) => {
  const isSoftware = project.id !== 'music'
  const item = {
    '@type': isSoftware ? 'SoftwareApplication' : 'CreativeWork',
    name: project.title,
    description: project.blurb,
    author: { '@id': PERSON_ID },
  }
  const os = inferOperatingSystem(project)
  if (isSoftware && os) item.operatingSystem = os
  const category = isSoftware ? inferApplicationCategory(project) : undefined
  if (category) item.applicationCategory = category
  const primaryUrl =
    project.links?.site ||
    project.links?.['app store'] ||
    project.links?.github ||
    Object.values(project.links || {}).find(Boolean) ||
    `${SITE_URL}/projects`
  item.url = primaryUrl
  if (project.links?.github) item.codeRepository = project.links.github
  if (project.links?.download) item.downloadUrl = project.links.download
  return item
}

export const buildStructuredData = (route) => {
  const meta = getRouteMeta(route)
  if (!meta) return null

  const canonical = getCanonicalUrl(route)
  const pageId = `${canonical}#webpage`
  const graph = [PERSON_ENTITY, WEBSITE_ENTITY]

  if (meta.schemaType === 'TechArticle') {
    const article = {
      '@type': 'TechArticle',
      '@id': `${canonical}#article`,
      headline: meta.title,
      description: meta.description,
      url: canonical,
      mainEntityOfPage: canonical,
      image: meta.image,
      inLanguage: 'en-US',
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
      isPartOf: { '@id': WEBSITE_ID },
    }
    if (meta.datePublished) article.datePublished = meta.datePublished
    if (meta.updated) article.dateModified = meta.updated
    graph.push(article)
  } else {
    const pageNode = {
      '@type': meta.schemaType || 'WebPage',
      '@id': pageId,
      name: meta.title,
      description: meta.description,
      url: canonical,
      inLanguage: 'en-US',
      isPartOf: { '@id': WEBSITE_ID },
    }
    if (meta.schemaType === 'ProfilePage' || meta.schemaType === 'ContactPage') {
      pageNode.mainEntity = { '@id': PERSON_ID }
    } else {
      pageNode.about = { '@id': PERSON_ID }
    }
    if (meta.updated) pageNode.dateModified = meta.updated

    if (route === '/projects') {
      const sorted = [...projectsData].sort(compareFeaturedProjects)
      pageNode.mainEntity = {
        '@type': 'ItemList',
        name: 'Software and Hardware Projects by Tucker Craig',
        numberOfItems: sorted.length,
        itemListElement: sorted.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: projectToSchemaItem(project),
        })),
      }
    }

    graph.push(pageNode)
  }

  if (route === '/') {
    const featuredIds = [
      'angl-browser',
      'winstream',
      'herdwick',
      'dictation',
      'pace-bar',
      'inkjoin',
      'center-seat',
      'boilerplate',
    ]
    const featured = featuredIds
      .map((id) => projectsData.find((project) => project.id === id))
      .filter(Boolean)

    graph.push({
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#featured-projects`,
      name: 'Featured Projects by Tucker Craig',
      numberOfItems: featured.length,
      itemListElement: featured.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: projectToSchemaItem(project),
      })),
    })
  }

  if (meta.appInfo) {
    const appNode = {
      '@type': 'SoftwareApplication',
      '@id': `${canonical}#software`,
      name: meta.appInfo.name,
      operatingSystem: meta.appInfo.operatingSystem,
      applicationCategory: meta.appInfo.applicationCategory,
      author: { '@id': PERSON_ID },
    }
    if (meta.appInfo.description) appNode.description = meta.appInfo.description
    if (meta.appInfo.url) appNode.url = meta.appInfo.url
    if (meta.appInfo.codeRepository) appNode.codeRepository = meta.appInfo.codeRepository
    graph.push(appNode)
  }

  if (meta.breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: meta.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: getCanonicalUrl(crumb.route),
      })),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export const serializeJsonLd = (data) =>
  JSON.stringify(data).replace(/</g, '\\u003c')
