import { Router, Request, Response } from 'express'
import { pool } from '../db/pool.js'
import { authenticateUser } from '../middleware/auth.js'
import { ApiResponse, Like } from '../types/index.js'

const router: Router = Router()

// GET /api/likes/user/:userId - Buscar filmes curtidos por um usuário
router.get('/user/:userId', async (req: Request, res: Response<ApiResponse<number[]>>) => {
  try {
    const { userId } = req.params

    const result = await pool.query(
      'SELECT movie_id FROM telanix.user_likes WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    )

    // Retornar apenas array de IDs de filmes
    const movieIds = result.rows.map((row) => row.movie_id)

    res.json({
      success: true,
      data: movieIds,
    })
  } catch (error) {
    console.error('Erro ao buscar likes:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar likes',
    })
  }
})

// POST /api/likes - Curtir um filme
router.post('/', authenticateUser, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).userId
    const { movie_id } = req.body

    if (!movie_id) {
      return res.status(400).json({
        success: false,
        error: 'ID do filme é obrigatório',
      })
    }

    // Verificar se já curtiu
    const existing = await pool.query(
      'SELECT * FROM telanix.user_likes WHERE user_id = $1 AND movie_id = $2',
      [userId, movie_id]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Filme já curtido',
      })
    }

    // Inserir like
    await pool.query(
      'INSERT INTO telanix.user_likes (user_id, movie_id) VALUES ($1, $2)',
      [userId, movie_id]
    )

    // Atualizar estatísticas
    await pool.query(
      'UPDATE telanix.user_stats SET total_likes = total_likes + 1 WHERE user_id = $1',
      [userId]
    )

    res.status(201).json({
      success: true,
      message: 'Filme curtido',
    })
  } catch (error) {
    console.error('Erro ao curtir filme:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao curtir filme',
    })
  }
})

// DELETE /api/likes/movie/:movieId - Descurtir um filme
router.delete('/movie/:movieId', authenticateUser, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { movieId } = req.params
    const userId = (req as any).userId

    const result = await pool.query(
      'DELETE FROM telanix.user_likes WHERE user_id = $1 AND movie_id = $2',
      [userId, parseInt(movieId)]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Like não encontrado',
      })
    }

    // Atualizar estatísticas
    await pool.query(
      'UPDATE telanix.user_stats SET total_likes = total_likes - 1 WHERE user_id = $1',
      [userId]
    )

    res.json({
      success: true,
      message: 'Like removido',
    })
  } catch (error) {
    console.error('Erro ao remover like:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao remover like',
    })
  }
})

export default router

