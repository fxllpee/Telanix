// COMPONENTE RESIZABLE - COMPONENTE DE PAINÉIS REDIMENSIONÁVEIS
// Este componente exibe painéis que podem ser redimensionados pelo usuário
// Baseado no react-resizable-panels e estilizado com Tailwind CSS

// IMPORTAÇÕES: Ícones e bibliotecas necessárias
// GripVertical = ícone de pegada vertical da Lucide React
import { GripVertical } from 'lucide-react'
// ResizablePrimitive = primitivos do react-resizable-panels
import * as ResizablePrimitive from 'react-resizable-panels'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE RESIZABLEPANELGROUP: Grupo de painéis redimensionáveis
// React.ComponentProps<typeof ResizablePrimitive.PanelGroup> = tipo TypeScript para props do PanelGroup
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  // RESIZABLEPRIMITIVE.PANELGROUP: Grupo de painéis do react-resizable-panels
  <ResizablePrimitive.PanelGroup
    // CLASSES: Classes CSS para layout flexível
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  />
)

// COMPONENTE RESIZABLEPANEL: Painel individual redimensionável
// ResizablePrimitive.Panel = painel do react-resizable-panels
const ResizablePanel = ResizablePrimitive.Panel

// COMPONENTE RESIZABLEHANDLE: Handle para redimensionar painéis
// React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> = tipo TypeScript para props do PanelResizeHandle
// withHandle?: boolean = prop opcional para mostrar handle visual
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean  // Se deve mostrar o handle visual
}) => (
  // RESIZABLEPRIMITIVE.PANELRESIZEHANDLE: Handle de redimensionamento do react-resizable-panels
  <ResizablePrimitive.PanelResizeHandle
    // CLASSES: Classes CSS com orientação e estilo
    className={cn(
      'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  >
    {/* HANDLE VISUAL: Handle visual opcional */}
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />  {/* Ícone de pegada */}
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

// EXPORTAÇÃO: Exporta os componentes de painéis redimensionáveis
export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
