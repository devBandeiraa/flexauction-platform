# Prompt — Plataforma de Leilões Online (Auction Platform)

## Contexto do Projeto

Você é um Desenvolvedor FullStack Sênior com expertise em UI/UX moderno, performance web e
arquiteturas escaláveis. Sua missão é construir uma plataforma de leilões online chamada **AuctionHub**
— clean, rápida e com foco na conversão e experiência do usuário.

A referência visual é o site https://www.flexauction.com.br/, mas o produto final deve ser
**visualmente superior**: mais moderno, mais leve, com navegação mais intuitiva, identidade visual
própria e boas práticas de acessibilidade e responsividade.

---

## Stack Tecnológica

### Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js com TypeScript
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Autenticação:** JWT + Refresh Tokens (httpOnly cookies)
- **Tempo real:** Socket.IO (lances em tempo real)
- **Upload de imagens:** Multer + integração com Cloudinary ou S3
- **Validação:** Zod
- **Testes:** Jest + Supertest

### Frontend
- **Framework:** React 18+ com TypeScript
- **Roteamento:** React Router v6
- **Estado global:** Zustand
- **Estilização:** Tailwind CSS v3 + componentes customizados
- **Componentes UI:** shadcn/ui como base
- **Formulários:** React Hook Form + Zod
- **Data fetching:** TanStack Query (React Query v5)
- **Tempo real:** Socket.IO Client
- **Ícones:** Lucide React
- **Testes:** Vitest + Testing Library

### DevOps / Infra
- PostgreSQL rodando localmente (instalação nativa ou serviço gerenciado tipo Supabase/Neon)
- Scripts npm para subir backend e frontend (`npm run dev`)
- GitHub Actions para CI/CD
- Variáveis de ambiente via `.env` com validação por Zod

---

## Identidade Visual

### Paleta de Cores
```
--color-primary:     #1A1A2E   /* Azul-noite profundo — confiança, seriedade */
--color-accent:      #E63946   /* Vermelho-leilão — urgência, ação */
--color-accent-alt:  #F4A261   /* Âmbar — destaque secundário, badges */
--color-surface:     #F8F9FA   /* Background geral — ultra clean */
--color-card:        #FFFFFF   /* Cards */
--color-border:      #E9ECEF   /* Separadores */
--color-text-primary:#212529   /* Texto principal */
--color-text-muted:  #6C757D   /* Texto secundário */
--color-success:     #2DC653   /* Lance vencedor, confirmações */
```

### Tipografia
- **Display / Headlines:** `Inter` (700–900) — bold, legível, moderno
- **Body:** `Inter` (400–500) — consistência com o display
- **Dados / Preços / Contadores:** `JetBrains Mono` — monospace para valores que mudam

### Princípios de Design
1. **Espaço em branco generoso** — o usuário precisa respirar entre lotes
2. **Hierarquia clara** — preço e prazo são os elementos mais importantes de cada card
3. **Micro-interações** — hover em cards, transição de preço ao receber lance em tempo real
4. **Responsividade mobile-first** — leilões são acompanhados pelo celular
5. **Acessibilidade** — WCAG AA, foco visível, labels semânticos

---

## Arquitetura de Pastas

```
auction-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn base components
│   │   │   ├── layout/      # Header, Footer, Sidebar
│   │   │   ├── auction/     # Cards, Timer, BidBox, Gallery
│   │   │   └── shared/      # Badges, Skeletons, Toasts
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/           # Zustand stores
│   │   ├── services/        # API calls + socket
│   │   ├── types/
│   │   └── lib/             # utils, formatters
│   ├── .env.example
│   └── package.json
└── .github/workflows/
```

---

## Páginas e Componentes

### 1. Header (`/components/layout/Header`)
- Logo à esquerda
- Busca global centralizada com autocomplete (por categoria, localidade, lote)
- Nav links: Imóveis · Veículos · Outros · Como Funciona
- Auth: botão "Entrar" e "Cadastrar" quando deslogado; avatar + dropdown quando logado
- Badge de leilões ao vivo pulsando em vermelho quando houver ativos
- Sticky com blur backdrop no scroll

### 2. Hero Section (Home)
- Headline impactante: ex. `"Arremate o que importa."` — 1 linha, grande, sem subtítulo prolixo
- Subtext curto: `"Leilões de imóveis, veículos e muito mais com segurança e transparência."`
- Barra de busca integrada com filtro rápido por categoria
- Visual: imagem de fundo com gradiente overlay ou ilustração SVG abstrata de leilão
- Sem carrossel — estático, carrega rápido

