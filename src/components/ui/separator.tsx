// COMPONENTE SEPARATOR - COMPONENTE DE SEPARADOR/LINHA DIVISÓRIA
// Este componente exibe uma linha divisória para separar seções de conteúdo
// Baseado no Radix UI Separator e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// SeparatorPrimitive = primitivos do Radix UI para separador
import * as SeparatorPrimitive from '@radix-ui/react-separator'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE SEPARATOR: Componente principal do separador
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>  // Tipo das props
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },  // Props com valores padrão
    ref,  // Ref passada para o elemento
  ) => (
    // SEPARATORPRIMITIVE.ROOT: Elemento raiz do separador do Radix UI
    <SeparatorPrimitive.Root
      ref={ref}  // Ref passada para o elemento
      decorative={decorative}  // Se o separador é apenas decorativo (padrão: true)
      orientation={orientation}  // Orientação do separador (horizontal ou vertical)
      // CLASSES: Classes CSS com tamanho baseado na orientação
      className={cn(
        'shrink-0 bg-border',  // Classes base: não encolhe e cor da borda
        // Classes condicionais baseadas na orientação
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',  // Altura/largura baseada na orientação
        className,  // Classes customizadas
      )}
      {...props}  // Todas as props passadas
    />
  ),
)
// DISPLAYNAME: Nome do componente para debugging
Separator.displayName = SeparatorPrimitive.Root.displayName

// EXPORTAÇÃO: Exporta o componente Separator
export { Separator }
