import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useRovingFocus } from '../hooks/useRovingFocus.jsx'
import AsciiButton from '../components/AsciiButton'
import { SYMBOLS } from '../constants/symbols'

const Home = () => {
  const navItems = [
    { id: 'about', label: 'ABOUT', path: '/about' },
    { id: 'projects', label: 'PROJECTS', path: '/projects' },
    { id: 'contact', label: 'CONTACT', path: '/contact' }
  ]

  const { getItemProps } = useRovingFocus('home-nav', navItems)

  return (
    <>
      <Helmet>
        <title>Tucker Craig - FinOps Engineer at Box | Cloud Cost Optimization</title>
        <meta name="description" content="Tucker Craig - FinOps Engineer at Box specializing in multi-cloud cost optimization and capacity planning. Davidson College '20. Building cloud cost optimization tools and full-stack applications." />
        <meta property="og:title" content="Tucker Craig - FinOps Engineer at Box" />
        <meta property="og:description" content="FinOps Engineer at Box specializing in multi-cloud cost optimization and capacity planning. Building cloud cost optimization tools and full-stack applications." />
        <meta property="og:url" content="https://btuckerc.dev/" />
        <link rel="canonical" href="https://btuckerc.dev/" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 pt-4 sm:pt-6 md:pt-8 pb-16">
        <div className="max-w-4xl w-full" ref={(el) => el && el.focus({ preventScroll: true })}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden border border-line/70 bg-bg/85 backdrop-blur-xl shadow-[0_32px_100px_-50px_rgba(0,0,0,0.85)]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" aria-hidden />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" aria-hidden />

          <div className="relative px-8 py-16 md:px-14 md:py-20 text-center flex flex-col justify-between min-h-[600px]">
            {/* Top Section - Name and Info */}
            <div>
              {/* Top horizontal line - matches character length of "davidson college '20" */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
                className="flex items-center justify-center mb-6 w-full"
              >
                <div className="h-px bg-accent w-[13ch] sm:w-[15ch] md:w-[17ch]" />
              </motion.div>

              <h1 
                className="font-bold text-fg mb-6 tracking-[0.3em] font-mono"
                style={{ fontSize: 'clamp(2rem, 5vw + 1rem, 3.75rem)' }}
              >
                TUCKER CRAIG
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
                className="space-y-2 mb-10"
              >
                <p className="text-accent text-base md:text-lg font-mono tracking-[0.35em] uppercase">
                  finops engineer @ box
                </p>
                <p className="text-muted text-xs md:text-sm font-mono tracking-[0.35em] uppercase">
                  davidson college '20
                </p>
              </motion.div>

              {/* Bottom horizontal line - matches character length of "davidson college '20" */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
                className="flex items-center justify-center w-full"
              >
                <div className="h-px bg-accent w-[13ch] sm:w-[15ch] md:w-[17ch]" />
              </motion.div>
            </div>

            {/* Bottom Section - Navigation Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="block w-full font-mono text-lg tracking-[0.3em] uppercase no-underline"
                  {...getItemProps(item, index)}
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
