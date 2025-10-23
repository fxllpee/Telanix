import { Router, Request, Response } from 'express'
import { pool } from '../db/pool.js'
import { authenticateUser } from '../middleware/auth.js'
import { ApiResponse, User, UserStats } from '../types/index.js'

const router: Router = Router()

// GET /api/users/:id - Buscar usuário por ID
router.get('/:id', async (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT id, email, name, avatar_url, bio, created_at, updated_at, is_active FROM telanix.users WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário',
    })
  }
})

// GET /api/users/:id/stats - Buscar estatísticas do usuário
router.get('/:id/stats', async (req: Request, res: Response<ApiResponse<UserStats>>) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT * FROM telanix.user_stats WHERE user_id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Estatísticas não encontradas',
      })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
    })
  }
})

// PUT /api/users/:id - Atualizar perfil do usuário
router.put('/:id', authenticateUser, async (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params
    const userId = (req as any).userId

    // Verificar se o usuário está atualizando o próprio perfil
    if (id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado',
      })
    }

    const { name, bio, avatar_url } = req.body

    const result = await pool.query(
      `UPDATE telanix.users 
       SET name = COALESCE($1, name),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, name, avatar_url, bio, created_at, updated_at, is_active`,
      [name, bio, avatar_url, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      })
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Perfil atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar perfil',
    })
  }
})

export default router

