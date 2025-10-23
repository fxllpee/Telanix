import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { getWatchProviders, getImageUrl } from '@/services/api'
import { WatchProviderDetails, WatchProvider } from '@/types'
import { Skeleton } from './ui/skeleton'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'

interface WatchProvidersButtonProps extends ButtonProps {
  movieId: number
  movieTitle: string
}

const ProviderSection = ({
  title,
  providers,
}: {
  title: string
  providers?: WatchProvider[]
}) => {
  if (!providers || providers.length === 0) return null
  return (
    <div>
      <h3 className="font-semibold text-lg mb-3 text-secondary">{title}</h3>
      <div className="flex flex-wrap gap-4">
        {providers.map((provider) => (
          <div
            key={provider.provider_id}
            className="flex flex-col items-center gap-2"
          >
            <img
              src={getImageUrl(provider.logo_path, 'w300')}
              alt={provider.provider_name}
              className="w-12 h-12 rounded-md object-cover"
            />
            <span className="text-xs text-center max-w-16 truncate">
              {provider.provider_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const WatchProvidersContent = ({
  movieId,
  movieTitle,
}: {
  movieId: number
  movieTitle: string
}) => {
  const [providers, setProviders] = useState<WatchProviderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getWatchProviders(movieId)
        setProviders(data.results.BR || null)
      } catch (err) {
        setError('Não foi possível carregar as informações. Tente novamente.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviders()
  }, [movieId])

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-accent-1">Onde Assistir</DialogTitle>
        <DialogDescription>{movieTitle}</DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-md" />
              <Skeleton className="w-12 h-12 rounded-md" />
              <Skeleton className="w-12 h-12 rounded-md" />
            </div>
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {!isLoading && !error && providers && (
          <div className="space-y-6">
            <ProviderSection title="Streaming" providers={providers.flatrate} />
            <ProviderSection title="Alugar" providers={providers.rent} />
            <ProviderSection title="Comprar" providers={providers.buy} />
            <Separator className="my-4 bg-border" />
            <a
              href={providers.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-accent-1 transition-colors"
            >
              Opções fornecidas por JustWatch
            </a>
          </div>
        )}
        {!isLoading && !error && !providers && (
          <p className="text-secondary">
            Não disponível em plataformas de streaming no momento.
          </p>
        )}
      </div>
    </>
  )
}

export const WatchProvidersButton = ({
  movieId,
  movieTitle,
  className,
  ...props
}: WatchProvidersButtonProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(className)}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(true)
          }}
          {...props}
        >
          <Play className="mr-2 h-4 w-4" /> Onde Assistir
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-accent-1/20 text-foreground">
        {open && (
          <WatchProvidersContent movieId={movieId} movieTitle={movieTitle} />
        )}
      </DialogContent>
    </Dialog>
  )
}
