import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react'

const FocusContext = createContext()

export const useFocusContext = () => {
  const context = useContext(FocusContext)
  if (!context) {
    throw new Error('useFocusContext must be used within FocusProvider')
  }
  return context
}

export const FocusProvider = ({ children }) => {
  const [activeId, setActiveId] = useState(null)
  const [focusedContainer, setFocusedContainer] = useState(null)
  const itemsRef = useRef(new Map()) // Map of containerId -> items[]
  const elementsRef = useRef(new Map()) // Map of itemId -> element

  const registerContainer = useCallback((containerId, items) => {
    itemsRef.current.set(containerId, items)
  }, [])

  const unregisterContainer = useCallback((containerId) => {
    itemsRef.current.delete(containerId)
    setFocusedContainer((prev) => (prev === containerId ? null : prev))
  }, [])

  const registerItem = useCallback((itemId, element) => {
    elementsRef.current.set(itemId, element)
  }, [])

  const unregisterItem = useCallback((itemId) => {
    elementsRef.current.delete(itemId)
  }, [])

  const focusItem = useCallback((itemId) => {
    const element = elementsRef.current.get(itemId)
    if (element) {
      element.focus()
      setActiveId(itemId)
      return true
    }
    return false
  }, [])

  const syncFocus = useCallback((containerId, itemId) => {
    setFocusedContainer(containerId)
    setActiveId(itemId)
  }, [])

  const moveHorizontal = useCallback((direction) => {
    if (!focusedContainer || !activeId) return false

    const items = itemsRef.current.get(focusedContainer)
    if (!items || items.length === 0) return false

    const currentIndex = items.findIndex(item => item.id === activeId)
    if (currentIndex === -1) return false

    let newIndex
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    } else {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    }

    return focusItem(items[newIndex].id)
  }, [focusedContainer, activeId, focusItem])

  const moveVertical = useCallback((direction) => {
    if (!focusedContainer || !activeId) return false

    const items = itemsRef.current.get(focusedContainer)
    if (!items || items.length === 0) return false

    const currentIndex = items.findIndex(item => item.id === activeId)
    if (currentIndex === -1) return false

    // For vertical movement, treat as linear list navigation
    let newIndex
    if (direction === 'up') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    } else {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    }

    return focusItem(items[newIndex].id)
  }, [focusedContainer, activeId, focusItem])

  const activateItem = useCallback(() => {
    if (!activeId) return false

    const element = elementsRef.current.get(activeId)
    if (element) {
      element.click()
      return true
    }
    return false
  }, [activeId])

  const setFocusContainer = useCallback((containerId, itemId = null) => {
    setFocusedContainer(containerId)
    if (itemId) {
      focusItem(itemId)
    } else {
      const items = itemsRef.current.get(containerId)
      if (items && items.length > 0) {
        focusItem(items[0].id)
      }
    }
  }, [focusItem])

  return (
    <FocusContext.Provider value={{
      activeId,
      focusedContainer,
      registerContainer,
      unregisterContainer,
      registerItem,
      unregisterItem,
      focusItem,
      syncFocus,
      setFocusContainer,
      moveHorizontal,
      moveVertical,
      activateItem
    }}>
      {children}
    </FocusContext.Provider>
  )
}

export const useRovingFocus = (containerId, items) => {
  const {
    focusedContainer,
    registerContainer,
    unregisterContainer,
    registerItem,
    unregisterItem,
    syncFocus
  } = useFocusContext()
  useEffect(() => {
    registerContainer(containerId, items)
    return () => unregisterContainer(containerId)
  }, [containerId, items, registerContainer, unregisterContainer])

  const getItemProps = useCallback((item) => ({
    ref: (element) => {
      if (element) {
        registerItem(item.id, element)
      } else {
        unregisterItem(item.id)
      }
    },
    'data-focus-item': true,
    'data-item-id': item.id,
    onFocus: () => {
      syncFocus(containerId, item.id)
    }
  }), [containerId, registerItem, unregisterItem, syncFocus])

  return { getItemProps, isActive: focusedContainer === containerId }
}
