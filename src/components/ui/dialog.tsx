// COMPONENTE DIALOG - COMPONENTE DE MODAL/DIÁLOGO
// Este componente exibe um modal que aparece no centro da tela
// Baseado no Radix UI Dialog e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// DialogPrimitive = primitivos do Radix UI para diálogos/modais
import * as DialogPrimitive from '@radix-ui/react-dialog'
// X = ícone de fechar da Lucide React
import { X } from 'lucide-react'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTES PRIMITIVOS: Componentes base do Radix UI
// Dialog = componente raiz que gerencia o estado do diálogo
const Dialog = DialogPrimitive.Root

// DialogTrigger = elemento que abre o diálogo (botão, link, etc.)
const DialogTrigger = DialogPrimitive.Trigger

// DialogPortal = portal que renderiza o diálogo fora da árvore DOM
const DialogPortal = DialogPrimitive.Portal

// DialogClose = elemento que fecha o diálogo
const DialogClose = DialogPrimitive.Close

// COMPONENTE DIALOGOVERLAY: Fundo escuro do modal
// React.forwardRef = permite passar ref para o componente
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>  // Tipo das props
>(({ className, ...props }, ref) => (
  // OVERLAY: Fundo escuro que cobre toda a tela
  <DialogPrimitive.Overlay
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com animações de fade
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// COMPONENTE DIALOGCONTENT: Conteúdo principal do modal
// React.forwardRef = permite passar ref para o componente
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>  // Tipo das props
>(({ className, children, ...props }, ref) => (
  // PORTAL: Renderiza o modal fora da árvore DOM
  <DialogPortal>
    {/* OVERLAY: Fundo escuro */}
    <DialogOverlay />
    
    {/* CONTENT: Conteúdo principal do modal */}
    <DialogPrimitive.Content
      ref={ref}  // Ref passada para o elemento
      // CLASSES: Classes CSS com posicionamento e animações
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg overflow-y-auto max-h-screen',  // Classes base
        className,  // Classes customizadas
      )}
      {...props}  // Todas as props passadas
    >
      {children}  {/* Conteúdo do modal */}
      
      {/* CLOSE BUTTON: Botão de fechar no canto superior direito */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />  {/* Ícone de fechar */}
        <span className="sr-only">Close</span>  {/* Texto para leitores de tela */}
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
