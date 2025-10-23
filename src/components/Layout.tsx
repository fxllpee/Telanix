// LAYOUT PRINCIPAL DA APLICAÇÃO - ESTRUTURA BASE DE TODAS AS PÁGINAS
// Este componente define a estrutura comum de todas as páginas (header, footer, navegação)

// IMPORTAÇÕES: Componentes necessários
// Outlet = componente do React Router que renderiza as páginas filhas
import { Outlet } from 'react-router-dom'
// Header = cabeçalho da aplicação (logo, menu, busca)
import { Header } from './Header'
// Footer = rodapé da aplicação (links, informações)
import { Footer } from './Footer'
// BottomNav = navegação inferior para mobile (botões de navegação)
import { BottomNav } from './BottomNav'
// InstallPWA = componente para instalação da aplicação como PWA
import { InstallPWA } from './InstallPWA'

// COMPONENTE LAYOUT: Função que retorna a estrutura base da aplicação
export default function Layout() {
  // RETURN: JSX com a estrutura completa da aplicação
  return (
    // CONTAINER PRINCIPAL: Div que organiza toda a estrutura verticalmente
    <div className="flex flex-col min-h-screen bg-background">
      {/* HEADER: Cabeçalho da aplicação (sempre no topo) */}
      <Header />
      
      {/* MAIN: Conteúdo principal da página (cresce para ocupar espaço disponível) */}
      <main className="flex-grow">
        {/* OUTLET: Renderiza o conteúdo da página atual (Index, Movie, Search, etc.) */}
        <Outlet />
      </main>
      
      {/* FOOTER: Rodapé da aplicação (sempre na parte inferior) */}
      <Footer />
      
      {/* BOTTOM NAV: Navegação inferior para dispositivos móveis */}
      <BottomNav />
      
      {/* INSTALL PWA: Componente para instalação da aplicação como app nativo */}
      <InstallPWA />
      
      {/* SPACER: Espaçador para compensar a navegação inferior no mobile */}
      <div className="h-16 md:hidden" /> {/* Altura de 16 (64px) apenas em telas pequenas */}
    </div>
  )
}
