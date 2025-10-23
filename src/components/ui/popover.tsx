// COMPONENTE POPOVER - COMPONENTE DE POPOVER/CAIXA FLUTUANTE
// Este componente exibe uma caixa flutuante que aparece quando o usuário clica em um elemento
// Baseado no Radix UI Popover e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// PopoverPrimitive = primitivos do Radix UI para popover
import * as PopoverPrimitive from '@radix-ui/react-popover'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTES PRIMITIVOS: Componentes base do Radix UI
// Popover = componente raiz que gerencia o estado do popover
const Popover = PopoverPrimitive.Root

// PopoverTrigger = elemento que abre o popover (botão, link, etc.)
const PopoverTrigger = PopoverPrimitive.Trigger

// COMPONENTE POPOVERCONTENT: Conteúdo do popover
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>  // Tipo das props
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  // PORTAL: Portal que renderiza o popover fora da árvore DOM
  <PopoverPrimitive.Portal>
    {/* CONTENT: Conteúdo principal do popover */}
    <PopoverPrimitive.Content
      ref={ref}  // Ref passada para o elemento
      align={align}  // Alinhamento do popover (padrão: center)
      sideOffset={sideOffset}  // Distância do elemento trigger (padrão: 4px)
      // CLASSES: Classes CSS com animações e posicionamento
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]',  // Classes base
        className,  // Classes customizadas
      )}
      {...props}  // Todas as props passadas
    />
  </PopoverPrimitive.Portal>
))
// DISPLAYNAME: Nome do componente para debugging
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// EXPORTAÇÃO: Exporta todos os componentes do popover
export { Popover, PopoverTrigger, PopoverContent }