### 3. Filtro de Busca Avançado (`/components/auction/FilterBar`)
- Filtros: Categoria · Estado/Cidade · Faixa de Preço · Status (Aberto / Encerrado / Em breve)
- UX: filtros aplicados aparecem como chips removíveis abaixo da barra
- URL params sincronizados para compartilhamento de busca

### 4. Grid de Lotes / Cards (`/components/auction/AuctionCard`)
Cada card contém:
- Imagem do bem (lazy loading + skeleton)
- Badge de status: `AO VIVO` (vermelho pulsante) · `EM BREVE` · `ENCERRADO`
- Badge de desconto quando aplicável (ex: `50% abaixo do avaliado`)
- Título do bem
- Localização (ícone + cidade/UF)
- **Lance atual** em destaque — tipografia monospace, grande
- **Contador regressivo** em tempo real (HH:MM:SS) integrado via Socket.IO
- Número de lances recebidos
- CTA: `"Ver Lote"` — botão outline que vira filled no hover
- Grid responsivo: 4 colunas desktop → 2 tablet → 1 mobile

### 5. Seção "Destaques do Momento" (Home)
- Carrossel horizontal com scroll snap (sem biblioteca externa)
- Máx. 8 cards, scroll suave
- Titulo + link "Ver todos"

### 6. Seção "Como Funciona"
- 3 passos horizontais: Cadastre-se → Escolha um lote → Dê seu lance
- Ícones limpos (Lucide), sem numeração artificial
- Background levemente diferente para separar da seção anterior

### 7. Página de Detalhe do Lote (`/pages/AuctionDetail`)
Layout 2 colunas (desktop):
**Coluna esquerda:**
- Galeria de imagens com thumbnail strip
- Descrição completa (markdown renderizado)
- Documentos para download (matrícula, laudo, edital)
- Mapa de localização integrado (Google Maps embed)

**Coluna direita (sticky):**
- Status badge + countdown grande
- Lance atual em destaque (atualiza em tempo real via socket)
- Histórico dos últimos lances (live feed)
- Campo de lance + botão `"Dar Lance"` — validação de valor mínimo inline
- Info do leiloeiro responsável
- Botão de favoritar (coração)
- Compartilhar (WhatsApp, copy link)

### 8. Página de Busca / Listagem (`/pages/Search`)
- URL: `/busca?categoria=imoveis&cidade=SP&min=100000`
- FilterBar no topo
- Grid de resultados com paginação infinita (IntersectionObserver)
- Loading skeleton durante fetch
- Empty state com CTA para limpar filtros

### 9. Autenticação (`/pages/Auth`)
- Login e Cadastro em modal (não página separada)
- Formulário de cadastro: Nome · CPF/CNPJ · E-mail · Senha
- Validação em tempo real com mensagens inline
- Sem redirecionamento de página — modal fecha e estado atualiza

### 10. Painel do Usuário (`/pages/Dashboard`)
- Meus lances (em andamento / vencidos / perdidos)
- Favoritos
- Dados pessoais + documentos enviados
- Notificações de lances superados

### 11. Footer
- Links institucionais: Sobre · Contato · Política de Privacidade · Termos de Uso
- Redes sociais
- Selos de segurança (SSL, certificações)
- Newsletter CTA minimalista

---

## Funcionalidades de Tempo Real (Socket.IO)

```typescript
// Eventos que o servidor emite:
'bid:new'         // { loteId, valor, totalLances, encerraEm }
'auction:closed'  // { loteId, vencedorId, valorFinal }
'auction:extended'// { loteId, novoEncerramento } — quando lance nos últimos 5min

// Eventos que o cliente emite:
'bid:place'       // { loteId, valor, userId }
'auction:watch'   // { loteId } — entra na room do lote
'auction:unwatch' // { loteId } — sai da room
```

---

## Modelos de Dados (Prisma Schema resumido)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  cpf       String   @unique
  password  String
  bids      Bid[]
  favorites Favorite[]
  createdAt DateTime @default(now())
}

model Auction {
  id          String   @id @default(cuid())
  title       String
  description String
  category    Category
  images      String[]
  city        String
  state       String
  startPrice  Decimal
  currentBid  Decimal
  appraisal   Decimal?
  startsAt    DateTime
  endsAt      DateTime
  status      AuctionStatus
  bids        Bid[]
  favorites   Favorite[]
  auctioneer  Auctioneer @relation(fields: [auctioneerId], references: [id])
  auctioneerId String
}

