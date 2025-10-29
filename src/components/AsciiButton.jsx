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
  as: Component = 'button',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    default: 'px-5 py-3',
    lg: 'px-6 py-4 text-lg'
  }

  const variantClasses = {
    default: 'bg-btn-bg hover:bg-btn-hover active:bg-btn-active text-fg',
    ghost: 'bg-transparent hover:bg-btn-hover active:bg-btn-active text-fg',
    accent: 'bg-accent text-bg hover:bg-accent/90 active:bg-accent/80'
  }

  const borderClass =
    variant === 'accent'
      ? 'border-accent/70'
      : 'border-btn-border/80'

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`
        relative group
        font-medium
        border-0 outline-0 
        background-transparent
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
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
          relative overflow-hidden border ${borderClass}
          transition-all duration-200 z-10
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? 'opacity-70' : 'group-hover:shadow-[0px_25px_45px_-35px_rgba(201,205,210,0.85)]'}
        `}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: variant === 'accent'
              ? 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.32), transparent 68%)'
              : 'radial-gradient(circle at 50% 0%, rgba(201,205,210,0.26), transparent 70%)'
          }}
        />
        <span className="relative z-10">
          {children}
        </span>
      </div>
    </motion.div>
  )
})

AsciiButton.displayName = 'AsciiButton'

export default AsciiButton