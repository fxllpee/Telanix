import { Router, Request, Response } from 'express'
import { pool } from '../db/pool.js'
import { authenticateUser } from '../middleware/auth.js'
import { ApiResponse, Rating } from '../types/index.js'
import { body, validationResult } from 'express-validator'

const router: Router = Router()

// GET /api/ratings/user/:userId - Buscar ratings de um usuário
router.get('/user/:userId', async (req: Request, res: Response<ApiResponse<Rating[]>>) => {
  try {
    const { userId } = req.params

    const result = await pool.query(
      'SELECT * FROM telanix.user_ratings WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Erro ao buscar ratings:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar ratings',
    })
  }
})

// GET /api/ratings/user/:userId/movie/:movieId - Buscar rating específico
router.get('/user/:userId/movie/:movieId', async (req: Request, res: Response<ApiResponse<Rating>>) => {
  try {
    const { userId, movieId } = req.params

    const result = await pool.query(
      'SELECT * FROM telanix.user_ratings WHERE user_id = $1 AND movie_id = $2',
      [userId, parseInt(movieId)]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Rating não encontrado',
      })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Erro ao buscar rating:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar rating',
    })
  }
})

// POST /api/ratings - Criar ou atualizar rating
router.post(
  '/',
  authenticateUser,
  [
    body('movie_id').isInt().withMessage('ID do filme inválido'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating deve ser entre 1 e 5'),
  ],
  async (req: Request, res: Response<ApiResponse<Rating>>) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          data: errors.array() as any,
        })
      }

      const userId = (req as any).userId
      const { movie_id, rating } = req.body

      // Verificar se já existe rating
      const existingRating = await pool.query(
        'SELECT * FROM telanix.user_ratings WHERE user_id = $1 AND movie_id = $2',
        [userId, movie_id]
      )

      let result
      if (existingRating.rows.length > 0) {
        // Atualizar rating existente
        result = await pool.query(
          `UPDATE telanix.user_ratings 
           SET rating = $1, updated_at = NOW() 
           WHERE user_id = $2 AND movie_id = $3 
           RETURNING *`,
          [rating, userId, movie_id]
        )
      } else {
        // Criar novo rating
        result = await pool.query(
          `INSERT INTO telanix.user_ratings (user_id, movie_id, rating) 
           VALUES ($1, $2, $3) 
           RETURNING *`,
          [userId, movie_id, rating]
        )

        // Incrementar estatísticas
        await pool.query(
          'UPDATE telanix.user_stats SET total_ratings = total_ratings + 1 WHERE user_id = $1',
          [userId]
        )
      }

      res.json({
        success: true,
        data: result.rows[0],
        message: existingRating.rows.length > 0 ? 'Rating atualizado' : 'Rating criado',
      })
    } catch (error) {
      console.error('Erro ao salvar rating:', error)
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar rating',
      })
    }
  }
)

// DELETE /api/ratings/movie/:movieId - Deletar rating
router.delete('/movie/:movieId', authenticateUser, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { movieId } = req.params
    const userId = (req as any).userId

    const result = await pool.query(
      'DELETE FROM telanix.user_ratings WHERE user_id = $1 AND movie_id = $2',
      [userId, parseInt(movieId)]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Rating não encontrado',
      })
    }

    // Decrementar estatísticas
    await pool.query(
      'UPDATE telanix.user_stats SET total_ratings = total_ratings - 1 WHERE user_id = $1',
      [userId]
    )

    res.json({
      success: true,
      message: 'Rating removido',
    })
  } catch (error) {
    console.error('Erro ao remover rating:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao remover rating',
    })
  }
})

export default router

