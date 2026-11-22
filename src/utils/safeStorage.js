const memoryStorage = new Map()
const failedWriteKeys = new Set()

const getStorage = (kind) => {
  if (typeof window === 'undefined') return null
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    return null
  }
}

const memoryKey = (kind, key) => `${kind}:${key}`

export const safeGetItem = (key, kind = 'local') => {
  const mKey = memoryKey(kind, key)
  if (failedWriteKeys.has(mKey) && memoryStorage.has(mKey)) {
    return memoryStorage.get(mKey)
  }

  const storage = getStorage(kind)
  if (storage) {
    try {
      const value = storage.getItem(key)
      if (value !== null) return value
    } catch {
      // Fall through to in-memory fallback when storage access is blocked.
    }
  }
  return memoryStorage.has(mKey) ? memoryStorage.get(mKey) : null
}

export const safeSetItem = (key, value, kind = 'local') => {
  const stringValue = String(value)
  const mKey = memoryKey(kind, key)
  memoryStorage.set(mKey, stringValue)

  const storage = getStorage(kind)
  if (!storage) {
    failedWriteKeys.add(mKey)
    return false
  }
  try {
    storage.setItem(key, stringValue)
    failedWriteKeys.delete(mKey)
    return true
  } catch {
    failedWriteKeys.add(mKey)
    return false
  }
}
