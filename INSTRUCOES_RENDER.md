# 🚀 INSTRUÇÕES PASSO A PASSO - RENDER

Você já criou o banco! Agora vamos configurar tudo.

---

## ✅ PASSO 1: EXECUTAR SQL NO BANCO

### 1.1 - Conectar ao banco via PSQL

Na página do Render onde você está:

1. Role até **"Connections"**
2. Clique no botão **"PSQL Command"**
3. Copie o comando (algo como: `PGPASSWORD=xxx psql -h...`)
4. Abra o **PowerShell**
5. Cole e execute o comando

### 1.2 - Executar o SQL

Quando conectar (vai aparecer `telanix=>`), cole este SQL:

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

CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_ratings INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  total_likes INTEGER NOT NULL DEFAULT 0,
  join_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, movie_id)
);

CREATE TABLE IF NOT EXISTS user_ratings (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, movie_id)
);

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

COMMIT;
```

Depois digite `\q` para sair.

---

## ✅ PASSO 2: COPIAR URL DO BANCO

Na página do Render:

1. Role até **"Connections"**
2. Copie a **"Internal Database URL"**
3. Guarde essa URL (vamos usar no próximo passo)

**Exemplo:**
```
postgresql://telanix_user:abc123@dpg-xxxxx-a.oregon-postgres.render.com/telanix
```

---

## ✅ PASSO 3: FAZER PUSH DO CÓDIGO PARA GITHUB

### 3.1 - Criar repositório no GitHub

1. Vá em [github.com/new](https://github.com/new)
2. Nome: `telanix`
3. Visibilidade: **Public**
4. Clique **"Create repository"**

### 3.2 - Fazer push do código

No PowerShell (na pasta do projeto):

```bash
git init
git add .
git commit -m "Deploy inicial TelaNix"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/telanix.git
git push -u origin main
```

---

## ✅ PASSO 4: CRIAR BACKEND NO RENDER

1. No [Dashboard do Render](https://dashboard.render.com)
2. Clique **"New +"** → **"Web Service"**
3. Clique **"Connect GitHub"** (autorize se necessário)
4. Selecione o repositório **telanix**
5. Configure:

```
Name: telanix-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: pnpm install && pnpm build
Start Command: node dist/index.js
Instance Type: Free
```

6. **Environment Variables** - Clique "Add Environment Variable":

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | Cole a URL que copiou no Passo 2 |
| `FRONTEND_URL_PROD` | `https://telanix.onrender.com` |
| `JWT_SECRET` | `telanix_super_secreto_2024` |

7. Clique **"Create Web Service"**
8. **AGUARDE 5-10 minutos** (vai fazer build)
9. Quando terminar, **COPIE A URL** do backend (ex: `https://telanix-backend-xxx.onrender.com`)

---

## ✅ PASSO 5: ATUALIZAR URL DO BACKEND NO CÓDIGO

1. No seu código, abra `src/services/backend-api.ts`
2. Na linha 4, SUBSTITUA pela URL do SEU backend:

```typescript
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api'
  : 'https://SEU-BACKEND-AQUI.onrender.com/api'  // ← TROCAR!
```

3. Salve o arquivo
4. Faça commit e push:

```bash
git add .
git commit -m "Atualizar URL do backend"
git push
```

---

## ✅ PASSO 6: CRIAR FRONTEND NO RENDER

1. No Render, **"New +"** → **"Static Site"**
2. Selecione o repositório **telanix**
3. Configure:

```
Name: telanix
Branch: main
Root Directory: (deixe vazio)
Build Command: pnpm install && pnpm build
Publish Directory: dist
```

4. Clique **"Create Static Site"**
5. **AGUARDE 3-5 minutos**

---

## ✅ PASSO 7: TESTAR!

Quando o deploy terminar:

1. Acesse: `https://telanix.onrender.com`
2. Crie uma conta
3. Curta alguns filmes
4. Verifique no Render → banco → Connect → PSQL:

```sql
SELECT * FROM telanix.users;
```

**Deve aparecer seu usuário!** 🎉

---

## 🆘 PROBLEMAS?

### Backend "Build Failed"

**Solução:** Verificar se o `backend/package.json` tem:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### Frontend não carrega

**Solução:** Pressionar Ctrl+Shift+R no navegador

### Backend "database: disconnected"

**Solução:** Verificar se a DATABASE_URL está correta nas variáveis de ambiente

---

## 📞 ME CHAME SE TRAVAR!

Qualquer problema, me avise em qual passo travou!

