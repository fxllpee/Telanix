// COMPONENTE SLIDER - COMPONENTE DE SLIDER/CONTROLE DESLIZANTE
// Este componente exibe um controle deslizante para selecionar valores em um intervalo
// Baseado no Radix UI Slider e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// SliderPrimitive = primitivos do Radix UI para slider
import * as SliderPrimitive from '@radix-ui/react-slider'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE SLIDER: Componente principal do slider
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>  // Tipo das props
>(({ className, ...props }, ref) => (
  // SLIDERPRIMITIVE.ROOT: Elemento raiz do slider do Radix UI
  <SliderPrimitive.Root
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para layout e interação
    className={cn(
      'relative flex w-full touch-none select-none items-center',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    {/* TRACK: Trilha/fundo do slider */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      {/* RANGE: Faixa selecionada do slider */}
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    
    {/* THUMB: Botão deslizante do slider */}
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
// DISPLAYNAME: Nome do componente para debugging
Slider.displayName = SliderPrimitive.Root.displayName

// EXPORTAÇÃO: Exporta o componente Slider
export { Slider }
