# Jaca 3D — Front-end

Vitrine web para divulgação e venda de objetos de impressão 3D ("Feito camada por camada"), desenvolvida para o Projeto Integrador II da Univesp.

Este diretório contém apenas o **front-end**. O back-end e o banco de dados são desenvolvidos separadamente e se comunicam com o site por uma API REST.

## Tecnologias

- React 18 e Vite
- Tailwind CSS
- Axios (chamadas à API)
- Jest e React Testing Library (testes)

## Funcionalidades

- **Vitrine pública:** cabeçalho com avisos da loja, seção de destaque e catálogo com busca por nome ou descrição e filtro por categoria.
- **Pedido pelo WhatsApp:** cada produto tem um botão que abre uma conversa com a mensagem do pedido já preenchida.
- **Login administrativo:** modal com usuário e senha.
- **Painel administrativo:** cadastro de produtos (foto, nome, categoria, descrição, gramatura e preço) e lista dos produtos publicados, com exclusão.

## Como executar

Requer o [Node.js](https://nodejs.org) (versão LTS).

```bash
npm install
npm run dev
```

O site abre em `http://localhost:5173`. Outros comandos:

```bash
npm test          # testes
npm run build     # versão de produção em dist/
```

Sem back-end conectado, o site usa dados de exemplo salvos no navegador. Nesse modo, o login do painel é `admin` / `admin`.

## Configuração

As variáveis ficam em um arquivo `.env`, criado a partir do `.env.example`:

| Variável | Descrição |
|---|---|
| `VITE_API_MODE` | `mock` (dados de exemplo, padrão), `api` (somente a API real) ou `auto` (tenta a API e usa o mock se ela estiver fora do ar) |
| `VITE_API_URL` | Endereço da API, por exemplo `http://localhost:3333` |
| `VITE_WHATSAPP_NUMBER` | Número que recebe os pedidos, com DDI e DDD, só dígitos (ex.: `5511987654321`) |

## Integração com a API

Todas as chamadas ao servidor ficam em `src/services/apiService.js`. Os componentes não acessam a API diretamente.

| Rota | Corpo | Resposta |
|---|---|---|
| `POST /auth/login` | JSON `{ usuario, senha }` | `200 { token, usuario }` ou `401` |
| `GET /produtos` | — | `200 [produto]` |
| `POST /produtos` | `multipart/form-data`: `nome`, `descricao`, `categoria`, `gramatura`, `preco`, `imagem` (arquivo, opcional) | `201 produto` |
| `DELETE /produtos/:id` | — | `204` |

`produto = { id, nome, descricao, categoria, gramatura, preco, imagemUrl }`

- `POST` e `DELETE` enviam o cabeçalho `Authorization: Bearer <token>`.
- O campo `imagemUrl` deve ser um endereço completo da imagem.
- O back-end precisa liberar CORS para o endereço do front-end.
- Se a API usar outros nomes de campo, o ajuste é feito apenas na função `normalizeProduct`.
- O formulário de cadastro inclui o campo **Categoria**, necessário para os filtros da vitrine.

## WhatsApp

`src/utils/whatsapp.js` monta o link `https://wa.me/<número>?text=<mensagem>`, com nome, categoria, peso e preço do produto na mensagem (texto codificado com `encodeURIComponent`).

## Estrutura do projeto

```
src/
├── assets/         logo
├── components/     Header, Hero, Catalog, ProductGrid, ProductCard, LoginModal, AdminDashboard
├── context/        AuthContext (estado de login)
├── hooks/          useProducts, useFocusTrap
├── services/       apiService (API real) e mockApi (dados de exemplo)
├── utils/          busca/filtro, validação, formatação, WhatsApp
├── __tests__/      testes
├── App.jsx
└── main.jsx
```

## Testes

Os testes cobrem a busca e os filtros do catálogo, a validação dos formulários (login e cadastro), o modal de login, o painel administrativo, o link do WhatsApp, a camada de API e o fluxo completo de login, cadastro e exclusão de produto.

## Acessibilidade

- HTML semântico (`header`, `main`, `section`, `article`, listas) e um `h1` por tela.
- Link "Pular para o catálogo" e foco visível em todos os elementos interativos.
- Modal de login com `role="dialog"`, foco preso dentro dele, fechamento com `Esc` e retorno do foco ao botão de origem.
- Campos de formulário com `label`, erros ligados aos campos (`aria-invalid` e `aria-describedby`) e foco no primeiro campo inválido.
- `aria-label` descritivo em botões e links (ex.: "Pedir Vaso Twist pelo WhatsApp") e ícones decorativos ocultos para leitores de tela.
- Navegação completa por teclado, contraste adequado e respeito à preferência de movimento reduzido.

## Controle de versão

Branches `main` (versão estável) e `feature/front-end` (desenvolvimento), com commits semânticos, por exemplo: `feat(catalogo): adiciona busca e filtros`, `fix(login): corrige foco ao fechar o modal`, `test(api): cobre criação e exclusão`, `docs: atualiza README`.
