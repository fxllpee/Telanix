# 🎬 TelaNix - Plataforma de Avaliação de Filmes

Sistema completo para descobrir, avaliar e compartilhar opiniões sobre filmes com banco de dados PostgreSQL real.

## 🚀 INICIAR PROJETO

### 1. Instalar Dependências

```bash
# Frontend
pnpm install

# Backend
cd backend
pnpm install
```

### 2. Configurar Banco de Dados

1. Crie o banco `telanix_db` no PostgreSQL
2. Configure `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/telanix_db
NODE_ENV=development
PORT=3001
```

### 3. Rodar

```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
pnpm dev
```

**Acesse:** http://localhost:8080

---

## 📦 TECNOLOGIAS

- **Frontend:** React 19 + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express + TypeScript
- **Banco:** PostgreSQL
- **APIs:** TMDB (filmes)

---

## ✨ FUNCIONALIDADES

- ✅ Catálogo de 500.000+ filmes
- ✅ Busca inteligente
- ✅ Sistema de avaliações (1-5 estrelas)
- ✅ Reviews completas
- ✅ Curtir filmes
- ✅ Perfil de usuário
- ✅ Senhas criptografadas (bcrypt)
- ✅ Responsivo (mobile/desktop)
- ✅ PWA (funciona offline)

---

## 🌐 DEPLOY

Veja **DEPLOY.md** para instruções completas de deploy no Render (gratuito).

---

## 📝 ESTRUTURA

```
Telanix/
├── backend/          # API REST (Node.js)
│   ├── src/
│   │   ├── routes/   # Endpoints da API
│   │   ├── db/       # Conexão PostgreSQL
│   │   └── index.ts  # Servidor principal
│   └── .env          # Configurações
│
├── src/              # Frontend (React)
│   ├── components/   # Componentes UI
│   ├── pages/        # Páginas
│   ├── stores/       # Estado (Zustand)
│   └── services/     # APIs
│
└── DEPLOY.md         # Guia de deploy
```

---

## 🔧 COMANDOS

```bash
# Desenvolvimento
pnpm dev                    # Inicia frontend
cd backend && pnpm dev      # Inicia backend

# Build
pnpm build                  # Compila frontend
cd backend && pnpm build    # Compila backend

# Produção
pnpm preview                # Preview do build
cd backend && pnpm start    # Roda backend
```

---

## 🗄️ BANCO DE DADOS

**Tabelas:**
- `users` - Usuários
- `user_stats` - Estatísticas
- `user_likes` - Curtidas
- `user_ratings` - Avaliações
- `reviews` - Reviews

**Ver dados:**
```sql
-- pgAdmin ou psql
SELECT * FROM telanix.users;
```

---

## 📖 DOCUMENTAÇÃO

Todos os arquivos principais estão comentados linha por linha:
- `src/main.tsx` - Ponto de entrada
- `src/App.tsx` - Rotas
- `backend/src/index.ts` - Servidor

---

## 🎓 DESENVOLVIDO PARA TCC

**Autor:** Felipe  
**Data:** Outubro 2025  
**Instituição:** [Sua Instituição]

---

## 📄 LICENÇA

MIT

---

**🎬 Bom uso!**
