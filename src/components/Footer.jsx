const Footer = () => {
  const socialLinks = [
    { name: 'github', url: 'https://github.com/tuckercraig', key: 'gh' },
    { name: 'linkedin', url: 'https://linkedin.com/in/tuckercraig', key: 'in' },
    { name: 'twitter', url: 'https://twitter.com/tuckercraig', key: 'tw' },
    { name: 'spotify', url: 'https://open.spotify.com/user/tuckercraig', key: 'sp' },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-bg/95 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs font-mono text-muted px-3 py-2">
        {/* Social links - bottom left */}
        <div className="flex items-center gap-3">
          {socialLinks.map((link, index) => (
            <span key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label={`Visit ${link.name} profile`}
              >
                {link.key}
              </a>
              {index < socialLinks.length - 1 && <span className="ml-3 text-line">│</span>}
            </span>
          ))}
        </div>
        
        {/* Help and copyright - bottom right */}
        <div>
          <span className="text-accent">:</span>help <span className="mx-2 text-line">│</span> <span className="text-accent">©</span> 2024
        </div>
      </div>
    </footer>
  )
}

export default Footer
