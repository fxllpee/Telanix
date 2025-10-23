// PÁGINA 404 - EXIBIDA QUANDO O USUÁRIO TENTA ACESSAR UMA ROTA INEXISTENTE
// Esta página é exibida automaticamente quando o React Router não encontra uma rota válida

// IMPORTAÇÕES: Hooks do React Router e React
// useLocation = hook para obter informações sobre a localização atual
import { useLocation } from 'react-router-dom'
// useEffect = hook para executar efeitos colaterais
import { useEffect } from 'react'

// COMPONENTE NOTFOUNDPAGE: Função que retorna a página 404
const NotFoundPage = () => {
  // HOOK: useLocation para obter informações da URL atual
  // location = objeto com informações sobre a rota atual (pathname, search, etc.)
  const location = useLocation()

  // EFEITO: Registra erro no console quando página 404 é acessada
  // useEffect = executa código quando o componente é montado ou quando location.pathname muda
  useEffect(() => {
    // CONSOLE.ERROR: Registra erro no console do navegador para debug
    console.error(
      '404 Error: User attempted to access non-existent route:',  // Mensagem de erro
      location.pathname,  // Caminho que o usuário tentou acessar
    )
  }, [location.pathname])  // DEPENDÊNCIA: Executa quando location.pathname muda

  // RETURN: JSX que será renderizado na tela
  return (
    // CONTAINER PRINCIPAL: Div que ocupa toda a altura da tela
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* CONTAINER DO CONTEÚDO: Div centralizada com o conteúdo da página */}
      <div className="text-center">
        {/* TÍTULO: Número 404 em destaque */}
        <h1 className="text-4xl font-bold mb-4">404</h1>
        
        {/* MENSAGEM: Texto explicativo sobre a página não encontrada */}
        <p className="text-xl text-gray-600 mb-4">Ops! Página não encontrada</p>
        
        {/* LINK: Botão para voltar à página inicial */}
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Voltar para Início
        </a>
      </div>
    </div>
  )
}

// EXPORTAÇÃO: Exporta o componente como padrão
export default NotFoundPage
