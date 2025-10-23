// ARQUIVO PRINCIPAL - Ponto de entrada do React
// Este é o primeiro arquivo executado quando o site abre

// Importar função createRoot do React 18+ (renderiza React no navegador)
import { createRoot } from 'react-dom/client'

// Importar componente principal App (contém todas as rotas e páginas)
import App from './App.tsx'

// Importar estilos globais (Tailwind CSS)
import './main.css'

// INICIAR APLICAÇÃO REACT:
// 1. Busca o elemento HTML com id="root" (está no index.html)
// 2. Cria uma raiz React nesse elemento
// 3. Renderiza o componente <App /> dentro dessa raiz
createRoot(document.getElementById('root')!).render(<App />)
