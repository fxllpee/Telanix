// COMPONENTE HEADER - CABEÇALHO PRINCIPAL DA APLICAÇÃO
// Este componente inclui logo, navegação, busca e sistema de autenticação

// IMPORTAÇÕES: Hooks do React para gerenciamento de estado
// useState = hook para gerenciar estado local
import { useState } from 'react'

// IMPORTAÇÕES: Componentes de navegação do React Router
// Link = componente para links de navegação
// NavLink = componente para links de navegação com estado ativo
// useNavigate = hook para navegação programática
import { Link, NavLink, useNavigate } from 'react-router-dom'

// IMPORTAÇÕES: Hooks customizados
// useTranslation = hook para tradução/internacionalização
import { useTranslation } from '@/hooks/use-translation'
// useScroll = hook para detectar scroll da página
import { useScroll } from '@/hooks/use-scroll'
// useValidation = hook para validação de formulários
import { useValidation } from '@/hooks/use-validation'

// IMPORTAÇÕES: Ícones da biblioteca Lucide React
// Search = ícone de busca
// User = ícone de usuário
import { Search, User } from 'lucide-react'

// IMPORTAÇÕES: Utilitários
// cn = função para combinar classes CSS
import { cn } from '@/lib/utils'

// IMPORTAÇÕES: Componentes UI (shadcn/ui)
// DropdownMenu = componentes para menu dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// Dialog = componentes para modais/diálogos
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
// Button = componente de botão
import { Button } from './ui/button'
// Input = componente de input
import { Input } from './ui/input'

// IMPORTAÇÕES: Stores (Zustand)
// useAuthStore = store para gerenciamento de autenticação
import { useAuthStore } from '@/stores/auth-store'

