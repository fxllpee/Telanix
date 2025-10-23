// COMPONENTE BUTTON - COMPONENTE DE BOTÃO REUTILIZÁVEL
// Este componente exibe um botão com diferentes variantes e tamanhos
// Baseado no Radix UI Slot e class-variance-authority para variantes

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// Slot = componente do Radix UI que permite renderizar como outro elemento
import { Slot } from '@radix-ui/react-slot'
// cva = class-variance-authority para criar variantes de classes CSS
// VariantProps = tipo TypeScript para props de variantes
import { cva, type VariantProps } from 'class-variance-authority'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// VARIAÇÕES: Define as variantes de estilo do botão
// cva = cria variantes de classes CSS baseadas em props
const buttonVariants = cva(
  // CLASSES BASE: Classes CSS que sempre são aplicadas
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    // VARIANTS: Objeto que define as variantes disponíveis
    variants: {
      // VARIANT: Variantes de estilo (cores, aparência)
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',  // Estilo padrão (primário)
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',  // Estilo destrutivo (vermelho)
        outline: 'border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',  // Estilo outline (borda)
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',  // Estilo secundário (cinza)
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',  // Estilo ghost (transparente)
        link: 'text-foreground underline-offset-4 hover:underline',  // Estilo link (texto sublinhado)
      },
      // SIZE: Variantes de tamanho
      size: {
        default: 'h-10 px-4 py-2',  // Tamanho padrão
        sm: 'h-9 rounded-md px-3',  // Tamanho pequeno
        lg: 'h-11 rounded-md px-8',  // Tamanho grande normal
        icon: 'h-10 w-10',  // Tamanho para ícones (quadrado)
      },
    },
    // DEFAULT VARIANTS: Variantes padrão quando não especificadas
    defaultVariants: {
      variant: 'default',  // Variante padrão
      size: 'default',     // Tamanho padrão
    },
  },
)

// INTERFACE: Define as props do componente Button
// ButtonProps = interface que estende props de botão HTML + variantes solo
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,  // Props nativas de botão HTML
    VariantProps<typeof buttonVariants> {  // Props das variantes (variant, size)
  asChild?: boolean  // Se true, renderiza como Slot (outro elemento)
}

// COMPONENTE BUTTON: Função principal do componente
// React.forwardRef = permite passar ref para o componente
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // COMP: Determina qual elemento renderizar
    // Se asChild for true, usa Slot; senão usa button
    const Comp = asChild ? Slot : 'button'
    
    // RETURN: JSX que será renderizado
    return (
      <Comp
        // CLASSES: Combina classes das variantes com classes customizadas
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}  // Ref passada para o elemento
        {...props}  // Todas as props passadas
      />
    )
  },
)
// DISPLAYNAME: Nome do componente para debugging
Button.displayName = 'Button'

// EXPORTAÇÃO: Exporta o componente Button e suas variantes
export { Button, buttonVariants }
