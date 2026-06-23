# FlexAuction

Plataforma de leilões online — imóveis, veículos e outros bens — com lances em tempo real, busca avançada e painel do usuário. Monorepo com backend Express/Prisma e frontend React/Vite.

![CI](https://github.com/devBandeiraa/flexauction-platform/actions/workflows/ci.yml/badge.svg)

## Funcionalidades

- **Catálogo e busca avançada** — filtros por categoria, UF, cidade, faixa de preço e status, com paginação e busca textual.
- **Lances em tempo real** — disputa ao vivo via WebSocket, com anti-sniping (extensão nos últimos 5 min) e atualização instantânea.
- **Autenticação segura** — JWT com access + refresh token (cookie httpOnly) e cadastro guiado em etapas.
- **Painel do usuário** — acompanhamento de lances e lotes favoritos.
- **Perfis** — participante e leiloeiro (criação e gestão de lotes com upload de imagens).
- **Experiência premium** — páginas institucionais (Início, Como Funciona, Sobre, Contato) com design responsivo, animações (Framer Motion), tema escuro nos heróis e acessibilidade.

## Stack

**Backend:** Node.js 20+, Express, TypeScript, Prisma (PostgreSQL), JWT + refresh tokens (httpOnly cookie), Socket.IO, Multer, Zod, pino, Jest.

**Frontend:** React 19, TypeScript, Vite, React Router, Zustand, TanStack Query, React Hook Form + Zod, Tailwind CSS + shadcn/ui, Framer Motion, Lucide, Sonner, Socket.IO client, Vitest + Testing Library.

## Estrutura

```
flexauction-platform/
├── backend/          # API Express + Prisma + Socket.IO
│   ├── src/
│   │   ├── controllers/  services/  repositories/
│   │   ├── middlewares/  routes/    sockets/
│   │   └── config/   utils/   app.ts
│   ├── prisma/       # schema.prisma, seed.ts, migrations
│   ├── uploads/      # imagens servidas estaticamente
│   └── tests/
├── frontend/         # SPA React + Vite
│   └── src/{components,pages,hooks,services,store,lib,types}
└── .github/workflows/ci.yml
```

## Pré-requisitos

- Node.js **20+** e npm **10+**
- Um banco PostgreSQL. O mais rápido é um projeto gratuito no [Supabase](https://supabase.com) (Neon ou Postgres local também funcionam).

## Configuração

### 1. Instalar dependências

A partir da raiz (npm workspaces instala backend e frontend de uma vez):

```bash
npm install
```

### 2. Variáveis de ambiente

**Backend** — copie o exemplo e preencha:

```bash
cp backend/.env.example backend/.env
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Postgres. No Supabase: *Project Settings → Database → Connection string → URI*. |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Segredos com 32+ caracteres. Gere com `openssl rand -hex 32`. |
| `PORT` | Porta da API (padrão `3001`). |
| `CORS_ORIGIN` | Origem do frontend (padrão `http://localhost:5173`). |

**Frontend** — copie o exemplo (os padrões já apontam para o backend local):

```bash
cp frontend/.env.example frontend/.env
```

| Variável | Padrão |
|---|---|
| `VITE_API_URL` | `http://localhost:3001/api` |
| `VITE_SOCKET_URL` | `http://localhost:3001` |

### 3. Banco de dados

```bash
npm run prisma:migrate --workspace=backend   # cria as tabelas
npm run prisma:seed    --workspace=backend   # popula dados de exemplo
```

O seed cria 4 usuários (senha **`senha1234`** para todos) e 16 leilões em 6 categorias (imóveis, veículos, galpões, máquinas, embarcações e outros):

| E-mail | Perfil |
|---|---|
| `maria@auctionhub.com` | Participante |
| `joao@auctionhub.com` | Participante |
| `leiloeiro1@auctionhub.com` | Leiloeiro |
| `leiloeiro2@auctionhub.com` | Leiloeiro |

> O papel de leiloeiro (`AUCTIONEER`) é atribuído via seed/banco — não há autocadastro como leiloeiro.

### 4. Rodar em desenvolvimento

A partir da raiz, sobe backend e frontend juntos:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001 (health check em `/api/health`)

## Scripts

Na raiz (rodam nos dois workspaces): `npm run dev`, `npm run build`, `npm run lint`, `npm run test`.

Por workspace, com `--workspace=backend` ou `--workspace=frontend`:

| Script | Ação |
|---|---|
| `dev` | Servidor de desenvolvimento |
| `build` | Build de produção |
| `test` | Testes (Jest no backend, Vitest no frontend) |
| `lint` | ESLint |
| `typecheck` *(backend)* | `tsc --noEmit` |
| `prisma:migrate` / `prisma:seed` / `prisma:studio` *(backend)* | Migrations / seed / Prisma Studio |

## API REST (principais rotas)

```
POST   /api/auth/register | login | refresh | logout
GET    /api/auctions                 # filtros: categoria, uf, cidade, faixa de preço, status, q + paginação
GET    /api/auctions/:id
POST   /api/auctions                 # AUCTIONEER (multipart com imagens)
PATCH  /api/auctions/:id             # AUCTIONEER (dono)
DELETE /api/auctions/:id             # AUCTIONEER (dono)
GET    /api/auctions/:id/bids
POST   /api/auctions/:id/bids        # autenticado
GET    /api/categories
GET    /api/search?q=
GET    /api/me/bids | favorites
POST   /api/me/favorites/:id
DELETE /api/me/favorites/:id
```

### Tempo real (Socket.IO)

- **Cliente → servidor:** `auction:watch` / `auction:unwatch` (`{ loteId }`)
- **Servidor → cliente:** `bid:new`, `auction:extended` (anti-sniping nos últimos 5 min), `auction:closed`

**Regras de lance:** o lance deve superar o atual em ≥ 1%; o leilão precisa estar `LIVE` dentro da janela; não é possível dar lance no próprio leilão nem cobrir o próprio lance.

## Testes e CI

```bash
npm run test            # backend (Jest) + frontend (Vitest)
npm run lint
```

Os testes de backend usam um Prisma client mockado — não exigem um banco rodando. O workflow em `.github/workflows/ci.yml` roda lint, type-check, testes e build dos dois workspaces a cada push/PR para `main`.

## Licença

Projeto de demonstração.
