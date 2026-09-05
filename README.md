# 🏛️ Secretaria Municipal da Mulher — Canindé de São Francisco

Portal institucional e painel administrativo da Secretaria da Mulher do município de Canindé de São Francisco/SE. Oferece divulgação de ações, saúde, direitos, agenda e um painel de gestão protegido.

---

## 🚀 Páginas

| Arquivo | Descrição |
|---|---|
| `index.html` | Portal público com carrossel de ações, saúde, galeria, agenda e seção Canindé + Delas |
| `login.html` | Página de autenticação (acesso restrito ao painel) |
| `admin.html` | Painel administrativo de gestão de conteúdo |

---

## ✨ Funcionalidades

- **Portal Público:** apresentação institucional, carrossel de ações nas ruas, seção de saúde, galeria de vídeos, agenda de eventos, seção Canindé + Delas, mapa e footer.
- **Responsividade mobile completa:** carrosséis com snap-scroll e dots de paginação, paddings ajustados e controle de overflow.
- **Acessibilidade:** barra institucional com A−/A/A+, Alto Contraste e widget VLibras em todas as páginas.
- **Login seguro:** senha verificada via SHA-256 (WebCrypto API), sem texto puro no código; proteção contra força bruta (bloqueio de 10 min após 5 tentativas).
- **Sessão:** persistência via `localStorage` (Manter Conectado) ou `sessionStorage`; logout correto limpa ambos; timeout automático por inatividade de 30 min com aviso.
- **Painel Admin:** guarda de autenticação no `<head>` (bloqueia render antes do carregamento); nome do usuário exibido dinamicamente; gestão de ações, galeria, agenda, saúde e Canindé + Delas com persistência via `localStorage`.

---

## 🛡️ Segurança

- Senha armazenada apenas como `SHA-256(SALT + usuario + senha)` — nunca em texto puro
- Proteção contra força bruta: 5 tentativas → bloqueio de 10 minutos com contagem regressiva
- Guarda de autenticação executada no `<head>` antes de qualquer render (evita flash de conteúdo)
- Sanitização `safe()` em todos os renders de dados do `localStorage` (prevenção de XSS)
- Meta tags: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `referrer: no-referrer`
- Timeout de sessão por inatividade (30 min) com aviso 60s antes do logout automático

---

## 🛠️ Tecnologias

- HTML5 / CSS3
- Tailwind CSS (CDN)
- JavaScript Vanilla
- Web Crypto API (SHA-256)
- LocalStorage / SessionStorage API
- FontAwesome 6
- Google Fonts (Poppins, Atkinson Hyperlegible)
- VLibras (acessibilidade LIBRAS)
