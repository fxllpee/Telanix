// COMPONENTE TEXTAREA - COMPONENTE DE ÁREA DE TEXTO
// Este componente exibe uma área de texto multilinha para entrada de texto longo
// Baseado no shadcn/ui com Tailwind CSS

// IMPORTAÇÕES: React e utilitários
// React = biblioteca principal para componentes
import * as React from 'react'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE TEXTAREA: Função principal do componente
// React.forwardRef = permite passar ref para o componente
// HTMLTextAreaElement = tipo TypeScript para elemento textarea HTML
// React.ComponentProps<'textarea'> = tipo TypeScript para props nativas de textarea
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  // RETURN: JSX que será renderizado
  return (
    // TEXTAREA: Elemento HTML textarea estilizado
    <textarea
      // CLASSES: Classes CSS com estilos e estados
      className={cn(
        // CLASSES BASE: Classes CSS que sempre são aplicadas
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,  // Classes customizadas passadas via props
      )}
      ref={ref}  // Ref passada para o elemento
      {...props}  // Todas as props passadas (value, onChange, placeholder, etc.)
    />
  )
})
// DISPLAYNAME: Nome do componente para debugging
Textarea.displayName = 'Textarea'

// EXPORTAÇÃO: Exporta o componente Textarea
export { Textarea }
