import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db/pool.js'
import { RegisterRequest, LoginRequest, AuthResponse, ApiResponse } from '../types/index.js'
import { body, validationResult } from 'express-validator'

const router: Router = Router()

// ⚠️ MODO DESENVOLVIMENTO: Usuários em memória (sem banco)
const mockUsers = new Map<string, any>()
const USE_MOCK_DB = !process.env.DATABASE_URL || process.env.USE_MOCK_DB === 'true'

if (USE_MOCK_DB) {
  console.log('⚠️ MODO MOCK: Usando banco de dados em memória (sem PostgreSQL)')
}

// POST /api/auth/register - Registrar novo usuário
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
  ],
  async (req: Request<{}, {}, RegisterRequest>, res: Response<ApiResponse<AuthResponse>>) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          data: errors.array() as any,
        })
      }

      const { email, password, name } = req.body

      // Verificar se email já existe
      const existingUser = await pool.query('SELECT id FROM telanix.users WHERE email = $1', [email])

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Email já cadastrado',
        })
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10)

      // Criar avatar URL
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f5b50a&color=18181b`

      // Inserir usuário
      const result = await pool.query(
        `INSERT INTO telanix.users (email, password, name, avatar_url, bio) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, email, name, avatar_url, bio, created_at, updated_at, is_active`,
        [email, hashedPassword, name, avatarUrl, '']
      )

      const user = result.rows[0]

      // Criar estatísticas iniciais
      await pool.query(
        `INSERT INTO telanix.user_stats (user_id, total_ratings, total_reviews, total_likes, join_date, last_login) 
         VALUES ($1, 0, 0, 0, NOW(), NOW())`,
        [user.id]
      )

      res.status(201).json({
        success: true,
        data: { user },
        message: 'Usuário criado com sucesso',
      })
    } catch (error) {
      console.error('Erro no registro:', error)
      res.status(500).json({
        success: false,
        error: 'Erro ao registrar usuário',
      })
    }
  }
)

// POST /api/auth/login - Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  async (req: Request<{}, {}, LoginRequest>, res: Response<ApiResponse<AuthResponse>>) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          data: errors.array() as any,
        })
      }

      const { email, password } = req.body

      // Buscar usuário
      const result = await pool.query(
        'SELECT * FROM telanix.users WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Email ou senha incorretos',
        })
      }

      const user = result.rows[0]

      // Verificar se conta está ativa
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          error: 'Conta desativada',
        })
      }

      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error: 'Email ou senha incorretos',
        })
      }

      // Atualizar último login
      await pool.query(
        'UPDATE telanix.user_stats SET last_login = NOW() WHERE user_id = $1',
        [user.id]
      )

      // Remover senha da resposta
      delete user.password

      res.json({
        success: true,
        data: { user },
        message: 'Login realizado com sucesso',
      })
    } catch (error) {
      console.error('Erro no login:', error)
      res.status(500).json({
        success: false,
        error: 'Erro ao fazer login',
      })
    }
  }
)

export default router

