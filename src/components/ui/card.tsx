// COMPONENTE CARD - COMPONENTE DE CARTÃO/CARD
// Este componente exibe um cartão com diferentes seções (header, content, footer)
// Baseado no shadcn/ui com Tailwind CSS

// IMPORTAÇÕES: React e utilitários
// React = biblioteca principal para componentes
import * as React from 'react'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE CARD: Componente principal do cartão
// React.forwardRef = permite passar ref para o componente
// HTMLDivElement = tipo TypeScript para elemento div HTML
// React.HTMLAttributes<HTMLDivElement> = tipo TypeScript para props nativas de div
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // DIV: Elemento div que representa o cartão
  <div
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com estilo de cartão
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
Card.displayName = 'Card'

// COMPONENTE CARDHEADER: Cabeçalho do cartão
// React.forwardRef = permite passar ref para o componente
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // DIV: Elemento div que representa o cabeçalho
  <div
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com layout flexível e espaçamento
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
CardHeader.displayName = 'CardHeader'

// COMPONENTE CARDTITLE: Título do cartão
// React.forwardRef = permite passar ref para o componente
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // DIV: Elemento div que representa o título
  <div
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com tipografia de título
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
CardTitle.displayName = 'CardTitle'

// COMPONENTE CARDDESCRIPTION: Descrição do cartão
// React.forwardRef = permite passar ref para o componente
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // DIV: Elemento div que representa a descrição
  <div
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com tipografia de descrição
    className={cn('text-sm text-muted-foreground', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
CardDescription.displayName = 'CardDescription'

// COMPONENTE CARDCONTENT: Conteúdo principal do cartão
// React.forwardRef = permite passar ref para o componente
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // DIV: Elemento div que representa o conteúdo
  <div 
    ref={ref}  // Ref passada para o elemento
    className={cn('p-6 pt-0', className)}  // Classes CSS com padding
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
CardContent.displayName = 'CardContent'

// COMPONENTE CARDFOOTER: Rodapé do cartão
// React.forwardRef = permite passar ref para o componente
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // DIV: Elemento div que representa o rodapé
  <div
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com layout flexível e espaçamento
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
CardFooter.displayName = 'CardFooter'

// EXPORTAÇÃO: Exporta todos os componentes do card
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
