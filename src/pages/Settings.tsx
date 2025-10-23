import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Moon, 
  Monitor, 
  Bell, 
  Play, 
  ChevronRight,
  RotateCcw
} from 'lucide-react'
import { useSettingsStore, Theme } from '@/stores/settings-store'
import { useLikesStore } from '@/stores/likes-store'
import { useAuthStore } from '@/stores/auth-store'
import { clearApiCache } from '@/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { 
    theme, 
    setTheme, 
    notifications,
    setNotifications,
    autoplay,
    setAutoplay,
    resetSettings 
  } = useSettingsStore()
  
  const { likedMovieIds } = useLikesStore()
  const [showResetDialog, setShowResetDialog] = useState(false)

  const themeIcons = {
    dark: Moon,
    system: Monitor,
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as Theme)
    const themeName = newTheme === 'dark' ? 'Escuro' : 'Sistema'
    toast.success(`Tema alterado para ${themeName}`, {
      description: 'As cores do site foram atualizadas',
    })
  }


  const handleNotificationToggle = (type: 'enabled' | 'newReleases' | 'recommendations', value: boolean) => {
    setNotifications({ [type]: value })
    
    const messages = {
      enabled: value ? 'Notificações ativadas' : 'Notificações desativadas',
      newReleases: value ? 'Notificações de novos lançamentos ativadas' : 'Notificações de novos lançamentos desativadas',
      recommendations: value ? 'Notificações de recomendações ativadas' : 'Notificações de recomendações desativadas',
    }
    
    toast.success(messages[type], {
      description: value ? 'Você receberá notificações' : 'Você não receberá mais notificações',
    })
  }

  const handleAutoplayToggle = (value: boolean) => {
    setAutoplay(value)
    toast.success(value ? 'Reprodução automática ativada' : 'Reprodução automática desativada', {
      description: value ? 'Trailers iniciarão automaticamente' : 'Você precisará iniciar trailers manualmente',
    })
  }

  const handleResetSettings = () => {
    resetSettings()
    setShowResetDialog(false)
    toast.success('Configurações restauradas para o padrão', {
      description: 'Todas as suas preferências foram redefinidas',
    })
  }

  const handleClearCache = () => {
    clearApiCache()
    toast.success('Cache da API limpo', {
      description: 'Os dados serão recarregados na próxima consulta',
    })
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-accent-1 mb-2">Configurações</h1>
        <p className="text-secondary">Personalize sua experiência no Telanix</p>
      </div>

      {/* Aparência */}
      <Card className="mb-6 bg-card border-accent-1/20 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' && <Moon className="w-5 h-5 text-accent-1" />}
            {theme === 'system' && <Monitor className="w-5 h-5 text-accent-1" />}
            Aparência
          </CardTitle>
          <CardDescription>Escolha o tema visual do aplicativo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {(['dark', 'system'] as Theme[]).map((themeOption) => {
              const Icon = themeIcons[themeOption]
              return (
                <Button
                  key={themeOption}
                  variant={theme === themeOption ? 'default' : 'outline'}
                  className={`flex flex-col items-center gap-2 h-auto py-4 ${
                    theme === themeOption 
                      ? 'bg-accent-1 text-primary-foreground hover:bg-accent-1/90' 
                      : 'border-accent-1/20 hover:border-accent-1'
                  }`}
                  onClick={() => handleThemeChange(themeOption)}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">
                    {themeOption === 'dark' ? 'Escuro' : 'Sistema'}
                  </span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>


      {/* Notificações */}
      <Card className="mb-6 bg-card border-accent-1/20 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent-1" />
            Notificações
          </CardTitle>
          <CardDescription>Gerencie suas preferências de notificação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-enabled">Ativar notificações</Label>
              <p className="text-sm text-muted-foreground">
                Receber todas as notificações
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={notifications.enabled}
              onCheckedChange={(checked) => handleNotificationToggle('enabled', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-releases">Novos lançamentos</Label>
              <p className="text-sm text-muted-foreground">
                Notificar sobre novos filmes
              </p>
            </div>
            <Switch
              id="new-releases"
              checked={notifications.newReleases}
              onCheckedChange={(checked) => handleNotificationToggle('newReleases', checked)}
              disabled={!notifications.enabled}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="recommendations">Recomendações</Label>
              <p className="text-sm text-muted-foreground">
                Receber sugestões personalizadas
              </p>
            </div>
            <Switch
              id="recommendations"
              checked={notifications.recommendations}
              onCheckedChange={(checked) => handleNotificationToggle('recommendations', checked)}
              disabled={!notifications.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reprodução */}
      <Card className="mb-6 bg-card border-accent-1/20 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-accent-1" />
            Reprodução
          </CardTitle>
          <CardDescription>Personalize a experiência de reprodução</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoplay">Reprodução automática</Label>
              <p className="text-sm text-muted-foreground">
                Iniciar trailers automaticamente
              </p>
            </div>
            <Switch
              id="autoplay"
              checked={autoplay}
              onCheckedChange={handleAutoplayToggle}
            />
          </div>
        </CardContent>
      </Card>


      {/* Informações da Conta */}
      {user && (
        <Card className="mb-6 bg-card border-accent-1/20 shadow-sm">
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Filmes curtidos</p>
                <p className="text-sm text-muted-foreground">
                  {likedMovieIds.length} {likedMovieIds.length === 1 ? 'filme' : 'filmes'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/perfil')}
                className="border-accent-1/20"
              >
                Ver perfil
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <Separator />
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                logout()
                toast.success('Você saiu da sua conta')
                navigate('/')
              }}
            >
              Sair da conta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reset e Ações */}
      <Card className="mb-6 bg-card border-accent-1/20 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-accent-1" />
            Redefinir
          </CardTitle>
          <CardDescription>Restaurar configurações padrão</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full border-accent-1/20"
            onClick={handleClearCache}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar Cache da API
          </Button>
          
          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-accent-1/20">
                Restaurar configurações padrão
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-accent-1/20">
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso irá restaurar todas as configurações para os valores padrão. 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-accent-1/20">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleResetSettings}
                  className="bg-accent-1 text-primary-foreground hover:bg-accent-1/90"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Telanix v1.0.0</p>
        <p className="mt-1">Feito com ❤️ para cinéfilos</p>
      </div>
    </div>
  )
}

export default SettingsPage
