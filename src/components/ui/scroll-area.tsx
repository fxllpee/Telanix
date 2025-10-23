// COMPONENTE SCROLLAREA - COMPONENTE DE ÁREA DE ROLAGEM
// Este componente exibe uma área de rolagem customizada com scrollbars estilizadas
// Baseado no Radix UI Scroll Area e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// ScrollAreaPrimitive = primitivos do Radix UI para scroll area
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE SCROLLAREA: Componente principal da área de rolagem
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>  // Tipo das props
>(({ className, children, ...props }, ref) => (
  // SCROLLAREAPRIMITIVE.ROOT: Elemento raiz da área de rolagem do Radix UI
  <ScrollAreaPrimitive.Root
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para posicionamento e overflow
    className={cn('relative overflow-hidden', className)}
    {...props}  // Todas as props passadas
  >
    {/* VIEWPORT: Área de visualização do conteúdo */}
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}  {/* Conteúdo da área de rolagem */}
    </ScrollAreaPrimitive.Viewport>
    
    {/* SCROLLBAR: Barra de rolagem customizada */}
    <ScrollBar />
    
    {/* CORNER: Canto onde as scrollbars se encontram */}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
// DISPLAYNAME: Nome do componente para debugging
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// COMPONENTE SCROLLBAR: Barra de rolagem customizada
// React.forwardRef = permite passar ref para o componente
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>  // Tipo das props
>(({ className, orientation = 'vertical', ...props }, ref) => (
  // SCROLLAREAPRIMITIVE.SCROLLAREASCROLLBAR: Barra de rolagem do Radix UI
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}  // Ref passada para o elemento
    orientation={orientation}  // Orientação da scrollbar (vertical ou horizontal)
    // CLASSES: Classes CSS com orientação e estilo
    className={cn(
      'flex touch-none select-none transition-colors',  // Classes base
      // Classes condicionais baseadas na orientação
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',  // Scrollbar vertical
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',  // Scrollbar horizontal
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    {/* THUMB: Parte que o usuário arrasta da scrollbar */}
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
// DISPLAYNAME: Nome do componente para debugging
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// EXPORTAÇÃO: Exporta os componentes da área de rolagem
export { ScrollArea, ScrollBar }
