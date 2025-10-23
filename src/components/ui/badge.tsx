// COMPONENTE BADGE - COMPONENTE DE INSÍGNIA/ETIQUETA
// Este componente exibe uma pequena etiqueta com texto e cores diferentes
// Baseado no shadcn/ui com class-variance-authority para variantes

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// cva = class-variance-authority para criar variantes de classes CSS
// VariantProps = tipo TypeScript para props de variantes
import { cva, type VariantProps } from 'class-variance-authority'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// VARIAÇÕES: Define as variantes de estilo do badge
// cva = cria variantes de classes CSS baseadas em props
const badgeVariants = cva(
  // CLASSES BASE: Classes CSS que sempre são aplicadas
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    // VARIANTS: Objeto que define as variantes disponíveis
    variants: {
      // VARIANT: Variantes de estilo (cores, aparência)
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',  // Estilo padrão (primário)
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',  // Estilo secundário (cinza)
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',  // Estilo destrutivo (vermelho)
        outline: 'text-foreground',  // Estilo outline (apenas borda)
      },
    },
    // DEFAULT VARIANTS: Variantes padrão quando não especificadas
    defaultVariants: {
      variant: 'default',  // Variante padrão
    },
  },
)

// INTERFACE: Define as props do componente Badge
// BadgeProps = interface que estende props de div HTML + variantes
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,  // Props nativas de div HTML
    VariantProps<typeof badgeVariants> {}  // Props das variantes (variant)

// COMPONENTE BADGE: Função principal do componente
function Badge({ className, variant, ...props }: BadgeProps) {
  // RETURN: JSX que será renderizado
  return (
    // DIV: Elemento div que representa o badge
    <div 
      // CLASSES: Combina classes das variantes com classes customizadas
      className={cn(badgeVariants({ variant }), className)} 
      {...props}  // Todas as props passadas
    />
  )
}

// EXPORTAÇÃO: Exporta o componente Badge e suas variantes
export { Badge, badgeVariants }
