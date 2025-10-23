// COMPONENTE ALERT - COMPONENTE DE ALERTA/NOTIFICAÇÃO
// Este componente desafia alertas e notificações importantes para o usuário
// Baseado no shadcn/ui com class-variance-authority para variantes

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// cva = class-variance-authority para criar variantes de classes CSS
// VariantProps = tipo TypeScript para props de variantes
import { cva, type VariantProps } from 'class-variance-authority'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// VARIAÇÕES: Define as variantes de estilo do alert
// cva = cria variantes de classes CSS baseadas em props
const alertVariants = cva(
  // CLASSES BASE: Classes CSS que sempre são aplicadas
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    // VARIANTS: Objeto que define as variantes disponíveis
    variants: {
      // VARIANT: Variantes de estilo (cores, aparência)
      variant: {
        default: 'bg-background text-foreground',  // Estilo padrão (neutro)
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',  // Estilo destrutivo (vermelho)
      },
    },
    // DEFAULT VARIANTS: Variantes padrão quando não especificadas
    defaultVariants: {
      variant: 'default',  // Variante padrão
    },
  },
)

// COMPONENTE ALERT: Componente principal do alerta
// React.forwardRef = permite passar ref para o componente
// HTMLDivElement = tipo TypeScript para elemento div HTML
// React.HTMLAttributes<HTMLDivElement> = tipo TypeScript para props nativas de div
// VariantProps<typeof alertVariants> = tipo TypeScript para props das variantes
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  // DIV: Elemento div que representa o alerta
  <div
    ref={ref}  // Ref passada para o elemento
    role="alert"  // Papel semântico para acessibilidade
    // CLASSES: Combina classes das variantes com classes customizadas
    className={cn(alertVariants({ variant }), className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
Alert.displayName = 'Alert'

// COMPONENTE ALERTTITLE: Título do alerta
// React.forwardRef = permite passar ref para o componente
// HTMLParagraphElement = tipo TypeScript para elemento p HTML
// React.HTMLAttributes<HTMLHeadingElement> = tipo TypeScript para props nativas de heading
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  // H5: Elemento h5 que representa o título do alerta
  <h5
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com tipografia de título
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
AlertTitle.displayName = 'AlertTitle'

// COMPONENTE ALERTDESCRIPTION: Descrição do alerta
// React.forwardRef = permite passar ref para o componente
// HTMLParagraphElement = tipo TypeScript para elemento p HTML
// React.HTMLAttributes<HTMLParagraphElement> = tipo TypeScript para props nativas de paragraph
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  // DIV: Elemento div que representa a descrição do alerta
  <div
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com tipografia de descrição
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
AlertDescription.displayName = 'AlertDescription'

// EXPORTAÇÃO: Exporta todos os componentes do alert
export { Alert, AlertTitle, AlertDescription }
