# TelaNix Backend API

Backend API REST para o sistema de avaliação de filmes TelaNix.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **pg** - Driver PostgreSQL nativo
- **bcrypt** - Hash de senhas
- **CORS** - Cross-Origin Resource Sharing

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado e rodando
- pnpm (ou npm/yarn)

## 🔧 Instalação Local

### 1. Instalar dependências
```bash
cd backend
pnpm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `env.example.txt` e renomeie para `.env`:

```bash
cp env.example.txt .env
```

Edite o `.env` e configure suas credenciais do PostgreSQL local:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/telanix_db
FRONTEND_URL_DEV=http://localhost:8080
```

### 3. Criar banco de dados no PostgreSQL

Abra o pgAdmin e execute:

```sql
CREATE DATABASE telanix_db;
```

Depois execute o script de inicialização:

```bash
psql -U seu_usuario -d telanix_db -f ../db/init.sql
```

Ou copie e cole o conteúdo do arquivo `../db/init.sql` no Query Tool do pgAdmin.

### 4. Iniciar o servidor

```bash
# Modo desenvolvimento (hot reload)
pnpm dev

# Ou build + produção
pnpm build
pnpm start
```

O servidor estará rodando em `http://localhost:3001`

## 📚 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login

### Usuários

- `GET /api/users/:id` - Buscar usuário
- `GET /api/users/:id/stats` - Estatísticas do usuário
- `PUT /api/users/:id` - Atualizar perfil (requer auth)

### Reviews

- `GET /api/reviews/movie/:movieId` - Reviews de um filme
- `GET /api/reviews/user/:userId` - Reviews de um usuário
- `POST /api/reviews` - Criar review (requer auth)
- `PUT /api/reviews/:id/helpful` - Marcar como útil
- `DELETE /api/reviews/:id` - Deletar review (requer auth)

### Ratings

- `GET /api/ratings/user/:userId` - Ratings de um usuário
- `GET /api/ratings/user/:userId/movie/:movieId` - Rating específico
- `POST /api/ratings` - Criar/atualizar rating (requer auth)
- `DELETE /api/ratings/movie/:movieId` - Remover rating (requer auth)

### Likes

- `GET /api/likes/user/:userId` - Filmes curtidos
- `POST /api/likes` - Curtir filme (requer auth)
- `DELETE /api/likes/movie/:movieId` - Descurtir filme (requer auth)

### Health Check

- `GET /health` - Status da API e banco de dados
- `GET /` - Informações da API

## 🔐 Autenticação

Para endpoints que requerem autenticação, envie o header:

```
x-user-id: <user_id>
```

## 🌐 Deploy no Render

### 1. Criar banco PostgreSQL no Render
1. Acesse [render.com](https://render.com)
2. New > PostgreSQL
3. Copie a **Internal Database URL**

### 2. Criar Web Service
1. New > Web Service
2. Conecte seu repositório GitHub
3. Configurações:
   - **Build Command:** `cd backend && pnpm install && pnpm build`
   - **Start Command:** `cd backend && pnpm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `PORT=3001`
     - `DATABASE_URL=<url_do_banco_render>`
     - `FRONTEND_URL_PROD=https://telanix.onrender.com`

### 3. Inicializar banco de dados
Após o deploy, execute o script SQL no banco do Render usando o Query Tool.

## 📝 Estrutura do Projeto

```
backend/
├── src/
│   ├── index.ts              # Servidor principal
│   ├── db/
│   │   └── pool.ts           # Conexão PostgreSQL
│   ├── routes/
│   │   ├── auth.ts           # Rotas de autenticação
│   │   ├── users.ts          # Rotas de usuários
│   │   ├── reviews.ts        # Rotas de reviews
│   │   ├── ratings.ts        # Rotas de ratings
│   │   └── likes.ts          # Rotas de likes
│   ├── middleware/
│   │   └── auth.ts           # Middleware de autenticação
│   └── types/
│       └── index.ts          # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Debug

Testar conexão com banco:
```bash
psql postgresql://seu_usuario:sua_senha@localhost:5432/telanix_db
```

Ver logs do servidor:
```bash
pnpm dev
```

## 📄 Licença

MIT

