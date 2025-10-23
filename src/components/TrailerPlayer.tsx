import { useState } from 'react'
import { PlayCircle, X, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

interface TrailerPlayerProps {
  trailerKey: string
  movieTitle: string
  className?: string
  autoplay?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const TrailerPlayer = ({ 
  trailerKey, 
  movieTitle, 
  className,
  autoplay = true,
  size = 'lg'
}: TrailerPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-3 sm:px-6 py-3 sm:py-5 text-sm sm:text-base',
  }

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe')
    if (!iframe) return

    if (!document.fullscreenElement) {
      iframe.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={cn(
            'rounded-full bg-accent-1 text-primary-foreground font-semibold transition-all hover:bg-accent-1/80 hover:scale-105',
            sizeClasses[size],
            className
          )}
        >
          <PlayCircle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
          <span className="hidden sm:inline">Ver Trailer</span>
          <span className="sm:hidden">Trailer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-accent-1/20 p-0 max-w-5xl w-[95vw] overflow-hidden">
        <div className="relative">
          {/* Header com controles */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-sm sm:text-base truncate flex-1">
              {movieTitle} - Trailer
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0 hidden sm:flex"
                onClick={handleFullscreen}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Player */}
          <AspectRatio ratio={16 / 9}>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=${autoplay ? 1 : 0}&mute=${isMuted ? 1 : 0}&vq=hd1080&cc_load_policy=1&cc_lang_pref=pt&rel=0&modestbranding=1`}
              title={`${movieTitle} - Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            ></iframe>
          </AspectRatio>

          {/* Footer com informações */}
          <div className="bg-gradient-to-t from-black/80 to-transparent p-4 absolute bottom-0 left-0 right-0">
            <p className="text-white/80 text-xs sm:text-sm">
              Trailer oficial em HD • Legendas disponíveis
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
