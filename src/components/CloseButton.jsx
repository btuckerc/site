import { useNavigate } from 'react-router-dom'

const CloseButton = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/')}
      className="px-3 py-1 border border-line bg-card-bg hover:border-accent hover:bg-accent/10 transition-colors focus-visible font-mono text-sm text-muted hover:text-accent"
      aria-label="Go back home"
      title="Back (Esc)"
    >
      ← back
    </button>
  )
}

export default CloseButton