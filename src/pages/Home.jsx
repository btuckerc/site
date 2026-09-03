import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useRovingFocus } from '../hooks/useRovingFocus.jsx'
import AsciiButton from '../components/AsciiButton'

const preloadRoutes = {
  about: () => import('./About'),
  projects: () => import('./Projects'),
  contact: () => import('./Contact')
}

const Home = () => {
  const navItems = [
    { id: 'about', label: 'ABOUT', path: '/about' },
    { id: 'projects', label: 'PROJECTS', path: '/projects' },
    { id: 'contact', label: 'CONTACT', path: '/contact' }
  ]

  const { getItemProps } = useRovingFocus('home-nav', navItems)

  const preloadRoute = (id) => {
    preloadRoutes[id]?.().catch(() => {})
  }

  return (
    <>
      <Helmet>
        <title>Tucker Craig - FinOps & Agent Systems</title>
        <meta name="description" content="Tucker Craig, Senior Software Engineer (FinOps) at Box. Forecast tooling, agent systems, and projects that run whether or not anyone's watching. Davidson '20." />
        <meta property="og:title" content="Tucker Craig - FinOps & Agent Systems" />
        <meta property="og:description" content="Senior Software Engineer (FinOps) at Box. Forecast tooling, agent systems, and a macmini full of side projects." />
        <meta property="og:url" content="https://btuckerc.dev/" />
        <link rel="canonical" href="https://btuckerc.dev/" />
      </Helmet>
      <div className="tui-page-shell min-h-svh flex items-center justify-center px-4 pt-14 sm:pt-16 pb-16">
        <div className="tui-home-lift max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="tui-home-shell relative overflow-hidden border border-line/70 backdrop-blur-xl"
        >
          <div className="home-panel relative px-6 py-10 sm:px-8 sm:py-14 md:px-14 md:py-20 text-center flex flex-col justify-between gap-10 sm:gap-12">
            {/* Top Section - Name and Info */}
            <div className="home-identity">
              {/* Optical rules frame the title block without competing with the name. */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center mb-[clamp(1rem,2.2vw,1.5rem)] w-full"
              >
                <div className="home-identity-rule h-px bg-accent" />
              </motion.div>

              <h1 
                className="font-bold text-fg mb-[clamp(0.875rem,2.4vw,1.5rem)] text-[clamp(1.85rem,8vw,4rem)] leading-[1.05] font-mono whitespace-nowrap"
              >
                TUCKER CRAIG
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.2, ease: "easeOut" }}
                className="space-y-2 mb-[clamp(1.75rem,4vw,2.25rem)]"
              >
                <p className="text-fg text-sm sm:text-base md:text-lg font-mono uppercase leading-[1.45] sm:leading-relaxed">
                  <span className="block">senior software engineer</span>
                  <span className="block">finops @ box</span>
                </p>
                <p className="text-muted text-xs md:text-sm font-mono uppercase leading-normal">
                  davidson college '20
                </p>
              </motion.div>

              {/* Keep the lower rule matched to the upper rule for stable symmetry. */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.16, duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center w-full"
              >
                <div className="home-identity-rule h-px bg-accent" />
              </motion.div>
            </div>

            {/* Bottom Section - Navigation Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-[360px]:gap-5 md:gap-6" data-home-nav>
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="block w-full font-mono text-base sm:text-lg uppercase no-underline"
                  {...getItemProps(item, index)}
                  onMouseEnter={() => preloadRoute(item.id)}
                  onFocus={() => preloadRoute(item.id)}
                >
                  <AsciiButton
                    size="lg"
                    className="w-full"
                    as="div"
                  >
                    {item.label}
                  </AsciiButton>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </>
  )
}

export default Home
