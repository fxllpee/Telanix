// COMPONENTE TOOLTIP - COMPONENTE DE DICA FLUTUANTE
// Este componente exibe dicas flutuantes quando o usuário passa o mouse sobre elementos
// Baseado no Radix UI Tooltip e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// TooltipPrimitive = primitivos do Radix UI para tooltips
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTES PRIMITIVOS: Componentes base do Radix UI
// TooltipProvider = provedor de contexto para tooltips
const TooltipProvider = TooltipPrimitive.Provider

// Tooltip = componente raiz que gerencia o estado do tooltip
const Tooltip = TooltipPrimitive.Root

// TooltipTrigger = elemento que ativa o tooltip (hover, focus, etc.)
const TooltipTrigger = TooltipPrimitive.Trigger

// COMPONENTE TOOLTIPCONTENT: Conteúdo da dica flutuante
// React.forwardRef = permite passar ref para o componente
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>  // Tipo das props
>(({ className, sideOffset = 4, ...props }, ref) => (
  // CONTENT: Conteúdo do tooltip do Radix UI
  <TooltipPrimitive.Content
    ref={ref}  // Ref passada para o elemento
    sideOffset={sideOffset}  // Distância do elemento trigger (padrão: 4px)
    // CLASSES: Classes CSS com animações e posicionamento
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// EXPORTAÇÃO: Exporta todos os componentes do tooltip
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
