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
    }
  }, [])

  const moveHorizontal = useCallback((direction) => {
    if (!focusedContainer || !activeId) return

    const items = itemsRef.current.get(focusedContainer)
    if (!items || items.length === 0) return

    const currentIndex = items.findIndex(item => item.id === activeId)
    if (currentIndex === -1) return

    let newIndex
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    } else {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    }

    focusItem(items[newIndex].id)
  }, [focusedContainer, activeId, focusItem])

  const moveVertical = useCallback((direction) => {
    if (!focusedContainer || !activeId) return

    const items = itemsRef.current.get(focusedContainer)
    if (!items || items.length === 0) return

    const currentIndex = items.findIndex(item => item.id === activeId)
    if (currentIndex === -1) return

    // For vertical movement, we can implement grid-like navigation
    // For now, treat as linear for simplicity
    let newIndex
    if (direction === 'up') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    } else {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    }

    focusItem(items[newIndex].id)
  }, [focusedContainer, activeId, focusItem])

  const activateItem = useCallback(() => {
    if (!activeId) return

    const element = elementsRef.current.get(activeId)
    if (element) {
      // Trigger click or enter event
      element.click()
    }
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
      setFocusContainer,
      moveHorizontal,
      moveVertical,
      activateItem
    }}>
      {children}
    </FocusContext.Provider>
  )
}

export const useRovingFocus = (containerId, items, options = {}) => {
  const { 
    activeId, 
    focusedContainer,
    registerContainer, 
    unregisterContainer,
    registerItem,
    unregisterItem
  } = useFocusContext()
  const { autoFocus = false } = options

  useEffect(() => {
    registerContainer(containerId, items)
    return () => unregisterContainer(containerId)
  }, [containerId, items, registerContainer, unregisterContainer])

  const getItemProps = useCallback((item, index) => {
    const isActive = activeId === item.id
    const isInActiveContainer = focusedContainer === containerId

    return {
      ref: (element) => {
        if (element) {
          registerItem(item.id, element)
        } else {
          unregisterItem(item.id)
        }
      },
      tabIndex: isActive && isInActiveContainer ? 0 : -1,
      'data-focus-item': true,
      'data-item-id': item.id,
      'aria-selected': isActive,
      onFocus: () => {
        // When an item receives focus, update the active state
        if (focusedContainer !== containerId) {
          // Switched to this container
        }
      }
    }
  }, [activeId, focusedContainer, containerId, registerItem, unregisterItem])

  return { getItemProps, isActive: focusedContainer === containerId }
}