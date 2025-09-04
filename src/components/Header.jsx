import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const location = useLocation()
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' }
  ]

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-mono text-fg hover:text-accent transition-colors focus-visible"
          >
            <span className="text-accent">[</span>TC<span className="text-accent">]</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-1 transition-colors focus-visible ${
                  location.pathname === item.path
                    ? 'text-accent'
                    : 'text-muted hover:text-fg'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    layoutId="nav-indicator"
                    initial={false}
                  >
                    {/* Bottom line */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-px bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    {/* Left vertical line */}
                    <motion.div
                      className="absolute left-0 bottom-0 w-px bg-accent"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                    />
                    {/* Right vertical line */}
                    <motion.div
                      className="absolute right-0 bottom-0 w-px bg-accent"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                    />
                    {/* Top line */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-px bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                    />
                  </motion.div>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header