model Bid {
  id        String   @id @default(cuid())
  value     Decimal
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  auction   Auction  @relation(fields: [auctionId], references: [id])
  auctionId String
  createdAt DateTime @default(now())
}

enum Category { IMOVEL VEICULO OUTROS }
enum AuctionStatus { UPCOMING LIVE CLOSED }
```

---

## API REST (principais endpoints)

```
GET    /api/auctions              — listagem com filtros via query params
GET    /api/auctions/:id          — detalhe do lote
GET    /api/auctions/:id/bids     — histórico de lances
POST   /api/auctions/:id/bids     — dar lance (autenticado)

GET    /api/categories            — categorias disponíveis
GET    /api/search?q=...          — busca global com autocomplete

POST   /api/auth/register         — cadastro
POST   /api/auth/login            — login → retorna JWT
POST   /api/auth/refresh          — refresh token
POST   /api/auth/logout           — invalida token

GET    /api/me/bids               — lances do usuário logado
GET    /api/me/favorites          — favoritos
POST   /api/me/favorites/:id      — favoritar lote
DELETE /api/me/favorites/:id      — desfavoritar
```

---

## UX / UI Boas Práticas Obrigatórias

1. **Skeleton Loading** em todos os grids — nunca spinner global
2. **Optimistic UI** ao dar lance — atualiza o valor na tela antes da confirmação do server
3. **Toast notifications** para: lance dado, lance superado, lote favorito, erros
4. **Erro inline** em formulários — mensagem abaixo do campo, nunca alert
5. **Navegação por teclado** em todos os modals e dropdowns
6. **Scroll restoration** ao voltar para listagem
7. **Imagens lazy** com blur placeholder (LQIP)
8. **Preço sempre formatado** como `R$ 250.000,00` — nunca valor bruto
9. **Countdown** atualiza a cada segundo via `setInterval`, pausado quando aba não está ativa (`visibilitychange`)
10. **Modo escuro** — opcional mas recomendado via `prefers-color-scheme`

---

## Fases de Desenvolvimento

### Fase 1 — Fundação
- Setup do monorepo, scripts npm, variáveis de ambiente
- PostgreSQL local configurado + connection string no `.env`
- Prisma schema + migrations
- Autenticação JWT completa (register, login, refresh, logout)
- Seed de dados de exemplo (10+ leilões variados)

### Fase 2 — Core de Leilões
- CRUD de leilões (backend)
- Listagem com filtros e paginação
- Página de detalhe
- Sistema de lances (REST + validações de negócio)

### Fase 3 — Tempo Real
- Integração Socket.IO no backend
- Atualização de lance em tempo real no frontend
- Countdown sincronizado
- Extensão automática de prazo

### Fase 4 — Frontend Completo
- Todas as páginas implementadas
- Skeletons, empty states, error boundaries
- Dashboard do usuário
- Favoritos e notificações

### Fase 5 — Qualidade e Deploy
- Testes unitários e de integração (backend)
- Testes de componente (frontend)
- Pipeline CI/CD no GitHub Actions (lint, test, build)
- Build de produção do frontend (Vite) + script de start do backend
- README completo com passo a passo de instalação local

---

## Regras Gerais para o Claude Code

- Sempre usar TypeScript strict em ambos frontend e backend
- Nenhum `any` sem justificativa em comentário
- Commits semânticos: `feat:`, `fix:`, `refactor:`, `test:`
- Cada função/serviço deve ter responsabilidade única
- Tratamento de erro centralizado no backend (middleware `errorHandler`)
- Logs estruturados com `pino` no backend
- Nunca expor stack trace no response de produção
- Variáveis de ambiente validadas por Zod na inicialização do app

---

## Entregável Final

Um repositório GitHub com:
- `README.md` completo (pré-requisitos, instalação, variáveis de ambiente, como rodar)
- Instruções claras de setup local:
  - `npm install` na raiz (ou em cada workspace)
  - Configurar `.env` a partir do `.env.example`
  - `npx prisma migrate dev` + `npx prisma db seed`
  - `npm run dev` no backend e no frontend
- Frontend acessível em `localhost:5173` (Vite)
- Backend acessível em `localhost:3001`
- Banco seed com dados suficientes para demonstrar todas as features
- Screenshot ou gravação da aplicação funcionando
