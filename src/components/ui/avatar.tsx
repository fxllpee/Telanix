// COMPONENTE AVATAR - COMPONENTE DE AVATAR/FOTO DE PERFIL
// Este componente exibe a foto de perfil do usuário com fallback para iniciais
// Baseado no Radix UI Avatar e estilizado com Tailwind CSS

// IMPORTAÇÕES: React e bibliotecas necessárias
// React = biblioteca principal para componentes
import * as React from 'react'
// AvatarPrimitive = primitivos do Radix UI para avatar
import * as AvatarPrimitive from '@radix-ui/react-avatar'

// IMPORTAÇÃO: Função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE AVATAR: Componente raiz do avatar
// React.forwardRef = permite passar ref para o componente
// React.ElementRef = tipo TypeScript para referência do elemento
// React.ComponentPropsWithoutRef = tipo TypeScript para props do componente
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>  // Tipo das props
>(({ className, ...props }, ref) => (
  // AVATARPRIMITIVE.ROOT: Elemento raiz do avatar do Radix UI
  <AvatarPrimitive.Root
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS com posicionamento e estilo circular
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
Avatar.displayName = AvatarPrimitive.Root.displayName

// COMPONENTE AVATARIMAGE: Imagem do avatar
// React.forwardRef = permite passar ref para o componente
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>  // Tipo das props
>(({ className, ...props }, ref) => (
  // AVATARPRIMITIVE.IMAGE: Elemento de imagem do avatar do Radix UI
  <AvatarPrimitive.Image
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para imagem responsiva
    className={cn('aspect-square h-full w-full', className)}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// COMPONENTE AVATARFALLBACK: Fallback quando a imagem não carrega
// React.forwardRef = permite passar ref para o componente
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,  // Tipo da ref
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>  // Tipo das props
>(({ className, ...props }, ref) => (
  // AVATARPRIMITIVE.FALLBACK: Elemento de fallback do avatar do Radix UI
  <AvatarPrimitive.Fallback
    ref={ref}  // Ref passada para o elemento
    // CLASSES: Classes CSS para fallback centralizado
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',  // Classes base
      className,  // Classes customizadas
    )}
    {...props}  // Todas as props passadas
  />
))
// DISPLAYNAME: Nome do componente para debugging
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// EXPORTAÇÃO: Exporta todos os componentes do avatar
export { Avatar, AvatarImage, AvatarFallback }
