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
      {/* Bracket hover effect lines */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
        {/* Left bracket */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-accent" />
        <div className="absolute left-0 top-0 w-[10px] h-px bg-accent" />
        <div className="absolute left-0 bottom-0 w-[10px] h-px bg-accent" />
        
        {/* Right bracket */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-accent" />
        <div className="absolute top-0 right-0 w-[10px] h-px bg-accent" />
        <div className="absolute bottom-0 right-0 w-[10px] h-px bg-accent" />
      </div>

      {/* Inner container */}
      <div 
        className={`
          relative border border-line bg-card-bg hover:bg-hover-bg
          transition-colors duration-200 z-10
          ${sizeClasses[size]}
          ${variant === 'accent' ? 'bg-accent text-bg hover:bg-accent/90' : ''}
        `}
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