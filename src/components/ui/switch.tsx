// COMPONENTE SWITCH - COMPONENTE DE SWITCH/INTERRUPTOR
// Este componente exibe um interruptor para alternar entre estados ligado/desligado
// Baseado no Radix UI Switch e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// SwitchPrimitives = primitivos do Radix UI para switch
import * as SwitchPrimitives from '@radix-ui/react-switch'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE SWITCH: Componente principal do switch
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>  // Tipo das props
>(({ className, ...props }, ref) => (
  // SWITCHPRIMITIVES.ROOT: Elemento raiz do switch do Radix UI
  <SwitchPrimitives.Root
    // CLASSES: Classes CSS com estados e animações
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
    ref={ref}  // Ref passada para o elemento
  >
    {/* THUMB: Botão deslizante do switch */}
    <SwitchPrimitives.Thumb
      // CLASSES: Classes CSS com animações de movimento
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',  // Classes base
      )}
    />
  </SwitchPrimitives.Root>
))
// DISPLAYNAME: Nome do componente para debugging
Switch.displayName = SwitchPrimitives.Root.displayName

// EXPORTAÇÃO: Exporta o componente Switch
export { Switch }
