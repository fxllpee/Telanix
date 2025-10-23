// COMPONENTE PAGINATION - COMPONENTE DE PAGINAÇÃO
// Este componente exibe controles de paginação para navegar entre páginas
// Baseado no shadcn/ui com Tailwind CSS e ícones da Lucide React

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// Ícones de navegação da Lucide React
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

// IMPORTAÇÕES: Utilitários e componentes
// cn = função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'
// ButtonProps, buttonVariants = tipos e variantes do componente Button
import { ButtonProps, buttonVariants } from '@/components/ui/button'

// COMPONENTE PAGINATION: Componente raiz da paginação
// React.ComponentProps<'nav'> = tipo TypeScript para props nativas de nav
const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  // NAV: Elemento semântico HTML para navegação
  <nav
    role="navigation"           // Papel semântico para acessibilidade
    aria-label="pagination"     // Label para leitores de tela
    // CLASSES: Classes CSS para centralização
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}  // Todas as props passadas
  />
)
// DISPLAYNAME: Nome do componente para debugging
Pagination.displayName = 'Pagination'

// COMPONENTE PAGINATIONCONTENT: Container dos itens de paginação
// React.forwardRef = permite passar ref para o componente
// HTMLUListElement = tipo TypeScript para elemento ul HTML
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  // UL: Lista não ordenada para os itens de paginação
  <ul
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para layout flexível horizontal
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
PaginationContent.displayName = 'PaginationContent'

// COMPONENTE PAGINATIONITEM: Item individual da paginação
// React.forwardRef = permite passar ref para o componente
// HTMLLIElement = tipo TypeScript para elemento li HTML
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  // LI: Item de lista para cada elemento da paginação
  <li ref={ref} className={cn('', className)} {...props} />
))
// DISPLAYNAME: Nome do componente para debugging
PaginationItem.displayName = 'PaginationItem'

// TIPO: Define as props do componente PaginationLink
// PaginationLinkProps = interface que combina props customizadas + props de botão + props de link
type PaginationLinkProps = {
  isActive?: boolean  // Se o link está ativo (página atual)
} & Pick<ButtonProps, 'size'> &  // Pega apenas a prop 'size' do ButtonProps
  React.ComponentProps<'a'>  // Props nativas de link HTML

// COMPONENTE PAGINATIONLINK: Link clicável da paginação
const PaginationLink = ({
  className,
  isActive,
  size = 'icon',  // Tamanho padrão para ícones
  ...props
}: PaginationLinkProps) => (
  // A: Link HTML estilizado como botão
  <a
    aria-current={isActive ? 'page' : undefined}  // Indica página atual para acessibilidade
    // CLASSES: Classes CSS usando variantes do botão
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',  // Variante baseada no estado ativo
        size,  // Tamanho do botão
      }),
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  />
)
// DISPLAYNAME: Nome do componente para debugging
PaginationLink.displayName = 'PaginationLink'

// COMPONENTE PAGINATIONPREVIOUS: Botão para página anterior
// React.ComponentProps<typeof PaginationLink> = tipo TypeScript para props do PaginationLink
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  // PAGINATIONLINK: Link estilizado para página anterior
  <PaginationLink
    aria-label="Go to previous page"  // Label para acessibilidade
    size="default"  // Tamanho padrão
    className={cn('gap-1 pl-2.5', className)}  // Classes com espaçamento
    {...props}  // Todas as props passadas
  >
    <ChevronLeft className="h-4 w-4" />  {/* Ícone de seta para esquerda */}
    <span>Previous</span>  {/* Texto do botão */}
  </PaginationLink>
)
// DISPLAYNAME: Nome do componente para debugging
PaginationPrevious.displayName = 'PaginationPrevious'

// COMPONENTE PAGINATIONNEXT: Botão para próxima página
// React.ComponentProps<typeof PaginationLink> = tipo TypeScript para props do PaginationLink
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  // PAGINATIONLINK: Link estilizado para próxima página
  <PaginationLink
    aria-label="Go to next page"  // Label para acessibilidade
    size="default"  // Tamanho padrão
    className={cn('gap-1 pr-2.5', className)}  // Classes com espaçamento
    {...props}  // Todas as props passadas
  >
    <span>Next</span>  {/* Texto do botão */}
    <ChevronRight className="h-4 w-4" />  {/* Ícone de seta para direita */}
  </PaginationLink>
)
// DISPLAYNAME: Nome do componente para debugging
PaginationNext.displayName = 'PaginationNext'

// COMPONENTE PAGINATIONELLIPSIS: Indicador de mais páginas (...)
// React.ComponentProps<'span'> = tipo TypeScript para props nativas de span
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  // SPAN: Elemento span para indicar mais páginas
  <span
    aria-hidden  // Oculta do leitor de tela (é apenas visual)
    // CLASSES: Classes CSS para centralização e tamanho
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}  // Todas as props passadas
  >
    <MoreHorizontal className="h-4 w-4" />  {/* Ícone de três pontos */}
    <span className="sr-only">More pages</span>  {/* Texto para leitores de tela */}
  </span>
)
// DISPLAYNAME: Nome do componente para debugging
PaginationEllipsis.displayName = 'PaginationEllipsis'

// EXPORTAÇÃO: Exporta todos os componentes da paginação
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
