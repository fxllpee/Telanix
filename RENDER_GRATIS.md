# 💰 RENDER - TOTALMENTE GRATUITO!

## ✅ O QUE É GRÁTIS NO RENDER

### 1. Banco PostgreSQL (FREE Tier)
- **Custo:** R$ 0,00/mês
- **Espaço:** 1 GB
- **Conexões:** 97 simultâneas
- **Backup:** NÃO (mas é grátis)
- **Suficiente para:** Milhares de usuários

### 2. Web Service - Backend (FREE Tier)
- **Custo:** R$ 0,00/mês
- **RAM:** 512 MB
- **Limite:** 750 horas/mês (≈ 31 dias)
- **Build time:** 500 min/mês
- **Bandwidth:** 100 GB/mês
- **⚠️ Limitação:** "Dorme" após 15 min sem uso (demora 1 min pra acordar)

### 3. Static Site - Frontend (FREE Tier)
- **Custo:** R$ 0,00/mês
- **Bandwidth:** 100 GB/mês
- **Build time:** 500 min/mês
- **Deploys:** Ilimitados
- **CDN:** Grátis
- **SSL (HTTPS):** Grátis
- **⚠️ Sem limitação de "dormir"** ✅

---

## 💡 ESTRATÉGIA ECONÔMICA (TUDO GRÁTIS)

### Opção 1: Backend + Frontend Separados (RECOMENDADO)

```
┌─────────────────────────────────────┐
│  🗄️  PostgreSQL Database (FREE)    │  ← Banco de dados
├─────────────────────────────────────┤
│  🔧 Web Service: Backend (FREE)    │  ← API Node.js
├─────────────────────────────────────┤
│  🌐 Static Site: Frontend (FREE)   │  ← Site React
└─────────────────────────────────────┘

TOTAL: R$ 0,00/mês ✅
```

**Vantagens:**
- Frontend NUNCA dorme (sempre rápido)
- Backend só dorme, mas acorda em 1 min
- 100% gratuito

---

## ⚠️ LIMITAÇÕES DO PLANO GRÁTIS

### Backend "Dorme" após 15 min

**O que acontece:**
1. Se ninguém usar por 15 min → backend para
2. Primeira requisição depois → demora ~1 min
3. Depois volta ao normal

**Solução simples:**
```javascript
// Adicionar no frontend (manter backend acordado)
// src/services/backend-api.ts

// Pingar o backend a cada 10 minutos
setInterval(async () => {
  try {
    await fetch(`${API_BASE_URL}/health`);
  } catch (e) {}
}, 10 * 60 * 1000); // 10 minutos
```

---

## 🚀 QUANDO PRECISA PAGAR?

Só precisa pagar se:

1. **Muito tráfego** (mais de 100GB/mês de banda)
2. **Backend sempre rápido** (sem "dormir")
3. **Mais poder** (mais RAM, CPU)

### Planos Pagos (SE precisar):

| Plano | Preço | O que muda |
|-------|-------|------------|
| **PostgreSQL Starter** | $7/mês | 10 GB, backups automáticos |
| **Web Service Starter** | $7/mês | Nunca dorme, 512MB RAM |
| **Static Site** | Sempre grátis | Sem limites |

---

## 📊 CÁLCULO DE USO (TelaNix)

### Cenário Real:

**100 usuários/dia**
- Requisições: ~10.000/dia
- Banda: ~5 GB/mês
- Build: ~30 min/mês

**Resultado:** GRÁTIS! ✅

**1.000 usuários/dia**
- Requisições: ~100.000/dia
- Banda: ~50 GB/mês
- Build: ~30 min/mês

**Resultado:** AINDA GRÁTIS! ✅

---

## 🎯 RESUMO

### Para TCC/Apresentação:
**TUDO GRÁTIS!**

### Para produção pequena/média:
**TUDO GRÁTIS!**

### Para startup com milhares de usuários:
**Provavelmente ainda grátis!**

---

## 🔗 ALTERNATIVAS TAMBÉM GRÁTIS

Se não gostar do Render:

1. **Vercel** (frontend) - Grátis
2. **Railway** (backend + DB) - $5 crédito/mês grátis
3. **Fly.io** (backend + DB) - 3 VMs grátis
4. **Supabase** (DB + Auth) - Grátis até 500MB

---

## ✅ CONCLUSÃO

**VOCÊ NÃO VAI PAGAR NADA!**

Para seu TCC e até para um site com alguns milhares de usuários, o plano gratuito do Render é mais que suficiente.

A única "desvantagem" é que na primeira requisição após 15 min de inatividade, o backend demora ~1 minuto para acordar. Depois disso, funciona perfeitamente.

---

**💡 DICA FINAL:**

Se na apresentação o site demorar na primeira vez, explique:
> "O backend está hospedado gratuitamente e 'dorme' após inatividade. Em produção paga, isso não acontece."

Mas sinceramente, para TCC é perfeito do jeito que está! 🎉

