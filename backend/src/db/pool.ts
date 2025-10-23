import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Configuração do pool de conexões PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Máximo de conexões no pool
  min: 2, // Mínimo de conexões sempre ativas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxUses: 7500, // Reciclar conexões após 7500 queries
})

// Teste de conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL')
})

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no PostgreSQL:', err)
  process.exit(-1)
})

// Helper function para queries (com logging otimizado)
export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  
  // Log apenas queries lentas (> 100ms) em produção
  if (process.env.NODE_ENV !== 'production' || duration > 100) {
    console.log('Executed query', { 
      text: text.substring(0, 50), // Truncar query longa
      duration, 
      rows: res.rowCount 
    })
  }
  return res
}

export default pool

