// COMPONENTE SELECT - COMPONENTE DE SELEÇÃO/DROPDOWN
// Este componente exibe um dropdown para selecionar opções de uma lista
// Baseado no Radix UI Select e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// SelectPrimitive = primitivos do Radix UI para select
import * as SelectPrimitive from '@radix-ui/react-select'
// Ícones da Lucide React
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTES referees: Componentes base do Radix UI
// Select = componente raiz que gerencia o estado do select
const Select = SelectPrimitive.Root

// SelectGroup = agrupador de itens do select
const SelectGroup = SelectPrimitive.Group

// SelectValue = componente que exibe o valor selecionado
const SelectValue = SelectPrimitive.Value

// COMPONENTE SELECTTRIGGER: Botão que abre o select
// React.forwardRef = permite passar ref para o componente
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>  // Tipo das props
>(({ className, children, ...props }, ref) => (
  // SELECTPRIMITIVE.TRIGGER: Elemento trigger do select do Radix UI
  <SelectPrimitive.Trigger
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com estilo de input
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    {children}  {/* Conteúdo do trigger */}
    {/* ICON: Ícone de seta para baixo */}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
// DISPLAYNAME: Nome do componente para debugging
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// COMPONENTE SELECTSCROLLUPBUTTON: Botão para rolar para cima
// React.forwardRef = permite passar ref para o componente
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>  // Tipo das props
>(({ className, ...props }, ref) => (
  // SELECTPRIMITIVE.SCROLLUPBUTTON: Botão de scroll para cima do Radix UI
  <SelectPrimitive.ScrollUpButton
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para centralização
    className={cn(
      'flex cursor-default items-center justify-center py-1',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    <ChevronUp className="h-4 w-4" />  {/* Ícone de seta para cima */}
  </SelectPrimitive.ScrollUpButton>
))
// DISPLAYNAME: Nome do componente para debugging
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

// COMPONENTE SELECTSCROLLDOWNBUTTON: Botão para rolar para baixo
// React.forwardRef = permite passar ref para o componente
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>  // Tipo das props
>(({ className, ...props }, ref) => (
  // SELECTPRIMITIVE.SCROLLDOWNBUTTON: Botão de scroll para baixo do Radix UI
  <SelectPrimitive.ScrollDownButton
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para centralização
    className={cn(
      'flex cursor-default items-center justify-center py-1',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    <ChevronDown className="h-4 w-4" />  {/* Ícone de seta para baixo */}
  </SelectPrimitive.ScrollDownButton>
))
// DISPLAYNAME: Nome do componente para debugging
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

// COMPONENTE SELECTCONTENT: Conteúdo do dropdown
// React.forwardRef = permite passar ref para o componente
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>  // Tipo das props
>(({ className, children, position = 'popper', ...props }, ref) => (
  // PORTAL: Portal que renderiza o conteúdo fora da árvore DOM
  <SelectPrimitive.Portal>
    {/* CONTENT: Conteúdo principal do select */}
    <SelectPrimitive.Content
      ref={ref}  // Ref passada para o elemento
      // CLASSES: Classes CSS com animações e posicionamento
      className={cn(
        'relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]',  // Classes base
        // Classes condicionais baseadas na posição
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,  // Classes customizadas
      )}
      position={position}  // Posição do dropdown
      {...props}  // Todas as props passadas
    >
      {/* SCROLL UP: Botão para rolar para cima */}
      <SelectScrollUpButton />
      
      {/* VIEWPORT: Área de visualização dos itens */}
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',  // Classes base
          // Classes condicionais baseadas na posição
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}  {/* Itens do select */}
      </SelectPrimitive.Viewport>
      
      {/* SCROLL DOWN: Botão para rolar para baixo */}
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
// DISPLAYNAME: Nome do componente para debugging
SelectContent.displayName = SelectPrimitive.Content.displayName

// COMPONENTE SELECTLABEL: Label/etiqueta do select
// React.forwardRef = permite passar ref para o componente
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>  // Tipo das props
>(({ className, ...props }, ref) => (
  // SELECTPRIMITIVE.LABEL: Label do select do Radix UI
  <SelectPrimitive.Label
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com tipografia de label
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
SelectLabel.displayName = SelectPrimitive.Label.displayName

// COMPONENTE SELECTITEM: Item individual do select
// React.forwardRef = permite passar ref para o componente
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>  // Tipo das props
>(({ className, children, ...props }, ref) => (
  // SELECTPRIMITIVE.ITEM: Item do select do Radix UI
  <SelectPrimitive.Item
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com estados e interações
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    {/* INDICATOR: Indicador visual quando o item está selecionado */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />  {/* Ícone de check */}
      </SelectPrimitive.ItemIndicator>
    </span>

    {/* TEXT: Texto do item */}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
// DISPLAYNAME: Nome do componente para debugging
SelectItem.displayName = SelectPrimitive.Item.displayName

// COMPONENTE SELECTSEPARATOR: Separador entre itens do select
// React.forwardRef = permite passar ref para o componente
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>  // Tipo das props
>(({ className, ...props }, ref) => (
  // SELECTPRIMITIVE.SEPARATOR: Separador do select do Radix UI
  <SelectPrimitive.Separator
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para linha divisória
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// EXPORTAÇÃO: Exporta todos os componentes do select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
