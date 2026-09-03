import { forwardRef } from 'react'

const AsciiButton = forwardRef(({
  children,
  onClick,
  onKeyDown,
  disabled = false,
  variant = 'default',
  size = 'default',
  className = '',
  type = 'button',
  as: Component = 'button',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    default: 'px-5 py-3',
    lg: 'px-5 py-3 text-base min-[360px]:px-6 min-[360px]:py-4 min-[360px]:text-lg'
  }

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`
        tui-home-nav-btn relative group
        font-medium
        border-0 outline-0
        bg-transparent
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring
        ${className}
      `}
      {...props}
    >
      <div className="tui-home-nav-bracket absolute inset-0 pointer-events-none z-30" aria-hidden="true">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--button-bracket)]" />
        <div className="absolute left-0 top-0 w-[10px] h-px bg-[var(--button-bracket)]" />
        <div className="absolute left-0 bottom-0 w-[10px] h-px bg-[var(--button-bracket)]" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-[var(--button-bracket)]" />
        <div className="absolute top-0 right-0 w-[10px] h-px bg-[var(--button-bracket)]" />
        <div className="absolute bottom-0 right-0 w-[10px] h-px bg-[var(--button-bracket)]" />
      </div>

      <div
        className={`
          tui-btn-face relative overflow-hidden border z-10
          ${sizeClasses[size]}
          ${variant === 'accent' ? 'tui-btn-face-accent' : ''}
          ${disabled ? 'opacity-70' : ''}
        `}
      >
        <span className="relative z-10">{children}</span>
      </div>
    </Component>
  )
})

AsciiButton.displayName = 'AsciiButton'

export default AsciiButton
