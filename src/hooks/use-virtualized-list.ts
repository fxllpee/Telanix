import { useState, useEffect, useRef } from 'react'

interface VirtualizedListOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export const useVirtualizedList = <T,>(
  items: T[],
  options: VirtualizedListOptions
) => {
  const { itemHeight, containerHeight, overscan = 5 } = options
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleEnd = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(visibleStart, visibleEnd + 1).map((item, index) => ({
    item,
    index: visibleStart + index
  }))

  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollTop(container.scrollTop)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY
  }
}
