import { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null

  return (
    <nav className="tui-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isHome = item.to === '/'

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li className="tui-breadcrumb-sep" aria-hidden="true">/</li>
              )}
              <li>
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="tui-breadcrumb-link"
                    title={isHome ? 'Home (Esc)' : undefined}
                    aria-keyshortcuts={isHome ? 'Escape' : undefined}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? 'tui-breadcrumb-current' : 'tui-breadcrumb-muted'}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
