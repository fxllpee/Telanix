import { Router, Request, Response } from 'express'
import { pool } from '../db/pool.js'
import { authenticateUser } from '../middleware/auth.js'
import { ApiResponse, Review } from '../types/index.js'
import { body, validationResult } from 'express-validator'

const router: Router = Router()

// GET /api/reviews/movie/:movieId - Buscar reviews de um filme
router.get('/movie/:movieId', async (req: Request, res: Response<ApiResponse<Review[]>>) => {
  try {
    const { movieId } = req.params

    const result = await pool.query(
      `SELECT * FROM telanix.reviews 
       WHERE movie_id = $1 
       ORDER BY helpful DESC, created_at DESC`,
      [parseInt(movieId)]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Erro ao buscar reviews:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar reviews',
    })
  }
})

// GET /api/reviews/user/:userId - Buscar reviews de um usuário
router.get('/user/:userId', async (req: Request, res: Response<ApiResponse<Review[]>>) => {
  try {
    const { userId } = req.params

    const result = await pool.query(
      `SELECT * FROM telanix.reviews 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Erro ao buscar reviews:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar reviews',
    })
  }
})

// POST /api/reviews - Criar nova review
router.post(
  '/',
  authenticateUser,
  [
    body('movie_id').isInt().withMessage('ID do filme inválido'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating deve ser entre 1 e 5'),
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('content').notEmpty().withMessage('Conteúdo é obrigatório'),
  ],
  async (req: Request, res: Response<ApiResponse<Review>>) => {
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
      const { movie_id, rating, title, content, spoiler = false } = req.body

      // Buscar dados do usuário
      const userResult = await pool.query(
        'SELECT name, avatar_url FROM telanix.users WHERE id = $1',
        [userId]
      )

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        })
      }

      const user = userResult.rows[0]

      // Inserir review
      const result = await pool.query(
        `INSERT INTO telanix.reviews (movie_id, user_id, user_name, user_avatar, rating, title, content, spoiler, helpful) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0) 
         RETURNING *`,
        [movie_id, userId, user.name, user.avatar_url, rating, title, content, spoiler]
      )

      // Atualizar estatísticas do usuário
      await pool.query(
        'UPDATE telanix.user_stats SET total_reviews = total_reviews + 1 WHERE user_id = $1',
        [userId]
      )

      res.status(201).json({
        success: true,
        data: result.rows[0],
        message: 'Review criada com sucesso',
      })
    } catch (error) {
      console.error('Erro ao criar review:', error)
      res.status(500).json({
        success: false,
        error: 'Erro ao criar review',
      })
    }
  }
)

// PUT /api/reviews/:id/helpful - Incrementar helpful em uma review
router.put('/:id/helpful', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params

    await pool.query(
      'UPDATE telanix.reviews SET helpful = helpful + 1 WHERE id = $1',
      [id]
    )

    res.json({
      success: true,
      message: 'Marcado como útil',
    })
  } catch (error) {
    console.error('Erro ao atualizar helpful:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar',
    })
  }
})

// DELETE /api/reviews/:id - Deletar review
router.delete('/:id', authenticateUser, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params
    const userId = (req as any).userId

    // Verificar se a review pertence ao usuário
    const checkResult = await pool.query(
      'SELECT user_id FROM telanix.reviews WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review não encontrada',
      })
    }

    if (checkResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado',
      })
    }

    // Deletar review
    await pool.query('DELETE FROM telanix.reviews WHERE id = $1', [id])

    // Atualizar estatísticas
    await pool.query(
      'UPDATE telanix.user_stats SET total_reviews = total_reviews - 1 WHERE user_id = $1',
      [userId]
    )

    res.json({
      success: true,
      message: 'Review deletada com sucesso',
    })
  } catch (error) {
    console.error('Erro ao deletar review:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar review',
    })
  }
})

export default router

