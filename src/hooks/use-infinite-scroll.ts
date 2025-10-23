import { useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  loading: boolean
  hasNextPage: boolean
  onLoadMore: () => void
  root?: Element | null
  rootMargin?: string
}

export const useInfiniteScroll = ({
  loading,
  hasNextPage,
  onLoadMore,
  root = null,
  rootMargin = '0px',
}: UseInfiniteScrollOptions) => {
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            onLoadMore()
          }
        },
        { root, rootMargin },
      )

      if (node) observer.current.observe(node)
    },
    [loading, hasNextPage, onLoadMore, root, rootMargin],
  )

  return { lastElementRef }
}
