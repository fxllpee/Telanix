import { useState } from 'react'
import { Star, ThumbsUp, AlertTriangle, Trash2, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReviewsStore, Review } from '@/stores/reviews-store'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface ReviewListProps {
  movieId: number
  onEditReview?: () => void
}

export const ReviewList = ({ movieId, onEditReview }: ReviewListProps) => {
  const { user } = useAuthStore()
  const { getReviewsByMovie, markAsHelpful, deleteReview } = useReviewsStore()
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(new Set())
  
  const reviews = getReviewsByMovie(movieId)

  const handleMarkHelpful = (reviewId: string) => {
    markAsHelpful(reviewId)
    toast.success('Obrigado pelo feedback!', {
      description: 'Você marcou esta review como útil',
    })
  }

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId)
    toast.success('Review excluída', {
      description: 'Sua review foi removida',
    })
  }

  const toggleSpoiler = (reviewId: string) => {
    setRevealedSpoilers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return 'Há menos de 1 hora'
    if (diffInHours < 24) return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    if (diffInDays < 7) return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`
    if (diffInDays < 30) return `Há ${Math.floor(diffInDays / 7)} semana${Math.floor(diffInDays / 7) > 1 ? 's' : ''}`
    return date.toLocaleDateString('pt-BR')
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating ? 'text-accent-1 fill-accent-1' : 'text-secondary/30'
        )}
      />
    ))
  }

  if (reviews.length === 0) {
    return (
      <Card className="bg-card border-accent-1/20">
        <CardContent className="py-12 text-center">
          <p className="text-secondary text-lg mb-2">
            Ainda não há reviews para este filme
          </p>
          <p className="text-secondary text-sm">
            Seja o primeiro a compartilhar sua opinião!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: Review) => {
        const isOwnReview = user && review.userId === user.id
        const isSpoilerRevealed = revealedSpoilers.has(review.id)

        return (
          <Card key={review.id} className="bg-card border-accent-1/20 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12 border-2 border-accent-1/20">
                  <AvatarImage src={review.userAvatar} alt={review.userName} />
                  <AvatarFallback className="bg-accent-1/10 text-accent-1">
                    {review.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold text-foreground">
                      {review.userName}
                    </h4>
                    {isOwnReview && (
                      <Badge variant="outline" className="border-accent-1 text-accent-1 text-xs">
                        Você
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-secondary">
                      {review.rating}/5
                    </span>
                    <span className="text-secondary">•</span>
                    <span className="text-xs text-secondary">
                      {formatDate(review.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {isOwnReview && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onEditReview}
                      className="text-secondary hover:text-accent-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-secondary hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-accent-1/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Review?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Sua review será permanentemente removida.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">
                  {review.title}
                </h3>

                {review.spoiler && (
                  <div className="flex items-center gap-2 text-yellow-500 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Contém Spoilers</span>
                  </div>
                )}

                {review.spoiler && !isSpoilerRevealed ? (
                  <div className="bg-accent-1/5 border border-accent-1/20 rounded-lg p-6 text-center">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-secondary mb-3">
                      Esta review contém spoilers
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSpoiler(review.id)}
                      className="border-accent-1 text-accent-1 hover:bg-accent-1/10"
                    >
                      Revelar Spoilers
                    </Button>
                  </div>
                ) : (
                  <p className="text-secondary leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {review.content}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-accent-1/10 flex items-center gap-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleMarkHelpful(review.id)}
                  className="text-secondary hover:text-accent-1 gap-2"
                  disabled={isOwnReview}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">
                    Útil ({review.helpful})
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
