// COMPONENTE INPUT - COMPONENTE DE CAMPO DE ENTRADA
// Este componente exibe um campo de entrada de texto estilizado
// Baseado no shadcn/ui com Tailwind CSS

// IMPORTAÇÕES: React e utilitários
// React = biblioteca principal para componentes
import * as React from 'react'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE INPUT: Função principal do componente
// React.forwardRef = permite passar ref para o componente
// HTMLInputElement = tipo TypeScript para elemento input HTML
// React.ComponentProps<'input'> = tipo TypeScript para props nativas de input
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    // RETURN: JSX que será renderizado
    return (
      // INPUT: Elemento HTML input estilizado
      <input
        type={type}  // Tipo do input (text, email, password, etc.)
        // CLASSES: Classes CSS com estilos e estados
        className={cn(
          // CLASSES BASE: Classes CSS que sempre são aplicadas
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,  // Classes customizadas passadas via props
        )}
        ref={ref}  // Ref passada para o elemento
        {...props}  // Todas as props passadas (value, onChange, placeholder, etc.)
      />
    )
  },
)
// DISPLAYNAME: Nome do componente para debugging
Input.displayName = 'Input'

// EXPORTAÇÃO: Exporta o componente Input
export { Input }
