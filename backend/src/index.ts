// SERVIDOR BACKEND - API REST DO TELANIX
// Este arquivo cria o servidor Node.js que responde requisições HTTP

// IMPORTS: Bibliotecas necessárias
import express, { Request, Response } from 'express'  // Framework web Express
import cors from 'cors'                               // Permitir requisições de outros domínios
import compression from 'compression'                 // Comprimir respostas HTTP (economiza banda)
import dotenv from 'dotenv'                          // Ler variáveis de ambiente (.env)
import { pool } from './db/pool.js'                  // Pool de conexões com PostgreSQL
import { initTables } from './db/init-tables.js'     // Criar tabelas no banco

// IMPORTS: Rotas da API (cada arquivo gerencia um tipo de requisição)
import authRoutes from './routes/auth.js'       // Rotas de autenticação (login, registro)
import usersRoutes from './routes/users.js'     // Rotas de usuários (perfil, estatísticas)
import reviewsRoutes from './routes/reviews.js' // Rotas de reviews (criar, listar, deletar)
import ratingsRoutes from './routes/ratings.js' // Rotas de avaliações (1-5 estrelas)
import likesRoutes from './routes/likes.js'     // Rotas de curtidas (like/unlike)

// CARREGAR VARIÁVEIS DE AMBIENTE: Lê arquivo .env (DATABASE_URL, PORT, etc)
dotenv.config()

// CRIAR APLICAÇÃO EXPRESS: Instância do servidor web
const app = express()
const PORT = process.env.PORT || 3001  // Porta 3001 por padrão

// MIDDLEWARE 1: Compressão - reduz tamanho das respostas em ~70%
app.use(compression())

// MIDDLEWARE 2: JSON Parser - permite ler JSON no body das requisições
app.use(express.json())

// MIDDLEWARE 3: URL Encoded - permite ler dados de formulários
app.use(express.urlencoded({ extended: true }))

// MIDDLEWARE 4: CORS - permitir que o frontend acesse o backend
// Lista de origins (domínios) permitidos a fazer requisições
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV || 'http://localhost:8080',          // Desenvolvimento local
  process.env.FRONTEND_URL_PROD || 'https://telanix.onrender.com', // Produção
  'http://localhost:5173',                                          // Vite porta alternativa
]

// Aplicar configuração CORS
app.use(
  cors({
    // Função que verifica se a origin é permitida
    origin: (origin, callback) => {
      // Se não tem origin (ex: Postman, apps mobile), permitir
      if (!origin) return callback(null, true)
      
      // Se origin está na lista permitida, permitir
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        // Origin não permitida, mas permitir mesmo assim em dev
        console.warn('⚠️ Origin não permitida:', origin)
        callback(null, true)
      }
    },
    credentials: true, // Permitir envio de cookies
  })
)

// REGISTRAR ROTAS: Conectar arquivos de rotas com endpoints da API
app.use('/api/auth', authRoutes)       // /api/auth/login, /api/auth/register
app.use('/api/users', usersRoutes)     // /api/users/:id, /api/users/:id/stats
app.use('/api/reviews', reviewsRoutes) // /api/reviews, /api/reviews/movie/:id
app.use('/api/ratings', ratingsRoutes) // /api/ratings, /api/ratings/user/:id
app.use('/api/likes', likesRoutes)     // /api/likes, /api/likes/user/:id

// ROTA HEALTH CHECK: Verifica se o servidor e banco estão funcionando
// Acesse: http://localhost:3001/health
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Tenta fazer uma query simples no banco (SELECT 1)
    await pool.query('SELECT 1')
    
    // Se deu certo, retornar sucesso
    res.json({
      status: 'ok',
      message: 'TelaNix API está funcionando!',
      timestamp: new Date().toISOString(),
      database: 'connected',
    })
  } catch (error) {
    // Se deu erro, retornar erro 500
    res.status(500).json({
      status: 'error',
      message: 'Erro ao conectar com banco de dados',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    })
  }
})

// ROTA RAIZ: Informações sobre a API
// Acesse: http://localhost:3001/
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'TelaNix API',
    version: '1.0.0',
    description: 'API REST para sistema de avaliação de filmes',
    endpoints: {
      auth: '/api/auth (register, login)',
      users: '/api/users',
      reviews: '/api/reviews',
      ratings: '/api/ratings',
      likes: '/api/likes',
      health: '/health',
    },
  })
})

// HANDLER 404: Rota não encontrada
// Executado quando nenhuma rota corresponde à URL acessada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    path: req.path,
  })
})

// HANDLER DE ERROS: Captura erros não tratados
// Executado quando ocorre um erro em qualquer rota
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('❌ Erro no servidor:', err)
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    // Só mostra mensagem detalhada em desenvolvimento (segurança)
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// INICIAR SERVIDOR: Coloca o servidor online na porta especificada
app.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════╗
║     🎬 TelaNix API Server 🎬         ║
╠═══════════════════════════════════════╣
║  Status: ✅ Rodando                   ║
║  Porta: ${PORT}                       ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}           ║
║  URL: http://localhost:${PORT}        ║
╚═══════════════════════════════════════╝
  `)
  
  // Criar tabelas no banco de dados (se não existirem)
  try {
    await initTables()
  } catch (error) {
    console.error('Erro ao inicializar tabelas, mas servidor continua rodando')
  }
})

// GRACEFUL SHUTDOWN: Fechar servidor corretamente quando receber sinal de término
// SIGTERM = sinal enviado pelo sistema para encerrar processo (ex: Ctrl+C no Docker)
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM recebido, fechando servidor...')
  await pool.end()  // Fechar todas as conexões com o banco
  process.exit(0)   // Sair do processo com código 0 (sucesso)
})

// SIGINT = sinal enviado quando pressiona Ctrl+C no terminal
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT recebido, fechando servidor...')
  await pool.end()  // Fechar todas as conexões com o banco
  process.exit(0)   // Sair do processo com código 0 (sucesso)
})

