/**
 * Hook para validação de dados de usuário
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const useValidation = () => {
  const validateEmail = (email: string): ValidationResult => {
    const errors: string[] = []
    
    if (!email) {
      errors.push('Email é obrigatório')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email deve ter um formato válido')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const validatePassword = (password: string): ValidationResult => {
    const errors: string[] = []
    
    if (!password) {
      errors.push('Senha é obrigatória')
    } else if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres')
    } else if (password.length > 50) {
      errors.push('Senha deve ter no máximo 50 caracteres')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const validateName = (name: string): ValidationResult => {
    const errors: string[] = []
    
    if (!name) {
      errors.push('Nome é obrigatório')
    } else if (name.length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres')
    } else if (name.length > 100) {
      errors.push('Nome deve ter no máximo 100 caracteres')
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
      errors.push('Nome deve conter apenas letras e espaços')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const validateUser = (email: string, password: string, name?: string): ValidationResult => {
    const errors: string[] = []
    
    // Validar email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors)
    }
    
    // Validar senha
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors)
    }
    
    // Validar nome (se fornecido)
    if (name !== undefined) {
      const nameValidation = validateName(name)
      if (!nameValidation.isValid) {
        errors.push(...nameValidation.errors)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const validateLogin = (email: string, password: string): ValidationResult => {
    return validateUser(email, password)
  }

  const validateRegister = (email: string, password: string, name: string): ValidationResult => {
    return validateUser(email, password, name)
  }

  return {
    validateEmail,
    validatePassword,
    validateName,
    validateUser,
    validateLogin,
    validateRegister
  }
}
