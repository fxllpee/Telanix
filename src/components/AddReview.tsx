import { useState } from 'react'
import { Star, AlertTriangle, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReviewsStore } from '@/stores/reviews-store'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface AddReviewProps {
  movieId: number
  movieTitle: string
  onReviewAdded?: () => void
}

export const AddReview = ({ movieId, movieTitle, onReviewAdded }: AddReviewProps) => {
  const { user } = useAuthStore()
  const { addReview, getUserReviewForMovie, updateReview } = useReviewsStore()
  
  const existingReview = user ? getUserReviewForMovie(movieId, user.id) : null
  
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [title, setTitle] = useState(existingReview?.title || '')
  const [content, setContent] = useState(existingReview?.content || '')
  const [spoiler, setSpoiler] = useState(existingReview?.spoiler || false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Você precisa estar logado', {
        description: 'Faça login para deixar uma avaliação',
      })
      return
    }

    if (rating === 0) {
      toast.error('Adicione uma avaliação', {
        description: 'Selecione quantas estrelas você daria ao filme',
      })
      return
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Preencha todos os campos', {
        description: 'Título e comentário são obrigatórios',
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (existingReview) {
        updateReview(existingReview.id, {
          rating,
          title: title.trim(),
          content: content.trim(),
          spoiler,
        })
        toast.success('Review atualizada!', {
          description: 'Sua avaliação foi atualizada com sucesso',
        })
      } else {
        addReview({
          movieId,
          userId: user.id,
          userName: user.name || 'Usuário Anônimo',
          userAvatar: user.avatarUrl || '',
          rating,
          title: title.trim(),
          content: content.trim(),
          spoiler,
        })
        toast.success('Review publicada!', {
          description: `Sua avaliação de "${movieTitle}" foi publicada`,
        })
      }

      // Reset form if it's a new review
      if (!existingReview) {
        setRating(0)
        setTitle('')
        setContent('')
        setSpoiler(false)
      }

      onReviewAdded?.()
    } catch (error) {
      toast.error('Erro ao publicar review', {
        description: 'Tente novamente mais tarde',
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || rating

  if (!user) {
    return (
      <Card className="bg-card border-accent-1/20">
        <CardContent className="py-8 text-center">
          <p className="text-secondary mb-4">
            Faça login para deixar uma avaliação
          </p>
          <Button variant="outline" className="border-accent-1 text-accent-1">
            Fazer Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-accent-1/20">
      <CardHeader>
        <CardTitle className="text-accent-1">
          {existingReview ? 'Editar Sua Review' : 'Escrever Review'}
        </CardTitle>
        <CardDescription>
          Compartilhe sua opinião sobre "{movieTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sua Avaliação *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none focus:ring-2 focus:ring-accent-1/50 rounded transition-transform hover:scale-110"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  <Star
                    className={cn(
                      'w-8 h-8 transition-colors duration-150',
                      star <= displayRating
                        ? 'text-accent-1 fill-accent-1'
                        : 'text-secondary/30 hover:text-accent-1/50'
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-secondary self-center">
                  {rating}/5 estrelas
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title" className="text-sm font-medium">
              Título da Review *
            </Label>
            <Input
              id="review-title"
              type="text"
              placeholder="Ex: Um filme incrível!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="bg-background border-accent-1/20"
            />
            <p className="text-xs text-secondary">
              {title.length}/100 caracteres
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="review-content" className="text-sm font-medium">
              Seu Comentário *
            </Label>
            <Textarea
              id="review-content"
              placeholder="Escreva sua opinião sobre o filme..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              rows={6}
              className="bg-background border-accent-1/20 resize-none"
            />
            <p className="text-xs text-secondary">
              {content.length}/1000 caracteres
            </p>
          </div>

          {/* Spoiler Alert */}
          <div className="flex items-center justify-between rounded-lg border border-accent-1/20 p-4 bg-background/50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <Label htmlFor="spoiler-switch" className="text-sm font-medium cursor-pointer">
                  Contém Spoilers
                </Label>
                <p className="text-xs text-secondary">
                  Marque se sua review revela partes importantes do filme
                </p>
              </div>
            </div>
            <Switch
              id="spoiler-switch"
              checked={spoiler}
              onCheckedChange={setSpoiler}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || !title.trim() || !content.trim()}
            className="w-full bg-accent-1 text-primary-foreground hover:bg-accent-1/90"
          >
            {isSubmitting ? (
              'Publicando...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {existingReview ? 'Atualizar Review' : 'Publicar Review'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
