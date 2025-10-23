// COMPONENTE ACCORDION - COMPONENTE DE ACORDEÃO (LISTA EXPANSÍVEL)
// Este componente exibe uma lista de itens em formato de acordeão (expandir/recolher)
// Baseado no Radix UI e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// AccordionPrimitive = primitivos do Radix UI para acordeão
import * as AccordionPrimitive from '@radix-ui/react-accordion'
// ChevronDown = ícone de seta para baixo da Lucide React
import { ChevronDown } from 'lucide-react'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE ACCORDION: Componente raiz do acordeão
// Accordion = componente principal que gerencia o estado do acordeão
const Accordion = AccordionPrimitive.Root

// COMPONENTE ACCORDIONITEM: Item individual do acordeão
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>  // Tipo das props
>(({ className, ...props }, ref) => (
  // ACCORDIONPRIMITIVE.ITEM: Item do acordeão do Radix UI
  <AccordionPrimitive.Item
    ref={ref}  // Ref passada para o elemento
    className={cn('border-b', className)}  // Classes CSS: borda inferior + classes customizadas
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
AccordionItem.displayName = 'AccordionItem'

// COMPONENTE ACCORDIONTRIGGER: Botão que expande/recolhe o item
// React.forwardRef = permite passar ref para o componente
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>  // Tipo das props
>(({ className, children, ...props }, ref) => (
  // HEADER: Cabeçalho do item do acordeão
  <AccordionPrimitive.Header className="flex">
    {/* TRIGGER: Botão que controla a expansão/recolhimento */}
    <AccordionPrimitive.Trigger
      ref={ref}  // Ref passada para o elemento
      // CLASSES: Classes CSS com estados e animações
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',  // Classes base
        className,  // Classes customizadas
      )}
      {...props}  // Todas as props passadas
    >
      {children}  {/* Conteúdo do trigger */}
      {/* ÍCONE: Seta que rotaciona quando o item está aberto */}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
// DISPLAYNAME: Nome do componente para debugging
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

// COMPONENTE ACCORDIONCONTENT: Conteúdo que é expandido/recolhido
// React.forwardRef = permite passar ref para o componente
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>  // Tipo das props
>(({ className, children, ...props }, ref) => (
  // CONTENT: Conteúdo do acordeão do Radix UI
  <AccordionPrimitive.Content
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com animações de abertura/fechamento
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}  // Todas as props passadas
  >
    {/* CONTAINER: Container interno com padding */}
    <div className={cn('pb-4 pt-0', className)}>
      {children}  {/* Conteúdo do acordeão */}
    </div>
  </AccordionPrimitive.Content>
))

// DISPLAYNAME: Nome do componente para debugging
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// EXPORTAÇÃO: Exporta todos os componentes do acordeão
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
