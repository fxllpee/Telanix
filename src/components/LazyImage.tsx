import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholderSrc?: string
  onLoad?: () => void
  onError?: () => void
}

export const LazyImage = ({
  src,
  alt,
  className,
  placeholderSrc = '/placeholder.svg',
  onLoad,
  onError,
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.src = src

            img.onload = () => {
              setImageSrc(src)
              setIsLoading(false)
              onLoad?.()
            }

            img.onerror = () => {
              setIsError(true)
              setIsLoading(false)
              onError?.()
            }

            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px', // Começar a carregar 200px antes de entrar na viewport
        threshold: 0.01,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [src, onLoad, onError])

  return (
    <div className="relative overflow-hidden">
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-all duration-300',
          isLoading && 'blur-sm scale-105',
          !isLoading && 'blur-0 scale-100',
          isError && 'opacity-50',
          className
        )}
        loading="lazy"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-1/10 to-accent-1/5 animate-pulse" />
      )}
    </div>
  )
}
