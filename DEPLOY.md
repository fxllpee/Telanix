# 🚀 GUIA RÁPIDO - DEPLOY NO RENDER

## 📋 PRÉ-REQUISITOS

✅ Conta no [Render](https://render.com) (gratuita)
✅ Conta no [GitHub](https://github.com)
✅ Código do TelaNix em um repositório GitHub

---

## PASSO 1: CRIAR BANCO PostgreSQL

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique **"New +"** > **"PostgreSQL"**
3. Configurações:
   - **Name:** `telanix-db`
   - **Database:** `telanix`
   - **Region:** `Oregon (US West)`
   - **Plan:** `Free`
4. Clique **"Create Database"**
5. **AGUARDE** até status `Available` (~2 minutos)
6. **COPIE** a **"Internal Database URL"**

### Executar Script SQL:

1. Na página do banco, clique **"Connect"**
2. Copie o comando **"PSQL Command"**
3. Abra terminal e execute
4. Dentro do psql, cole o SQL abaixo:

```sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS telanix;
SET search_path TO telanix, public;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_ratings INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  total_likes INTEGER NOT NULL DEFAULT 0,
  join_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_user_stats_join_date ON user_stats (join_date DESC);

CREATE TABLE IF NOT EXISTS user_likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, movie_id)
);
CREATE INDEX IF NOT EXISTS idx_user_likes_user ON user_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_movie ON user_likes (movie_id);

CREATE TABLE IF NOT EXISTS user_ratings (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, movie_id)
);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user ON user_ratings (user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_movie ON user_ratings (movie_id);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  helpful INTEGER NOT NULL DEFAULT 0,
  spoiler BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_movie ON reviews (movie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews (user_id);

COMMIT;
```

---

## PASSO 2: CRIAR WEB SERVICE (BACKEND)

1. No Dashboard do Render, clique **"New +"** > **"Web Service"**
2. **Conecte seu repositório GitHub**
3. Selecione o repositório **TelaNix**
4. Configurações:

```
Name: telanix-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: pnpm install && pnpm build
Start Command: pnpm start
```

5. **Environment Variables** (clique "Add Environment Variable"):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | Cole a **Internal Database URL** do Passo 1 |
| `FRONTEND_URL_PROD` | `https://telanix.onrender.com` |
| `JWT_SECRET` | `telanix_secreto_2024_mudar` |

6. Clique **"Create Web Service"**
7. **AGUARDE** o deploy (~5-10 min)
8. **COPIE** a URL do backend (ex: `https://telanix-backend.onrender.com`)

### Verificar:
```
https://telanix-backend.onrender.com/health
```
Deve retornar: `{"status":"ok","database":"connected"}`

---

## PASSO 3: ATUALIZAR FRONTEND

1. No seu código, abra `src/services/backend-api.ts`
2. Verifique se a linha está assim:

```typescript
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api'
  : 'https://telanix-backend.onrender.com/api'  // ← TROCAR PELA SUA URL
```

3. **SUBSTITUA** `telanix-backend.onrender.com` pela URL do SEU backend
4. **Commit e push** para o GitHub:

```bash
git add .
git commit -m "Atualizar URL do backend"
git push
```

---

## PASSO 4: DEPLOY FRONTEND

### Opção A: Site Estático (Recomendado)

1. No Render, **"New +"** > **"Static Site"**
2. Selecione o repositório **TelaNix**
3. Configurações:

```
Name: telanix
Branch: main
Build Command: pnpm install && pnpm build
Publish Directory: dist
```

4. Clique **"Create Static Site"**
5. **AGUARDE** o deploy (~3-5 min)
6. **SUA URL FINAL:** `https://telanix.onrender.com`

### Opção B: Web Service

1. **"New +"** > **"Web Service"**
2. Configurações:

```
Name: telanix-frontend
Branch: main
Build Command: pnpm install && pnpm build
Start Command: pnpm preview
```

---

## ✅ TESTAR

1. Acesse: `https://telanix.onrender.com`
2. Crie uma conta
3. Curta filmes
4. Verifique no pgAdmin se salvou no banco

---

## 🔧 PROBLEMAS COMUNS

### Backend "database: disconnected"
**Solução:** Verificar DATABASE_URL nas variáveis de ambiente

### Frontend não carrega filmes
**Solução:** Pressionar Ctrl+Shift+R no navegador

### Backend demora 1 minuto na primeira requisição
**Normal:** Tier gratuito dorme após 15 min de inatividade

---

## 💰 CUSTOS

- **Banco PostgreSQL:** Gratuito (500MB)
- **Backend:** Gratuito (750 horas/mês)
- **Frontend:** Gratuito (100GB/mês)

**TOTAL: R$ 0,00/mês** ✅

---

## 📍 CHECKLIST

- [ ] Banco criado no Render
- [ ] Script SQL executado
- [ ] Backend deployado
- [ ] Variáveis de ambiente configuradas
- [ ] Backend respondendo /health
- [ ] URL do backend atualizada no frontend
- [ ] Frontend deployado
- [ ] Site acessível
- [ ] Criar conta funciona
- [ ] Curtir filme funciona
- [ ] Dados salvos no PostgreSQL

---

**PRONTO! SEU SITE ESTÁ NO AR! 🎉**

