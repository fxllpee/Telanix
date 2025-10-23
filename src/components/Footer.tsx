// COMPONENTE FOOTER - RODAPÉ DA APLICAÇÃO
// Este componente exibe informações de rodapé, links úteis e redes sociais

// IMPORTAÇÕES: Ícones e componentes de navegação
// Instagram, Facebook = ícones de redes sociais da biblioteca Lucide React
import { Instagram, Facebook } from 'lucide-react'
// Link = componente do React Router para navegação interna
import { Link } from 'react-router-dom'

// COMPONENTE XICON: Ícone personalizado do X (Twitter)
// React.SVGProps<SVGSVGElement> = tipo TypeScript para props de SVG
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // SVG: Elemento SVG que define o ícone do X
  <svg
    xmlns="http://www.w3.org/2000/svg"  // Namespace XML para SVG
    viewBox="0 0 24 24"                 // Área de visualização do SVG (24x24)
    fill="currentColor"                 // Preenche com a cor atual do texto
    {...props}                          // Espalha todas as props recebidas
  >
    {/* PATH: Caminho SVG que desenha o ícone do X */}
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// COMPONENTE FOOTER: Função que retorna o rodapé da aplicação
export const Footer = () => {
  // RETURN: JSX que será renderizado
  return (
    // FOOTER: Elemento semântico HTML para rodapé
    <footer className="bg-background border-t border-accent-1/10 py-8 mt-16">
      {/* CONTAINER: Container principal com layout responsivo */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 px-4">
        
        {/* COPYRIGHT: Texto de direitos autorais */}
        <p className="text-sm text-secondary">
          © 2025 Telanix. Todos os direitos reservados.
        </p>
        
        {/* LINKS ÚTEIS: Links para páginas importantes */}
        <div className="flex items-center gap-6 text-sm text-secondary">
          {/* LINK: Política de Privacidade */}
          <Link to="#" className="transition-colors hover:text-accent-1">
            Política de Privacidade
          </Link>
          
          {/* LINK: Termos de Serviço */}
          <Link to="#" className="transition-colors hover:text-accent-1">
            Termos de Serviço
          </Link>
          
          {/* LINK: Sobre Nós (link interno para página About) */}
          <Link
            to="/quem-somos"  // Rota para página "Quem somos"
            className="transition-colors hover:text-accent-1"
          >
            Sobre Nós
          </Link>
        </div>
        
        {/* REDES SOCIAIS: Ícones das redes sociais */}
        <div className="flex items-center gap-4">
          {/* LINK: Instagram */}
          <a
            href="#"  // URL do Instagram (placeholder)
            aria-label="Instagram"  // Acessibilidade: descrição para leitores de tela
            className="text-secondary transition-colors hover:text-accent-1"
          >
            <Instagram className="h-5 w-5" />  {/* Ícone Instagram 20x20px */}
          </a>
          
          {/* LINK: X (Twitter) */}
          <a
            href="#"  // URL do X (placeholder)
            aria-label="X"  // Acessibilidade: descrição para leitores de tela
            className="text-secondary transition-colors hover:text-accent-1"
          >
            <XIcon className="h-5 w-5" />  {/* Ícone personalizado X 20x20px */}
          </a>
          
          {/* LINK: Facebook */}
          <a
            href="#"  // URL do Facebook (placeholder)
            aria-label="Facebook"  // Acessibilidade: descrição para leitores de tela
            className="text-secondary transition-colors hover:text-accent-1"
          >
            <Facebook className="h-5 w-5" />  {/* Ícone Facebook 20x20px */}
          </a>
        </div>
      </div>
    </footer>
  )
}
