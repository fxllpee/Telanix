// COMPONENTE CHECKBOX - COMPONENTE DE CHECKBOX/CAIXA DE SELEÇÃO
// Este componente exibe uma caixa de seleção para marcar/desmarcar opções
// Baseado no Radix UI Checkbox e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// CheckboxPrimitive = primitivos do Radix UI para checkbox
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
// Check = ícone de check da Lucide React
import { Check } from 'lucide-react'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE CHECKBOX: Componente principal do checkbox
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>  // Tipo das props
>(({ className, ...props }, ref) => (
  // CHECKBOXPRIMITIVE.ROOT: Elemento raiz do checkbox do Radix UI
  <CheckboxPrimitive.Root
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com estados e foco
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    {/* INDICATOR: Indicador visual quando o checkbox está marcado */}
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" />  {/* Ícone de check */}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
// DISPLAYNAME: Nome do componente para debugging
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// EXPORTAÇÃO: Exporta o componente Checkbox
export { Checkbox }
