import { usePWA } from '@/hooks/use-pwa'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export const InstallPWA = () => {
  const { isInstallable, installApp } = usePWA()

  if (!isInstallable) return null

  return (
    <Button
      onClick={installApp}
      className="fixed bottom-4 right-4 z-50 bg-accent-1 hover:bg-accent-1/80"
    >
      <Download className="w-4 h-4 mr-2" />
      Instalar App
    </Button>
  )
}
