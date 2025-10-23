# 🚀 Deploy do TelaNix no Render

Este guia mostra como fazer o deploy completo do TelaNix no Render (backend + banco de dados PostgreSQL).

## 📋 Pré-requisitos

- Conta no [Render](https://render.com) (gratuita)
- Conta no [GitHub](https://github.com) 
- Código do TelaNix em um repositório GitHub

---

## 🗄️ PASSO 1: Criar Banco de Dados PostgreSQL

1. Acesse o [Dashboard do Render](https://dashboard.render.com)
2. Clique em **"New +"** > **"PostgreSQL"**
3. Configure:
   - **Name:** `telanix-db`
   - **Database:** `telanix`
   - **User:** (deixe o padrão)
   - **Region:** `Oregon (US West)` (mais rápido)
   - **Plan:** **Free**
4. Clique em **"Create Database"**
5. **AGUARDE** alguns minutos até o status ficar `Available`

### 📝 Executar Script SQL no Banco

Após o banco estar disponível:

1. No dashboard do banco, vá em **"Connect"** > **"External Connection"**
2. Copie a **"PSQL Command"** (algo como `psql -h... -U...`)
3. Ou use o **Query Tool do pgAdmin:**
   - Crie uma nova conexão com os dados fornecidos
   - Copie o conteúdo do arquivo `db/init.sql`
   - Cole no Query Tool e execute

---

## 🌐 PASSO 2: Criar Web Service (Backend)

1. No Dashboard do Render, clique em **"New +"** > **"Web Service"**
2. **Conecte seu repositório GitHub** (se ainda não conectou)
3. Selecione o repositório **TelaNix**
4. Configure:

### Build & Deploy

```
Name: telanix-backend
Region: Oregon (US West)
Branch: main (ou master)
Root Directory: backend
Runtime: Node
Build Command: pnpm install && pnpm build
Start Command: pnpm start
```

### Environment Variables

Adicione as seguintes variáveis:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | Cole a **Internal Database URL** do banco criado no Passo 1 |
| `FRONTEND_URL_PROD` | `https://telanix.onrender.com` (ou sua URL do frontend) |
| `JWT_SECRET` | `gere_uma_string_aleatoria_segura_aqui` |

**Para obter a DATABASE_URL:**
- Vá no banco `telanix-db` criado
- Aba **"Connect"** > **"Internal Database URL"**
- Copie e cole em `DATABASE_URL`

5. Clique em **"Create Web Service"**
6. **AGUARDE** o deploy (5-10 minutos na primeira vez)

### ✅ Verificar Deploy

Após o deploy, acesse:
```
https://telanix-backend.onrender.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "TelaNix API está funcionando!",
  "database": "connected"
}
```

---

## 🎨 PASSO 3: Atualizar Frontend

O frontend já está hospedado no Render. Agora precisa apontar para o backend em produção.

### Opção A: Frontend no mesmo repositório

1. No Dashboard do Render, vá no serviço do frontend
2. Em **Environment Variables**, adicione:
   ```
   VITE_API_URL=https://telanix-backend.onrender.com/api
   ```
3. Clique em **"Manual Deploy" > "Deploy latest commit"**

### Opção B: Build Local e Deploy

1. No arquivo `src/services/backend-api.ts`, a URL já está configurada:
   ```typescript
   const API_BASE_URL = import.meta.env.DEV 
     ? 'http://localhost:3001/api'
     : 'https://telanix-backend.onrender.com/api'
   ```

2. Se sua URL do backend for diferente, ajuste e faça commit

---

## 🔒 Passo 4: Inicializar Banco de Dados (Se ainda não fez)

Se você ainda não executou o script SQL no banco do Render:

### Via psql (Terminal)

```bash
# Copie o comando PSQL do Render
psql -h dpg-XXXXX.oregon-postgres.render.com -U telanix_user telanix

# Dentro do psql, copie e cole o conteúdo de db/init.sql
```

### Via pgAdmin

1. No pgAdmin, **Add New Server**
2. Preencha com os dados da conexão do Render:
   - Host: `dpg-XXXXX.oregon-postgres.render.com`
   - Port: `5432`
   - Database: `telanix`
   - Username: (fornecido pelo Render)
   - Password: (fornecido pelo Render)
3. Abra o **Query Tool**
4. Copie todo o conteúdo de `db/init.sql`
5. Execute (F5)

---

## ✅ Verificação Final

### 1. Backend
```bash
curl https://telanix-backend.onrender.com/health
```

### 2. Banco de Dados
No pgAdmin, execute:
```sql
SELECT * FROM telanix.users;
```

Deve mostrar os usuários de exemplo.

### 3. Frontend
Acesse seu site e:
- ✅ Faça login
- ✅ Curta um filme
- ✅ Avalie um filme
- ✅ Escreva uma review

---

## 🐛 Problemas Comuns

### Backend não conecta ao banco

**Erro:** `database: "disconnected"`

**Solução:**
- Verifique se a `DATABASE_URL` está correta
- Use a **Internal Database URL** (não a External)
- Certifique-se que o banco está `Available`

### CORS Error no Frontend

**Erro:** `Access to fetch blocked by CORS policy`

**Solução:**
- Verifique se a `FRONTEND_URL_PROD` no backend está correta
- Redeploy do backend após atualizar

### Backend muito lento

**Causa:** Free tier do Render dorme após 15 minutos de inatividade

**Solução:**
- Primeira requisição após sleep demora ~1 minuto
- Considere upgrade para Hobby plan ($7/mês)
- Ou use um serviço de "keep-alive" (ex: UptimeRobot)

---

## 💰 Custos

- **Banco PostgreSQL:** Gratuito (500MB de storage)
- **Backend:** Gratuito (750 horas/mês)
- **Frontend:** Gratuito (100GB bandwidth/mês)

**Total:** R$ 0,00 / mês 🎉

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Dashboard do Render
2. Teste o backend com `curl`
3. Verifique as variáveis de ambiente
4. Consulte a [documentação do Render](https://render.com/docs)

---

**Desenvolvido com ❤️ para TelaNix**

