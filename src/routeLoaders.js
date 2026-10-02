// Page chunks keyed by route. main.jsx preloads the current route before the
// first render so a reload never shows an empty Suspense fallback.
export const routeLoaders = {
  '/': () => import('./pages/Home'),
  '/about': () => import('./pages/About'),
  '/projects': () => import('./pages/Projects'),
  '/projects/omalo': () => import('./pages/Omalo'),
  '/projects/s3-amoled': () => import('./pages/S3Amoled'),
  '/contact': () => import('./pages/Contact'),
  '/privacy/flipping-seven-calculator': () => import('./pages/FlippingSevenPrivacy'),
  '/privacy/herdwick': () => import('./pages/HerdwickPrivacy'),
}

export const preloadRoute = (pathname) => {
  const route = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return routeLoaders[route]?.() ?? Promise.resolve()
}
