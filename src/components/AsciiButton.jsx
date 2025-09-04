import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const AsciiButton = forwardRef(({ 
  children, 
  onClick, 
  onKeyDown,
  disabled = false,
  variant = 'default', // default, ghost, accent
  size = 'default', // sm, default, lg
  className = '',
  type = 'button',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    default: 'px-5 py-3',
    lg: 'px-6 py-4 text-lg'
  }

  const variantClasses = {
    default: 'bg-card-bg hover:bg-hover-bg active:bg-active-bg',
    ghost: 'bg-transparent hover:bg-hover-bg active:bg-active-bg',
    accent: 'bg-accent text-bg hover:bg-accent/90 active:bg-accent/80'
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`
        relative group
        font-medium
        border-0 outline-0 
        background-transparent
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring
        transition-colors duration-200
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Left bracket */}
      <span 
        className="
          absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1
          font-mono text-muted group-hover:text-accent group-focus-visible:text-accent
          opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
          transition-all duration-200
          pointer-events-none
        "
        aria-hidden="true"
      >
        [
      </span>

      {/* Right bracket */}
      <span 
        className="
          absolute right-0 top-1/2 -translate-y-1/2 translate-x-1
          font-mono text-muted group-hover:text-accent group-focus-visible:text-accent
          opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
          transition-all duration-200
          pointer-events-none
        "
        aria-hidden="true"
      >
        ]
      </span>

      {/* Inner container with outline */}
      <div 
        className={`
          relative rounded-xl
          border border-line group-hover:border-accent/50 group-focus-visible:border-accent/50
          transition-all duration-200
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
        style={{
          background: variant === 'accent' ? 'var(--accent)' : `
            linear-gradient(var(--card-bg), var(--card-bg)) padding-box,
            linear-gradient(var(--line), var(--line)) border-box
          `,
          borderRadius: '14px'
        }}
      >
        <span className="relative z-10">
          {children}
        </span>
      </div>
    </motion.button>
  )
})

AsciiButton.displayName = 'AsciiButton'

export default AsciiButton