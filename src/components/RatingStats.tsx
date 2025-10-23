import { Star, TrendingUp, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStatsProps {
  tmdbRating: number
  userRating?: number | null
  totalUserRatings?: number
  className?: string
}

export const RatingStats = ({ 
  tmdbRating, 
  userRating, 
  totalUserRatings = 0,
  className 
}: RatingStatsProps) => {
  const renderStars = (rating: number, maxStars: number = 5) => {
    return Array.from({ length: maxStars }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < Math.floor(rating)
            ? 'text-accent-1 fill-accent-1'
            : 'text-secondary/30'
        )}
      />
    ))
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Avaliação TMDB */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-accent-1 fill-accent-1" />
          <span className="font-bold text-lg">{tmdbRating.toFixed(1)}</span>
          <span className="text-secondary text-sm">/10</span>
        </div>
        <div className="flex gap-1">
          {renderStars((tmdbRating / 10) * 5)}
        </div>
        <span className="text-secondary text-sm">TMDB</span>
      </div>

      {/* Avaliação do Usuário */}
      {userRating && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-400 fill-blue-400" />
            <span className="font-bold text-lg">{userRating}</span>
            <span className="text-secondary text-sm">/5</span>
          </div>
          <div className="flex gap-1">
            {renderStars(userRating)}
          </div>
          <span className="text-secondary text-sm">Sua avaliação</span>
        </div>
      )}

      {/* Estatísticas Gerais */}
      {totalUserRatings > 0 && (
        <div className="flex items-center gap-4 pt-2 border-t border-accent-1/10">
          <div className="flex items-center gap-2 text-secondary">
            <Users className="w-4 h-4" />
            <span className="text-sm">{totalUserRatings} avaliações</span>
          </div>
          <div className="flex items-center gap-2 text-secondary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">
              {userRating && userRating >= 4 ? 'Ótima escolha!' : 
               userRating && userRating >= 3 ? 'Boa opção' : 
               userRating && userRating >= 2 ? 'Razoável' : 
               userRating && userRating >= 1 ? 'Não gostou' : 'Ainda não avaliado'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
