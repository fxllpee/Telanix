import { translations } from '@/lib/translations'

export const useTranslation = () => {
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations['pt-BR'][key as keyof typeof translations['pt-BR']] || key
    
    // Substituir parâmetros na string
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value))
      })
    }
    
    return translation
  }
  
  return { t, language: 'pt-BR' }
}
