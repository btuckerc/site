import { Writable } from 'node:stream'
import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'
import { preloadRoute } from './routeLoaders'

export async function render(url) {
  await preloadRoute(url)
  const helmetContext = {}

  const html = await new Promise((resolve, reject) => {
    const chunks = []
    let settled = false

    const stream = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        callback()
      },
      final(callback) {
        callback()
        if (!settled) {
          settled = true
          resolve(Buffer.concat(chunks).toString('utf8'))
        }
      },
    })

    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={url}>
          <App helmetContext={helmetContext} />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady() {
          pipe(stream)
        },
        onShellError(error) {
          if (!settled) {
            settled = true
            reject(error)
          }
        },
        onError(error) {
          if (!settled) {
            settled = true
            reject(error)
          }
        },
      }
    )
  })

  return {
    html,
    helmet: helmetContext.helmet,
  }
}
