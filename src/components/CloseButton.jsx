import { useNavigate } from 'react-router-dom'

const CloseButton = () => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/')}
      className="tui-page-back-button tui-action inline-flex min-h-11 items-center border border-line bg-card-bg px-3 py-2 font-mono text-sm text-muted"
      aria-label="Go back home"
      title="Back (Esc)"
    >
      <span className="tui-action-content">← back</span>
    </button>
  )
}

export default CloseButton
