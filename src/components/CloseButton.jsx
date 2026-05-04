import { useNavigate } from 'react-router-dom'

const CloseButton = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/')}
      className="tui-action min-h-10 px-3 py-1 border border-line bg-card-bg focus-visible font-mono text-sm text-muted"
      aria-label="Go back home"
      title="Back (Esc)"
    >
      <span className="tui-action-content">← back</span>
    </button>
  )
}

export default CloseButton
