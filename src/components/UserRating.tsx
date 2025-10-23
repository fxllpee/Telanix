import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRatingsStore } from '@/stores/ratings-store'
import { toast } from 'sonner'

interface UserRatingProps {
  movieId: number
  movieTitle: string
  className?: string
  showLabel?: boolean
}

export const UserRating = ({ 
  movieId, 
  movieTitle, 
  className,
  showLabel = true 
}: UserRatingProps) => {
  const { getRating, setRating, removeRating } = useRatingsStore()
  const currentRating = getRating(movieId)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  const handleRatingClick = (rating: number) => {
    if (currentRating === rating) {
      // Se clicar na mesma estrela, remove a avaliação
      removeRating(movieId)
      toast.success('Avaliação removida', {
        description: `Sua avaliação para "${movieTitle}" foi removida`,
      })
    } else {
      setRating(movieId, rating)
      toast.success('Avaliação salva!', {
        description: `Você avaliou "${movieTitle}" com ${rating} estrela${rating > 1 ? 's' : ''}`,
      })
    }
  }

  const displayRating = hoveredRating || currentRating || 0

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {showLabel && (
        <p className="text-sm font-medium text-secondary">
          Sua Avaliação
        </p>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none focus:ring-2 focus:ring-accent-1/50 rounded"
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
          >
            <Star
              className={cn(
                'w-6 h-6 transition-colors duration-150',
                star <= displayRating
                  ? 'text-accent-1 fill-accent-1'
                  : 'text-secondary/30 hover:text-accent-1/50'
              )}
            />
          </button>
        ))}
      </div>
      {currentRating && (
        <p className="text-xs text-secondary">
          {currentRating}/5 estrelas
        </p>
      )}
    </div>
  )
}