// COMPONENTE HEADER: Função principal do cabeçalho
export const Header = () => {
  // HOOKS: Hooks para funcionalidades específicas
  // useScroll = detecta se a página foi rolada (threshold de 50px)
  const scrolled = useScroll(50)
  // useNavigate = hook para navegação programática
  const navigate = useNavigate()
  // useTranslation = hook para tradução de textos
  const { t } = useTranslation()

  // ESTADO: Estados para controle de modais de autenticação
  // useState = hook para gerenciar estado local
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)      // Modal de login aberto/fechado
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false) // Modal de registro aberto/fechado

  // STORE: Store de autenticação (Zustand)
  // useAuthStore = store global para gerenciamento de autenticação
  const { user, login, register, logout, isAuthenticated } = useAuthStore()
  // isUserLoggedIn = verifica se o usuário está logado
  const isUserLoggedIn = isAuthenticated()

  // ESTADO: Estados para formulários de autenticação
  const [email, setEmail] = useState('')        // Email do usuário
  const [password, setPassword] = useState('')  // Senha do usuário
  const [name, setName] = useState('')          // Nome do usuário
  const [isSubmitting, setIsSubmitting] = useState(false) // Estado de envio do formulário
  const [error, setError] = useState('')        // Mensagem de erro

  // HOOK: useValidation para validação de formulários
  const { validateLogin, validateRegister } = useValidation()

  // FUNÇÃO: Manipula clique no logo
  const handleLogoClick = () => {
    // Se estiver na página inicial, rola para o topo
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Senão, navega para a página inicial
      navigate('/')
    }
  }

  // FUNÇÃO: Define classes CSS para links de navegação
  // navLinkClasses = função que retorna classes CSS baseadas no estado ativo
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      'font-semibold text-secondary transition-colors duration-300 hover:text-accent-1',  // Classes base
      isActive && 'text-accent-1',  // Classe adicional se o link estiver ativo
    )

  // RETURN: JSX que será renderizado
  return (
    <>
      {/* HEADER: Elemento semântico HTML para cabeçalho */}
      <header
        // CLASSES: Classes CSS condicionais baseadas no scroll
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] h-20 transition-all duration-300',  // Classes base
          // Classe condicional: glassmorphism se rolado, transparente se não
          scrolled ? 'glassmorphism-dark' : 'bg-transparent',
        )}
      >
        {/* CONTAINER: Container principal do cabeçalho */}
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          
          {/* LOGO E NAVEGAÇÃO: Seção esquerda do cabeçalho */}
          <div className="flex items-center gap-8">
            {/* BOTÃO LOGO: Botão clicável do logo */}
            <button
              onClick={handleLogoClick}  // Função executada ao clicar
              className="text-2xl font-bold text-accent-1 transition-all hover:opacity-80"
            >
              TelaNix
            </button>
            
            {/* NAVEGAÇÃO: Menu de navegação (visível apenas em desktop) */}
            <nav className="hidden md:flex items-center gap-6">
              {/* LINK: Descobrir */}
              <NavLink to="/descobrir" className={navLinkClasses}>
                {t('nav.discover')}
              </NavLink>
              {/* COMENTÁRIO: Recomendações foi removido do sistema */}
              {/* Recomendações removido */}
              {/* LINK: Quem somos */}
              <NavLink to="/quem-somos" className={navLinkClasses}>
                {t('nav.about')}
              </NavLink>
            </nav>
          </div>

          {/* AÇÕES: Seção direita do cabeçalho */}
          <div className="flex items-center gap-6">
            {/* LINK: Busca */}
            <Link to="/buscar" className="group">
              <Search className="h-6 w-6 text-foreground transition-colors duration-300 group-hover:text-accent-1 group-hover:animate-pulse" />
            </Link>

            {/* CONDIÇÃO: Menu do usuário baseado no estado de login */}
            {isUserLoggedIn ? (
              // DROPDOWN: Menu dropdown para usuário logado
              <DropdownMenu>
                {/* TRIGGER: Botão que abre o dropdown */}
                <DropdownMenuTrigger>
                  <User className="h-6 w-6 text-foreground transition-colors duration-300 hover:text-accent-1 hover:animate-pulse" />
                </DropdownMenuTrigger>
                
                {/* CONTENT: Conteúdo do dropdown */}
                <DropdownMenuContent className="bg-card border-accent-1/20">
                  {/* LABEL: Título do menu */}
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  
                  {/* SEPARATOR: Separador visual */}
                  <DropdownMenuSeparator />
                  
                  {/* ITEM: Perfil */}
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    {t('nav.profile')}
                  </DropdownMenuItem>
                  
                  {/* ITEM: Minha lista */}
                  <DropdownMenuItem onClick={() => navigate('/perfil#minha-lista')}>
                    {t('nav.myList')}
                  </DropdownMenuItem>
                  
                  {/* ITEM: Configurações */}
                  <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                    {t('nav.settings')}
                  </DropdownMenuItem>
                  
                  {/* SEPARATOR: Separador visual */}
                  <DropdownMenuSeparator />
                  
                  {/* ITEM: Logout */}
                  <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // BOTÃO: Botão para abrir modal de login (usuário não logado)
              <button onClick={() => setIsLoginModalOpen(true)}>
                <User className="h-6 w-6 text-foreground transition-colors duration-300 hover:text-accent-1 hover:animate-pulse" />
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* MODAL DE LOGIN: Diálogo para login do usuário */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        {/* CONTENT: Conteúdo do modal */}
        <DialogContent className="bg-card border-accent-1/20 text-foreground">
          {/* HEADER: Cabeçalho do modal */}
          <DialogHeader>
            <DialogTitle className="text-accent-1">
              Login / Cadastro
            </DialogTitle>
            <DialogDescription>
              Acesse sua conta para uma experiência personalizada.
            </DialogDescription>
          </DialogHeader>
          
          {/* FORM: Formulário de login */}
          <div className="grid gap-4 py-4">
            {/* ERRO: Exibe mensagem de erro se houver */}
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}
            
            {/* INPUT: Campo de email */}
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-accent-1/20 focus:ring-accent-1"
            />
            
            {/* INPUT: Campo de senha */}
            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-accent-1/20 focus:ring-accent-1"
              // EVENTO: Login ao pressionar Enter
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && email && password && !isSubmitting) {
                  // VALIDAÇÃO: Valida dados antes do login
                  const validation = validateLogin(email, password)
                  if (!validation.isValid) {
                    setError(validation.errors.join(', '))
                    return
                  }
                  
                  try {
                    setIsSubmitting(true)
                    setError('')
                    await login(email, password)  // Executa login
                    setIsLoginModalOpen(false)    // Fecha modal
                    setEmail('')                  // Limpa email
                    setPassword('')               // Limpa senha
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Erro no login')
                  } finally {
                    setIsSubmitting(false)
                  }
                }
              }}
            />
            
            {/* BOTÃO: Botão de login */}
            <Button
              disabled={isSubmitting || !email || !password}  // Desabilitado se enviando ou campos vazios
              onClick={async () => {
                // VALIDAÇÃO: Valida dados antes do login
                const validation = validateLogin(email, password)
                if (!validation.isValid) {
                  setError(validation.errors.join(', '))
                  return
                }
                
                try {
                  setIsSubmitting(true)
                  setError('')
                  await login(email, password)  // Executa login
                  setIsLoginModalOpen(false)    // Fecha modal
                  setEmail('')                  // Limpa email
                  setPassword('')               // Limpa senha
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Erro no login')
                } finally {
                  setIsSubmitting(false)
                }
              }}
              className="bg-accent-1 text-primary-foreground hover:bg-accent-1/80"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
            
            {/* LINK: Link para modal de cadastro */}
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <button 
                className="text-accent-1 underline"
                onClick={() => {
                  setIsLoginModalOpen(false)      // Fecha modal de login
                  setIsRegisterModalOpen(true)    // Abre modal de registro
                }}
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE CADASTRO: Diálogo para registro de novo usuário */}
      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        {/* CONTENT: Conteúdo do modal */}
        <DialogContent className="bg-card border-accent-1/20 text-foreground">
          {/* HEADER: Cabeçalho do modal */}
          <DialogHeader>
            <DialogTitle className="text-accent-1">
              Criar Conta
            </DialogTitle>
            <DialogDescription>
              Crie sua conta para uma experiência personalizada.
            </DialogDescription>
          </DialogHeader>
          
          {/* FORM: Formulário de cadastro */}
          <div className="grid gap-4 py-4">
            {/* ERRO: Exibe mensagem de erro se houver */}
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}
            
            {/* INPUT: Campo de nome completo */}
            <Input
              placeholder="Nome completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-accent-1/20 focus:ring-accent-1"
            />
            
            {/* INPUT: Campo de email */}
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-accent-1/20 focus:ring-accent-1"
            />
            
            {/* INPUT: Campo de senha */}
            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-accent-1/20 focus:ring-accent-1"
              // EVENTO: Cadastro ao pressionar Enter
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && email && password && name && !isSubmitting) {
                  // VALIDAÇÃO: Valida dados antes do cadastro
                  const validation = validateRegister(email, password, name)
                  if (!validation.isValid) {
                    setError(validation.errors.join(', '))
                    return
                  }
                  
                  try {
                    setIsSubmitting(true)
                    setError('')
                    await register(email, password, name)  // Executa cadastro
                    setIsRegisterModalOpen(false)         // Fecha modal
                    setEmail('')                          // Limpa email
                    setPassword('')                       // Limpa senha
                    setName('')                           // Limpa nome
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Erro no cadastro')
                  } finally {
                    setIsSubmitting(false)
                  }
                }
              }}
            />
            
            {/* BOTÃO: Botão de cadastro */}
            <Button
              disabled={isSubmitting || !email || !password || !name}  // Desabilitado se enviando ou campos vazios
              onClick={async () => {
                // VALIDAÇÃO: Valida dados antes do cadastro
                const validation = validateRegister(email, password, name)
                if (!validation.isValid) {
                  setError(validation.errors.join(', '))
                  return
                }
                
                try {
                  setIsSubmitting(true)
                  setError('')
                  await register(email, password, name)  // Executa cadastro
                  setIsRegisterModalOpen(false)         // Fecha modal
                  setEmail('')                          // Limpa email
                  setPassword('')                       // Limpa senha
                  setName('')                           // Limpa nome
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Erro no cadastro')
                } finally {
                  setIsSubmitting(false)
                }
              }}
              className="bg-accent-1 text-primary-foreground hover:bg-accent-1/80"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </Button>
            
            {/* LINK: Link para modal de login */}
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <button 
                className="text-accent-1 underline"
                onClick={() => {
                  setIsRegisterModalOpen(false)  // Fecha modal de cadastro
                  setIsLoginModalOpen(true)      // Abre modal de login
                }}
              >
                Faça login
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
