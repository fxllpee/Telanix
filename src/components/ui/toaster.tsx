// COMPONENTE TOASTER - SISTEMA DE NOTIFICAÇÕES TOAST
// Este componente exibe notificações toast na tela
// Baseado no shadcn/ui com hook useToast para gerenciamento de estado

// IMPORTAÇÕES: Hook e componentes de toast
// useToast = hook customizado para gerenciar toasts
import { useToast } from '@/hooks/use-toast'
// Componentes de toast do shadcn/ui
import {
  Toast,           // Componente principal do toast
  ToastClose,      // Botão de fechar o toast
  ToastDescription,// Descrição do toast
  ToastProvider,   // Provedor de contexto dos toasts
  ToastTitle,      // Título do toast
  ToastViewport,   // Viewport onde os toasts são renderizados
} from '@/components/ui/toast'

// COMPONENTE TOASTER: Função principal do sistema de toasts
export function Toaster() {
  // HOOK: useToast para obter lista de toasts ativos
  // toasts = array de toasts que devem ser exibidos
  const { toasts } = useToast()

  // RETURN: JSX que será renderizado
  return (
    // PROVIDER: Provedor de contexto para os toasts
    <ToastProvider>
      {/* MAP: Itera sobre cada toast ativo */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // RETURN: JSX para cada toast individual
        return (
          // TOAST: Componente principal do toast
          <Toast key={id} {...props}>
            {/* CONTAINER: Container interno com título e descrição */}
            <div className="grid gap-1">
              {/* TITLE: Título do toast (se existir) */}
              {title && <ToastTitle>{title}</ToastTitle>}
              
              {/* DESCRIPTION: Descrição do toast (se existir) */}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            
            {/* ACTION: Ação customizada do toast (botão, link, etc.) */}
            {action}
            
            {/* CLOSE: Botão de fechar o toast */}
            <ToastClose />
          </Toast>
        )
      })}
      
      {/* VIEWPORT: Viewport onde os toasts são posicionados na tela */}
      <ToastViewport />
    </ToastProvider>
  )
}
