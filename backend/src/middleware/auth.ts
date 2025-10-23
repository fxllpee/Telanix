import { Request, Response, NextFunction } from 'express'

// Middleware simples de autenticação (sem JWT por enquanto)
// Em produção, usar JWT tokens
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Não autenticado. Faça login primeiro.',
    })
  }

  // Adiciona userId ao request para uso nas rotas
  (req as any).userId = userId
  next()
}

// Middleware para validar requisições
export const validateRequest = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req)
      if (!result.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: result.array(),
        })
      }
    }
    next()
  }
}

