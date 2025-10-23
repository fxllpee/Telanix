// COMPONENTE PROGRESS - COMPONENTE DE BARRA DE PROGRESSO
// Este componente exibe uma barra de progresso para mostrar o andamento de uma operação
// Baseado no Radix UI Progress e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// ProgressPrimitive = primitivos do Radix UI para progress
import * as ProgressPrimitive from '@radix-ui/react-progress'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE PROGRESS: Componente principal da barra de progresso
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>  // Tipo das props
>(({ className, value, ...props }, ref) => (
  // PROGRESSPRIMITIVE.ROOT: Elemento raiz da barra de progresso do Radix UI
  <ProgressPrimitive.Root
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para layout e estilo
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    {/* INDICATOR: Indicador visual do progresso */}
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"  // Classes CSS para o indicador
      // STYLE: Transformação CSS para posicionar o indicador baseado no valor
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
// DISPLAYNAME: Nome do componente para debugging
Progress.displayName = ProgressPrimitive.Root.displayName

// EXPORTAÇÃO: Exporta o componente Progress
export { Progress }
