# 🚀 PRÓXIMOS PASSOS - DEPLOY COMPLETO

Você tem a URL do banco! Agora vamos fazer o deploy.

## ✅ URL DO BANCO (GUARDADA):
```
postgresql://telanix_db_user:ZtnsqWh6LrH2eiMbD6StdxgrRgn9GbbK@dpg-d3tascodl3ps73e980gg-a.oregon-postgres.render.com/telanix_db
```

---

## 📦 PASSO 1: FAZER PUSH PARA O GITHUB

### 1.1 - Criar repositório no GitHub
1. Acesse: https://github.com/new
2. Nome do repositório: **telanix**
3. Visibilidade: **Public**
4. **NÃO marque** "Add a README"
5. Clique **"Create repository"**

### 1.2 - Fazer push do código

No PowerShell (na pasta do projeto):

```bash
git init
git add .
git commit -m "Deploy inicial TelaNix"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/telanix.git
git push -u origin main
```

**⚠️ TROQUE "SEU_USUARIO" pelo seu username do GitHub!**

---

## 🔧 PASSO 2: CRIAR BACKEND NO RENDER

### 2.1 - Criar Web Service
1. Volte no [Dashboard do Render](https://dashboard.render.com)
2. Clique **"New +"** → **"Web Service"**
3. Clique **"Connect GitHub"** (autorize se pedir)
4. Selecione o repositório **telanix**
5. Clique **"Connect"**

### 2.2 - Configurar Backend

Preencha assim:

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

### 2.3 - Adicionar Variáveis de Ambiente

Role até **"Environment Variables"** e adicione:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | `postgresql://telanix_db_user:ZtnsqWh6LrH2eiMbD6StdxgrRgn9GbbK@dpg-d3tascodl3ps73e980gg-a.oregon-postgres.render.com/telanix_db` |
| `FRONTEND_URL_PROD` | `https://telanix.onrender.com` |
| `JWT_SECRET` | `telanix_super_secreto_2024_mudar_depois` |

### 2.4 - Criar
Clique **"Create Web Service"** e aguarde (~5-10 min)

---

## 🌐 PASSO 3: ATUALIZAR URL NO FRONTEND

Quando o backend terminar de buildar, você vai receber uma URL tipo:
```
https://telanix-backend-xxxxx.onrender.com
```

### 3.1 - Copiar URL do backend
Na página do backend no Render, copie a URL completa

### 3.2 - Atualizar no código
Abra `src/services/backend-api.ts` e mude a linha 4:

```typescript
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api'
  : 'https://SUA-URL-BACKEND-AQUI.onrender.com/api'  // ← TROCAR!
```

### 3.3 - Fazer push
```bash
git add .
git commit -m "Atualizar URL do backend"
git push
```

---

## 📱 PASSO 4: CRIAR FRONTEND NO RENDER

### 4.1 - Criar Static Site
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
5. Aguarde (~3-5 min)

---

## ✅ PRONTO!

Quando terminar, acesse: **https://telanix.onrender.com**

---

## 🎯 COMEÇAR AGORA?

Você está pronto para começar o Passo 1 (GitHub)?
- Se SIM, me avise que eu te ajudo
- Se ainda não tem conta no GitHub, crie em: https://github.com/signup

